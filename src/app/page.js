import AnimatedLion from "@/components/AnimatedLion";
import { Menu } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-8 text-center mb-12">
      <AnimatedLion />
      <div className="mt-8 space-y-6 max-w-2xl">
        <h2 className="text-3xl font-bold">
          Welcome to the Graph Algorithm Game!
        </h2>
        <p className="text-xl font-semibold text-white">
          Please click the sidebar{" "}
          <Menu className="inline-block w-6 h-6 text-blue-500 animate-pulse" />{" "}
          and:
        </p>
        <ol className="text-left text-lg text-gray-900 space-y-4 pl-6">
          <li className="animate-fade-in-1">
            1. Choose education or game mode
          </li>
          <li className="animate-fade-in-2">
            2. Choose the algorithm to get started!
          </li>
        </ol>
      </div>
    </main>
  );
}
