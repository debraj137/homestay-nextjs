const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking'); // import your Booking model
const Coupon = require('../models/Coupon');
exports.getOwnersWithPendingRooms = async (req, res) => {
  try {
    const owners = await Room.find({ isApproved: false })
      .populate('ownerId', 'name email')
      .distinct('ownerId'); // only unique owners

    const ownerDetails = await User.find({ _id: { $in: owners } }, 'name email');
    res.json(ownerDetails);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingRoomsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const rooms = await Room.find({ ownerId, isApproved: false });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRoomApproval = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    let updatedRoom;
    if (action === 'approve') {
      updatedRoom = await Room.findByIdAndUpdate(roomId, { isApproved: true }, { new: true });
    } else if (action === 'reject') {
      updatedRoom = await Room.findByIdAndDelete(roomId);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


/* ================= Approved property endpoints ================= */

/**
 * Get owners who have approved rooms
 */
exports.getOwnersWithApprovedRooms = async (req, res) => {
  try {
    const ownerIds = await Room.distinct('ownerId', { isApproved: true });
    if (!ownerIds || ownerIds.length === 0) return res.json([]);
    const owners = await User.find({ _id: { $in: ownerIds } }, 'name email');
    res.json(owners);
  } catch (err) {
    console.error('getOwnersWithApprovedRooms:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get approved rooms for a given owner
 */
exports.getApprovedRoomsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const rooms = await Room.find({ ownerId, isApproved: true }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error('getApprovedRoomsByOwner:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update room category: { category: 'Normal'|'Silver'|'Gold'|'Diamond' }
 */
exports.updateRoomCategory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { category } = req.body;

    const allowed = ['Normal', 'Silver', 'Gold', 'Diamond'];
    if (!allowed.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const room = await Room.findByIdAndUpdate(roomId, { category }, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.json({ message: 'Category updated', room });
  } catch (err) {
    console.error('updateRoomCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all owners
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('name email');
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all rooms by owner (both approved & pending)
exports.getRoomsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const rooms = await Room.find({ ownerId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('roomId') // get room details
      .populate('userId', 'name email'); // get user details

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

exports.toggleCouponActive = async (req, res) => {  
  try {
    console.log('toggleCouponActive called',req.user);
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin required' });
    const { couponId } = req.params;
    const { isActive } = req.body;
    const updated = await Coupon.findByIdAndUpdate(couponId, { isActive: !!isActive }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Updated', coupon: updated });
  } catch (err) {
    console.error('toggleCouponActive', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update existing coupon (admin only)
exports.updateCoupon = async (req, res) => {
  try {
    // require admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { couponId } = req.params;
    const payload = req.body || {};

    // Only allow a controlled set of fields to be updated
    const allowedFields = [
      'code',
      'description',
      'discountType',
      'discountValue',
      'startsAt',
      'endsAt',
      'minBookingAmount',
      'applicableRooms',
      'maxUses',
      'maxUsesPerUser',
      'isActive'
    ];

    // Build update object
    const update = {};
    for (const key of allowedFields) {
      if (typeof payload[key] !== 'undefined') update[key] = payload[key];
    }

    // Normalize code
    if (update.code) update.code = String(update.code).toUpperCase();

    // Validate date fields if present
    if (update.startsAt) update.startsAt = new Date(update.startsAt);
    if (update.endsAt) update.endsAt = new Date(update.endsAt);
    if (update.startsAt && update.endsAt && update.startsAt > update.endsAt) {
      return res.status(400).json({ message: 'startsAt must be before endsAt' });
    }

    // Fetch existing coupon
    const existing = await Coupon.findById(couponId);
    if (!existing) return res.status(404).json({ message: 'Coupon not found' });

    // If code changed, ensure uniqueness
    if (update.code && update.code !== existing.code) {
      const found = await Coupon.findOne({ code: update.code });
      if (found) return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // If maxUses is being lowered, ensure it is not below already used count
    if (typeof update.maxUses !== 'undefined') {
      const newMax = Number(update.maxUses) || 0;
      const existingUses = existing.usesCount || 0;
      if (newMax > 0 && newMax < existingUses) {
        return res.status(400).json({
          message: `Cannot set maxUses to ${newMax} because coupon already used ${existingUses} times`
        });
      }
    }

    // If maxUsesPerUser changed, ensure >= existing per-user uses (hard to check for all users quickly but we'll check the simplest case: must be >=1 if already used)
    if (typeof update.maxUsesPerUser !== 'undefined') {
      const newMaxPerUser = Number(update.maxUsesPerUser) || 0;
      if (newMaxPerUser > 0 && newMaxPerUser < 0) {
        // this is unlikely, but keep for shape - no-op
      }
      // (Optional) You could add a deeper check by aggregating bookings grouped by user; skipping for perf.
    }

    // Apply update
    Object.assign(existing, update);
    await existing.save();

    return res.json({ message: 'Coupon updated', coupon: existing });
  } catch (err) {
    console.error('updateCoupon error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
