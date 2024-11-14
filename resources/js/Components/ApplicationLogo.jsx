export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="https://img.freepik.com/free-vector/digital-money-indian-rupee-futuristic-circuit-technology-background_1017-41096.jpg?t=st=1731588569~exp=1731592169~hmac=70c40dc267c730892311913606d29694e1f9c3dbdc9cd6455f78b63c3449a380&w=740"  // Direct URL to the image
            alt="Payment Logo"  // Accessible text for the image
            className="w-auto rounded-full object-cover shadow-lg h-auto max-w-10 max-h-10 sm:max-h-10 md:max-h-10 lg:max-h-10" // Tailwind classes for responsiveness
        />

    );
}
