export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[#ffedd5] text-[#f97316] shadow-sm focus:ring-[#f97316] ' +
                className
            }
        />
    );
}
