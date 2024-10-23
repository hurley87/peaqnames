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
import { getTokenURIFromName } from '@/lib/utils';
import { isAddress } from 'viem';

const accountFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name must be at least 1 character.',
  }),
  recipient: z.string().min(1, {
    message: 'Wallet must be at least 1 character.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  name: '',
  recipient: '',
};

export function ReserveForm() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const account = wallet?.address as `0x${string}`;
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  async function onSubmit(data: AccountFormValues) {
    setIsUpdating(true);
    const recipient = data.recipient;
    const name = data.name;

    if (!isAddress(recipient)) {
      toast.error('Invalid recipient address.');
      setIsUpdating(false);
      return;
    }

    if (name.length < 3) {
      toast.error('Wallet and name must be at least 3 characters.');
      setIsUpdating(false);
      return;
    }

    const tokenURI = await getTokenURIFromName(name);

    const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

    const walletClient = await createWalletClient({
      account,
      chain: baseSepolia,
      transport: custom(ethereumProvider),
    });

    const { request }: any = await publicClient.simulateContract({
      address: peaqnamesAddress,
      abi: peaqnamesAbi,
      functionName: 'reserveName',
      args: [recipient, name, 10, tokenURI, true],
      account,
    });

    const hash = await walletClient.writeContract(request);

    await publicClient.waitForTransactionReceipt({
      hash,
    });

    toast.success('Name reserved successfully');

    setIsUpdating(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x1169E27981BceEd47E590bB9E327b26529962bAe"
                  {...field}
                />
              </FormControl>
              <FormDescription>{`Recipient's wallet address.`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>
                Name reserved for the recipient.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Reserving...' : 'Reserve Name'}
        </Button>
      </form>
    </Form>
  );
}
