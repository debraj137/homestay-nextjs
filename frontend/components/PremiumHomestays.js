'use client';

export default function PremiumHomestays() {
  const categories = [
    {
      title: 'Gold Rooms',
      icon: '🌟',
      color: 'text-yellow-600',
      underline: 'border-yellow-500',
      badge: 'bg-yellow-100 text-yellow-700',
      priceColor: 'text-yellow-600',
      bookBtn: 'bg-yellow-500 hover:bg-yellow-600',
      outlineBtn: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50',
      tagBg: 'bg-yellow-50 text-yellow-700',
      rooms: [
        {
          name: 'Tulsi Homestay',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹1494',
          image: '/rooms/gold1.jpg',
          tags: ['AC', 'Wifi', 'Parking'],
        },
        {
          name: 'The Narayan Bhawan',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹1026',
          image: '/rooms/gold2.jpg',
          tags: ['AC', 'Wifi', 'Parking'],
        },
        {
          name: 'Shri Balaji Homestay',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹759',
          image: '/rooms/gold3.jpg',
          tags: ['AC', 'Wifi', 'Parking'],
        },
      ],
    },
    {
      title: 'Silver Rooms',
      icon: '🥈',
      color: 'text-gray-700',
      underline: 'border-gray-400',
      badge: 'bg-gray-200 text-gray-700',
      priceColor: 'text-gray-700',
      bookBtn: 'bg-gray-700 hover:bg-gray-800',
      outlineBtn: 'border-gray-400 text-gray-700 hover:bg-gray-50',
      tagBg: 'bg-gray-100 text-gray-700',
      rooms: [
        {
          name: 'Elements by Nila',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹2093',
          image: '/rooms/silver1.jpg',
          tags: ['AC', 'Wifi', 'Parking'],
        },
        {
          name: 'The Ved Palace',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹937',
          image: '/rooms/silver2.jpg',
          tags: ['AC', 'Wifi', 'Room Service'],
        },
        {
          name: 'Siyaram Palace',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹1423',
          image: '/rooms/silver3.jpg',
          tags: ['AC', 'Wifi', 'Parking'],
        },
      ],
    },
    {
      title: 'Diamond Rooms',
      icon: '💎',
      color: 'text-purple-700',
      underline: 'border-purple-600',
      badge: 'bg-purple-100 text-purple-700',
      priceColor: 'text-purple-700',
      bookBtn: 'bg-purple-600 hover:bg-purple-700',
      outlineBtn: 'border-purple-600 text-purple-700 hover:bg-purple-50',
      tagBg: 'bg-purple-50 text-purple-700',
      rooms: [
        {
          name: 'Ramayanika Homestay',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹465',
          image: '/rooms/diamond1.jpg',
          tags: ['AC', 'Wifi', 'Parking'],
        },
        {
          name: 'Janki Devi Homestay',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹677',
          image: '/rooms/diamond2.jpg',
          tags: ['AC', 'Wifi', 'Parking'],
        },
        {
          name: 'Rameshwar Villa',
          city: 'Ayodhya, Uttar Pradesh',
          price: '₹1755',
          image: '/rooms/diamond3.jpg',
          tags: ['AC', 'Wifi', 'Parking', 'Swimming Pool'],
        },
      ],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Our Premium Homestay
        </h2>

        {categories.map((cat, idx) => (
          <div key={idx} className="mb-12">
            {/* Category Title */}
            <h3
              className={`text-xl font-semibold mb-6 flex items-center space-x-2 ${cat.color}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.title}</span>
            </h3>
            <div className={`w-24 border-b-4 ${cat.underline} mb-6`}></div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cat.rooms.map((room, rIdx) => (
                <div
                  key={rIdx}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  {/* Image */}
                  <img
                    src="https://r1imghtlak.mmtcdn.com/7a9d6dba-3cea-42a8-854f-9896f4931a29.jpg"
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />

                  {/* Info */}
                  <div className="p-4 flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg truncate">
                        {room.name}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${cat.badge}`}
                      >
                        {cat.title.split(' ')[0].toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{room.city}</p>
                    <p className={`font-bold ${cat.priceColor}`}>
                      {room.price}
                      <span className="text-gray-600 text-sm font-normal">
                        {' '}
                        /night
                      </span>
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {room.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className={`px-2 py-1 rounded-full ${cat.tagBg}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-3 space-x-2">
                      <button
                        className={`flex-1 px-4 py-2 text-white text-sm font-semibold rounded-lg ${cat.bookBtn}`}
                      >
                        Book Now
                      </button>
                      <button
                        className={`flex-1 px-4 py-2 border text-sm font-semibold rounded-lg ${cat.outlineBtn}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
