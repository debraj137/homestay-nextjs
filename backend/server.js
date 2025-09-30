// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const reviewRouter = require('./routes/review');
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 4000;


mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use("/api/reviews", reviewRouter);

app.get('/', (req, res) => res.send('Homestay API running'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// seedReviews.js
// const Review = require("./models/Review"); // adjust path
// async function seed() {
//     await Review.insertMany([
//         {
//             roomId: "68ceaafa1115ff8e61377fff",
//             userId: "68d65aeab941cfaa91dd9372",
//             rating: 1,
//             comment: "Excellent service and cozy rooms!",
//             createdAt: new Date()
//         },
//         {
//             roomId: "68ceaafa1115ff8e61377fff",
//             userId: "68d65aeab941cfaa91dd9372",
//             rating: 1,
//             comment: "Clean and cozy rooms!",
//             createdAt: new Date()
//         },
//         {
//             roomId: "68ceaafa1115ff8e61377fff",
//             userId: "68d65aeab941cfaa91dd9372",
//             rating: 1,
//             comment: "Nice rooms!",
//             createdAt: new Date()
//         },
//         {
//             roomId: "68ceaafa1115ff8e61377fff",
//             userId: "68d65aeab941cfaa91dd9372",
//             rating: 1,
//             comment: "Nice rooms!",
//             createdAt: new Date()
//         },
//         {
//             roomId: "68ceaafa1115ff8e61377fff",
//             userId: "68d65aeab941cfaa91dd9372",
//             rating: 1,
//             comment: "Avg rooms!",
//             createdAt: new Date()
//         }
//     ]);
//     console.log("✅ Reviews seeded!");
// }

// seed();
