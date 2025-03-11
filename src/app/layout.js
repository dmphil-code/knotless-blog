import './globals.css';

export const metadata = {
  title: 'My Blog',
  description: 'Sharing insights and knowledge through our articles',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}