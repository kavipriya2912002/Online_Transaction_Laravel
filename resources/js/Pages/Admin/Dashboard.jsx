import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            await axios.post(route('logout')); // Use Inertia's route helper
            localStorage.clear(); // Clear local storage
            window.location.href = '/'; // Redirect after logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                  Admin  Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h4>Admin Dashboard Page</h4>
                            <ResponsiveNavLink
                                method="post"
                                href="#"
                                onClick={handleLogout} // Use the custom logout handler
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
