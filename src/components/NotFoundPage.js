import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-10">
      <Image src="/images/lion.png" alt="Lion" width={200} height={200} />
      <h1 className="text-2xl mt-4">This page doesn't exist yet!</h1>
      <h1 className="text-lg mt-4">Please try visiting another page.</h1>
    </div>
  );
};

export default NotFoundPage;
