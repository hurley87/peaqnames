'use client';

import { useSkillName } from '@/hooks/useSkillName';

export function ViewSkill({
  skill,
  selected,
  onClick,
}: {
  skill: number;
  selected: boolean;
  onClick: () => void;
}) {
  const { skillName } = useSkillName(skill);

  return (
    <span
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border  px-3 py-2 text-sm font-bold transition-all ${
        selected
          ? 'border-[#6565FF] bg-[#6565FF]/20 text-[#6565FF]'
          : 'border-gray-300 bg-gray-100 text-gray-600'
      }`}
    >
      {skillName}
    </span>
  );
}
