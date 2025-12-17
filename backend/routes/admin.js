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
    getAllBookings,
    toggleCouponActive,
    updateCoupon,
    getUserWithBookings 
} = require('../controllers/adminController');
const authMiddleware = require("../middleware/authMiddleware");
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
// enable toggling coupon active from admin UI
router.put('/coupons/:couponId/active',authMiddleware, toggleCouponActive);
router.put('/coupons/:couponId',authMiddleware, updateCoupon);
router.get('/users/:userId/bookings', authMiddleware, getUserWithBookings);
module.exports = router;