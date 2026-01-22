/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  previewSize?: "sm" | "md" | "lg";
};

export default function FormImageUpload({ label, value, onChange, description, previewSize = "md" }: Props) {
  const previewClass = previewSize === "lg" ? "h-56" : previewSize === "md" ? "h-40" : "h-24";

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lee/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      onChange(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <div>
        <p className="text-xs font-medium text-white/70">{label}</p>
        {description && <p className="text-[11px] text-white/35">{description}</p>}
      </div>

      <div className={"flex items-start gap-4"}>
        {/* Button */}
        <div>
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="
              h-10 rounded-md border border-white/20 bg-white/5 px-4 text-sm text-white
              hover:bg-white/10 disabled:opacity-50
            "
          >
            {uploading ? "업로드 중..." : "이미지 선택"}
          </button>

          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        {/* Preview */}
        <div className="flex-1">
          {value ? (
            <img
              src={value}
              alt={label}
              className={`${previewClass} rounded-md border border-white/10 object-contain bg-black/30`}
            />
          ) : (
            <div
              className={`${previewClass} h-24 rounded-md border border-dashed border-white/20 bg-black/20 flex items-center justify-center text-xs text-white/40`}
            >
              {"미리보기 없음"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
