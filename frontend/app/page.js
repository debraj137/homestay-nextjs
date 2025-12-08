// import Link from 'next/link';
// export default function Page() {
// return (
// <div>
// <h2>Welcome to Homestay</h2>
// <p>
// <Link href="/rooms">View Rooms</Link>
// </p>
// </div>
// );
// }

import Banner from '../components/Banner';
import WhyChooseUs from '../components/WhyChooseUs';
import FeaturedHomestays from '../components/FeaturedHomestays';
import PremiumHomestays from '../components/PremiumHomestays';
import HomeSectionsClient from '../components/HomeSectionsClient';
export default function Home() {
  return (
    <div>
  <HomeSectionsClient />
    </div>
  );
}
