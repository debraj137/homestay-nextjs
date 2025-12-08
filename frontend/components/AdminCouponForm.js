// 'use client';
// import { useEffect, useState } from 'react';
// import { API_BASE } from '@/lib/api';
// import toast from 'react-hot-toast';

// export default function AdminCouponForm({ initial = null, onCreated, onUpdated, onCancel }) {
//     // If initial is provided, we are in edit mode
//     const isEdit = !!initial;

//     const [code, setCode] = useState(initial?.code || '');
//     const [description, setDescription] = useState(initial?.description || '');
//     const [discountType, setDiscountType] = useState(initial?.discountType || 'percent');
//     const [discountValue, setDiscountValue] = useState(initial?.discountValue ?? 10);
//     const [startsAt, setStartsAt] = useState(initial ? formatDateInput(initial.startsAt) : '');
//     const [endsAt, setEndsAt] = useState(initial ? formatDateInput(initial.endsAt) : '');
//     const [minBookingAmount, setMinBookingAmount] = useState(initial?.minBookingAmount ?? 0);
//     const [maxUses, setMaxUses] = useState(initial?.maxUses ?? 0);
//     const [maxUsesPerUser, setMaxUsesPerUser] = useState(initial?.maxUsesPerUser ?? 0);
//     const [isActive, setIsActive] = useState(initial?.isActive ?? true);
//     const [loading, setLoading] = useState(false);

//     // helper: convert ISO date to yyyy-mm-dd for input[type=date]
//     function formatDateInput(d) {
//         if (!d) return '';
//         const date = new Date(d);
//         const yyyy = date.getFullYear();
//         const mm = String(date.getMonth() + 1).padStart(2, '0');
//         const dd = String(date.getDate()).padStart(2, '0');
//         return `${yyyy}-${mm}-${dd}`;
//     }

//     // If initial prop changes (when opening edit), update form fields
//     useEffect(() => {
//         if (initial) {
//             setCode(initial.code || '');
//             setDescription(initial.description || '');
//             setDiscountType(initial.discountType || 'percent');
//             setDiscountValue(initial.discountValue ?? 10);
//             setStartsAt(formatDateInput(initial.startsAt));
//             setEndsAt(formatDateInput(initial.endsAt));
//             setMinBookingAmount(initial.minBookingAmount ?? 0);
//             setMaxUses(initial.maxUses ?? 0);
//             setMaxUsesPerUser(initial.maxUsesPerUser ?? 0);
//             setIsActive(initial.isActive ?? true);
//         } else {
//             // reset on create mode
//             setCode('');
//             setDescription('');
//             setDiscountType('percent');
//             setDiscountValue(10);
//             setStartsAt('');
//             setEndsAt('');
//             setMinBookingAmount(0);
//             setMaxUses(0);
//             setMaxUsesPerUser(0);
//             setIsActive(true);
//         }
//     }, [initial]);

//     async function handleCreate(e) {
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
//                 applicableRooms: [], // can extend later
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
//         } catch (err) {
//             toast.error(err.message || 'Create coupon failed');
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function handleUpdate(e) {
//         e.preventDefault();
//         if (!initial || !initial._id) {
//             toast.error('Missing coupon id for update');
//             return;
//         }
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
//                 maxUses: Number(maxUses || 0),
//                 maxUsesPerUser: Number(maxUsesPerUser || 0),
//                 isActive
//             };
//             const res = await fetch(`${API_BASE}/admin/coupons/${initial._id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: token ? `Bearer ${token}` : undefined,
//                 },
//                 body: JSON.stringify(body),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || 'Update failed');
//             onUpdated && onUpdated(data.coupon || data);
//         } catch (err) {
//             toast.error(err.message || 'Update failed');
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="bg-white p-6 rounded shadow mb-6">
//             <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h3>

//             <form onSubmit={isEdit ? handleUpdate : handleCreate} className="grid grid-cols-1 gap-3">
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

//                 <div className="flex gap-2">
//                     <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">
//                             Minimum Booking Amount (Optional)
//                         </label>
//                         <input
//                             type="number"
//                             value={minBookingAmount}
//                             onChange={(e) => setMinBookingAmount(e.target.value)}
//                             placeholder="Enter minimum booking amount (₹)"
//                             className="w-full border px-3 py-2 rounded"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             Coupon will apply only if booking total is at least this amount.
//                         </p>
//                     </div>

//                     <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">
//                             Max Uses (Optional)
//                         </label>
//                         <input
//                             type="number"
//                             value={maxUses}
//                             onChange={(e) => setMaxUses(e.target.value)}
//                             placeholder="0 = unlimited"
//                             className="w-full border px-3 py-2 rounded"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             Total number of times this coupon can be used. Set 0 for unlimited.
//                         </p>
//                     </div>

//                     <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">
//                             Max Uses Per User (Optional)
//                         </label>
//                         <input
//                             type="number"
//                             value={maxUsesPerUser}
//                             onChange={(e) => setMaxUsesPerUser(e.target.value)}
//                             placeholder="0 = unlimited"
//                             className="w-full border px-3 py-2 rounded"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             Limit how many times a single user can redeem this coupon. 0 = unlimited.
//                         </p>
//                     </div>

//                 </div>

//                 <div className="flex items-center gap-3">
//                     {!isEdit && (
//                         <label className="flex items-center gap-2">
//                             <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
//                             <span className="text-sm">Active</span>
//                         </label>
//                     )}
//                     <div className="ml-auto flex gap-2">
//                         <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
//                         <button type="submit" disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-gray-800'}`}>
//                             {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Coupon' : 'Create Coupon')}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// }


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
        if (code && code.length > 10) {
            // setCodeError('Coupon code must be at most 10 characters');
            toast.error('Coupon code must be at most 10 characters');
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
                    <div className="flex-1">
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value.slice(0, 10))}   // limit to 10 chars
                            placeholder="Code (e.g. XMAS2025)"
                            className="w-full border px-3 py-2 rounded"
                        />
                        {code.length >= 10 && (
                            <p className="text-xs text-red-600 mt-1">
                                Max coupon code length reached i.e, 10 characters
                            </p>
                        )}
                    </div>

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
