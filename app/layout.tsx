import type { Metadata } from "next";
import "@/app/globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const metadata: Metadata = {
  title: "Anime Tinder",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="beVietnam dark">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
