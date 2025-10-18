import './globals.css'
import { SessionProvider } from './SessionProvider'

export const metadata = {
  title: 'Martial Peak - Cultivation RPG Game',
  description: 'Embark on an epic cultivation journey. Gather qi, breakthrough realms, and become the ultimate immortal!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}