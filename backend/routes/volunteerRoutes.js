const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const auth = require('../middleware/auth');

// Volunteer opportunity routes
router.get('/opportunities', volunteerController.getVolunteerOpportunities);
router.get('/opportunities/:id', volunteerController.getVolunteerOpportunity);
router.post('/opportunities', auth, volunteerController.createVolunteerOpportunity);
router.put('/opportunities/:id', auth, volunteerController.updateVolunteerOpportunity);
router.delete('/opportunities/:id', auth, volunteerController.deleteVolunteerOpportunity);

// Volunteer participation routes
router.post('/opportunities/:id/join', auth, volunteerController.joinVolunteerOpportunity);
router.post('/opportunities/:id/leave', auth, volunteerController.leaveVolunteerOpportunity);

// Volunteer profile routes
router.post('/profile', auth, volunteerController.createVolunteer);
router.get('/profile/me', auth, volunteerController.getMyVolunteerProfile);
router.put('/profile', auth, volunteerController.updateVolunteer);
router.delete('/profile', auth, volunteerController.deleteVolunteer);

// Admin routes (only accessible by admin users)
router.get('/admin/all', auth, volunteerController.getAllVolunteers);
router.get('/admin/:id', auth, volunteerController.getVolunteerById);

// Volunteer registration route (no auth required)
router.post('/register', volunteerController.registerVolunteer);

module.exports = router; 