'use client';
import { useDefaultName } from '@/hooks/useDefaultName';

export const DefaultName = ({
  profileAddress,
}: {
  profileAddress: `0x${string}`;
}) => {
  const defaultName = useDefaultName(profileAddress);

  return (
    <div className="flex flex-col h-full w-full justify-center">
      <div className="flex flex-col h-[300px] w-full justify-between p-6 bg-[#6565FF] rounded-3xl shadow-xl">
        <img
          src="https://peaqnames.vercel.app/peaq.jpg"
          alt="Peaqnames"
          className="w-[70px] h-[70px] border-2 rounded-full"
        />
        <p className="text-white text-4xl truncate">{defaultName}</p>
      </div>
    </div>
  );
};
