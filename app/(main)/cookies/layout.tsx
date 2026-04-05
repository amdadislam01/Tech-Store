import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Tech-Store",
  description: "How we use cookies to improve your Tech-Store shopping experience.",
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
