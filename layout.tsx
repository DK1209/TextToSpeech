import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Redux setup
import { Providers } from "@/Redux/provider"
import Header from '@/components/Header'
import { ToastContainer } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MogiVerse',
  description: 'Generated by MogiIO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={`${inter.className} bg-black`}>
        <Providers>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" />
          <main className='min-h-[100vh] flex flex-col gap-1 bg-black text-white'>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}