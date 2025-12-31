import HomeCard from "@/components/home/HomeCard";

import { NAV_ITEMS as HOME_CARDS } from "@/config/navigation";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* DATABASE */}
      <section className="max-w-5xl mx-auto text-center">
        <h2 className="mb-6 text-3xl font-semibold tracking-widest text-white/60">DATABASE</h2>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,240px))] justify-center">
          {HOME_CARDS.filter((item) => item.section === "database").map((card) => (
            <HomeCard key={card.href} title={card.label} href={card.href} image={card.image} />
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="max-w-5xl mx-auto text-center">
        <h2 className="mb-4 text-3xl font-semibold tracking-widest text-white/60">TOOLS</h2>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,240px))] justify-center">
          {HOME_CARDS.filter((item) => item.section === "tools").map((card) => (
            <HomeCard
              key={card.href}
              title={card.label}
              href={card.href}
              image={card.image}
              highlight={card.highlight}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
