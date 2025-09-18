// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getOwnersWithPendingRooms, 
    getPendingRoomsByOwner, 
    updateRoomApproval,
    getOwnersWithApprovedRooms, 
    getApprovedRoomsByOwner, 
    updateRoomCategory, 
    getAllOwners, 
    getRoomsByOwner,
    getAllBookings
} = require('../controllers/adminController');

// List owners with pending rooms
router.get('/pending-owners', getOwnersWithPendingRooms);

// List pending rooms by owner
router.get('/pending-rooms/:ownerId', getPendingRoomsByOwner);

// Approve/Reject room
router.put('/room/:roomId/approval', updateRoomApproval);

// ✅ Approved Properties
router.get('/approved-owners', getOwnersWithApprovedRooms);
router.get('/approved-rooms/:ownerId', getApprovedRoomsByOwner);
router.put('/room/:roomId/category', updateRoomCategory);

// Get all owners
router.get('/owners', getAllOwners);

// Get all rooms of one owner
router.get('/owner/:ownerId/rooms', getRoomsByOwner);

router.get('/bookings', getAllBookings);

module.exports = router;