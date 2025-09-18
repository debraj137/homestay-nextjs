const User = require('../models/User');
const Room = require('../models/Room');

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