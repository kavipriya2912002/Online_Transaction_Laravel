import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import 'react-toastify/dist/ReactToastify.css';

import React, { useState, useEffect } from 'react';

const Admin = ({ transactions = [], notifications: initialNotifications }) => {
    const [activeTab, setActiveTab] = useState('transactions');
    const [notifications, setNotifications] = useState(initialNotifications || []);
    console.log(notifications);

    if (!notifications) {
        console.error("Expected notifications to be an array, got:", notifications);
        return <div className="text-center text-red-500">Error: Notifications data is not available.</div>; // Optional error handling
    }
    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            await axios.post(route('admin.logout')); // Use Inertia's route helper
            localStorage.clear(); // Clear local storage
            window.location.href = '/'; // Redirect after logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleSuccess = async (notificationId) => {
        try {
            const response = await axios.post(route('admin.approve', notificationId), {});
            if (response.status === 200) {
                toast.success("Transaction Approved", {
                    autoClose: 3000,
                    style: {
                        backgroundColor: 'white', // Change background color
                        color: 'black', // Change text color
                        borderRadius: '8px', // Add border radius
                        padding: '10px', // Add padding
                        fontSize: '14px', // Set font size
                    },
                });

                // Update notifications state
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) =>
                        notification.id === notificationId
                            ? { ...notification, status: 'approved' } // Update status to approved
                            : notification
                    )
                );
            }
        } catch (error) {
            toast.error("Transaction Rejected.", {
                autoClose: 3000,
                style: {
                    backgroundColor: 'white', // Change background color
                    color: 'black', // Change text color
                    borderRadius: '8px', // Add border radius
                    padding: '10px', // Add padding
                    fontSize: '14px', // Set font size
                },
            });
            console.error('Error approving transaction:', error);
        }
    };

    const handleReject = async (notificationId) => {
        try {
            const response = await axios.post(route('admin.reject', notificationId), {});
            if (response.status === 200) {
                toast.error("Transaction Rejected", {
                    autoClose: 3000,
                    style: {
                        backgroundColor: 'white', // Change background color
                        color: 'black', // Change text color
                        borderRadius: '8px', // Add border radius
                        padding: '10px', // Add padding
                        fontSize: '14px', // Set font size
                    },
                });

                // Update notifications state
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) =>
                        notification.id === notificationId
                            ? { ...notification, status: 'rejected' } // Update status to rejected
                            : notification
                    )
                );
            }
        } catch (error) {
            toast.error("Error rejecting transaction.", {
                autoClose: 3000,
                style: {
                    backgroundColor: 'white', // Change background color
                    color: 'black', // Change text color
                    borderRadius: '8px', // Add border radius
                    padding: '10px', // Add padding
                    fontSize: '14px', // Set font size
                },
            });
            console.error('Error rejecting transaction:', error);
        }
    };

    console.log('transactions', transactions);

    if (!Array.isArray(transactions)) {
        console.error("Expected transactions to be an array, got:", transactions);
        return <div className="text-center text-red-500">Error: Transactions data is not available.</div>;
    }

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <ToastContainer />
            

            <div className="py-12 bg-blue-100 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 shade text-gray-900">
                        <div className="flex justify-end mb-4">
                                <ResponsiveNavLink
                                    method="post"
                                    href="#"
                                    onClick={handleLogout}
                                    as="button"
                                    className="text-blue-600 font-bold underline"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                            {/* Tab buttons */}
                            <div className="flex space-x-4 mb-6">
                                <button
                                    onClick={() => handleTabChange('transactions')}
                                    className={`font-bold shade py-1.5 px-3 rounded-lg text-sm transition-all ${activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-700'}`}
                                >
                                    All Transactions
                                </button>
                                <button
                                    onClick={() => handleTabChange('status')}
                                    className={`font-bold shade py-1.5 px-3 rounded-lg text-sm transition-all ${activeTab === 'status' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-700'}`}
                                >
                                    Status
                                </button>
                                
                            </div>

                            {/* Conditional rendering based on active tab */}
                            {activeTab === 'transactions' && (
                                <div className="flex shade rounded-md flex-col items-center p-4 bg-blue-100">
                                    <h1 className="text-2xl  font-semibold text-blue-600 mb-4">All Transfers</h1>
                                    <div className="overflow-y-auto w-full max-w-4xl flex-grow" style={{ maxHeight: '400px' }}>
                                        {transactions.length === 0 ? (
                                            <p className="text-md text-gray-700">No transactions found.</p>
                                        ) : (
                                            <table className="min-w-full bg-white border border-blue-400 rounded-lg shadow-md text-sm">
                                                <thead className="bg-blue-400 text-white">
                                                    <tr>
                                                        <th className="py-1.5 px-3 border-b">Transaction ID</th>
                                                        <th className="py-1.5 px-3 border-b">User ID</th>
                                                        <th className="py-1.5 px-3 border-b">Account Holder</th>
                                                        <th className="py-1.5 px-3 border-b">Amount</th>
                                                        <th className="py-1.5 px-3 border-b">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.map((transfer) => (
                                                        <tr key={transfer.id} className="hover:bg-blue-200 odd:bg-blue-100 even:bg-blue-200 transition duration-200">
                                                            <td className="py-1.5 px-3 border-b">{transfer.id}</td>
                                                            <td className="py-1.5 px-3 border-b">{transfer.user_id}</td>
                                                            <td className="py-1.5 px-3 border-b">{transfer.receiver_account_holder_name}</td>
                                                            <td className="py-1.5 px-3 border-b">{transfer.amount}</td>
                                                            <td className="py-1.5 px-3 border-b">{new Date(transfer.created_at).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'status' && (
                                <div className="bg-blue-100 shade rounded-md p-6">
                                    <h1 className="text-2xl  font-semibold text-blue-600 mb-6 text-center">Request Status</h1>
                                    <div className="overflow-x-auto">
                                        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                                            <table className="min-w-full bg-white rounded-lg shadow-lg text-sm">
                                                <thead className="bg-blue-400 text-white">
                                                    <tr>
                                                        <th className="px-3 py-1.5 text-left">From Account</th>
                                                        <th className="px-3 py-1.5 text-left">To Account</th>
                                                        <th className="px-3 py-1.5 text-left">Amount</th>
                                                        <th className="px-3 py-1.5 text-left">Date</th>
                                                        <th className="px-3 py-1.5 text-left">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(notifications) && notifications.length > 0 ? (
                                                        notifications.map((notification) => (
                                                            <tr key={notification.id} className="odd:bg-blue-100 even:bg-blue-200">
                                                                <td className="border px-3 py-1.5">{notification.from_account_number}</td>
                                                                <td className="border px-3 py-1.5">{notification.to_account_number}</td>
                                                                <td className="border px-3 py-1.5">{notification.amount}</td>
                                                                <td className="border px-3 py-1.5">{new Date(notification.created_at).toLocaleString()}</td>
                                                                <td className="border px-3 py-1.5">
                                                                    {notification.status === 'approved' ? (
                                                                        <span className="text-green-600">Approved</span>
                                                                    ) : notification.status === 'rejected' ? (
                                                                        <span className="text-red-600">Rejected</span>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                className="bg-green-500 shade text-white px-2 py-1 rounded hover:bg-green-600 mr-2 text-xs"
                                                                                onClick={() => handleSuccess(notification.id)}
                                                                            >
                                                                                Success
                                                                            </button>
                                                                            <button
                                                                                className="bg-red-500 shade text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                                                                                onClick={() => handleReject(notification.id)}
                                                                            >
                                                                                Reject
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </td>

                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center p-4 text-blue-600">No notifications found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Admin;
