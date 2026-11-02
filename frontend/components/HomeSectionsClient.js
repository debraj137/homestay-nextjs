"use client";
import { useAuth } from '@/context/AuthContext';
import Banner from './Banner';
import WhyChooseUs from './WhyChooseUs';
import FeaturedHomestays from './FeaturedHomestays';
import PremiumHomestays from './PremiumHomestays';
import AdminHomePage from './AdminHomePage';
export default function HomeSectionsClient() {
    const { user, loading } = useAuth();

    // Authentication is read from localStorage after hydration. Render the
    // public home page while that happens so the server never sends an empty
    // main area between the header and footer.
    const showAdminHome = !loading && user?.role === 'admin';

    return (
        <>
            {showAdminHome && (
                <AdminHomePage />
            )}

            {/* Switch to the admin home only after auth has been resolved. */}
            {!showAdminHome && (
                <>
                    <Banner />
                    <WhyChooseUs />
                    <FeaturedHomestays />
                    <PremiumHomestays />
                </>
            )}
        </>
    );
}
