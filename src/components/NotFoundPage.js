import Image from "next/image";
import { Menu } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-10">
      <Image src="/images/lion.png" alt="Lion" width={200} height={200} />
      <h1 className="text-2xl mt-4">This page doesn't exist yet!</h1>
      <h1 className="text-lg mt-4">Please try visiting another page by</h1>
      <h1 className="text-lg mt-4">
        clicking a different option on the sidebar{" "}
        <Menu className="inline-block w-7 h-7 text-blue-600 animate-bounce" />
      </h1>
    </div>
  );
};

export default NotFoundPage;
