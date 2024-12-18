'use client';
import { Button } from '@/components/ui/button';
import { getTokenURIFromName } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { peaqnamesAbi, peaqnamesAddress } from '@/lib/peaqnames';
import { useRouter } from 'next/navigation';
import { useNameContext } from '../lib/NameContext';
import { publicClient } from '@/lib/publicClient';
import { useYearlyFee } from '@/hooks/useYearlyFee';

const VALID_CHAIN_ID = '84532';

export default function RegisterName() {
  const { user, login } = usePrivy();
  const [name, setName] = useState<string>('');
  const [showClaimForm, setShowClaimForm] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isNameRegistered, setIsNameRegistered] = useState<boolean>(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState<boolean>(false);
  const [checkIfNameRegistered, setCheckIfNameRegistered] =
    useState<boolean>(false);
  const [years, setYears] = useState<number>(1);
  const validName = name.length > 3;
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const address = wallet?.address as `0x${string}`;
  const router = useRouter();
  const chainId = wallet?.chainId?.split(':')[1];
  const [isDefaultName, setIsDefaultName] = useState<boolean>(true);
  const { setDefaultName } = useNameContext();
  const { yearlyFee } = useYearlyFee();
  const fee = parseFloat(formatEther(BigInt(yearlyFee)));

  const registerName = async () => {
    setIsUploading(true);

    try {
      const tokenURI = await getTokenURIFromName(name);

      const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

      const walletClient = await createWalletClient({
        account: address,
        chain: baseSepolia,
        transport: custom(ethereumProvider),
      });

      const { request }: any = await publicClient.simulateContract({
        address: peaqnamesAddress,
        abi: peaqnamesAbi,
        functionName: 'earlyMint',
        args: [name, years, tokenURI, isDefaultName],
        account: address,
        value: BigInt(Math.floor(fee * years * 1e18)),
      });

      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.success('Name registered successfully');

      if (isDefaultName) {
        setDefaultName(`${name}.peaq`);
      }

      router.push(`/profile/${address}`);
    } catch (error) {
      console.log('error', error);
      toast.error('Registration failed');
    } finally {
      setIsUploading(false);
    }
  };

  const switchNetwork = async () => {
    setIsSwitchingNetwork(true);
    await wallet?.switchChain(parseInt(VALID_CHAIN_ID));
    toast.success('Switched to the correct network');
    setIsSwitchingNetwork(false);
  };

  if (showClaimForm) {
    return (
      <div className="w-full relative transition-[padding] px-4 md:px-8 duration-700">
        <div className="relative flex w-full max-w-full flex-col items-center justify-center md:-translate-y-12">
          <div className="relative z-10 w-full transition-opacity duration-700 max-w-full">
            <div className="absolute left-1/2 z-9 mx-auto w-full -translate-x-1/2 -translate-y-[calc(15vh)] transition-opacity md:max-w-[16rem]  md:-translate-y-20 duration-700">
              <div className="flex gap-4 px-2 justify-center">
                <Button
                  onClick={() => {
                    setName('');
                    setShowClaimForm(false);
                  }}
                  className="flex gap-2 items-center"
                  variant="ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                  <span>Find another name</span>
                </Button>
              </div>
            </div>
            <div className="transition-[max-width, transform] mx-auto duration-700">
              <div className="bg-[#6565FF] w-fit-content mx-auto text-white relative leading-[2em] overflow-hidden text-ellipsis max-w-full transition-all duration-700 ease-in-out rounded-[5rem] py-4 md:py-6 px-8 w-fit items-center shadow-xl shadow-[#6565FF]/20">
                <img
                  className="flex items-center justify-center overflow-hidden rounded-full absolute transition-all duration-700 ease-in-out h-[2.5rem] w-[2.5rem] md:h-[4rem] md:w-[4rem] top-3 left-4"
                  src="/peaq.jpg"
                  alt="Logo"
                />
                <span className="overflow-y-hidden text-ellipsis whitespace-nowrap transition-all duration-700 ease-in-out pl-8 md:pl-[4rem] text-[clamp(2rem,5vw,3rem)]">
                  {name}.peaq
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-40 transition-opacity mx-auto duration-700">
            <div className="mt-20 transition-all duration-500">
              <div className="z-10 flex flex-col items-start justify-between gap-6  p-8 text-gray-60 shadow-sm shadow-[#6565FF] md:flex-row md:items-center rounded-2xl">
                <div className="max-w-[14rem] self-start">
                  <p className="text-line mb-2 text-sm font-bold uppercase">
                    Claim for
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setYears((prev) => Math.max(1, prev - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DEE1E7] active:bg-[#DEE1E7]/80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </button>
                    <span className="flex w-32 items-center justify-center text-3xl font-bold text-black">
                      {years} year
                    </span>
                    <button
                      onClick={() => setYears(years + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DEE1E7] active:bg-[#DEE1E7]/80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>
                  <label
                    htmlFor="default"
                    className="font-bold mt-4 flex w-full items-center justify-start gap-2 text-center cursor-pointer"
                  >
                    <input
                      id="default"
                      type="checkbox"
                      checked={isDefaultName}
                      onChange={() => setIsDefaultName(!isDefaultName)}
                    />
                    <span className="flex flex-row items-center gap-2 text-sm">
                      Set as primary name
                    </span>
                  </label>
                </div>
                <div className="min-w-[14rem] self-start text-left">
                  <p className="text-line mb-2 text-sm font-bold uppercase">
                    Amount
                  </p>
                  <div className="whitespace-nowrap text-3xl font-bold text-black">
                    {(fee * years).toFixed(3)} ETH
                  </div>
                </div>
                <div className="w-full max-w-full md:max-w-[13rem]">
                  {user ? (
                    <>
                      {chainId === VALID_CHAIN_ID ? (
                        <Button
                          onClick={registerName}
                          disabled={isUploading}
                          size="lg"
                        >
                          {isUploading ? 'Registering...' : 'Register Name'}
                        </Button>
                      ) : (
                        <Button
                          onClick={switchNetwork}
                          disabled={isSwitchingNetwork}
                          size="lg"
                        >
                          {isSwitchingNetwork
                            ? 'Switching...'
                            : 'Switch Network'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button onClick={login} size="lg">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nameRegisteredCheck = async (name: string) => {
    setCheckIfNameRegistered(true);
    setName(name);
    const response = await publicClient.readContract({
      address: peaqnamesAddress,
      abi: peaqnamesAbi,
      functionName: 'isNameRegistered',
      args: [name],
    });

    const isRegistered = Boolean(response);

    setIsNameRegistered(isRegistered);
    setCheckIfNameRegistered(false);

    return response;
  };

  return (
    <div className="absolute left-1/2 z-8 mx-auto w-full max-w-2xl -translate-x-1/2 transform transition-opacity  md:-translate-y-1/2 duration-700 top-[40vh] md:top-[50vh]">
      <div className="relative bottom-full w-full pb-4 px-4 md:px-8">
        <div className="relative flex w-full flex-row justify-between">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-[#6565FF]"></div>
            <div className="text-md font-bold md:text-xl">Peaqnames</div>
          </div>
          <p className="sm:text-md text-xs md:text-xl">Own your name today</p>
        </div>
      </div>
      <div className="mx-auto transition-[max-width] duration-700 px-4 md:px-8">
        <fieldset className="relative z-9 transition-all duration-500 w-full mx-auto group text-black">
          <input
            type="text"
            value={name}
            onChange={(e) => nameRegisteredCheck(e.target.value)}
            className={`hover:border-[#6565FF] w-full outline-0 placeholder:uppercase peer py-5 md:py-7 pl-6 pr-16 text-md md:text-2xl bg-white border-gray-40/20 focus:border-[#6565FF]   ${
              validName ? 'rounded-t-3xl border-b-none' : 'rounded-3xl border-2'
            } transition-colors  border-gray-40/20 group-hover:border-[#6565FF]  shadow-lg`}
          />
          <div
            className={`flex flex-col items-start bg-white text-black absolute left-0 right-0 top-full z-9 border-t-0 border-2 border-gray-40/20 group-hover:border-blue-600  shadow-lg pb-4 } peer-focus:border-blue-600  transition-all overflow-scroll ${
              validName
                ? 'max-h-[20rem] opacity-100 rounded-b-3xl'
                : 'max-h-0 opacity-0'
            }   p-0 border-none`}
          >
            <div className="w-full px-6">
              <div className="w-full border-t border-gray-40/20"></div>
            </div>
            {checkIfNameRegistered && (
              <p className="w-full text-gray-60 pointer-events-none text-sm ml-6 mb-4 mt-4 hidden md:block">
                Checking...
              </p>
            )}
            {!checkIfNameRegistered && !isNameRegistered && (
              <p className="w-full uppercase text-gray-60 font-bold pointer-events-none text-sm ml-6 mb-4 mt-4 hidden md:block">
                Available
              </p>
            )}
            {!checkIfNameRegistered && isNameRegistered && (
              <p className="w-full text-gray-60 pointer-events-none text-sm ml-6 mb-4 mt-4 hidden md:block text-red-500">
                {name}.peaq is already registered
              </p>
            )}
            {!checkIfNameRegistered && !isNameRegistered && (
              <button
                onClick={() => setShowClaimForm(true)}
                className="flex w-full flex-row items-center justify-between transition-colors hover:bg-[#F9F9F9] active:bg-[#EAEAEB] text-ellipsis px-6 py-3 text"
              >
                <span className="truncate">{`${name}.peaq`}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            )}
          </div>
          <span className="absolute top-1/2 z-9 flex -translate-y-1/2 items-center scale-75 md:scale-100 right-8">
            <span>
              {validName ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={() => setName('')}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              )}
            </span>
          </span>
        </fieldset>
      </div>
    </div>
  );
}
