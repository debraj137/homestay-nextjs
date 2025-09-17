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