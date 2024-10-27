import Container from '@/components/container';
import { DefaultName } from '@/components/default-name';
import { isAddress } from 'viem';
import { ManageProfile } from './manage-profile';

interface UpdatePageProps {
  params: { address: string };
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const address = params.address as `0x${string}`;

  if (!isAddress(address)) {
    return <div>Profile not found</div>;
  }

  return (
    <Container>
      <div className="w-full max-w-lg mx-auto flex flex-col gap-4">
        <DefaultName profileAddress={address} />
        <ManageProfile profileAddress={address} />
      </div>
    </Container>
  );
}
