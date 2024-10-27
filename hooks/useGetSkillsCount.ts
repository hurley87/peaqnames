import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { peaqprofilesAbi, peaqprofilesAddress } from '@/lib/peaqprofiles';

export function useGetSkillsCount() {
  const [skillsCount, setSkillsCount] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const skillsCount = await publicClient.readContract({
          address: peaqprofilesAddress,
          abi: peaqprofilesAbi,
          functionName: 'getSkillsCount',
          args: [],
        });

        if (skillsCount) {
          setSkillsCount(skillsCount);
        }
      } catch (error) {
        console.error('Error fetching skills count:', error);
      }
    };

    fetchProfile();
  }, []);

  return { skillsCount, setSkillsCount };
}
