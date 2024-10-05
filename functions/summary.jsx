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

export async function onRequest(context) {
  const transcript = await client.transcripts.transcribe(data);
  let a = {texts: transcript.text, results: ""}
  for (let result of transcript.auto_highlights_result.results) {
   a.results = a.results + "\n" + result.count + "\n" + result.rank + ";"
 }
  return new Response(a)
}

import React from 'react';
import ReactDOM from 'react-dom/client';

function Hello(props) {
  return <h1>Hello World!</h1>;
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Hello />);
