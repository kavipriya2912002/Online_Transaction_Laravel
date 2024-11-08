import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-black">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="shade p-6 rounded-lg shadow-md max-w-md mx-auto">
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full border-[#f97316] text-black bg-[#ffedd5] rounded-md focus:ring-[#f97316] focus:border-[#f97316]"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />

                <InputError message={errors.email} className="mt-2 text-[#fb923c]" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4 bg-[#fb923c] hover:bg-[#f97316] text-white" disabled={processing}>
                        Email Password Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
