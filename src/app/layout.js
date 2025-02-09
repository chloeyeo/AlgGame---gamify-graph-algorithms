"use client";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastContainer } from "react-toastify";
import LayoutContent from "./LayoutContent";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html
      lang="en"
      className={`h-full ${pathname === "/auth" ? "no-scroll" : ""}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/alg.png" />
        <link rel="apple-touch-icon" href="/images/alg.png" />
      </head>
      <body>
        <div className="bg-gray-50 w-full min-h-screen">
          <div className="bg-white w-full h-full relative flex flex-col overflow-hidden shadow-lg">
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-y-auto bg-white no-scrollbar">
                <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
                  <Provider store={store}>
                    <LayoutContent>{children}</LayoutContent>
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      limit={1}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                    />
                  </Provider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
