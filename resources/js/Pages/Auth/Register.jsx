import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
                // Redirect to the login page after successful registration
                window.location.href = route('login');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="bg-blue-200 shade p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4 sm:space-y-6 md:space-y-8">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-blue-600" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-blue-400 text-blue-600 bg-blue-100 rounded-md focus:ring-blue-400 focus:border-blue-600"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2 text-red-500" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-blue-600" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-blue-400 text-blue-600 bg-blue-100 rounded-md focus:ring-blue-400 focus:border-blue-600"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2 text-red-500" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-blue-600" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-blue-400 text-blue-600 bg-blue-100 rounded-md focus:ring-blue-400 focus:border-blue-600"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2 text-red-500" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-blue-600" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-blue-400 text-blue-600 bg-blue-100 rounded-md focus:ring-blue-400 focus:border-blue-600"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2 text-red-500" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-blue-600 underline hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ml-4 bg-blue-600 hover:bg-blue-700 text-white" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
