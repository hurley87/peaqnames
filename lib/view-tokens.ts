import { createPublicClient, http } from 'viem';
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x`;
import { baseSepolia } from 'viem/chains';
import { peaqnamesAddress, peaqnamesAbi } from './peaqnames';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

export async function balanceOf(address: string) {
  try {
    const balanceData = await publicClient.readContract({
      address: peaqnamesAddress,
      abi: peaqnamesAbi,
      functionName: 'balanceOf',
      args: [address],
    });
    const balance: number = Number(balanceData);
    return balance;
  } catch (error) {
    return error;
  }
}

export async function tokenOfOwnerByIndex(address: string, index: number) {
  try {
    const tokenIdData = await publicClient.readContract({
      address: peaqnamesAddress,
      abi: peaqnamesAbi,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, index],
    });
    const tokenId: number = Number(tokenIdData);
    return tokenId;
  } catch (error) {
    return error;
  }
}

export async function getTokensOfOwner(address: string) {
  try {
    const balance = (await balanceOf(address)) as number;
    const tokenIds = [];

    for (let i = 0; i < balance; i++) {
      const tokenId = await tokenOfOwnerByIndex(address, i);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  } catch {
    return [];
  }
}

export async function getUri(tokenId: number) {
  try {
    const uriData = await publicClient.readContract({
      address: peaqnamesAddress,
      abi: peaqnamesAbi,
      functionName: 'tokenURI',
      args: [tokenId],
    });
    return uriData;
  } catch (error) {
    return error;
  }
}
