const Room = require('../models/Room');


exports.listRooms = async (req, res) => {
try {
const rooms = await Room.find();
res.json(rooms);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getRoom = async (req, res) => {
try {
const room = await Room.findById(req.params.id);
if (!room) return res.status(404).json({ message: 'Room not found' });
res.json(room);
} catch (err) {
res.status(500).json({ message: err.message });
}
};