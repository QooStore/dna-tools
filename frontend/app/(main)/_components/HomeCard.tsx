import Link from "next/link";

type HomeCardProps = {
  title: string;
  href: string;
  image: string;
  highlight?: boolean;
};

export default function HomeCard({ title, href, image, highlight = false }: HomeCardProps) {
  return (
    <Link
      href={href}
      className={`
        group relative block w-[240px] overflow-hidden rounded-xl
        ${highlight ? "ring-2 ring-cyan-400/60" : "border border-white/10"}
        aspect-square
      `}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/35" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <h3
          className="
            text-xl font-bold tracking-wide text-white
            transition-colors group-hover:text-cyan-300
          "
        >
          {title}
        </h3>
      </div>
    </Link>
  );
}
