import { Head, Link } from '@inertiajs/react';
import homeImage from '../../../public/rb_785.png';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div
                className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center"
            >
                {/* Container moved to the right with margin */}
                <div className="text-center p-8 bg-gray-800 bg-opacity-70 mr-20 rounded-lg shadow-lg w-[80%] max-w-4xl h-[400px] flex flex-row justify-between items-center ml-10">
                    {/* Left side image */}
                    <div className="flex-shrink-0 w-1/2">
                        <img src={homeImage} alt="Home Image" className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                    {/* Right side content */}
                    <div className="w-1/2 flex flex-col justify-center items-center">
                        <h1 className="text-5xl font-extrabold text-white mb-6">Welcome</h1>
                        <div className="space-x-4">
                            <Link
                                href={route('login')}
                                className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300"
                            >
                                Log In
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
