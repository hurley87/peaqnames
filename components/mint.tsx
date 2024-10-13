'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTokenURIFromName } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Mint() {
  const [name, setName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [tokenURI, setTokenURI] = useState<string>('');

  const handleUpload = async () => {
    setIsUploading(true);

    if (name === '') return;

    try {
      const tokenURI = await getTokenURIFromName(name);

      setTokenURI(tokenURI);
      setIsUploading(false);
      toast.success('TokenURI has been created.');
    } catch (error) {
      console.error('Error uploading:', error);
      setIsUploading(false);
      toast.error('Error uploading.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenURI);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-4 w-[600px] mx-auto">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleUpload}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {tokenURI && (
        <div
          className="cursor-pointer text-center text-[#6565FF] text-sm"
          onClick={copyToClipboard}
        >
          {tokenURI}
        </div>
      )}
      <div className="border h-[600px] w-[600px] bg-white flex relative p-6 mx-auto">
        <div className="flex flex-col h-full w-full justify-center">
          <div className="flex flex-col h-[300px] w-full justify-between p-6 bg-[#6565FF] rounded-3xl shadow-xl">
            <img
              src="/peaq.jpg"
              alt="Peaqnames"
              className="w-[70px] h-[70px] border-2 rounded-full"
            />
            <p className="text-white text-5xl truncate">{name}.peaq</p>
          </div>
        </div>
      </div>
    </div>
  );
}
