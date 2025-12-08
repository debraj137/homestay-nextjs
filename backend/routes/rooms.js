const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');


router.get('/', roomsController.listRooms);
router.post('/', roomsController.createRoom);
router.get('/search', roomsController.searchRooms);
router.get('/amenities', roomsController.getDistinctAmenities);
// ✅ new filter route
router.post('/filter', roomsController.filterRooms);
// get rooms by category
router.get('/category/:category', roomsController.getRoomsByCategory);

// get rooms by owner
router.get('/owner/:ownerId', roomsController.getRoomsByOwner);
router.get('/owner/:ownerId/approved', roomsController.getApprovedRoomsByOwner);
router.get('/:id', roomsController.getRoom);
router.put('/:id', roomsController.updateRoom);


// ✅ Route for approved rooms by owner
// router.get('/owner/:ownerId/approved', roomsController.getApprovedRoomsByOwner);
// router.patch('/:roomId/category', roomsController.updateRoomCategory);
module.exports = router;