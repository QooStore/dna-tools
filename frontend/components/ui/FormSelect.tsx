type Option = {
  value: string;
  label: string;
};

type FormSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
};

export default function FormSelect({
  value,
  onChange,
  options,
  placeholder = "선택",
  disabled = false,
}: FormSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full h-10
        rounded-md
        bg-white/5
        border border-white/20
        px-3
        text-sm
        text-white
        focus:outline-none
        focus:border-cyan-400/60
        disabled:opacity-50
      "
    >
      <option value="" className="text-black">
        {placeholder}
      </option>

      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="text-black">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
