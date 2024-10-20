"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import LayoutContent from "./LayoutContent";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/alg.png" />
        <link rel="apple-touch-icon" href="/images/alg.png" />
      </head>
      <body>
        <div className="bg-gray-50 w-full min-h-screen flex justify-center items-center">
          <div className="bg-white w-full h-full relative flex flex-col overflow-hidden shadow-lg py-10 md:py-0">
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-y-auto bg-white no-scrollbar">
                <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
                  <Provider store={store}>
                    <LayoutContent>{children}</LayoutContent>
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
