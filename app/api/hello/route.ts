export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { read } from "fs";
import {MsEdgeTTS} from "msedge-tts";

// Utility function to collect stream data into a buffer
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
;
async function getTTS(num) {
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
  const buffer = await getTTS(num);
  
  return new Response(buffer, {
    headers: {
      'Content-Type': 'audio/webm', // Adjust the MIME type according to your audio format
      'Content-Length': buffer.length.toString(),
    },
  });
  
  // return new Response(`Hellooo from ${process.env.VERCEL_REGION}`);
}

export const runtime = 'nodejs';