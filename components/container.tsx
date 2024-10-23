export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 flex flex-col gap-9 max-w-2xl w-full mx-auto pt-20">
      {children}
    </div>
  );
}
