import FindName from '@/components/find-name';

export default function Home() {
  return (
    <div className="w-full relative min-h-screen pb-40 transition-[padding] px-4 md:px-8 duration-700 pt-[calc(35vh)] md:pt-[calc(50vh)]">
      <FindName />
    </div>
  );
}
