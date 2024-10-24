'use client';

import { createWalletClient, custom, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';
import { useWallets } from '@privy-io/react-auth';
import { publicClient } from '@/lib/publicClient';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { usePaused } from '@/hooks/usePaused';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function WithdrawForm() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const account = wallet?.address as `0x${string}`;
  const { isPaused, setIsPaused } = usePaused();
  const [isUpdating, setIsUpdating] = useState(false);
  const [balance, setBalance] = useState<string>('0');

  const fetchBalance = async () => {
    try {
      const balanceWei = await publicClient.getBalance({
        address: peaqnamesAddress,
      });
      setBalance(formatEther(balanceWei));
    } catch (error) {
      console.error('Error fetching contract balance:', error);
      toast.error('Failed to fetch contract balance');
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  async function withdrawFunds() {
    setIsUpdating(true);
    try {
      const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

      const walletClient = await createWalletClient({
        account,
        chain: baseSepolia,
        transport: custom(ethereumProvider),
      });

      const functionName = 'withdraw';

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

      toast.success('Funds withdrawn');

      // Fetch updated balance after successful withdrawal
      await fetchBalance();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      toast.error('Failed to withdraw funds');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label className="text-base">Balance: {balance} ETH</Label>
      </div>
      <div>
        <Button onClick={withdrawFunds} disabled={isUpdating}>
          {isUpdating ? 'Withdrawing...' : 'Withdraw'}
        </Button>
      </div>
    </div>
  );
}
