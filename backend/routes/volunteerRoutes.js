const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { authenticateToken } = require('../middleware/auth');

// Volunteer opportunity routes
router.get('/opportunities', volunteerController.getVolunteerOpportunities);
router.get('/opportunities/:id', volunteerController.getVolunteerOpportunity);
router.post('/opportunities', authenticateToken, volunteerController.createVolunteerOpportunity);
router.put('/opportunities/:id', authenticateToken, volunteerController.updateVolunteerOpportunity);
router.delete('/opportunities/:id', authenticateToken, volunteerController.deleteVolunteerOpportunity);

// Volunteer participation routes
router.post('/opportunities/:id/join', authenticateToken, volunteerController.joinVolunteerOpportunity);
router.post('/opportunities/:id/leave', authenticateToken, volunteerController.leaveVolunteerOpportunity);

// Volunteer profile routes
router.post('/profile', authenticateToken, volunteerController.createVolunteer);
router.get('/profile/me', authenticateToken, volunteerController.getMyVolunteerProfile);
router.put('/profile', authenticateToken, volunteerController.updateVolunteer);
router.delete('/profile', authenticateToken, volunteerController.deleteVolunteer);

// Admin routes (only accessible by admin users)
router.get('/admin/all', authenticateToken, volunteerController.getAllVolunteers);
router.get('/admin/:id', authenticateToken, volunteerController.getVolunteerById);

// Volunteer registration route (no auth required)
router.post('/register', volunteerController.registerVolunteer);

module.exports = router;