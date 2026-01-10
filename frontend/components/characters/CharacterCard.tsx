import Image from "next/image";
import Link from "next/link";

import Feature from "../Feature";

import { CharacterListItem } from "@/domains/characters/character";

type CharacterCardProps = Pick<CharacterListItem, "slug" | "name" | "listImage" | "features" | "elementImage">;

export default function CharacterCard({ slug, name, listImage, features, elementImage }: CharacterCardProps) {
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
          {/* 🔥 속성 아이콘 */}
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
              <Feature key={feature.featureCode} feature={feature.featureCode} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
