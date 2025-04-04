import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WEBIFY | Solutions Web Modernes',
  description: 'WEBIFY offre des solutions web modernes, élégantes et performantes pour votre entreprise. Expertise en développement React, Next.js et Supabase.',
  keywords: 'développement web, nextjs, react, supabase, webify, design responsive',
  authors: [{ name: 'WEBIFY Team' }],
  creator: 'WEBIFY',
  publisher: 'WEBIFY',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/webifyLogo1.jpg" sizes="any" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
