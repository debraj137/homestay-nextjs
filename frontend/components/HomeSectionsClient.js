"use client";
import { useAuth } from '@/context/AuthContext';
import Banner from './Banner';
// import WhyChooseUs from './WhyChooseUs';
// import FeaturedHomestays from './FeaturedHomestays';
// import PremiumHomestays from './PremiumHomestays';
import AdminHomePage from './AdminHomePage';
import dynamic from "next/dynamic";
const WhyChooseUs = dynamic(() => import("./WhyChooseUs"));
const FeaturedHomestays = dynamic(() => import("./FeaturedHomestays"));
const PremiumHomestays = dynamic(() => import("./PremiumHomestays"));
export default function HomeSectionsClient() {
    const { user, loading } = useAuth();

    // While auth is initializing, render nothing to avoid a flash
    if (loading) return null;

    // For admin users, show a small admin notice and hide the public homepage
    // sections so admins see header/footer and a placeholder area that can be
    // extended later.
    return (
        <>
            {user?.role === 'admin' && (
                <AdminHomePage />
            )}

            {/* Render public homepage sections only for non-admin users */}
            {user?.role !== 'admin' && (
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
