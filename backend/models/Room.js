const mongoose = require('mongoose');


const RoomSchema = new mongoose.Schema({
title: { type: String, required: true },
description: String,
pricePerNight: { type: Number, required: true },
location: String,
images: [String],
amenities: [String],
owner: String,
bookedDates: [Date]
});


module.exports = mongoose.model('Room', RoomSchema);