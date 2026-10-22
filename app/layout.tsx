import type { Metadata } from "next";
import "./globals.css";
import "./promo.css";
import "./footer.css";

export const metadata: Metadata = {
  title: "Студия перманентного макияжа",
  description:
    "Перманентный макияж бровей, губ и век. Естественный результат и запись на процедуру.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
