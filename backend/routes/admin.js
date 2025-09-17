// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getOwnersWithPendingRooms, getPendingRoomsByOwner, updateRoomApproval } = require('../controllers/adminController');

// List owners with pending rooms
router.get('/pending-owners', getOwnersWithPendingRooms);

// List pending rooms by owner
router.get('/pending-rooms/:ownerId', getPendingRoomsByOwner);

// Approve/Reject room
router.put('/room/:roomId/approval', updateRoomApproval);

module.exports = router;