import './globals.css'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

// 使用本地字体或系统默认字体
const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export const metadata = {
  title: '课堂反馈',
  description: '为您的课程提供反馈',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={systemFont}>{children}</body>
    </html>
  )
}

