const Room = require('../models/Room');
const Review = require('../models/Review'); // ✅ import review model
const Booking = require('../models/Booking');

exports.listRooms = async (req, res) => {
try {
const rooms = await Room.find();
res.json(rooms);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


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



// Search rooms by city and availability and capacity
exports.searchRooms = async (req, res) => {
  try {
    console.log("Search query params:", req.query);
    const { city, checkInDate, checkOutDate, adults, children } = req.query;
    console.log("Search params:", city, checkInDate, checkOutDate, adults, children);

    if (!city || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ message: "City, check-in and check-out are required" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const numAdults = parseInt(adults) || 1;
    const numChildren = parseInt(children) || 0;

    // ✅ Step 1: Get all approved rooms in city with enough capacity
    let rooms = await Room.find({
      "location.city": city,
      isApproved: true,
      isAvailable: true,
      maximumAllowedAdult: { $gte: numAdults },
      maximumAllowedChild: { $gte: numChildren },
    });

    console.log(
      `Found ${rooms.length} rooms in ${city} with capacity for ${numAdults} adults and ${numChildren} children`
    );

    // ✅ Step 2: Find already booked rooms for overlapping dates
    const bookedRoomIds = await Booking.find({
      roomId: { $in: rooms.map((r) => r._id) },
      status: "confirmed",
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    }).distinct("roomId");

    console.log("Booked room IDs:", bookedRoomIds);

    // ✅ Step 3: Exclude booked rooms (force string comparison)
    const availableRooms = rooms.filter(
      (r) => !bookedRoomIds.map(id => id.toString()).includes(r._id.toString())
    );

    res.json(availableRooms);
  } catch (err) {
    console.error("❌ Error in searchRooms:", err.message, err);
    res.status(500).json({ message: "Server error" });
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
// exports.filterRooms = async (req, res) => {
//   try {
//     const { maxPrice, amenities } = req.body; // amenities: array of strings

//     let query = { isApproved: true, isAvailable: true };

//     // ✅ Price filter
//     if (maxPrice) {
//       query.price = { $lte: Number(maxPrice) };
//     }

//     // ✅ Amenities filter (all selected amenities must be in room)
//     if (amenities && amenities.length > 0) {
//       query.amenities = { $all: amenities };
//     }

//     const rooms = await Room.find(query);
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// 🔍 Filter rooms by price, amenities & average rating
exports.filterRooms = async (req, res) => {
  try {
    console.log("Filter params:", req.body);
    const { maxPrice, amenities, minRating } = req.body;

    let query = { isApproved: true, isAvailable: true };

    // ✅ Price filter
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    // ✅ Amenities filter
    if (amenities && amenities.length > 0) {
      query.amenities = { $all: amenities };
    }

    // Step 1: Get base rooms
    const rooms = await Room.find(query).lean();
    if (rooms.length === 0) {
      return res.json([]);
    }

    // Step 2: Aggregate reviews to get avg rating per room
    const ratings = await Review.aggregate([
      { $match: { roomId: { $in: rooms.map(r => r._id) } } },
      {
        $group: {
          _id: "$roomId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    // Step 3: Create lookup map
    const ratingMap = {};
    ratings.forEach(r => {
      ratingMap[r._id.toString()] = {
        averageRating: r.averageRating,
        totalReviews: r.totalReviews
      };
    });

    // Step 4: Merge rating data into rooms and filter by minRating
    const filteredRooms = rooms
      .map(room => {
        const ratingData = ratingMap[room._id.toString()] || { averageRating: 0, totalReviews: 0 };
        return {
          ...room,
          averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
          totalReviews: ratingData.totalReviews
        };
      })
      .filter(room => {
        if (minRating) {
          return room.averageRating >= Number(minRating);
        }
        return true;
      });

    res.json(filteredRooms);
  } catch (err) {
    console.error("❌ Error filtering rooms:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get rooms by category
exports.getRoomsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const rooms = await Room.find({ category, isApproved: true });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
