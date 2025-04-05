import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'WEBIFY - Votre vision, notre création',
  description: 'Plateforme de partage de projets et blogs avec gestion avancée des rôles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-white transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 