'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function UpdateRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  // Fetch room details
  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setFormData(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch room');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchRoom();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle array inputs
  const handleArrayChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (index, field) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Room updated successfully!');
      router.push('/listed-property');
    } catch (err) {
      toast.error(err.message || 'Failed to update room');
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!formData) return <p className="text-center py-8 text-red-500">Room not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Update Room</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* Location */}
        <div>
          <label className="block font-medium mb-2">Location</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="location.addressLine1"
              placeholder="Address Line 1"
              value={formData.location.addressLine1}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="location.addressLine2"
              placeholder="Address Line 2"
              value={formData.location.addressLine2}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="location.city"
              placeholder="City"
              value={formData.location.city}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="location.state"
              placeholder="State"
              value={formData.location.state}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="location.pincode"
              placeholder="Pincode"
              value={formData.location.pincode}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg col-span-2"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium mb-2">Images (URLs)</label>
          {formData.images.map((img, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={img}
                placeholder="Image URL"
                onChange={(e) => handleArrayChange(i, 'images', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(i, 'images')}
                  className="text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('images')}
            className="text-blue-500 text-sm mt-1"
          >
            + Add Image
          </button>
        </div>

        {/* Amenities */}
        <div>
          <label className="block font-medium mb-2">Amenities</label>
          {formData.amenities.map((amenity, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={amenity}
                placeholder="Amenity (e.g. Wifi)"
                onChange={(e) => handleArrayChange(i, 'amenities', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(i, 'amenities')}
                  className="text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('amenities')}
            className="text-blue-500 text-sm mt-1"
          >
            + Add Amenity
          </button>
        </div>

        {/* Guests */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">
              Maximum Allowed Adults
            </label>
            <input
              type="number"
              name="maximumAllowedAdult"
              value={formData.maximumAllowedAdult}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">
              Maximum Allowed Children
            </label>
            <input
              type="number"
              name="maximumAllowedChild"
              value={formData.maximumAllowedChild}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
        >
          Update Room
        </button>
      </form>
    </div>
  );
}
