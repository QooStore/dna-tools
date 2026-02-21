import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DNA Tools",
  description: "듀엣나이트 어비스 정보, 계산기",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`bg-[#070b18] text-white flex flex-col min-h-screen`}>
        {/* 배경 이미지 레이어 */}
        <div className="fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/home/background_image.jpg')" }}
          />
          <div className="absolute inset-0 bg-[#070b18]/85" />
        </div>
        <div className="flex-1">{children}</div>
        <footer className="text-center text-xs text-gray-500 py-6 mt-8">
          <p>This is a fan-made site. All game assets belong to Pan Studio.</p>
          <p className="mt-1">© 2026 DNA Tools | <a href="mailto:acetom35@gmail.com" className="hover:text-gray-300">acetom35@gmail.com</a></p>
        </footer>
      </body>
    </html>
  );
}
