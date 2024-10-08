import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { gaslessFundAndUploadSingleFile, uploadMetadata } from './irys';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const IRYS_URL = 'https://gateway.irys.xyz/';

export async function getTokenURIFromName(peaqName: string) {
  const response = await fetch('/api/og', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ peaqName }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const blob = new Blob([buffer], { type: 'image/png' });
  const file = new File([blob], 'combined_image.png', {
    type: 'image/png',
  });

  const tags = [{ name: 'Content-Type', value: 'image/png' }];

  const id = await gaslessFundAndUploadSingleFile(file, tags);

  const image = `${IRYS_URL}${id}`;
  const name = `${peaqName}.peaq`;
  const description = 'Peaqnames';

  const receiptId = await uploadMetadata({
    name,
    description,
    image,
  });

  return `${IRYS_URL}${receiptId}`;
}
