const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');


router.get('/', roomsController.listRooms);
router.get('/:id', roomsController.getRoom);
// get rooms by owner
router.get('/owner/:ownerId', roomsController.getRoomsByOwner);
router.post('/', roomsController.createRoom);
router.get('/:id', roomsController.getRoom);
router.put('/:id', roomsController.updateRoom);
// ✅ Route for approved rooms by owner
router.get('/owner/:ownerId/approved', roomsController.getApprovedRoomsByOwner);
module.exports = router;