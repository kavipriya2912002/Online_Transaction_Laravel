import { useState } from 'react';
import axios from 'axios';
import { Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Wallet() {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleAddMoney = (e) => {
        e.preventDefault();  // Prevent default form submission

        axios.post('/wallet', { amount: parseFloat(amount) })  // Ensure amount is a number
            .then((response) => {
                setMessage(response.data.message || 'Funds added successfully!');
                setAmount(''); // Clear the input field
            })
            .catch((error) => {
                setMessage(error.response?.data?.message || 'Error: Unable to add money.');
            });
    };

    return (
        <AuthenticatedLayout>
    <Head title="Dashboard" />

    <div className="container mx-auto p-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Add Money to Wallet
        </h1>
        <form
            onSubmit={handleAddMoney}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
            <label className="block text-gray-700 text-lg font-semibold mb-2">
                Enter Amount
            </label>
            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-3 border border-gray-300 rounded w-full mb-4 focus:outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                className="w-full px-3 py-2 shade bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out text-base"
            >
                Add Money
            </button>
        </form>

        {message && (
            <p className="mt-6 text-lg text-green-600 font-semibold">
                {message}
            </p>
        )}
    </div>
</AuthenticatedLayout>

    );
    
}
