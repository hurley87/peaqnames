import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { peaqprofilesAbi, peaqprofilesAddress } from '@/lib/peaqprofiles';

export function useSkillName(skill: number) {
  const [skillName, setSkillName] = useState<any>(null);

  useEffect(() => {
    const fetchSkillName = async () => {
      try {
        const skillName = await publicClient.readContract({
          address: peaqprofilesAddress,
          abi: peaqprofilesAbi,
          functionName: 'getSkillName',
          args: [skill],
        });

        if (skillName) {
          setSkillName(skillName);
        }
      } catch (error) {
        console.error('Error fetching skill name:', error);
      }
    };

    fetchSkillName();
  }, []);

  return { skillName };
}
