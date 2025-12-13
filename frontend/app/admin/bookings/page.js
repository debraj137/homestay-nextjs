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

  // useEffect(() => {
  //   async function fetchBookings() {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/bookings`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });
  //       const data = await res.json();
  //       if (!res.ok) throw new Error(data.message || 'Failed to load');
  //       setBookings(data);
  //     } catch (err) {
  //       toast.error(err.message || 'Failed to fetch bookings');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchBookings();
  // }, []);
  // fetchBookings reads page & limit
  async function fetchBookings(p = page, l = limit) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/bookings?page=${p}&limit=${l}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');

      // If backend returns the paginated shape:
      if (data.bookings) {
        setBookings(data.bookings);
        setTotal(data.total || 0);
        setPage(Number(data.page || p));
        setLimit(Number(data.limit || l));
        setTotalPages(Number(data.totalPages || Math.ceil((data.total || 0) / (data.limit || l))));
      } else {
        // fallback to older shape (array)
        setBookings(Array.isArray(data) ? data : []);
        setTotal(Array.isArray(data) ? data.length : 0);
        setPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }

  // initial fetch, and when page/limit changes
  useEffect(() => {
    fetchBookings(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);
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
                  <td className="p-3">{b.userId?.name}</td>
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
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <strong>{bookings.length}</strong> of <strong>{total}</strong> bookings
          {totalPages > 1 && <span> — page {page} of {totalPages}</span>}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`px-3 py-1 rounded border ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Prev
            </button>

            {/* show up to 7 page buttons centered on current page */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                // show only a window of pages
                const showWindow = 7;
                const half = Math.floor(showWindow / 2);
                if (totalPages > showWindow) {
                  if (p === 1 || p === totalPages) return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-2 py-1 rounded ${p === page ? 'bg-gray-800 text-white' : 'border'}`}
                    >
                      {p}
                    </button>
                  );
                  if (Math.abs(p - page) > half) {
                    // skip rendering pages far from current; but render ellipsis in place
                    // we'll render ellipsis only once per gap — simpler approach: render only pages within window
                    return null;
                  }
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2 py-1 rounded ${p === page ? 'bg-gray-800 text-white' : 'border'}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`px-3 py-1 rounded border ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Next
            </button>

            {/* optional: change rows per page */}
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value) || 20;
                setPage(1); // reset to first page on limit change
                setLimit(newLimit);
              }}
              className="ml-3 border rounded px-2 py-1"
            >
              {[5,10, 20, 30, 50, 100].map(n => <option key={n} value={n}>{n}/page</option>)}
            </select>
          </div>
        )}
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
    </div>
  );
}
