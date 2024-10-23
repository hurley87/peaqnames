'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formatEther, parseEther, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useYearlyFee } from '@/hooks/useYearlyFee';
import { useWallets } from '@privy-io/react-auth';
import { publicClient } from '@/lib/publicClient';
import { toast } from 'sonner';
import { useState } from 'react';

const accountFormSchema = z.object({
  fee: z.string().min(0, {
    message: 'Fee must be at least 0.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  fee: '',
};

export function FeeForm() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const account = wallet?.address as `0x${string}`;
  const { yearlyFee, setYearlyFee } = useYearlyFee();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  async function onSubmit(data: AccountFormValues) {
    setIsUpdating(true);
    const fee = parseEther(data.fee);

    if (parseFloat(data.fee) < 0.001) {
      toast.error('Fee must be at least 0.001 ETH.');
      setIsUpdating(false);
      return;
    }

    const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

    const walletClient = await createWalletClient({
      account,
      chain: baseSepolia,
      transport: custom(ethereumProvider),
    });

    const { request }: any = await publicClient.simulateContract({
      address: peaqnamesAddress,
      abi: peaqnamesAbi,
      functionName: 'setFlatFeePerYear',
      args: [fee],
      account,
    });

    const hash = await walletClient.writeContract(request);

    await publicClient.waitForTransactionReceipt({
      hash,
    });

    toast.success('Fee updated successfully');

    setYearlyFee(fee.toString());
    setIsUpdating(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee</FormLabel>
              <FormControl>
                <Input placeholder="0.001" {...field} />
              </FormControl>
              <FormDescription>
                The current fee is {formatEther(BigInt(yearlyFee || '0'))} ETH.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Fee'}
        </Button>
      </form>
    </Form>
  );
}
