import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure proper client-side routing
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // For static export, we need to show content immediately
  if (typeof window === 'undefined') {
    // Server-side: redirect via meta refresh for static export
    return (
      <>
        <Head>
          <meta httpEquiv="refresh" content="0; url=/Ecommerce/home" />
          <title>Elite Store - Redirecting...</title>
        </Head>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'Arial, sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Elite Store</h2>
            <p>Loading your shopping experience...</p>
            <div style={{ 
              border: '2px solid white',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite',
              margin: '20px auto'
            }}></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Elite Store - Loading...</title>
      </Head>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Elite Store</h2>
          <p>Redirecting to your shopping experience...</p>
        </div>
      </div>
    </>
  );
}
