import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';

export function useDefaultName(address: `0x${string}` | undefined) {
  const [defaultName, setDefaultName] = useState<string | null>(null);

  useEffect(() => {
    const formatAddress = (address: `0x${string}`) => {
      return address.slice(0, 4) + '...' + address.slice(-4);
    };

    const fetchDefaultName = async () => {
      if (!address) return;

      try {
        const name = await publicClient.readContract({
          address: peaqnamesAddress,
          abi: peaqnamesAbi,
          functionName: 'getDefaultName',
          args: [address],
        });

        setDefaultName(`${name}.peaq`);
      } catch (error) {
        console.error('Error fetching default name:', error);
        setDefaultName(formatAddress(address));
      }
    };

    fetchDefaultName();
  }, [address]);

  return defaultName;
}
