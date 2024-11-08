import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotifyAdmin = ({ notifications }) => {
  if (!notifications) {
    console.error("Expected transactions to be an array, got:", notifications);
    return <div className="text-center text-red-500">Error: Transactions data is not available.</div>; // Optional error handling
  }

  const handleSuccess = (notificationId) => {
    // Handle success logic here (e.g., update the notification status)
    console.log(`Notification ${notificationId} marked as success.`);
  };

  const handleReject = (notificationId) => {
    // Handle rejection logic here (e.g., update the notification status)
    console.log(`Notification ${notificationId} marked as rejected.`);
  };

  return (
    <div className="min-h-screen bg-[#ffedd5] p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-[#f97316] mb-6 text-center">Admin Notifications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-[#fb923c] text-white">
            <tr>
              <th className="px-4 py-2 text-left">From Account</th>
              <th className="px-4 py-2 text-left">To Account</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((notification) => (
                <tr key={notification.id} className="odd:bg-[#ffedd5] even:bg-[#fb923c]/10">
                  <td className="border px-4 py-2">{notification.from_account_number}</td>
                  <td className="border px-4 py-2">{notification.to_account_number}</td>
                  <td className="border px-4 py-2">{notification.amount}</td>
                  <td className="border px-4 py-2">{new Date(notification.created_at).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                      onClick={() => handleSuccess(notification.id)}
                    >
                      Success
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleReject(notification.id)}
                    >
                      Rejected
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-[#f97316]">No notifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotifyAdmin;
