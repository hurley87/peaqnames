import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';

export function useYearlyFee() {
  const [yearlyFee, setYearlyFee] = useState<string>('1000000000000000');

  useEffect(() => {
    const fetchYearlyFee = async () => {
      try {
        const fee = await publicClient.readContract({
          address: peaqnamesAddress,
          abi: peaqnamesAbi,
          functionName: 'flatFeePerYear',
        });

        if (fee) {
          setYearlyFee(fee?.toString());
        }
      } catch (error) {
        console.error('Error fetching yearly fee:', error);
      }
    };

    fetchYearlyFee();
  }, []);

  return { yearlyFee, setYearlyFee };
}
