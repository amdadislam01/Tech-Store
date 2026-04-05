import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Tech-Store",
  description: "How we protect and handle your personal data at Tech-Store.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
