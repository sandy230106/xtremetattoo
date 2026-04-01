import './globals.css';

export const metadata = {
  title: 'Xtreme Tattoo Studio | Premium Tattoo Artistry in Trichy',
  description: 'Custom tattoos crafted with precision, meaning, and artistry in Trichy. Led by artist Muthu Kumar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="cursor"></div>
        {children}
      </body>
    </html>
  );
}
