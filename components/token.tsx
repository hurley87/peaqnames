'use client';
import { getUri } from '@/lib/view-tokens';
import { useEffect, useState } from 'react';

export const Token = ({
  tokenId,
}: {
  tokenId: number;
  showActions?: boolean;
}) => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const uri = (await getUri(tokenId)) as string;
      const token = await fetch(uri, { cache: 'no-store' });
      const json = await token.json();
      console.log(json);
      setName(json.name);
    };
    fetchToken();
  }, [tokenId]);

  if (!name) return null;

  return (
    <div className="flex flex-col h-full w-full justify-center">
      <div className="flex flex-col h-[300px] w-full justify-between p-6 bg-[#6565FF] rounded-3xl shadow-xl">
        <img
          src="https://peaqnames.vercel.app/peaq.jpg"
          alt="Peaqnames"
          className="w-[70px] h-[70px] border-2 rounded-full"
        />
        <p className="text-white text-5xl truncate">{name}</p>
      </div>
    </div>
  );
};
