// const Room = require('../models/Room');
// const Review = require('../models/Review'); // ✅ import review model
// const Booking = require('../models/Booking');

// exports.listRooms = async (req, res) => {
// try {
// const rooms = await Room.find();
// res.json(rooms);
// } catch (err) {
// res.status(500).json({ message: err.message });
// }
// };


// // Get rooms by owner
// exports.getRoomsByOwner = async (req, res) => {
//   try {
//     const { ownerId } = req.params;
//     const rooms = await Room.find({ ownerId }).sort({ createdAt: -1 });
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Create new room
// exports.createRoom = async (req, res) => {
//   try {
//     const newRoom = new Room(req.body);
//     await newRoom.save();
//     res.status(201).json(newRoom);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get room by ID
// exports.getRoom = async (req, res) => {
//   try {
//     const room = await Room.findById(req.params.id);
//     if (!room) return res.status(404).json({ message: 'Room not found' });
//     res.json(room);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Update room
// exports.updateRoom = async (req, res) => {
//   try {
//     const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Room not found' });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.searchRooms = async (req, res) => {
//   try {
//     const { city, checkInDate, checkOutDate, adults, children } = req.query;

//     // ✅ Require only city
//     if (!city) {
//       return res.status(400).json({ message: "City is required" });
//     }

//     const numAdults = parseInt(adults) || 1;
//     const numChildren = parseInt(children) || 0;

//     // ✅ Fetch rooms by city and capacity
//     let rooms = await Room.find({
//       "location.city": city,
//       isApproved: true,
//       isAvailable: true,
//       maximumAllowedAdult: { $gte: numAdults },
//       maximumAllowedChild: { $gte: numChildren },
//     }).lean();

//     // ✅ If no date range provided, skip booking overlap logic
//     let availableRooms = rooms;

//     if (checkInDate && checkOutDate) {
//       const checkIn = new Date(checkInDate);
//       const checkOut = new Date(checkOutDate);

//       // Ensure valid date range
//       if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkIn >= checkOut) {
//         return res.status(400).json({ message: "Invalid check-in/check-out dates" });
//       }

//       // ✅ Find booked room IDs overlapping with the selected range
//       const bookedRoomIds = await Booking.find({
//         roomId: { $in: rooms.map((r) => r._id) },
//         status: "confirmed",
//         checkInDate: { $lt: checkOut },
//         checkOutDate: { $gt: checkIn },
//       }).distinct("roomId");

//       availableRooms = rooms.filter(
//         (r) => !bookedRoomIds.map((id) => id.toString()).includes(r._id.toString())
//       );
//     }

//     // ✅ Add rating info
//     const roomIds = availableRooms.map((r) => r._id);
//     const ratings = await Review.aggregate([
//       { $match: { roomId: { $in: roomIds } } },
//       {
//         $group: {
//           _id: "$roomId",
//           averageRating: { $avg: "$rating" },
//           totalReviews: { $sum: 1 },
//         },
//       },
//     ]);

//     const ratingMap = {};
//     ratings.forEach((r) => {
//       ratingMap[r._id.toString()] = {
//         averageRating: r.averageRating,
//         totalReviews: r.totalReviews,
//       };
//     });

//     availableRooms = availableRooms.map((room) => {
//       const ratingData = ratingMap[room._id.toString()] || {
//         averageRating: 0,
//         totalReviews: 0,
//       };
//       return {
//         ...room,
//         averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
//         totalReviews: ratingData.totalReviews,
//       };
//     });

//     res.json(availableRooms);
//   } catch (err) {
//     console.error("❌ Error in searchRooms:", err.message, err);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// exports.getDistinctAmenities = async (req, res) => {
//   try {
//     const amenities = await Room.distinct("amenities", { isApproved: true });
//     res.json(amenities);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch amenities" });
//   }
// };


// // 🔍 Filter rooms by price, amenities & average rating


// exports.filterRooms = async (req, res) => {
//   try {
//     const { maxPrice, amenities, minRating } = req.body;

//     let query = { isApproved: true, isAvailable: true };

//     if (maxPrice) {
//       query.price = { $lte: Number(maxPrice) };
//     }
//     if (amenities && amenities.length > 0) {
//       query.amenities = { $all: amenities };
//     }

//     const rooms = await Room.find(query).lean();
//     if (rooms.length === 0) return res.json([]);

//     const roomIds = rooms.map((r) => r._id);

//     // Aggregate reviews
//     const ratings = await Review.aggregate([
//       { $match: { roomId: { $in: roomIds } } },
//       {
//         $group: {
//           _id: "$roomId",
//           averageRating: { $avg: "$rating" },
//           totalReviews: { $sum: 1 },
//         },
//       },
//     ]);

//     const ratingMap = {};
//     ratings.forEach((r) => {
//       ratingMap[r._id.toString()] = {
//         averageRating: r.averageRating,
//         totalReviews: r.totalReviews,
//       };
//     });

//     // Merge ratings
//     const enrichedRooms = rooms
//       .map((room) => {
//         const ratingData = ratingMap[room._id.toString()] || {
//           averageRating: 0,
//           totalReviews: 0,
//         };
//         return {
//           ...room,
//           averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
//           totalReviews: ratingData.totalReviews,
//         };
//       })
//       .filter((room) =>
//         minRating ? room.averageRating >= Number(minRating) : true
//       );

//     res.json(enrichedRooms);
//   } catch (err) {
//     console.error("❌ Error filtering rooms:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get rooms by category
// exports.getRoomsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const rooms = await Room.find({ category, isApproved: true });
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
// controllers/roomsController.js
// __define-ocg__: Added discount-aware response structure

const Room = require('../models/Room');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// ✅ Get all rooms
exports.listRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get rooms by owner
exports.getRoomsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const rooms = await Room.find({ ownerId }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create new room
exports.createRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get room by ID
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Compute discounted price
    const discountedPrice =
      room.discount > 0
        ? Math.round(room.price * (1 - room.discount / 100))
        : room.price;

    res.json({ ...room.toObject(), discountedPrice });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update room
exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Room not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Search Rooms (city, dates, etc.)
exports.searchRooms = async (req, res) => {
  try {
    const { city, checkInDate, checkOutDate, adults, children } = req.query;
    if (!city) return res.status(400).json({ message: "City is required" });

    const numAdults = parseInt(adults) || 1;
    const numChildren = parseInt(children) || 0;

    let rooms = await Room.find({
      "location.city": city,
      isApproved: true,
      isAvailable: true,
      maximumAllowedAdult: { $gte: numAdults },
      maximumAllowedChild: { $gte: numChildren },
    }).lean();

    let availableRooms = rooms;

    // ✅ Date overlap check
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkIn >= checkOut) {
        return res.status(400).json({ message: "Invalid check-in/check-out dates" });
      }

      const bookedRoomIds = await Booking.find({
        roomId: { $in: rooms.map((r) => r._id) },
        status: "confirmed",
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
      }).distinct("roomId");

      availableRooms = rooms.filter(
        (r) => !bookedRoomIds.map((id) => id.toString()).includes(r._id.toString())
      );
    }

    // ✅ Ratings
    const roomIds = availableRooms.map((r) => r._id);
    const ratings = await Review.aggregate([
      { $match: { roomId: { $in: roomIds } } },
      {
        $group: {
          _id: "$roomId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r._id.toString()] = {
        averageRating: r.averageRating,
        totalReviews: r.totalReviews,
      };
    });

    // ✅ Attach discount + rating data
    availableRooms = availableRooms.map((room) => {
      const ratingData = ratingMap[room._id.toString()] || { averageRating: 0, totalReviews: 0 };
      const discountedPrice =
        room.discount > 0 ? Math.round(room.price * (1 - room.discount / 100)) : room.price;

      return {
        ...room,
        averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
        totalReviews: ratingData.totalReviews,
        discountedPrice,
      };
    });

    res.json(availableRooms);
  } catch (err) {
    console.error("❌ Error in searchRooms:", err.message, err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get distinct amenities
exports.getDistinctAmenities = async (req, res) => {
  try {
    const amenities = await Room.distinct("amenities", { isApproved: true });
    res.json(amenities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch amenities" });
  }
};

// ✅ Filter rooms by price, amenities, and rating
exports.filterRooms = async (req, res) => {
  try {
    const { maxPrice, amenities, minRating } = req.body;
    let query = { isApproved: true, isAvailable: true };

    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (amenities && amenities.length > 0) query.amenities = { $all: amenities };

    const rooms = await Room.find(query).lean();
    if (rooms.length === 0) return res.json([]);

    const roomIds = rooms.map((r) => r._id);
    const ratings = await Review.aggregate([
      { $match: { roomId: { $in: roomIds } } },
      {
        $group: {
          _id: "$roomId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r._id.toString()] = {
        averageRating: r.averageRating,
        totalReviews: r.totalReviews,
      };
    });

    // ✅ Add discount & rating info
    const enrichedRooms = rooms
      .map((room) => {
        const ratingData = ratingMap[room._id.toString()] || {
          averageRating: 0,
          totalReviews: 0,
        };

        const discountedPrice =
          room.discount > 0
            ? Math.round(room.price * (1 - room.discount / 100))
            : room.price;

        return {
          ...room,
          averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
          totalReviews: ratingData.totalReviews,
          discountedPrice,
        };
      })
      .filter((room) =>
        minRating ? room.averageRating >= Number(minRating) : true
      );

    res.json(enrichedRooms);
  } catch (err) {
    console.error("❌ Error filtering rooms:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get rooms by category
exports.getRoomsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const rooms = await Room.find({ category, isApproved: true }).lean();

    const enriched = rooms.map((room) => ({
      ...room,
      discountedPrice:
        room.discount > 0
          ? Math.round(room.price * (1 - room.discount / 100))
          : room.price,
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
