export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import {MsEdgeTTS} from "msedge-tts";

// Utility function to collect stream data into a buffer
function streamToBuffer(stream:any) : Promise<Buffer> {
  
  return new Promise((resolve, reject) => {
    const chunks: Array<any> = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

}

async function getTTS(num: number): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("de-DE-KatjaNeural", MsEdgeTTS.OUTPUT_FORMATS.WEBM_24KHZ_16BIT_MONO_OPUS);
  const readable = tts.toStream(num.toString());

  const buffer = await streamToBuffer(readable);
  return buffer;
}

export async function GET(request: Request) {
  // console.log(readable)
  // const number = request.query.get('number');
  const num = new URL(request.url).searchParams.get('number');
  const buffer = await getTTS(Number(num));
  
  return new Response(buffer, {
    headers: {
      'Content-Type': 'audio/webm', // Adjust the MIME type according to your audio format
      'Content-Length': buffer.length.toString(),
    },
  });
}

export const runtime = 'nodejs';