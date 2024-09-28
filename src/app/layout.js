"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import LayoutContent from "./LayoutContent";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/alg.png" />
        <link rel="apple-touch-icon" href="/images/alg.png" />
      </head>
      <body>
        <div className="sm:bg-gray-50 w-full min-h-screen flex justify-center items-center">
          <div className="bg-white w-full h-full sm:w-[576px] sm:h-screen relative flex flex-col overflow-hidden sm:shadow-lg">
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-y-auto bg-white px-0 py-0 no-scrollbar">
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
