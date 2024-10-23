'use client';

import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';
import { useWallets } from '@privy-io/react-auth';
import { publicClient } from '@/lib/publicClient';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePaused } from '@/hooks/usePaused';
import { useState } from 'react';

export function EarlyForm() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const account = wallet?.address as `0x${string}`;
  const { isPaused, setIsPaused } = usePaused();
  const [isUpdating, setIsUpdating] = useState(false);

  async function toggleEarlyMintActive() {
    setIsUpdating(true);
    try {
      const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

      const walletClient = await createWalletClient({
        account,
        chain: baseSepolia,
        transport: custom(ethereumProvider),
      });

      const updatedActive = !isPaused;

      const functionName = updatedActive ? 'pause' : 'unpause';

      const { request }: any = await publicClient.simulateContract({
        address: peaqnamesAddress,
        abi: peaqnamesAbi,
        functionName,
        args: [],
        account,
      });

      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      setIsPaused(updatedActive);

      toast.success(updatedActive ? 'Minting is paused' : 'Minting is active');
    } catch (error) {
      console.error('Error toggling early mint status:', error);
      toast.error('Failed to update early mint status');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label className="text-base">
          Minting is {isPaused ? 'paused' : 'active'}
        </Label>
      </div>
      <div>
        <Switch
          disabled={isUpdating}
          checked={!isPaused}
          onCheckedChange={toggleEarlyMintActive}
        />
      </div>
    </div>
  );
}
