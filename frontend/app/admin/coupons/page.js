// 'use client';

// import { useEffect, useState } from 'react';
// import AdminCouponForm from '@/components/AdminCouponForm';
// import { API_BASE } from '@/lib/api';
// import toast from 'react-hot-toast';

// export default function AdminCouponsPage() {
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);

//   async function fetchCoupons() {
//     setLoading(true);
//     try {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//       const res = await fetch(`${API_BASE}/coupons`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : undefined,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to fetch coupons');
//       setCoupons(data);
//     } catch (err) {
//       toast.error(err.message || 'Failed to load coupons');
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   async function handleCreated(newCoupon) {
//     toast.success('Coupon created');
//     setCoupons(prev => [newCoupon, ...prev]);
//     setShowForm(false);
//   }

//   async function handleToggleActive(couponId, newActive) {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${API_BASE}/admin/coupons/${couponId}/active`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token ? `Bearer ${token}` : undefined,
//         },
//         body: JSON.stringify({ isActive: newActive }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to update coupon');
//       setCoupons(prev => prev.map(c => (c._id === couponId ? { ...c, isActive: newActive } : c)));
//       toast.success('Updated');
//     } catch (err) {
//       toast.error(err.message || 'Update failed');
//     }
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-10">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Manage Coupons</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-gray-800 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-900"
//         >
//           Create Coupon
//         </button>
//       </div>

//       {showForm && <AdminCouponForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />}

//       <div className="mt-6">
//         {loading ? (
//           <p>Loading coupons...</p>
//         ) : coupons.length === 0 ? (
//           <p>No coupons yet.</p>
//         ) : (
//           <div className="grid gap-4">
//             {coupons.map((c) => (
//               <div key={c._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <h2 className="font-semibold text-lg">{c.code}</h2>
//                     <span className="text-sm text-gray-600">{c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`}</span>
//                     {c.minBookingAmount ? <span className="text-xs ml-2 px-2 py-1 rounded bg-gray-100">Min ₹{c.minBookingAmount}</span> : null}
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">{c.description}</p>
//                   <p className="text-xs text-gray-500 mt-2">Active: {c.isActive ? 'Yes' : 'No'} • Uses: {c.usesCount || 0} • Valid: {new Date(c.startsAt).toLocaleDateString()} → {new Date(c.endsAt).toLocaleDateString()}</p>
//                 </div>

//                 <div className="flex flex-col items-end gap-2">
//                   <button
//                     onClick={() => handleToggleActive(c._id, !c.isActive)}
//                     className={`px-3 py-1 rounded ${c.isActive ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}
//                   >
//                     {c.isActive ? 'Deactivate' : 'Activate'}
//                   </button>
//                   <button
//                     onClick={() => navigator.clipboard.writeText(c.code).then(()=>toast.success('Copied'))}
//                     className="px-3 py-1 rounded border"
//                   >
//                     Copy Code
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import AdminCouponForm from '@/components/AdminCouponForm';
import { API_BASE } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null); // coupon being edited

  async function fetchCoupons() {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE}/coupons`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch coupons');
      setCoupons(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function handleCreated(newCoupon) {
    toast.success('Coupon created');
    setCoupons(prev => [newCoupon, ...prev]);
    setShowForm(false);
    setEditingCoupon(null);
  }

  // called after coupon updated
  function handleUpdated(updatedCoupon) {
    toast.success('Coupon updated');
    setCoupons(prev => prev.map(c => (c._id === updatedCoupon._id ? updatedCoupon : c)));
    setShowForm(false);
    setEditingCoupon(null);
  }

  async function handleToggleActive(couponId, newActive) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/coupons/${couponId}/active`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ isActive: newActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update coupon');
      setCoupons(prev => prev.map(c => (c._id === couponId ? { ...c, isActive: newActive } : c)));
      toast.success('Updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  }

  // open form for editing
  function openEdit(coupon) {
    setEditingCoupon(coupon);
    setShowForm(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Coupons</h1>
        <button
          onClick={() => { setEditingCoupon(null); setShowForm(true); }}
          className="bg-gray-800 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-900"
        >
          Create Coupon
        </button>
      </div>

      {showForm && (
        <AdminCouponForm
          initial={editingCoupon}
          onCreated={handleCreated}
          onUpdated={handleUpdated}
          onCancel={() => { setShowForm(false); setEditingCoupon(null); }}
        />
      )}

      <div className="mt-6">
        {loading ? (
          <p>Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p>No coupons yet.</p>
        ) : (
          <div className="grid gap-4">
            {coupons.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-lg">{c.code}</h2>
                    <span className="text-sm text-gray-600">{c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`}</span>
                    {c.minBookingAmount ? <span className="text-xs ml-2 px-2 py-1 rounded bg-gray-100">Min ₹{c.minBookingAmount}</span> : null}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Active: {c.isActive ? 'Yes' : 'No'} • Uses: {c.usesCount || 0} • Valid: {new Date(c.startsAt).toLocaleDateString()} → {new Date(c.endsAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="px-3 py-1 rounded border bg-white hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(c._id, !c.isActive)}
                      className={`px-3 py-1 rounded ${c.isActive ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  <button
                    onClick={() => navigator.clipboard.writeText(c.code).then(()=>toast.success('Copied'))}
                    className="px-3 py-1 rounded border"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
