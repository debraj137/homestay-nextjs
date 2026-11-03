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
    getUserWithBookings,
    getApprovedAvailableRooms,
    bookRoomForGuest,
    searchUsers
} = require('../controllers/adminController');
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = authMiddleware;

router.use(authMiddleware, requireRole('admin'));
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
router.put('/coupons/:couponId/active', toggleCouponActive);
router.put('/coupons/:couponId', updateCoupon);
router.get('/users/:userId/bookings', getUserWithBookings);
router.get('/rooms/', getApprovedAvailableRooms);
// router.post('/book-room', authMiddleware, adminBookRoomForGuest);
router.get('/users/search', searchUsers);
router.post('/book-for-guest', bookRoomForGuest);
module.exports = router;
