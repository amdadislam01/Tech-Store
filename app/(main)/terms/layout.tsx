import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Tech-Store",
  description: "Rules and terms governing the use of the Tech-Store platform.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
