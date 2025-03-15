import "./globals.css"
import { ThemeProvider } from "./components/theme-provider"

export const metadata = {
  title: "Video Content Generator",
  description: "Generate engaging video content with AI",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
