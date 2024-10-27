'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useWallets } from '@privy-io/react-auth';
import { publicClient } from '@/lib/publicClient';
import { toast } from 'sonner';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { peaqprofilesAbi, peaqprofilesAddress } from '@/lib/peaqprofiles';
import { useGetSkillsCount } from '@/hooks/useGetSkillsCount';
import { ViewSkill } from './view-skill';

const accountFormSchema = z.object({
  twitter: z.string().min(1, {
    message: 'Twitter must be at least 1 character.',
  }),
  website: z.string().min(1, {
    message: 'Website must be at least 1 character.',
  }),
  description: z.string().min(1, {
    message: 'Description must be at least 1 character.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  twitter: '',
  website: '',
  description: '',
};

export function CreateProfile({
  setProfile,
}: {
  setProfile: (profile: any) => void;
}) {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const account = wallet?.address as `0x${string}`;
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const { skillsCount } = useGetSkillsCount();

  const toggleSkill = (skill: number) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  async function onSubmit(data: AccountFormValues) {
    setIsUpdating(true);
    try {
      const twitter = data.twitter;
      const website = data.website;
      const description = data.description;

      const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

      const walletClient = await createWalletClient({
        account,
        chain: baseSepolia,
        transport: custom(ethereumProvider),
      });

      const { request }: any = await publicClient.simulateContract({
        address: peaqprofilesAddress,
        abi: peaqprofilesAbi,
        functionName: 'createProfile',
        args: [twitter, website, selectedSkills, description],
        account,
      });

      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      setProfile([twitter, website, selectedSkills, description]);

      toast.success('Profile created successfully');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="font-display text-center flex gap-2 items-center whitespace-nowrap cursor-pointer text-black bg-gray-200 hover:bg-[#EEF0F3]/60 active:bg-[#EEF0F3]/80 text-sm md:text-lg px-10 py-8 rounded-full w-full justify-center shadow-sm">
          Create Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Profile</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2 text-left pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description </FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        { length: Number(skillsCount) },
                        (_, index) => (
                          <span className="cursor-pointer" key={index}>
                            <ViewSkill
                              skill={index + 1}
                              selected={selectedSkills.includes(index + 1)}
                              onClick={() => toggleSkill(index + 1)}
                            />
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Creating...' : 'Create Profile'}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}