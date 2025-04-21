const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    async register(req, res) {
        try {
            console.log('=== REGISTRATION START ===');
            console.log('Request received with body:', JSON.stringify(req.body, null, 2));
            
            const { name, email, password } = req.body;

            // Validate required fields
            if (!name || !email || !password) {
                console.log('Missing required fields:', {
                    name: !name,
                    email: !email,
                    password: !password
                });
                return res.status(400).json({
                    message: 'All fields are required',
                    missingFields: {
                        name: !name,
                        email: !email,
                        password: !password
                    }
                });
            }

            // Check if user already exists
            console.log('Checking if user exists:', email);
            let existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists:', email);
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            console.log('Creating new user:', { name, email });
            const user = new User({
                name,
                email,
                password
            });

            console.log('Attempting to save user:', {
                name: user.name,
                email: user.email,
                password: user.password ? 'present' : 'missing'
            });
            
            // Save user and log result
            const savedUser = await user.save();
            console.log('User saved successfully:', {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            });

            // Generate auth token
            console.log('Generating auth token');
            const token = await user.generateAuthToken();
            console.log('Token generated successfully');

            // Set token in response header
            res.header('Authorization', `Bearer ${token}`);

            console.log('=== REGISTRATION SUCCESS ===');
            res.status(201).json({
                token,
                user: user.toJSON()
            });
        } catch (error) {
            console.error('=== REGISTRATION ERROR ===');
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Handle validation errors
            if (error.name === 'ValidationError') {
                console.error('Validation errors:', error.errors);
                return res.status(400).json({
                    message: 'Validation error',
                    errors: Object.keys(error.errors).reduce((acc, key) => {
                        acc[key] = error.errors[key].message;
                        return acc;
                    }, {})
                });
            }
            
            res.status(500).json({ 
                message: 'Server error',
                error: error.message 
            });
        }
    },

    async login(req, res) {
        try {
            console.log('Login request received:', {
                email: req.body.email
            });
            
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required',
                    missingFields: {
                        email: !email,
                        password: !password
                    }
                });
            }

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found:', email);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Check if account is locked
            if (user.accountLocked && user.lockUntil > new Date()) {
                console.log('Account is locked:', {
                    email: user.email,
                    lockUntil: user.lockUntil
                });
                
                const remainingTime = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
                return res.status(403).json({
                    message: `Account is locked. Please try again in ${remainingTime} minutes.`
                });
            }

            // Validate password
            const isMatch = await user.validatePassword(password);
            if (!isMatch) {
                const remainingAttempts = 5 - user.loginAttempts;
                return res.status(400).json({
                    message: `Invalid credentials. ${remainingAttempts} attempts remaining.`
                });
            }

            // Generate auth token
            const token = await user.generateAuthToken();

            // Set token in response header
            res.header('Authorization', `Bearer ${token}`);

            console.log('Login successful:', {
                userId: user._id,
                email: user.email
            });
            
            res.json({
                token,
                user: user.toJSON()
            });
        } catch (error) {
            console.error('Login error:', {
                message: error.message,
                stack: error.stack
            });
            
            res.status(500).json({ 
                message: 'Server error',
                error: error.message 
            });
        }
    },

    async logout(req, res) {
        try {
            console.log('Logout request received:', {
                userId: req.user._id,
                email: req.user.email
            });
            
            // Remove the current token
            req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
            await req.user.save();
            
            console.log('User logged out successfully');
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', {
                message: error.message,
                stack: error.stack
            });
            
            res.status(500).json({ message: 'Server error' });
        }
    },

    async getCurrentUser(req, res) {
        try {
            console.log('Get current user request:', {
                userId: req.user._id,
                email: req.user.email
            });
            
            res.json(req.user.toJSON());
        } catch (error) {
            console.error('Get current user error:', {
                message: error.message,
                stack: error.stack
            });
            
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = authController; 