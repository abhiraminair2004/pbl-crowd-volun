const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const volunteerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  skills: { type: String, required: true },
  interests: [{ type: String }],
  availability: { type: String, required: true },
  experience: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const volunteerOpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  skills: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  commitment: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  raised: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  category: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const donationSchema = new mongoose.Schema({
  campaignId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  message: { type: String },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Password reset token schema
const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Token expires in 1 hour
});

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribeDate: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Volunteer = mongoose.model('Volunteer', volunteerSchema);
const VolunteerOpportunity = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);
const Campaign = mongoose.model('Campaign', campaignSchema);
const Donation = mongoose.model('Donation', donationSchema);
const ResetToken = mongoose.model('ResetToken', resetTokenSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.status(201).json({ 
      success: true, 
      data: { 
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.status(200).json({ 
      success: true, 
      data: { 
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({ success: true, message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(resetToken, salt);
    
    // Save token
    await ResetToken.findOneAndDelete({ userId: user._id });
    await new ResetToken({
      userId: user._id,
      token: hash,
      createdAt: Date.now()
    }).save();
    
    // In a real application, you would send an email with the reset link
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    res.status(200).json({ success: true, message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Find token
    const resetTokenRecord = await ResetToken.findOne({});
    if (!resetTokenRecord) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }
    
    // Verify token
    const isValid = await bcrypt.compare(token, resetTokenRecord.token);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    await User.findByIdAndUpdate(resetTokenRecord.userId, { password: hashedPassword });
    
    // Delete token
    await ResetToken.findByIdAndDelete(resetTokenRecord._id);
    
    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already subscribed' 
      });
    }
    
    const subscriber = new Newsletter({ email });
    await subscriber.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Share opportunity endpoint
app.post('/api/volunteer/share', async (req, res) => {
  try {
    const { opportunityId, recipientEmail, senderName } = req.body;
    
    // Get opportunity details
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ 
        success: false, 
        error: 'Opportunity not found' 
      });
    }
    
    // In a real application, you would send an email here
    console.log(`Sharing opportunity ${opportunityId} with ${recipientEmail} from ${senderName}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Opportunity shared successfully' 
    });
  } catch (error) {
    console.error('Share opportunity error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Volunteer Routes
app.post('/api/volunteer/register', async (req, res) => {
  try {
    console.log('Received volunteer registration data:', req.body);
    const volunteer = new Volunteer(req.body);
    
    // If user is authenticated, associate volunteer with user
    if (req.user) {
      volunteer.userId = req.user._id;
    }
    
    await volunteer.save();
    console.log('Volunteer registered successfully');
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    console.error('Error registering volunteer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all volunteers
app.get('/api/volunteers', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get volunteer opportunities
app.get('/api/volunteer/opportunities', async (req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.find();
    res.status(200).json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get volunteer opportunity by ID
app.get('/api/volunteer/opportunities/:id', async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, error: 'Volunteer opportunity not found' });
    }
    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crowdfunding Routes
app.post('/api/crowdfunding/donate', async (req, res) => {
  try {
    const { campaignId, fullName, email, finalAmount, paymentMethod, message, isAnonymous } = req.body;
    
    const donation = new Donation({
      campaignId,
      fullName,
      email,
      amount: parseFloat(finalAmount),
      paymentMethod,
      message,
      isAnonymous
    });
    
    // If user is authenticated, associate donation with user
    if (req.user) {
      donation.userId = req.user._id;
    }
    
    await donation.save();
    
    // Update campaign raised amount
    const campaign = await Campaign.findById(campaignId);
    if (campaign) {
      campaign.raised += parseFloat(finalAmount);
      await campaign.save();
    }
    
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error('Error processing donation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all donations
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get donations by campaign
app.get('/api/donations/campaign/:id', async (req, res) => {
  try {
    const donations = await Donation.find({ campaignId: req.params.id });
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all campaigns
app.get('/api/crowdfunding/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get campaign by ID
app.get('/api/crowdfunding/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add some initial data if in development
if (process.env.NODE_ENV !== 'production') {
  const seedDatabase = async () => {
    try {
      // Check if volunteer opportunities exist
      const opportunitiesCount = await VolunteerOpportunity.countDocuments();
      if (opportunitiesCount === 0) {
        console.log('Seeding volunteer opportunities...');
        const opportunities = [
          {
            title: 'Community Garden Helper',
            organization: 'Urban Green',
            description: 'Help maintain our community gardens and teach sustainable gardening practices.',
            location: 'San Francisco, CA',
            skills: ['Gardening', 'Teaching', 'Physical Labor'],
            startDate: new Date(2025, 4, 1),
            commitment: '4 hours per week',
            image: 'https://source.unsplash.com/random/800x600/?garden'
          },
          {
            title: 'Literacy Tutor',
            organization: 'Read Forward',
            description: 'Work with adults and children to improve literacy and reading skills.',
            location: 'Boston, MA',
            skills: ['Teaching', 'Patience', 'Communication'],
            startDate: new Date(2025, 4, 15),
            commitment: '2 hours per week',
            image: 'https://source.unsplash.com/random/800x600/?reading'
          },
          {
            title: 'Disaster Relief Volunteer',
            organization: 'Global Aid Network',
            description: 'Join our disaster response team to provide immediate assistance after natural disasters.',
            location: 'Multiple Locations',
            skills: ['First Aid', 'Physical Labor', 'Crisis Management'],
            startDate: new Date(2025, 5, 1),
            commitment: 'On-call, 1-2 weeks when deployed',
            image: 'https://source.unsplash.com/random/800x600/?disaster'
          }
        ];
        
        await VolunteerOpportunity.insertMany(opportunities);
        console.log('Volunteer opportunities seeded successfully');
      }
      
      // Check if campaigns exist
      const campaignsCount = await Campaign.countDocuments();
      if (campaignsCount === 0) {
        console.log('Seeding crowdfunding campaigns...');
        const campaigns = [
          {
            title: 'Clean Water Initiative',
            organization: 'Water for All',
            description: 'Help us bring clean drinking water to remote villages in Africa.',
            goal: 25000,
            raised: 8750,
            deadline: new Date(2025, 6, 30),
            category: 'Environment',
            image: 'https://source.unsplash.com/random/800x600/?water'
          },
          {
            title: 'School Supplies for Children',
            organization: 'Education First',
            description: 'Provide essential school supplies to underprivileged children.',
            goal: 10000,
            raised: 4200,
            deadline: new Date(2025, 7, 15),
            category: 'Education',
            image: 'https://source.unsplash.com/random/800x600/?school'
          },
          {
            title: 'Animal Shelter Renovation',
            organization: 'Paws & Claws',
            description: 'Help us renovate our animal shelter to provide better care for rescued animals.',
            goal: 15000,
            raised: 6800,
            deadline: new Date(2025, 8, 1),
            category: 'Animal Welfare',
            image: 'https://source.unsplash.com/random/800x600/?animals'
          }
        ];
        
        await Campaign.insertMany(campaigns);
        console.log('Crowdfunding campaigns seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };
  
  mongoose.connection.once('open', () => {
    seedDatabase();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
