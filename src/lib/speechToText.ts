import { DeepgramClient } from "@deepgram/sdk";
import { PvRecorder } from "@picovoice/pvrecorder-node";

const DEEPGRAM_API_KEY = '9d4c40ebb0dfec93e4c44500882843336f228dd6';
if (!DEEPGRAM_API_KEY) {
  throw new Error("DEEPGRAM_API_KEY is not set");
}

const client = new DeepgramClient({ apiKey: DEEPGRAM_API_KEY! });

// Initialize deepgram connection
const connection = await client.listen.v1.connect({
  model: "nova-3",
  language: "en",
  punctuate: "true",
  interim_results: "false"
});

connection.connect();
await connection.waitForOpen();
console.log("Bridge connected. Listening for microphone input...");

// Start capturing microphone
const recorder = new PvRecorder(512);
const devices = PvRecorder.getAvailableDevices()
console.log(devices);
recorder.start();

// Asynchronously read text results from deepgram
(async () => {
    for await (const message of connection) {
        if (message.type === "Results" && message.is_final) {
            const text = message.channel.alternatives[0]?.transcript?.trim();
        if (text) {
            console.log("Transcribed:", text);
            // TODO: Handle transcripts and commands
        }
        }
    }
})();

// Send audio to deepgram
while (recorder.isRecording) {
    const frame = await recorder.read();
    const buffer = Buffer.from(frame.buffer, frame.byteOffset, frame.byteLength);
    connection.sendMedia(buffer);
    console.log("Sent audio to deepgram");
}