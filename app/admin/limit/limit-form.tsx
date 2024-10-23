'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createWalletClient, custom } from 'viem';
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
import { useWallets } from '@privy-io/react-auth';
import { publicClient } from '@/lib/publicClient';
import { toast } from 'sonner';
import { useState } from 'react';
import { useMintLimit } from '@/hooks/useMintLimit';

const accountFormSchema = z.object({
  limit: z.string().min(0, {
    message: 'Limit must be at least 0.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  limit: '',
};

export function LimitForm() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const account = wallet?.address as `0x${string}`;
  const { mintLimit, setMintLimit } = useMintLimit();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  async function onSubmit(data: AccountFormValues) {
    setIsUpdating(true);
    const limit = Number(data.limit);

    if (limit < 0) {
      toast.error('Limit must be at least 0.');
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
      functionName: 'setEarlyMintLimit',
      args: [limit],
      account,
    });

    const hash = await walletClient.writeContract(request);

    await publicClient.waitForTransactionReceipt({
      hash,
    });

    toast.success('Limit updated successfully');

    setMintLimit(limit);
    setIsUpdating(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
              <FormControl>
                <Input placeholder="10" {...field} />
              </FormControl>
              <FormDescription>
                The current limit is {mintLimit}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Limit'}
        </Button>
      </form>
    </Form>
  );
}
