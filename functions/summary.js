// Start by making sure the `assemblyai` package is installed.
// If not, you can install it by running the following command:
// npm install assemblyai

import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: 'e10a491c4dde4392b5cc848fa49ed09e',
});

const FILE_URL =
  'https://assembly.ai/sports_injuries.mp3';

// You can also transcribe a local file by passing in a file path
// const FILE_URL = './path/to/file.mp3';

// Request parameters where auto_highlights has been enabled
const data = {
  audio: FILE_URL,
  auto_highlights: true
}

const run = async () => {
  const transcript = await client.transcripts.transcribe(data);
  console.log(transcript.text);

  for (let result of transcript.auto_highlights_result.results) {
    console.log(
      `Highlight: ${result.text}, Count: ${result.count}, Rank: ${result.rank}`
    );
  }
};

export function onRequest(context) {
  return new Response("gjhfgfsdgfhgh")
}
