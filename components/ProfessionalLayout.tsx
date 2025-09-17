import Head from "next/head";
import ProfessionalHeader from "./ProfessionalHeader";

interface ProfessionalLayoutProps {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly description?: string;
  readonly cartCount?: number;
  readonly currentPage?: string;
}

export default function ProfessionalLayout({
  children,
  title,
  description = "Premium e-commerce experience",
  cartCount = 0,
  currentPage,
}: ProfessionalLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} - Elite Store</title>
        <meta name="description" content={description} />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/professional.css" />
      </Head>

      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        <ProfessionalHeader cartCount={cartCount} currentPage={currentPage} />
        {children}
      </div>
    </>
  );
}
