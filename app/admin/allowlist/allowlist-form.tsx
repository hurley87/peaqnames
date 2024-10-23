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

const accountFormSchema = z.object({
  recipients: z.string().min(1, {
    message: 'Recipients must be at least 1 character.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  recipients: '',
};

export function AllowlistForm() {
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
    try {
      const recipients = data.recipients;
      console.log('recipients', recipients);

      const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

      const walletClient = await createWalletClient({
        account,
        chain: baseSepolia,
        transport: custom(ethereumProvider),
      });

      const { request }: any = await publicClient.simulateContract({
        address: peaqnamesAddress,
        abi: peaqnamesAbi,
        functionName: 'addToAllowlist',
        args: [
          recipients.split(',').map((recipient: string) => recipient.trim()),
        ],
        account,
      });

      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.success('Recipients added successfully');
    } catch (error) {
      console.error('Error adding recipients to allowlist:', error);
      toast.error('Failed to add recipients to allowlist');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="recipients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipients</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x1169E27981BceEd47E590bB9E327b26529962bAe, 0x1169E27981BceEd47E590bB9E327b26529962bAe"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Recipients wallet addresses separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Adding...' : 'Add to Allowlist'}
        </Button>
      </form>
    </Form>
  );
}
