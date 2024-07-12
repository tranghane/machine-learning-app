import { useState, useRef, useEffect } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcribing";
import { MessageTypes } from "./utils/presets";
function App() {
  // 2 variable for upload a file or record
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloading, setDownloading] = useState(false);

  //check if there's any thing, either file or record audio
  const isAudioAvailable = file || audioStream;

  //a function allow user to re-take audio
  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  const worker = useRef(null);
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.js", import.meta.url, {
          type: "module",
        })
      );
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case "DOWNLOADING":
          setDownloading(true);
          console.log("downloading");
          break;
        case "LOADING":
          setLoading(true);
          console.log("loading");
          break;
        case "RESULT":
          setOutput(e.data.results);
          break;
        case "INFERENCE_DONE":
          setFinished(true);
          console.log("done")
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListener('message', onMessageReceived)
  }, []);


  async function readAudioFrom(file) {
    const sampling_rate = 1600;
    const audioCTX = new AudioContext({sampleRate: sampling_rate});
    const response = await file.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {return}
    let audio = await readAudioFrom(file ? file : audioStream)
    const model_name = 'openai/whisper-tiny.en';

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio ,
      model_name 
    })
  }

  return (
    <div
      className="flex flex-col max-w-[1000px]
    mx-auto w-full"
    >
      <section className="min-h-screen flex flex-col">
        <Header />
        {output ? (
          <Information />
        ) : loading ? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay
            handleAudioReset={handleAudioReset}
            file={file}
            audioStream={audioStream}
          />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}

        {/* pass in setters as props */}
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
