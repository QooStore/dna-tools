type ContentSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function ContentSection({ title, children, className = "" }: ContentSectionProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
