'use client';
import { useEffect, useState } from 'react';
import { getTokensOfOwner } from '@/lib/view-tokens';
import { Token } from './token';

export const Tokens = ({ address }: { address: `0x${string}` }) => {
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const tokenIds = (await getTokensOfOwner(address)) as number[];
      setTokenIds(tokenIds);
    };

    if (address) fetchData();
  }, [address]);

  if (!address) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tokenIds.map((tokenId) => (
        <Token key={tokenId} tokenId={tokenId} />
      ))}
    </div>
  );
};
