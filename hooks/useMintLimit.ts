import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';

export function useMintLimit() {
  const [mintLimit, setMintLimit] = useState<number>(5);

  useEffect(() => {
    const fetchYearlyFee = async () => {
      try {
        const limit = await publicClient.readContract({
          address: peaqnamesAddress,
          abi: peaqnamesAbi,
          functionName: 'earlyMintLimit',
        });

        if (limit) {
          setMintLimit(Number(limit));
        }
      } catch (error) {
        console.error('Error fetching mint limit:', error);
      }
    };

    fetchYearlyFee();
  }, []);

  return { mintLimit, setMintLimit };
}
