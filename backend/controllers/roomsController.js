const Room = require('../models/Room');


exports.listRooms = async (req, res) => {
try {
const rooms = await Room.find();
res.json(rooms);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


// exports.getRoom = async (req, res) => {
// try {
// const room = await Room.findById(req.params.id);
// if (!room) return res.status(404).json({ message: 'Room not found' });
// res.json(room);
// } catch (err) {
// res.status(500).json({ message: err.message });
// }
// };

// Get rooms by owner
exports.getRoomsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const rooms = await Room.find({ ownerId }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new room
exports.createRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get room by ID
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Room not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


