import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { peaqName } = await req.json();

    const imageResponse = new ImageResponse(
      (
        <div tw="h-[600px] w-[600px] bg-white flex relative p-6 mx-auto">
          <div tw="flex flex-col h-full w-full justify-center">
            <div tw="flex flex-col h-[300px] w-full justify-between p-6 bg-[#6565FF] rounded-3xl shadow-xl">
              <img
                src="https://peaqnames.vercel.app/peaq.jpg"
                alt="Peaqnames"
                tw="w-[70px] h-[70px] border-2 rounded-full"
              />
              <p tw="text-white text-4xl truncate">{`${peaqName}.peaq`}</p>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 600,
      }
    );

    return new Response(await imageResponse.arrayBuffer(), {
      headers: imageResponse.headers,
    });
  } catch (e) {
    console.error('Error processing request:', e);
    return new Response('Request processing error', { status: 500 });
  }
}
