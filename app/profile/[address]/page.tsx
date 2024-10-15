import { toast } from 'sonner';
import { Tokens } from '../../../components/tokens';

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
    <div className="p-6 flex flex-col gap-9 max-w-xl w-full mx-auto pt-20">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">{formatAddress(address)}</div>
        </div>
      </div>
      <Tokens address={address} />
    </div>
  );
}
