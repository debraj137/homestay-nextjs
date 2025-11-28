// 'use client';
// import { useState } from 'react';
// import { API_BASE } from '@/lib/api';
// import toast from 'react-hot-toast';

// export default function AdminCouponForm({ onCreated, onCancel }) {
//     const [code, setCode] = useState('');
//     const [description, setDescription] = useState('');
//     const [discountType, setDiscountType] = useState('percent');
//     const [discountValue, setDiscountValue] = useState(10);
//     const [startsAt, setStartsAt] = useState('');
//     const [endsAt, setEndsAt] = useState('');
//     const [minBookingAmount, setMinBookingAmount] = useState(0);
//     const [maxUses, setMaxUses] = useState(0);
//     const [maxUsesPerUser, setMaxUsesPerUser] = useState(1);
//     const [isActive, setIsActive] = useState(true);
//     const [loading, setLoading] = useState(false);

//     async function handleSubmit(e) {
//         e.preventDefault();
//         if (!code || !startsAt || !endsAt) {
//             toast.error('Please fill required fields');
//             return;
//         }
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('token');
//             const body = {
//                 code: code.toUpperCase(),
//                 description,
//                 discountType,
//                 discountValue: Number(discountValue),
//                 startsAt,
//                 endsAt,
//                 minBookingAmount: Number(minBookingAmount || 0),
//                 applicableRooms: [], // admin can extend to pick rooms later
//                 maxUses: Number(maxUses || 0),
//                 maxUsesPerUser: Number(maxUsesPerUser || 0),
//                 isActive
//             };
//             const res = await fetch(`${API_BASE}/coupons`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: token ? `Bearer ${token}` : undefined,
//                 },
//                 body: JSON.stringify(body),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || 'Create failed');
//             onCreated && onCreated(data.coupon || data);
//             // reset form
//             setCode('');
//             setDescription('');
//             setDiscountValue(10);
//             setStartsAt('');
//             setEndsAt('');
//         } catch (err) {
//             toast.error(err.message || 'Create coupon failed');
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="bg-white p-6 rounded shadow mb-6">
//             <h3 className="text-lg font-semibold mb-4">Create Coupon</h3>

//             <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
//                 <div className="flex gap-2">
//                     <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code (e.g. XMAS2025)" className="flex-1 border px-3 py-2 rounded" />
//                     <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="w-40 border px-3 py-2 rounded">
//                         <option value="percent">Percent %</option>
//                         <option value="fixed">Fixed ₹</option>
//                     </select>
//                     <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="w-32 border px-3 py-2 rounded" />
//                 </div>

//                 <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" className="border px-3 py-2 rounded" />

//                 <div className="flex gap-2">
//                     <div className="flex-1">
//                         <label className="text-xs text-gray-600">Starts At</label>
//                         <input type="date" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
//                     </div>
//                     <div className="flex-1">
//                         <label className="text-xs text-gray-600">Ends At</label>
//                         <input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {/* Minimum booking amount */}
//                     <div className="flex flex-col">
//                         <label className="text-sm font-medium text-gray-700">
//                             Minimum Booking Amount <span className="text-xs text-gray-500">(Optional)</span>
//                         </label>
//                         <input
//                             type="number"
//                             min="0"
//                             value={minBookingAmount}
//                             onChange={e => setMinBookingAmount(e.target.value)}
//                             placeholder="e.g. 1000"
//                             className="mt-1 border px-3 py-2 rounded"
//                         />
//                         <p className="mt-1 text-xs text-gray-500">
//                             Enter the minimum order value required to apply this coupon. Leave blank for no minimum.
//                         </p>
//                     </div>

//                     {/* Maximum total uses */}
//                     <div className="flex flex-col">
//                         <label className="text-sm font-medium text-gray-700">
//                             Maximum Uses <span className="text-xs text-gray-500">(Optional)</span>
//                         </label>
//                         <input
//                             type="number"
//                             min="0"
//                             value={maxUses}
//                             onChange={e => setMaxUses(e.target.value)}
//                             placeholder="0 = unlimited"
//                             className="mt-1 border px-3 py-2 rounded w-full"
//                         />
//                         <p className="mt-1 text-xs text-gray-500">
//                             Total times this coupon can be used across all users. Use 0 or leave blank for unlimited.
//                         </p>
//                     </div>

//                     {/* Maximum uses per user */}
//                     <div className="flex flex-col">
//                         <label className="text-sm font-medium text-gray-700">
//                             Max Uses Per User <span className="text-xs text-gray-500">(Optional)</span>
//                         </label>
//                         <input
//                             type="number"
//                             min="0"
//                             value={maxUsesPerUser}
//                             onChange={e => setMaxUsesPerUser(e.target.value)}
//                             placeholder="Leave blank or 0 for no limit"
//                             className="mt-1 border px-3 py-2 rounded w-full"
//                         />
//                         <p className="mt-1 text-xs text-gray-500">
//                             How many times a single user may redeem this coupon. Leave blank or set 0 for no per-user limit.
//                         </p>
//                     </div>
//                 </div>


//                 <div className="flex items-center gap-3">
//                     <label className="flex items-center gap-2">
//                         <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
//                         <span className="text-sm">Active</span>
//                     </label>

//                     <div className="ml-auto flex gap-2">
//                         <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
//                         <button type="submit" disabled={loading} className={`cursor-pointer px-4 py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800'}`}>
//                             {loading ? 'Creating...' : 'Create Coupon'}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// }





////////////////////////////////////////////////////////////////////////////////////////////////////////

// frontend/components/AdminCouponForm.jsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { API_BASE } from '@/lib/api';
// import toast from 'react-hot-toast';

// /**
//  * Props:
//  * - onCreated(coupon)  // called on create
//  * - onUpdated(coupon)  // called on update
//  * - onCancel()
//  * - coupon (optional)  // if provided -> edit mode
//  */
// export default function AdminCouponForm({ onCreated, onUpdated, onCancel, coupon }) {
//   const isEdit = Boolean(coupon);

//   // initialize fields (use coupon values if editing)
//   const [code, setCode] = useState(coupon?.code || '');
//   const [description, setDescription] = useState(coupon?.description || '');
//   const [discountType, setDiscountType] = useState(coupon?.discountType || 'percent');
//   const [discountValue, setDiscountValue] = useState(coupon?.discountValue ?? 10);
//   const [startsAt, setStartsAt] = useState(
//     coupon?.startsAt ? new Date(coupon.startsAt).toISOString().slice(0,10) : ''
//   );
//   const [endsAt, setEndsAt] = useState(
//     coupon?.endsAt ? new Date(coupon.endsAt).toISOString().slice(0,10) : ''
//   );
//   const [minBookingAmount, setMinBookingAmount] = useState(coupon?.minBookingAmount || 0);
//   const [maxUses, setMaxUses] = useState(coupon?.maxUses || 0);
//   const [maxUsesPerUser, setMaxUsesPerUser] = useState(coupon?.maxUsesPerUser || 0);
//   const [isActive, setIsActive] = useState(typeof coupon?.isActive !== 'undefined' ? coupon.isActive : true);
//   const [applicableRooms, setApplicableRooms] = useState(coupon?.applicableRooms || []); // keep as array of ids for now
//   const [loading, setLoading] = useState(false);

//   // If coupon prop changes (when opening edit form), sync states
//   useEffect(() => {
//     if (!coupon) return;
//     setCode(coupon.code || '');
//     setDescription(coupon.description || '');
//     setDiscountType(coupon.discountType || 'percent');
//     setDiscountValue(coupon.discountValue ?? 10);
//     setStartsAt(coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0,10) : '');
//     setEndsAt(coupon.endsAt ? new Date(coupon.endsAt).toISOString().slice(0,10) : '');
//     setMinBookingAmount(coupon.minBookingAmount || 0);
//     setMaxUses(coupon.maxUses || 0);
//     setMaxUsesPerUser(coupon.maxUsesPerUser || 0);
//     setIsActive(typeof coupon.isActive !== 'undefined' ? coupon.isActive : true);
//     setApplicableRooms(coupon.applicableRooms || []);
//   }, [coupon]);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!code || !startsAt || !endsAt) {
//       toast.error('Please fill required fields: code, startsAt, endsAt');
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const body = {
//         code: code.toUpperCase(),
//         description,
//         discountType,
//         discountValue: Number(discountValue),
//         startsAt,
//         endsAt,
//         minBookingAmount: Number(minBookingAmount || 0),
//         applicableRooms, // array of room ids (optional)
//         maxUses: Number(maxUses || 0),
//         maxUsesPerUser: Number(maxUsesPerUser || 0),
//         isActive
//       };

//       let res, data;
//       if (isEdit) {
//         res = await fetch(`${API_BASE}/admin/coupons/${coupon._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: token ? `Bearer ${token}` : undefined,
//           },
//           body: JSON.stringify(body),
//         });
//         data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Update failed');
//         toast.success('Coupon updated');
//         onUpdated && onUpdated(data.coupon || data);
//       } else {
//         res = await fetch(`${API_BASE}/coupons`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: token ? `Bearer ${token}` : undefined,
//           },
//           body: JSON.stringify(body),
//         });
//         data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Create failed');
//         toast.success('Coupon created');
//         onCreated && onCreated(data.coupon || data);
//         // reset form fields
//         setCode('');
//         setDescription('');
//         setDiscountValue(10);
//         setStartsAt('');
//         setEndsAt('');
//         setMinBookingAmount(0);
//         setMaxUses(0);
//         setMaxUsesPerUser(0);
//         setIsActive(true);
//       }
//     } catch (err) {
//       toast.error(err.message || 'Operation failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="bg-white p-6 rounded shadow mb-6">
//       <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h3>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
//         <div className="flex gap-2">
//           <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code (e.g. XMAS2025)" className="flex-1 border px-3 py-2 rounded" />
//           <select value={discountType} onChange={e=>setDiscountType(e.target.value)} className="w-40 border px-3 py-2 rounded">
//             <option value="percent">Percent %</option>
//             <option value="fixed">Fixed ₹</option>
//           </select>
//           <input type="number" value={discountValue} onChange={e=>setDiscountValue(e.target.value)} className="w-32 border px-3 py-2 rounded" />
//         </div>

//         <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)" className="border px-3 py-2 rounded" />

//         <div className="flex gap-2">
//           <div className="flex-1">
//             <label className="text-xs text-gray-600">Starts At</label>
//             <input type="date" value={startsAt} onChange={e=>setStartsAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
//           </div>
//           <div className="flex-1">
//             <label className="text-xs text-gray-600">Ends At</label>
//             <input type="date" value={endsAt} onChange={e=>setEndsAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <input type="number" value={minBookingAmount} onChange={e=>setMinBookingAmount(e.target.value)} placeholder="Min booking amount (₹)" className="flex-1 border px-3 py-2 rounded" />
//           <input type="number" value={maxUses} onChange={e=>setMaxUses(e.target.value)} placeholder="Max uses (0 = unlimited)" className="w-48 border px-3 py-2 rounded" />
//           <input type="number" value={maxUsesPerUser} onChange={e=>setMaxUsesPerUser(e.target.value)} placeholder="Max per user" className="w-40 border px-3 py-2 rounded" />
//         </div>

//         {/* Optional: applicableRooms input (comma-separated IDs) */}
//         <div>
//           <label className="text-xs text-gray-600">Applicable Room IDs (comma separated, optional)</label>
//           <input
//             value={applicableRooms.join ? applicableRooms.join(',') : ''}
//             onChange={(e) => setApplicableRooms(e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])}
//             placeholder="roomId1,roomId2"
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <label className="flex items-center gap-2">
//             <input type="checkbox" checked={isActive} onChange={e=>setIsActive(e.target.checked)} />
//             <span className="text-sm">Active</span>
//           </label>

//           <div className="ml-auto flex gap-2">
//             <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
//             <button type="submit" disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-gray-800'}`}>
//               {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Coupon' : 'Create Coupon')}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }



////////////////////////////////////////////////////////////////////////////////////////////
// frontend/components/AdminCouponForm.jsx
'use client';
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCouponForm({ initial = null, onCreated, onUpdated, onCancel }) {
    // If initial is provided, we are in edit mode
    const isEdit = !!initial;

    const [code, setCode] = useState(initial?.code || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [discountType, setDiscountType] = useState(initial?.discountType || 'percent');
    const [discountValue, setDiscountValue] = useState(initial?.discountValue ?? 10);
    const [startsAt, setStartsAt] = useState(initial ? formatDateInput(initial.startsAt) : '');
    const [endsAt, setEndsAt] = useState(initial ? formatDateInput(initial.endsAt) : '');
    const [minBookingAmount, setMinBookingAmount] = useState(initial?.minBookingAmount ?? 0);
    const [maxUses, setMaxUses] = useState(initial?.maxUses ?? 0);
    const [maxUsesPerUser, setMaxUsesPerUser] = useState(initial?.maxUsesPerUser ?? 0);
    const [isActive, setIsActive] = useState(initial?.isActive ?? true);
    const [loading, setLoading] = useState(false);

    // helper: convert ISO date to yyyy-mm-dd for input[type=date]
    function formatDateInput(d) {
        if (!d) return '';
        const date = new Date(d);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // If initial prop changes (when opening edit), update form fields
    useEffect(() => {
        if (initial) {
            setCode(initial.code || '');
            setDescription(initial.description || '');
            setDiscountType(initial.discountType || 'percent');
            setDiscountValue(initial.discountValue ?? 10);
            setStartsAt(formatDateInput(initial.startsAt));
            setEndsAt(formatDateInput(initial.endsAt));
            setMinBookingAmount(initial.minBookingAmount ?? 0);
            setMaxUses(initial.maxUses ?? 0);
            setMaxUsesPerUser(initial.maxUsesPerUser ?? 0);
            setIsActive(initial.isActive ?? true);
        } else {
            // reset on create mode
            setCode('');
            setDescription('');
            setDiscountType('percent');
            setDiscountValue(10);
            setStartsAt('');
            setEndsAt('');
            setMinBookingAmount(0);
            setMaxUses(0);
            setMaxUsesPerUser(0);
            setIsActive(true);
        }
    }, [initial]);

    async function handleCreate(e) {
        e.preventDefault();
        if (!code || !startsAt || !endsAt) {
            toast.error('Please fill required fields');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const body = {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue: Number(discountValue),
                startsAt,
                endsAt,
                minBookingAmount: Number(minBookingAmount || 0),
                applicableRooms: [], // can extend later
                maxUses: Number(maxUses || 0),
                maxUsesPerUser: Number(maxUsesPerUser || 0),
                isActive
            };
            const res = await fetch(`${API_BASE}/coupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Create failed');
            onCreated && onCreated(data.coupon || data);
        } catch (err) {
            toast.error(err.message || 'Create coupon failed');
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        if (!initial || !initial._id) {
            toast.error('Missing coupon id for update');
            return;
        }
        if (!code || !startsAt || !endsAt) {
            toast.error('Please fill required fields');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const body = {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue: Number(discountValue),
                startsAt,
                endsAt,
                minBookingAmount: Number(minBookingAmount || 0),
                maxUses: Number(maxUses || 0),
                maxUsesPerUser: Number(maxUsesPerUser || 0),
                isActive
            };
            const res = await fetch(`${API_BASE}/admin/coupons/${initial._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Update failed');
            onUpdated && onUpdated(data.coupon || data);
        } catch (err) {
            toast.error(err.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h3>

            <form onSubmit={isEdit ? handleUpdate : handleCreate} className="grid grid-cols-1 gap-3">
                <div className="flex gap-2">
                    <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code (e.g. XMAS2025)" className="flex-1 border px-3 py-2 rounded" />
                    <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="w-40 border px-3 py-2 rounded">
                        <option value="percent">Percent %</option>
                        <option value="fixed">Fixed ₹</option>
                    </select>
                    <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="w-32 border px-3 py-2 rounded" />
                </div>

                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" className="border px-3 py-2 rounded" />

                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs text-gray-600">Starts At</label>
                        <input type="date" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-600">Ends At</label>
                        <input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Minimum Booking Amount (Optional)
                        </label>
                        <input
                            type="number"
                            value={minBookingAmount}
                            onChange={(e) => setMinBookingAmount(e.target.value)}
                            placeholder="Enter minimum booking amount (₹)"
                            className="w-full border px-3 py-2 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Coupon will apply only if booking total is at least this amount.
                        </p>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Max Uses (Optional)
                        </label>
                        <input
                            type="number"
                            value={maxUses}
                            onChange={(e) => setMaxUses(e.target.value)}
                            placeholder="0 = unlimited"
                            className="w-full border px-3 py-2 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Total number of times this coupon can be used. Set 0 for unlimited.
                        </p>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Max Uses Per User (Optional)
                        </label>
                        <input
                            type="number"
                            value={maxUsesPerUser}
                            onChange={(e) => setMaxUsesPerUser(e.target.value)}
                            placeholder="0 = unlimited"
                            className="w-full border px-3 py-2 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Limit how many times a single user can redeem this coupon. 0 = unlimited.
                        </p>
                    </div>

                </div>

                <div className="flex items-center gap-3">
                    {!isEdit && (
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                            <span className="text-sm">Active</span>
                        </label>
                    )}
                    <div className="ml-auto flex gap-2">
                        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
                        <button type="submit" disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-gray-800'}`}>
                            {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Coupon' : 'Create Coupon')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
