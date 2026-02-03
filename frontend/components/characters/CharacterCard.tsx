"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Feature from "../Feature";

import { CharacterListItem } from "@/domains/characters/character";
import { AdminActionButton } from "../ui/AdminActionButton";

type CharacterCardProps = Pick<CharacterListItem, "slug" | "name" | "listImage" | "features" | "elementImage"> & {
  onDelete?: () => void;
  isAdmin: boolean;
};

export default function CharacterCard({
  slug,
  name,
  listImage,
  features,
  elementImage,
  onDelete,
  isAdmin,
}: CharacterCardProps) {
  const router = useRouter();

  return (
    <Link href={`/characters/${slug}`} className="block">
      <div className="group mx-auto w-full max-w-60 overflow-hidden rounded-xl border bg-[#0b1020]/80 transition  border-white/10 hover:border-cyan-400/50">
        {/* Image */}
        <div className="relative aspect-3/4 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${listImage})` }}
          />

          <div className="absolute inset-0 bg-black/20" />

          {/* 삭제 버튼 */}
          {isAdmin && (
            <div
              className="
                        absolute inset-0 z-20
                        flex items-center justify-center
                        bg-black/40
                        opacity-0 group-hover:opacity-100
                        transition
                        pointer-events-none
                      "
            >
              <AdminActionButton variant="delete" onClick={() => onDelete?.()} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/characters/${slug}/edit`);
                }}
                className="
                            pointer-events-auto
                            rounded-full
                            bg-black/70
                            px-4 py-2
                            text-sm font-semibold
                            ring-1
                            transition
                            text-cyan-300 ring-cyan-500 hover:bg-cyan-500/20
                          "
              >
                수정
              </button>
            </div>
          )}

          {/* 속성 아이콘 */}
          {elementImage && (
            <div className="absolute right-2 top-2 z-10 rounded-md bg-black/60 p-1 backdrop-blur">
              <Image src={elementImage} alt="" width={30} height={30} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Name */}
          <div className="mb-2 text-center font-semibold tracking-wide">{name}</div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {features.map((feature) => (
              <Feature key={feature.featureCode} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
