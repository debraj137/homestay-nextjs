'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // default rows per page
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);

  const [filters, setFilters] = useState({
    qTitle: '',
    qLocation: '',
    qBookedBy: '',
    bookingDate: '', // YYYY-MM-DD
    bookingType: '', // '' | 'hourly' | 'full'
  });

  async function openUserModal(userId) {
    setShowUserModal(true);
    setLoadingUser(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/users/${userId}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUserDetails(data.user);
      setUserBookings(data.bookings || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load user details');
      setShowUserModal(false);
    } finally {
      setLoadingUser(false);
    }
  }


  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.qTitle) params.append('qTitle', filters.qTitle);
        if (filters.qLocation) params.append('qLocation', filters.qLocation);
        if (filters.qBookedBy) params.append('qBookedBy', filters.qBookedBy);
        if (filters.bookingDate) params.append('bookingDate', filters.bookingDate);
        if (filters.bookingType) params.append('bookingType', filters.bookingType);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);

        const url = `${process.env.NEXT_PUBLIC_API_BASE}/admin/bookings?${params.toString()}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load');
        // Now backend returns { total, page, limit, bookings }
        setBookings(data.bookings || []);
        setTotal(Number(data.total || 0));
      } catch (err) {
        toast.error(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [filters, page, limit]);
  function openEditModal(booking) {
    // prepare formData with safe defaults
    setSelectedBooking(booking);
    setFormData({
      bookingType: booking.bookingType || 'full', // read-only indicator
      status: booking.status || 'confirmed',
      // dates: use ISO date string (yyyy-mm-dd) for input[type=date]
      checkInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().slice(0, 10) : '',
      checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().slice(0, 10) : '',
      checkInTime: booking.checkInTime || '',
      hours: booking.hours || 3,
      numberOfAdult: booking.numberOfAdult ?? 1,
      numberOfChild: booking.numberOfChild ?? 0,
    });
  }

  function closeModal() {
    setSelectedBooking(null);
    setFormData({});
    setSaving(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleSave() {
    if (!selectedBooking) return;
    // Basic validation
    if (formData.bookingType === 'full') {
      if (!formData.checkInDate || !formData.checkOutDate) {
        toast.error('Please provide check-in and check-out dates.');
        return;
      }
      if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
        toast.error('Check-out date must be after check-in date.');
        return;
      }
    } else {
      if (!formData.checkInDate || !formData.checkInTime) {
        toast.error('Please provide check-in date and time for hourly booking.');
        return;
      }
      const hrs = Number(formData.hours);
      if (isNaN(hrs) || hrs < 2 || hrs > 10) {
        toast.error('Hours must be between 2 and 10.');
        return;
      }
    }

    //////////////////cancel validation//////////////////////
    // 🚫 Admin cancel validation (24 hours before check-in)
    // if (
    //   formData.status === 'cancelled' &&
    //   selectedBooking.status === 'confirmed'
    // ) {
    //   const checkIn = new Date(
    //     selectedBooking.startAt ||
    //     selectedBooking.checkInDate
    //   );

    //   const diffHours = (checkIn - new Date()) / (1000 * 60 * 60);

    //   if (diffHours < 24) {
    //     toast.error('Booking can only be cancelled at least 24 hours before check-in.');
    //     return;
    //   }
    // }
    //////////////////cancel validation end//////////////////////
    // Prepare body for backend. Keep only fields backend expects.
    const body = {
      bookingType: formData.bookingType,
      status: formData.status,
      numberOfAdult: Number(formData.numberOfAdult),
      numberOfChild: Number(formData.numberOfChild),
    };

    if (formData.bookingType === 'full') {
      body.checkInDate = formData.checkInDate;
      body.checkOutDate = formData.checkOutDate;
      // for compatibility, don't send hourly-only fields
    } else {
      body.checkInDate = formData.checkInDate;
      body.checkInTime = formData.checkInTime;
      body.hours = Number(formData.hours);
      // For hourly booking we may want startAt/endAt calculated server-side
    }

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/${selectedBooking._id}/modify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update booking');

      // backend may return updated booking as data.booking or data
      const updated = data.booking || data;

      // update local state
      setBookings((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      toast.success('Booking updated successfully');
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update booking');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-9xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-600">Room title</label>
          <input type="text" value={filters.qTitle} onChange={(e) => setFilters(f => ({ ...f, qTitle: e.target.value }))} placeholder="Search room title" className="border px-3 py-2 rounded w-60" />
        </div>

        <div>
          <label className="text-xs text-gray-600">Location</label>
          <input type="text" value={filters.qLocation} onChange={(e) => setFilters(f => ({ ...f, qLocation: e.target.value }))} placeholder="City / State / Address" className="border px-3 py-2 rounded w-60" />
        </div>

        <div>
          <label className="text-xs text-gray-600">Booked by</label>
          <input type="text" value={filters.qBookedBy} onChange={(e) => setFilters(f => ({ ...f, qBookedBy: e.target.value }))} placeholder="User name or email" className="border px-3 py-2 rounded w-60" />
        </div>

        <div>
          <label className="text-xs text-gray-600">Booking date</label>
          <input type="date" value={filters.bookingDate} onChange={(e) => setFilters(f => ({ ...f, bookingDate: e.target.value }))} className="border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="text-xs text-gray-600">Booking type</label>
          <select value={filters.bookingType} onChange={(e) => setFilters(f => ({ ...f, bookingType: e.target.value }))} className="border px-3 py-2 rounded">
            <option value="">All</option>
            <option value="full">Full-Day</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => { setFilters({ qTitle: '', qLocation: '', qBookedBy: '', bookingDate: '', bookingType: '' }); setPage(1); }} className="px-3 py-2 border rounded text-sm">Reset</button>
          <button onClick={() => { setPage(1); }} className="px-3 py-2 bg-gray-800 text-white rounded text-sm">Apply</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg shadow">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Room Title</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Booked By</th>
              <th className="p-3 text-left">Booking Date</th>
              <th className="p-3 text-left">Booking Type</th>
              <th className="p-3 text-left">Check-In Time</th>
              <th className="p-3 text-left">Hours</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Check-in Date</th>
              <th className="p-3 text-left">Check-out Date</th>
              <th className="p-3 text-left">Adult</th>
              <th className="p-3 text-left">Child</th>
              <th className="p-3 text-left">Total Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="14" className="text-center p-8 text-gray-500">Loading...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="14" className="text-center p-4 text-gray-500">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-3 max-w-xs truncate">{b.roomId?.title}</td>
                  <td className="p-3 max-w-sm truncate">
                    {b.roomId?.location?.addressLine1 || ''}{b.roomId?.location?.addressLine1 ? ', ' : ''}
                    {b.roomId?.location?.city || ''}{b.roomId?.location?.city ? ', ' : ''}
                    {b.roomId?.location?.state || ''} {b.roomId?.location?.pincode ? '- ' + b.roomId?.location?.pincode : ''}
                  </td>
                  <td className="p-3 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => openUserModal(b.userId?._id)}>{b.userId?.name}</td>
                  <td className="p-3">{b.createdAt ? new Date(b.createdAt).toLocaleString('en-IN') : '—'}</td>
                  {/* Booking Type */}
                  <td className="p-3 capitalize">
                    {b.bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'}
                  </td>

                  {/* Check-In Time (hourly only) */}
                  <td className="p-3">
                    {b.bookingType === 'hourly' ? (b.checkInTime || '—') : '—'}
                  </td>

                  {/* Hours */}
                  <td className="p-3">{b.bookingType === 'hourly' ? (`${b.hours || '-'} hrs`) : '—'}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {b.status}
                    </span>
                  </td>

                  {/* Dates */}
                  <td className="p-3">{b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : '—'}</td>
                  <td className="p-3">{b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : '—'}</td>

                  <td className="p-3">{b.numberOfAdult}</td>
                  <td className="p-3">{b.numberOfChild}</td>
                  <td className="p-3 font-semibold">₹{b.totalPrice}</td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(b)}
                        className="text-blue-600 hover:underline text-sm cursor-pointer"
                      >
                        Modify
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * limit + 1} – {Math.min(page * limit, total)} of {total}
        </div>

        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className={`px-3 py-1 rounded border ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>Prev</button>
          <div className="px-3 py-1 border rounded">Page {page}</div>
          <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)} className={`px-3 py-1 rounded border ${page * limit >= total ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>

          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border px-2 py-1 rounded">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>


      {/* Edit Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-[95%] max-w-2xl p-6 z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">Modify Booking</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedBooking.roomId?.title}</p>
              </div>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Booking Type (read-only label) */}
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Booking Type</label>
                <div className="mt-1 text-sm font-semibold">
                  {formData.bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded px-3 py-2"
                >
                  <option value="confirmed">confirmed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>

              {/* Date/time fields */}
              {formData.bookingType === 'full' ? (
                <>
                  <div>
                    <label className="text-xs text-gray-500">Check-In Date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Check-Out Date</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-gray-500">Check-In Date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Check-In Time</label>
                    <input
                      type="text"
                      name="checkInTime"
                      value={formData.checkInTime}
                      onChange={handleChange}
                      placeholder="e.g. 04:00 PM"
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500">Duration (hours)</label>
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleChange}
                      min={2}
                      max={10}
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">Allowed: 2 - 10 hrs</p>
                  </div>
                </>
              )}

              {/* Guests */}
              <div>
                <label className="text-xs text-gray-500">Adults</label>
                <input
                  type="number"
                  name="numberOfAdult"
                  value={formData.numberOfAdult}
                  onChange={handleChange}
                  min={1}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Children</label>
                <input
                  type="number"
                  name="numberOfChild"
                  value={formData.numberOfChild}
                  onChange={handleChange}
                  min={0}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowUserModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-[95%] max-w-3xl p-6 z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">User Details</h2>
                <p className="text-sm text-gray-500">
                  Booking history of this user
                </p>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {loadingUser ? (
              <p className="text-center py-8 text-gray-500">Loading...</p>
            ) : (
              <>
                {/* User info */}
                <div className="mb-4 border rounded p-4 bg-gray-50">
                  <p><strong>Name:</strong> {userDetails?.name}</p>
                  <p><strong>Email:</strong> {userDetails?.email}</p>
                  <p><strong>Mobile:</strong> {userDetails?.mobileNumber || '—'}</p>
                </div>

                {/* User bookings */}
                <div className="max-h-80 overflow-y-auto border rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Room</th>
                        <th className="p-2 text-left">Check-in</th>
                        <th className="p-2 text-left">Check-out</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBookings.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-500">
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        userBookings.map((bk) => (
                          <tr key={bk._id} className="border-t">
                            <td className="p-2">{bk.roomId?.title}</td>
                            <td className="p-2">
                              {bk.checkInDate
                                ? new Date(bk.checkInDate).toLocaleDateString()
                                : '—'}
                            </td>
                            <td className="p-2">
                              {bk.checkOutDate
                                ? new Date(bk.checkOutDate).toLocaleDateString()
                                : '—'}
                            </td>
                            <td className="p-2 capitalize">{bk.status}</td>
                            <td className="p-2 font-semibold">₹{bk.totalPrice}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
