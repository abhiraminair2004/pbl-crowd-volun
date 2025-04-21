const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function(value) {
                // Password must contain at least one uppercase letter, one lowercase letter, and one number
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        }
    },
    role: {
        type: String,
        enum: ['user', 'volunteer', 'admin'],
        default: 'user'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '7d' // Token expires after 7 days
        }
    }],
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    accountLocked: {
        type: Boolean,
        default: false
    },
    lockUntil: {
        type: Date
    }
}, {
    timestamps: true,
    validateBeforeSave: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        const user = this;
        console.log('=== PRE-SAVE MIDDLEWARE START ===');
        console.log('User before save:', {
            id: user._id,
            name: user.name,
            email: user.email,
            isModified: {
                password: user.isModified('password'),
                name: user.isModified('name'),
                email: user.isModified('email')
            }
        });
        
        if (user.isModified('password')) {
            console.log(`Hashing password for user: ${user.email}`);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            console.log('Password hashed successfully');
        }
        
        console.log('=== PRE-SAVE MIDDLEWARE END ===');
        next();
    } catch (error) {
        console.error('=== PRE-SAVE MIDDLEWARE ERROR ===');
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        next(error);
    }
});

// Method to validate password
userSchema.methods.validatePassword = async function(password) {
    try {
        console.log(`Validating password for user: ${this.email}`);
        const isMatch = await bcrypt.compare(password, this.password);
        
        // Update login attempts
        if (!isMatch) {
            this.loginAttempts += 1;
            console.log(`Failed login attempt for user: ${this.email}. Total attempts: ${this.loginAttempts}`);
            
            // Lock account after 5 failed attempts
            if (this.loginAttempts >= 5) {
                this.accountLocked = true;
                this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
                console.log(`Account locked for user: ${this.email} until ${this.lockUntil}`);
            }
            
            await this.save();
        } else {
            // Reset login attempts on successful login
            if (this.loginAttempts > 0) {
                this.loginAttempts = 0;
                this.accountLocked = false;
                this.lockUntil = null;
                await this.save();
            }
            
            // Update last login
            this.lastLogin = new Date();
            await this.save();
            console.log(`Successful login for user: ${this.email}`);
        }
        
        return isMatch;
    } catch (error) {
        console.error('Error validating password:', error);
        throw error;
    }
};

// Generate auth token
userSchema.methods.generateAuthToken = async function() {
    try {
        console.log(`Generating auth token for user: ${this.email}`);
        const token = jwt.sign(
            { _id: this._id.toString(), email: this.email, role: this.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        this.tokens = this.tokens.concat({ token });
        await this.save();
        console.log('Auth token generated successfully');
        
        return token;
    } catch (error) {
        console.error('Error generating auth token:', error);
        throw error;
    }
};

// Remove sensitive information when converting to JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.loginAttempts;
    delete user.accountLocked;
    delete user.lockUntil;
    return user;
};

// Find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User; 