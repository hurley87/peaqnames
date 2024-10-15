interface UpdatePageProps {
  params: { address: string };
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const address = params.address as `0x${string}`;

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  return (
    <div className="p-6 flex flex-col gap-9 font-serif max-w-3xl w-full mx-auto pt-20">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">{formatAddress(address)}</div>
        </div>
      </div>
      <div className="border-b border-[#B3B3B3]">
        <h2 className="border-b-2 w-fit border-white pb-2">Your Names</h2>
      </div>
    </div>
  );
}
