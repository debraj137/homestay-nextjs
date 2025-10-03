function bookingConfirmationTemplate(user, room, booking) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
    <!-- Header -->
    <div style="background:#e50914; color:white; padding:20px; text-align:center;">
      <h1 style="margin:0;">Awadh Hotels</h1>
      <p style="margin:0; font-size:18px;">Your booking is confirmed ✅</p>
    </div>

    <!-- Booking Info -->
    <div style="padding:20px;">
      <h2 style="color:#e50914; margin-bottom:10px;">Booking Details</h2>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Room:</strong> ${room.title}</p>
      <p><strong>Location:</strong> ${room.location?.addressLine1 || ""}, ${room.location?.city || ""}, ${room.location?.state || ""}</p>
      <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}</p>
      <p><strong>Guests:</strong> ${booking.numberOfAdult} Adults, ${booking.numberOfChild} Children</p>
    </div>

    <!-- Payment Info -->
    <div style="background:#f9f9f9; padding:20px;">
      <h3 style="margin-top:0; color:#333;">Payment Summary</h3>
      <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
      <p><strong>Status:</strong> ${booking.status}</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center; padding:20px;">
      <a href="https://awadhhotels.com/my-bookings" style="background:#e50914; color:white; padding:12px 24px; border-radius:5px; text-decoration:none; font-weight:bold;">
        View My Booking
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#555;">
      <p>Need help? Contact our support at <a href="mailto:support@awadhhotels.com">support@awadhhotels.com</a></p>
      <p>© ${new Date().getFullYear()} Awadh Hotels. All rights reserved.</p>
    </div>
  </div>
  `;
}

function ownerNotificationTemplate(owner, user, room, booking) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
    <!-- Header -->
    <div style="background:#e50914; color:white; padding:20px; text-align:center;">
      <h1 style="margin:0;">Awadh Hotels</h1>
      <p style="margin:0; font-size:18px;">You have a new booking 📩</p>
    </div>

    <!-- Booking Info -->
    <div style="padding:20px;">
      <h2 style="color:#e50914; margin-bottom:10px;">Booking Details</h2>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Room:</strong> ${room.title}</p>
      <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}</p>
      <p><strong>Guest Name:</strong> ${user.name}</p>
      <p><strong>Guests:</strong> ${booking.numberOfAdult} Adults, ${booking.numberOfChild} Children</p>
      <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center; padding:20px;">
      <a href="https://awadhhotels.com/listed-property" style="background:#e50914; color:white; padding:12px 24px; border-radius:5px; text-decoration:none; font-weight:bold;">
        View Booking in Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#555;">
      <p>For support, contact <a href="mailto:support@awadhhotels.com">support@awadhhotels.com</a></p>
      <p>© ${new Date().getFullYear()} Awadh Hotels. All rights reserved.</p>
    </div>
  </div>
  `;
}

module.exports = { bookingConfirmationTemplate, ownerNotificationTemplate };
