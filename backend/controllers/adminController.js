const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking'); // import your Booking model
const Coupon = require('../models/Coupon');
const BookingController = require('./bookingsController'); 
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
// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate('roomId') // get room details
//       .populate('userId', 'name email'); // get user details

//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch bookings' });
//   }
// };

/**
 * GET /admin/bookings?page=1&limit=20
 * Returns paginated bookings with room & user populated.
 */
// exports.getAllBookings = async (req, res) => {
//   try {
//     // parse pagination params (default page=1, limit=20)
//     const page = Math.max(1, parseInt(req.query.page || '1', 10));
//     const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20', 10))); // cap to 100

//     const filter = {}; // you can extend with query filters later (status, room, date, etc.)

//     // total count for pagination
//     const total = await Booking.countDocuments(filter);

//     // fetch page (sort by newest)
//     const bookings = await Booking.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .populate('roomId')
//       .populate('userId', 'name email');

//     const totalPages = Math.ceil(total / limit);

//     res.json({
//       bookings,
//       total,
//       page,
//       totalPages,
//       limit
//     });
//   } catch (err) {
//     console.error('getAllBookings error', err);
//     res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
//   }
// };
// GET /admin/bookings
// supports query params:
// qTitle (string) - search room title (partial, case-insensitive)
// qLocation (string) - search city / state / addressLine (partial)
// qBookedBy (string) - search user name or email (partial)
// bookingDate (YYYY-MM-DD) - bookings created on that date (server local timezone)
// bookingType ('hourly'|'full')
// page (int, default 1) - pagination
// limit (int, default 25)
exports.getAllBookings = async (req, res) => {
  try {
    const {
      qTitle,
      qLocation,
      qBookedBy,
      bookingDate,
      bookingType,
      page = 1,
      limit = 25,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(200, parseInt(limit, 10) || 25);
    const skip = (pageNum - 1) * pageLimit;

    // Build aggregation pipeline
    const pipeline = [];

    // Join room
    pipeline.push({
      $lookup: {
        from: "rooms",
        localField: "roomId",
        foreignField: "_id",
        as: "room",
      },
    });
    pipeline.push({ $unwind: { path: "$room", preserveNullAndEmptyArrays: true } });

    // Join user (booked by)
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    });
    pipeline.push({ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } });

    // Build match object
    const match = {};

    if (bookingType) {
      match.bookingType = bookingType;
    }

    // Text/regex filters (case-insensitive)
    if (qTitle) {
      match["room.title"] = { $regex: qTitle, $options: "i" };
    }
    if (qLocation) {
      // search city, state, address lines
      match.$or = match.$or || [];
      match.$or.push(
        { "room.location.city": { $regex: qLocation, $options: "i" } },
        { "room.location.state": { $regex: qLocation, $options: "i" } },
        { "room.location.addressLine1": { $regex: qLocation, $options: "i" } },
        { "room.location.addressLine2": { $regex: qLocation, $options: "i" } }
      );
    }
    if (qBookedBy) {
      match.$or = match.$or || [];
      match.$or.push(
        { "user.name": { $regex: qBookedBy, $options: "i" } },
        { "user.email": { $regex: qBookedBy, $options: "i" } }
      );
    }

    if (bookingDate) {
      // Accept single date YYYY-MM-DD — match createdAt on that local date
      const d = new Date(bookingDate);
      if (!isNaN(d.getTime())) {
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
        match.createdAt = { $gte: start, $lte: end };
      }
    }

    // If we have any match criteria, add $match
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    // Count total (for pagination)
    const countPipeline = [...pipeline, { $count: "total" }];
    const countRes = await Booking.aggregate(countPipeline);
    const total = (countRes[0] && countRes[0].total) || 0;

    // Sorting (latest first)
    pipeline.push({ $sort: { createdAt: -1 } });

    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: pageLimit });

    // Project fields to return (populated room and user)
    pipeline.push({
      $project: {
        _id: 1,
        bookingType: 1,
        bookingSource: 1,
        checkInDate: 1,
        checkOutDate: 1,
        checkInTime: 1,
        hours: 1,
        numberOfAdult: 1,
        numberOfChild: 1,
        status: 1,
        totalPrice: 1,
        coupon: 1,
        createdAt: 1,
        startAt: 1,
        endAt: 1,
        // embed the joined room and user (select fields only)
        room: {
          _id: "$room._id",
          title: "$room.title",
          location: "$room.location",
          images: "$room.images",
        },
        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          mobileNumber: "$user.mobileNumber",
        },
      },
    });

    const results = await Booking.aggregate(pipeline);

    // Format to match previous shape (roomId, userId) to minimize frontend changes
    const formatted = results.map((r) => ({
      ...r,
      roomId: r.room,
      userId: r.user,
    }));

    res.json({
      total,
      page: pageNum,
      limit: pageLimit,
      bookings: formatted,
    });
  } catch (err) {
    console.error('getAllBookings error', err);
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

exports.toggleCouponActive = async (req, res) => {
  try {
    console.log('toggleCouponActive called', req.user);
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


// Get user details + all bookings by that user
exports.getUserWithBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('name email mobileNumber');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = await Booking.find({ userId })
      .populate('roomId', 'title location')
      .sort({ createdAt: -1 });

    res.json({
      user,
      bookings,
    });
  } catch (err) {
    console.error('getUserWithBookings error', err);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.getApprovedAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      isApproved: true,
      isAvailable: true,
    }).sort({ createdAt: -1 });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { mobileNumber: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name email mobileNumber')
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search users' });
  }
};

// ✅ Admin books room for guest
exports.bookRoomForGuest = async (req, res) => {
  try {
    const {
      roomId,
      userId, // optional
      guest,
      checkInDate,
      checkOutDate,
      numberOfAdult,
      numberOfChild,
    } = req.body;

    // -------------------------
    // 1️⃣ Basic validation
    // -------------------------
    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        message: 'Check-out date must be after check-in date',
      });
    }

    // -------------------------
    // 2️⃣ Check room availability FIRST
    // -------------------------
    const overlappingBooking = await Booking.findOne({
      roomId,
      status: 'confirmed',
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'Room already booked for selected dates',
      });
    }

    // -------------------------
    // 3️⃣ Load room & calculate price
    // -------------------------
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const nights = Math.max(
      1,
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );

    const basePrice =
      room.discount > 0
        ? Math.round(room.price * (1 - room.discount / 100))
        : room.price;

    const totalPrice = basePrice * nights;

    // -------------------------
    // 4️⃣ Resolve user (ONLY NOW)
    // -------------------------
    let finalUserId = userId;

    if (!finalUserId) {
      // Check again by email (safety)
      let existingUser = await User.findOne({ email: guest.email });

      if (existingUser) {
        finalUserId = existingUser._id;
      } else {
        const hashedPassword = await bcrypt.hash('TEMP_PASSWORD', 10);

        const newUser = await User.create({
          name: guest.name,
          email: guest.email,
          mobileNumber: guest.mobileNumber,
          password: hashedPassword,
          emailVerified: true,
          mobileVerified: true,
        });

        finalUserId = newUser._id;
      }
    }

    // -------------------------
    // 5️⃣ Create booking
    // -------------------------
    const booking = await Booking.create({
      userId: finalUserId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfAdult,
      numberOfChild,
      totalPrice,
      mobileNumber: guest.mobileNumber,
      status: 'confirmed',
    });

    return res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (err) {
    console.error('Admin booking error:', err);
    res.status(500).json({ message: err.message });
  }
};

