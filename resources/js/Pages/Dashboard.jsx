import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import '../../css/app.css'

import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard({ notifications = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        bankAccountNumber: '',
        bankName: '',
        accountHolderName: '',
        receiverBankAccountNumber: '',
        receiverBankName: '',
        receiverAccountHolderName: '',
        amount: '',
        utr_file: null,
    });

    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [localToken, setLocalToken] = useState('');
    const [activeTab, setActiveTab] = useState('deposit');
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        console.log('storedEmail', storedEmail);

        const storedToken = localStorage.getItem('token');
        const storedId = localStorage.getItem('id');
        const storedName = localStorage.getItem('name');
        if (storedEmail && storedToken && storedId) {
            setUser(storedEmail);
            setLocalToken(storedToken);
            setUserId(storedId)
        }
    }, []);

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


    const submitBankDetails = (e) => {
        e.preventDefault();
        console.log('Submitting bank details');

        // Log current data state
        console.log('Current Data:', data);

        // Store values in local storage
        localStorage.setItem('bankAccountNumber', data.bankAccountNumber);
        localStorage.setItem('bankName', data.bankName);
        localStorage.setItem('accountHolderName', data.accountHolderName);

        post(route('bank-details.submit'), {
            data,
            onFinish: () => {
                setData({ bankAccountNumber: '', bankName: '', accountHolderName: '' });
                setNotification(null);
                setError(null);
            },
            onError: (errors) => {
                if (errors && errors.error) {
                    setError(errors.error);
                }
            },
            onSuccess: (response) => {
                const latestTransfer = response.props.transfers?.[response.props.transfers.length - 1];
                if (latestTransfer) {
                    setActiveTab('transactions');
                    localStorage.setItem('bankDetails', JSON.stringify(latestTransfer));
                    setNotification('Bank details submitted successfully!');
                } else {
                    setError('Unexpected response format.');
                }
            },
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure name and value from the target
        setData((prevData) => ({
            ...prevData,
            [name]: value // Update only the field that changed
        }));
    };

    console.log('user', user);

    const userAccountNumber = localStorage.getItem('bankAccountNumber');
    console.log(userAccountNumber);


    const notifyAdmin = () => {
        if (!user || !userAccountNumber) {
            console.error('User information is missing.');
            toast.error('Unable to notify admin. User information is missing, Login first');
            return;
        }
    
        axios.post(route('admin.notify'), {
            // user_id: userId, // Ensure user.id is being used
            fromAccountNumber: userAccountNumber,
            toAccountNumber: data.receiverBankAccountNumber,
            amount: data.amount,
        }, {
            headers: {
                Authorization: `Bearer ${localToken}`,
            }
        })
        .then((response) => {
            toast.success("Admin has been notified.", {
                autoClose: 3000,
                style: {
                    backgroundColor: 'white', // Change background color
                    color: 'black', // Change text color
                    borderRadius: '8px', // Add border radius
                    padding: '10px', // Add padding
                    fontSize: '14px', // Set font size
                },
            });
            
            
        })
        .catch((error) => {
            toast.error("Failed to notify admin.", {
                autoClose: 3000,
                style: {
                    backgroundColor: 'white', // Change background color
                    color: 'black', // Change text color
                    borderRadius: '8px', // Add border radius
                    padding: '10px', // Add padding
                    fontSize: '14px', // Set font size
                },
            });
        });
    };
    



    const submitTransferDetails = (e) => {
        e.preventDefault();

        const amount = parseFloat(data.amount);
        const isCompany = data.receiverAccountHolderName.toLowerCase() === 'company';

        // Validate the transfer amount based on account type
        if (amount < 100000 && isCompany) {
            toast.error("Transfer amount less than 100,000 cannot be sent to a company account.", {
                autoClose: 3000, // Display success message for 30 seconds
                style: {
                    fontSize: '14px', // Adjust the font size as needed
                    padding: '10px', // Adjust padding to minimize size
                },
            });
            return;
        }

        if (amount >= 100000 && !isCompany) {
            toast.error("Transfer amount of 100,000 or more must be sent to a company account.l", {
                autoClose: 3000, // Display success message for 30 seconds
                style: {
                    fontSize: '14px', // Adjust the font size as needed
                    padding: '10px', // Adjust padding to minimize size
                },
            });
            
            return;
        }

        // Proceed with submitting the transfer details
        post(route('transfers.submit'), {
            data: {
                receiverBankAccountNumber: data.receiverBankAccountNumber,
                receiverBankName: data.receiverBankName,
                receiverAccountHolderName: data.receiverAccountHolderName,
                amount: data.amount,
            },
            onSuccess: () => {
                setIsOpen(false); // Close modal on success
                toast.success("Transaction Successful", {
                    autoClose: 3000, // Display success message for 30 seconds
                    style: {
                        backgroundColor: 'white', // Change background color
                        color: 'black', // Change text color
                        borderRadius: '8px', // Add border radius
                        padding: '10px', // Add padding
                        fontSize: '14px', // Set font size
                    },
                });
                notifyAdmin(); // Notify admin about the transaction
                setActiveTab('utr');
            },
            onError: () => {
                toast.error("Transaction failed. Please try again.");
                setIsOpen(true);
            }
        });
    };

    console.log('userId', userId);

    const submit = (e) => {
        e.preventDefault();
        post(route('utr.store'), {
            data: {
                utr_file: data.utr_file,
                user_id: userId
            },

            onFinish: () => {
                setData('utr_file', null);
                setActiveTab('statements');
                toast.success("UTR Upload Successful", {
                    autoClose: 3000, // Display success message for 30 seconds
                    style: {
                        backgroundColor: 'white', // Change background color
                        color: 'black', // Change text color
                        borderRadius: '8px', // Add border radius
                        padding: '10px', // Add padding
                        fontSize: '14px', // Set font size
                    },
                });
            },
        });
    };
    console.log(notifications);
    if (!notifications || !Array.isArray(notifications)) {
        console.error("Expected notifications to be an array, got:", notifications);
        return <div className="text-center text-red-500">Error: Notifications data is not available.</div>;
    }

    console.log('Notifications:', notifications);

    // Initialize an array to hold user-specific notifications
    const userNotifications = [];

    // Loop through notifications and check user_id
    for (let i = 0; i < notifications.length; i++) {
        console.log(notifications[i]);
        console.log(notifications[i].user_id);
        console.log(userId);
        
        
        if (notifications[i].user_id == userId) {
            userNotifications.push(notifications[i]);
        }
    }
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <ToastContainer />

            <div className="py-12 w-auto bg-blue-100">
                <div className="mx-auto  max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shade bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-wrap space-x-2 mb-6">
                                <button
                                    onClick={() => handleTabChange('deposit')}
                                    className={`font-bold py-2 px-4 rounded-lg ${activeTab === 'deposit' ? 'bg-blue-600 text-white' : 'text-gray-700'} text-xs sm:text-sm`}
                                >
                                    Deposit
                                </button>
                                <button
                                    onClick={() => handleTabChange('transactions')}
                                    className={`font-bold py-2 px-4 rounded-lg ${activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'text-gray-700'} text-xs sm:text-sm`}
                                >
                                    Transactions
                                </button>
                                <button
                                    onClick={() => handleTabChange('utr')}
                                    className={`font-bold py-2 px-4 rounded-lg ${activeTab === 'utr' ? 'bg-blue-600 text-white' : 'text-gray-700'} text-xs sm:text-sm`}
                                >
                                    UTR Upload
                                </button>
                                <button
                                    onClick={() => handleTabChange('statements')}
                                    className={`font-bold py-2 px-4 rounded-lg ${activeTab === 'statements' ? 'bg-blue-600 text-white' : 'text-gray-700'} text-xs sm:text-sm`}
                                >
                                    Statements
                                </button>
                            </div>


                            {activeTab === 'deposit' && (
                                <div className="bg-blue-200 p-4 rounded-lg">
                                    {notification && (
                                        <div className="mb-4 text-sm font-medium text-green-600">
                                            {notification}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="mb-4 text-sm font-medium text-red-600">
                                            {error}
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold text-[#406cb3]">Sender Bank Account Details</h3>
                                    <form onSubmit={submitBankDetails} className="mt-4 bg-blue-100 shadow-md rounded-lg p-6">
                                        <TextInput
                                            id="bankAccountNumber"
                                            name="bankAccountNumber"
                                            value={data.bankAccountNumber || ''}
                                            onChange={handleChange}
                                            placeholder="Bank Account Number"
                                            required
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.bankAccountNumber} className="mt-2" />
                                        <TextInput
                                            id="bankName"
                                            name="bankName"
                                            value={data.bankName || ''}
                                            onChange={handleChange}
                                            placeholder="Bank Name"
                                            required
                                            className="mt-4 block w-full"
                                        />
                                        <InputError message={errors.bankName} className="mt-2" />
                                        <TextInput
                                            id="accountHolderName"
                                            name="accountHolderName"
                                            value={data.accountHolderName || ''}
                                            onChange={handleChange}
                                            placeholder="Account Holder Name"
                                            required
                                            className="mt-4 block w-full"
                                        />
                                        <InputError message={errors.accountHolderName} className="mt-2" />
                                        <div className="mt-4 flex items-center justify-end">
                                            <PrimaryButton className="bg-[#f97316] text-white" disabled={processing}>
                                                Submit
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'transactions' && (
                                <div className="bg-blue-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-[#406cb3]">Transfer Account Details</h3>
                                    <form onSubmit={submitTransferDetails} className="mt-4 bg-blue-100 shadow-md rounded-lg p-6">
                                        <TextInput
                                            id="receiverBankAccountNumber"
                                            name="receiverBankAccountNumber"
                                            value={data.receiverBankAccountNumber || ''}
                                            onChange={handleChange}
                                            placeholder="Receiver Bank Account Number"
                                            required
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.receiverBankAccountNumber} className="mt-2" />
                                        <TextInput
                                            id="receiverBankName"
                                            name="receiverBankName"
                                            value={data.receiverBankName || ''}
                                            onChange={handleChange}
                                            placeholder="Receiver Bank Name"
                                            required
                                            className="mt-4 block w-full"
                                        />
                                        <InputError message={errors.receiverBankName} className="mt-2" />
                                        <TextInput
                                            id="receiverAccountHolderName"
                                            name="receiverAccountHolderName"
                                            value={data.receiverAccountHolderName || ''}
                                            onChange={handleChange}
                                            placeholder="Receiver Account Holder Name"
                                            required
                                            className="mt-4 block w-full"
                                        />
                                        <InputError message={errors.receiverAccountHolderName} className="mt-2" />
                                        <TextInput
                                            id="amount"
                                            name="amount"
                                            value={data.amount || ''}
                                            onChange={handleChange}
                                            placeholder="Amount"
                                            required
                                            className="mt-4 block w-full"
                                        />
                                        <InputError message={errors.amount} className="mt-2" />
                                        <div className="mt-4 flex items-center justify-end">
                                            <PrimaryButton className="bg-[#f97316] text-white" disabled={processing}>
                                                Submit
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'utr' && (
                                <div className="bg-blue-200 p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-[#406cb3] mb-4">UTR Upload</h3>
                                    <div className="mt-4 bg-blue-100 shadow-lg rounded-lg p-6">
                                        <form onSubmit={submit} className="flex flex-col space-y-4">
                                            <div>
                                                <input
                                                    type="file"
                                                    accept=".jpg,.png,.pdf"
                                                    onChange={(e) => setData('utr_file', e.target.files[0])}
                                                    required
                                                    className="border border-gray-300 rounded-lg p-1 w-1/2 text-gray-700 text-sm focus:outline-none focus:border-[#fb923c] focus:ring-1 focus:ring-[#fb923c]"
                                                />
                                                <InputError message={errors.utr_file} className="mt-2 text-red-500" />
                                            </div>

                                            <div>
                                                <PrimaryButton className="bg-[#fb923c] hover:bg-[#f97316] text-white rounded-lg px-4 py-2 transition duration-200">
                                                    {processing ? 'Uploading...' : 'Upload UTR'}
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}




                            {activeTab === 'statements' && (
                                <div className="bg-blue-200 p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-[#406cb3] mb-4">Statements</h3>

                                    <div className="mt-4 bg-blue-100 shadow-lg rounded-lg p-6">
                                        <p className="text-gray-700 text-lg mb-4">Here you can view your statements.</p>

                                        {/* Scrollable Transaction List */}
                                        <div className="max-h-64 overflow-y-auto">
                                            <ul className="space-y-4">
                                                {userNotifications.map(transaction => (
                                                    <li key={transaction.id} className="border-b border-gray-300 pb-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-800 text-sm font-medium">
                                                                {transaction.from_account_number} to {transaction.to_account_number}
                                                            </span>
                                                            <span className={`font-semibold text-sm ${transaction.status === 'completed' ? 'text-green-500' : 'text-orange-500'}`}>
                                                                {transaction.amount}
                                                            </span>
                                                        </div>
                                                        <span className="text-gray-600 text-xs">
                                                            Status: {transaction.status || 'Pending'}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* No Transactions Message */}
                                            {notifications.length === 0 && (
                                                <p className="text-center text-lg text-gray-600 mt-4">No statements available.</p>
                                            )}
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
}
