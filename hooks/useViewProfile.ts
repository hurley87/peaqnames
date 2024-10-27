import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { peaqprofilesAbi, peaqprofilesAddress } from '@/lib/peaqprofiles';

export function useViewProfile(address: string) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await publicClient.readContract({
          address: peaqprofilesAddress,
          abi: peaqprofilesAbi,
          functionName: 'viewProfile',
          args: [address],
        });

        if (profile) {
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return { profile, setProfile };
}
