import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TransferDetails() {
    const { data, setData, post, processing, errors } = useForm({
        receiverBankAccountNumber: '',
        receiverBankName: '',
        receiverAccountHolderName: '',
        amount: '',
    });
    const [userEmail, setUserEmail] = useState('');
    const [userAccountNumber, setUserAccountNumber] = useState('');
    const [AccountHolderName, setAccountHolderName] = useState('');
    const [BankName, setBankName] = useState('');
    const [localToken, setLocalToken] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('deposit');

    // Retrieve user data from localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedAccountNumber = localStorage.getItem('bankAccountNumber');
        const storedAccountHolderName = localStorage.getItem('accountHolderName');
        const storedBankName = localStorage.getItem('bankName');
        const storedToken = localStorage.getItem('token');

        console.log(storedAccountHolderName);
        console.log(storedAccountNumber);
        console.log(storedBankName);
        
        
        
        if (storedEmail && storedAccountNumber && storedToken && storedAccountHolderName && storedBankName) {
            setUserEmail(storedEmail);
            setUserAccountNumber(storedAccountNumber);
            setAccountHolderName(storedAccountHolderName);
            setBankName(storedBankName);
            setLocalToken(storedToken);
        } else {
            console.error('User information is missing. Redirecting to login...');
        }
    }, []);

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab); // Restore active tab on component mount
        }
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab); // Store the active tab
    };

    const submitTransferDetails = (e) => {
        e.preventDefault();

        const amount = parseFloat(data.amount);
        const isCompany = data.receiverAccountHolderName.toLowerCase() === 'company';

        // Validate the transfer amount based on account type
        if (amount < 100000 && isCompany) {
            toast.error('Transfer amount less than 100,000 cannot be sent to a company account.');
            return;
        }

        if (amount >= 100000 && !isCompany) {
            toast.error('Transfer amount of 100,000 or more must be sent to a company account.');
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
                    autoClose: 30000, // Display success message for 30 seconds
                });
                notifyAdmin(); // Notify admin about the transaction
                setActiveTab('statements');
            },
            onError: () => {
                toast.error("Transaction failed. Please try again.");
                setIsOpen(true);
            }
        });
    };

    const notifyAdmin = () => {
        if (!userEmail || !userAccountNumber) {
            console.error('User information is missing.');
            toast.error('Unable to notify admin. User information is missing.');
            return;
        }

        axios.post(route('admin.notify'), {
            fromAccountNumber: userAccountNumber,
            toAccountNumber: data.receiverBankAccountNumber,
            amount: data.amount,
        },
        {
            headers: {
                Authorization: `Bearer ${localToken}`, // Include token in the request header
            }
        })
        .then((response) => {
            toast.success("Admin has been notified.");
        })
        .catch((error) => {
            toast.error("Failed to notify admin.");
        });
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Head title="Transfer Money" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-blue-100 shadow-sm sm:rounded-lg">
                        <div className="p-6 shade bg-blue-100 text-gray-900">
                            <h3 className="text-lg font-semibold">Enter Receiver's Bank Details</h3>
                            <form onSubmit={submitTransferDetails} className="mt-4">
                                <TextInput
                                    id="receiverBankAccountNumber"
                                    name="receiverBankAccountNumber"
                                    value={data.receiverBankAccountNumber}
                                    className="mt-1 block w-full border border-blue-400 bg-white focus:border-blue-600 focus:ring focus:ring-blue-600 placeholder-gray-500"
                                    onChange={(e) => setData('receiverBankAccountNumber', e.target.value)}
                                    placeholder="Receiver's Bank Account Number"
                                    required
                                />
                                <InputError message={errors.receiverBankAccountNumber} className="mt-2" />

                                <TextInput
                                    id="receiverBankName"
                                    name="receiverBankName"
                                    value={data.receiverBankName}
                                    className="mt-4 block w-full border border-blue-400 bg-white focus:border-blue-600 focus:ring focus:ring-blue-600 placeholder-gray-500"
                                    onChange={(e) => setData('receiverBankName', e.target.value)}
                                    placeholder="Receiver's Bank Name"
                                    required
                                />
                                <InputError message={errors.receiverBankName} className="mt-2" />

                                <TextInput
                                    id="receiverAccountHolderName"
                                    name="receiverAccountHolderName"
                                    value={data.receiverAccountHolderName}
                                    className="mt-4 block w-full border border-blue-400 bg-white focus:border-blue-600 focus:ring focus:ring-blue-600 placeholder-gray-500"
                                    onChange={(e) => setData('receiverAccountHolderName', e.target.value)}
                                    placeholder="Receiver's Account Holder Name"
                                    required
                                />
                                <InputError message={errors.receiverAccountHolderName} className="mt-2" />

                                <TextInput
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={data.amount}
                                    className="mt-4 block w-full border border-blue-400 bg-white focus:border-blue-600 focus:ring focus:ring-blue-600 placeholder-gray-500"
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Amount"
                                    required
                                />
                                <InputError message={errors.amount} className="mt-2" />

                                <div className="mt-4 flex items-center justify-end">
                                    <PrimaryButton onClick={() => handleTabChange('statements')} className="ms-4 bg-blue-400 hover:bg-blue-600 text-white" disabled={processing}>
                                        Transfer Money
                                    </PrimaryButton>
                                    <Link
    href={route('utr.upload')} // Use the route to UTR upload page
    className="ms-4 bg-blue-400 shade hover:bg-blue-600 text-white py-2 px-1.5 rounded-md shadow-md transition duration-200 ease-in-out text-sm"
>
    Upload UTR
</Link>



                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={isOpen} onClose={handleClose}>
                <h2 className="text-lg">Transaction Notification</h2>
                <p>Your transaction details have been submitted.</p>
                <PrimaryButton onClick={handleClose}>Close</PrimaryButton>
            </Modal>

            <ToastContainer />
       </>
    );
}
