export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/build/assets/payment.png"  // The relative path from the public directory
            alt="Payment Logo"  // Accessible text for the image
            className="w-auto rounded-full object-cover shadow-lg h-auto max-w-10 max-h-10 object-contain sm:max-h-10 md:max-h-10 lg:max-h-10" // Tailwind classes for responsiveness
        />
    );
}
