const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');
const auth = require('../middleware/authMiddleware');
const { requireRole, optionalAuth } = auth;


router.get('/', roomsController.listRooms);
router.post('/', auth, requireRole('owner', 'admin'), roomsController.createRoom);
router.get('/search', roomsController.searchRooms);
router.get('/amenities', roomsController.getDistinctAmenities);
// ✅ new filter route
router.post('/filter', roomsController.filterRooms);
// get rooms by category
router.get('/category/:category', roomsController.getRoomsByCategory);

// get rooms by owner
router.get('/owner/:ownerId', auth, requireRole('owner', 'admin'), roomsController.getRoomsByOwner);
router.get('/owner/:ownerId/approved', auth, requireRole('owner', 'admin'), roomsController.getApprovedRoomsByOwner);
router.get('/:id', optionalAuth, roomsController.getRoom);
router.put('/:id', auth, requireRole('owner', 'admin'), roomsController.updateRoom);


// ✅ Route for approved rooms by owner
// router.get('/owner/:ownerId/approved', roomsController.getApprovedRoomsByOwner);
// router.patch('/:roomId/category', roomsController.updateRoomCategory);
module.exports = router;
