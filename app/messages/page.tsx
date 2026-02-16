'use client'

import {useRouter} from "next/navigation";

export default function Page() {

  const router = useRouter();

  const handleGoToAsd = () => {
    router.push("/asd");
  };

  return (
    <div className="flex flex-1 min-h-screen items-center justify-center font-sans space-x-4">
      <p>Messages</p>

      <button className='bg-zinc-500 rounded-lg py-4 px-8' onClick={handleGoToAsd}>Go to asd</button>
    </div>
  );
}
