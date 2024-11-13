import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Function to generate a simple token (for demo purposes)
    const generateToken = (email) => {
        const token = btoa(email + new Date().getTime()); // Base64 encode email and timestamp
        console.log(token);
        return token;
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.login'), {
            
            onSuccess: (response) => {
                if (response.props.auth.user) {
                    const user = response.props.auth.user;
                    console.log(user);

                    const token = generateToken(user.email);
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('token', token);
                    localStorage.setItem('id', user.id);
                    localStorage.setItem('name', user.name);
                }
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-solway font-medium text-blue-600">
                    {status}
                </div>
            )}

            <h4 className='text-center mb-3 font-bold'>Admin Login page</h4>
            <form
                onSubmit={submit}
                className="bg-blue-200 p-6 rounded-lg shadow-md max-w-md mx-auto"
            >
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-blue-600" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-blue-400 text-blue-600 bg-blue-100 rounded-md focus:ring-blue-400 focus:border-blue-600"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-red-500" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" className="text-blue-600" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-blue-400 text-blue-600 bg-blue-100 rounded-md focus:ring-blue-400 focus:border-blue-600"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-red-500" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="text-blue-600 focus:ring-blue-400"
                        />
                        <span className="ml-2 text-sm text-blue-600">Remember me</span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-blue-600 underline hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton
                        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
