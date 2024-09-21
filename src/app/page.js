"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import GraphVisualisation from "@/components/GraphVisualisation";
import Footer from "@/components/Footer"; // Import the Footer

export default function Home() {
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Header />
      <main className="flex-grow flex flex-col p-4 overflow-hidden font-quicksand">
        <div className="flex-grow overflow-y-auto no-scrollbar gap-y-10">
          {/* Graph Visualisation Section */}
          <div className="flex-grow p-2 h-2/3">
            <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
            <div className="flex-grow h-full bg-white border border-gray-300 rounded-lg flex items-center justify-center overflow-auto no-scrollbar">
              <GraphVisualisation />
            </div>
          </div>
          {/* Explanation Section */}
          <div className="flex-grow mt-10 p-2 h-1/3">
            <h2 className="text-xl mb-2 font-semibold">
              <Image
                src="/images/person-speaking.png"
                alt="person speaking icon for explanation section"
                width={30}
                height={30}
              />
            </h2>
            <div className="flex-grow bg-white border border-gray-300 rounded-lg flex flex-col overflow-hidden">
              <div className="flex-grow overflow-auto no-scrollbar">
                <p className="text-center px-4 py-4">
                  {/* Add long text here for testing scrolling */}
                  Some explanation given. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Quisque gravida, eros et egestas
                  gravida. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Quisque gravida, eros et egestas gravida.Some
                  explanation given. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Quisque gravida, eros et egestas gravida.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque gravida, eros et egestas gravida.Some explanation
                  given. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Quisque gravida, eros et egestas gravida. Lorem ipsum
                  dolor sit amet, consectetur adipiscing elit. Quisque gravida,
                  eros et egestas gravida.Some explanation given. Lorem ipsum
                  dolor sit amet, consectetur adipiscing elit. Quisque gravida,
                  eros et egestas gravida. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Quisque gravida, eros et egestas
                  gravida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
