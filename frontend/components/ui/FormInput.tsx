type FormInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

export default function FormInput({ value, onChange, placeholder, type = "text" }: FormInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="w-full h-10 rounded-md bg-white/5 border border-white/20 px-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
    />
  );
}
