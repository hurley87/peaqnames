import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';

export function usePaused() {
  const [isPaused, setIsPaused] = useState<boolean>(true);

  useEffect(() => {
    const fetchYearlyFee = async () => {
      try {
        const paused = await publicClient.readContract({
          address: peaqnamesAddress,
          abi: peaqnamesAbi,
          functionName: 'paused',
        });

        if (paused) {
          setIsPaused(true);
        } else {
          setIsPaused(false);
        }
      } catch (error) {
        console.error('Error fetching early mint active:', error);
      }
    };

    fetchYearlyFee();
  }, []);

  return { isPaused, setIsPaused };
}
