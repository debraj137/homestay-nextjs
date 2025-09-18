const Room = require('../models/Room');
const Booking = require('../models/Booking');

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




exports.searchRooms = async (req, res) => {
  try {
    const { city, checkInDate, checkOutDate } = req.query;
    console.log("Search params:", city, checkInDate, checkOutDate);
    if (!city || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'City, check-in and check-out are required' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // 1. Get all approved rooms in city
    let rooms = await Room.find({
      'location.city': city,
      isApproved: true,
      isAvailable: true
    });

    // 2. Filter out rooms that are already booked in given dates
    const availableRooms = [];
    for (let room of rooms) {
      const overlappingBooking = await Booking.findOne({
        roomId: room._id,
        status: 'confirmed',
        $or: [
          { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } } // overlaps
        ]
      });

      if (!overlappingBooking) {
        availableRooms.push(room);
      }
    }

    res.json(availableRooms);
  } catch (err) {
    console.error("❌ Error in searchRooms:", err.message, err);
    res.status(500).json({ message: 'Server errorr' });
  }
};

exports.getDistinctAmenities = async (req, res) => {
  try {
    const amenities = await Room.distinct("amenities", { isApproved: true });
    res.json(amenities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch amenities" });
  }
};


// 🔍 Filter rooms by price & amenities
exports.filterRooms = async (req, res) => {
  try {
    const { maxPrice, amenities } = req.body; // amenities: array of strings

    let query = { isApproved: true, isAvailable: true };

    // ✅ Price filter
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    // ✅ Amenities filter (all selected amenities must be in room)
    if (amenities && amenities.length > 0) {
      query.amenities = { $all: amenities };
    }

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};