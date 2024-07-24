import React, { useState, useEffect, useRef } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information(props) {
  const { output } = props;
  const [tab, setTab] = useState("transcription");

  //for translation
  const [translation, setTranslation] = useState(null);
  const [translating, setTranslating] = useState(null);
  const [toLanguage, setToLanguage] = useState("Select Language");

  const worker = useRef();

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../utils/translate.worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = async (e) => {
      switch (e.data.status) {
        case "initiate":
          console.log("DOWNLOADING");
          break;
        case "progress":
          console.log("LOADING");
          break;
        case "update":
          setTranslation(e.data.output);
          console.log(e.data.output);
          break;
        case "complete":
          setTranslating(false);
          console.log("DONE");
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  //to pass down to Transciption component
  const textElement =
    tab === "transcription"
      ? output.map((val) => val.text)
      : translation || "No Translation";
  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }
  function handleDownload() {
    const element = document.createElement("a")
    const file = new Blob([textElement], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `sugoispeechscribe.txt`
    document.body.appendChild(element)
    element.click()
}
  function generateTranslation() {
    if (translating || toLanguage === "Select language") {
      return;
    }

    //start the translating
    setTranslating(true);

    worker.current.postMessage({
      text: output.map((val) => val.text),
      src_language: "eng_Latn",
      tgt_lang: toLanguage,
    });
  }

  return (
    <main
      className="flex-1 p-4 flex flex-col gap-3 sm:gap-4
         justify-center text-center pb-20 max-w-prose w-full mx-auto"
    >
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        {/* <span>Sugoi</span><span className='text-blue-400'>Speech</span><span className='text-purple-500'>Scribe</span> */}
        <span className="text-blue-400">Your </span>
        <span className="text-purple-500">Transcription</span>
      </h1>
      <div
        className="grid grid-cols-2 mx-auto bg-white
       shadow rounded-full overflow-hidden items-center"
      >
        <button
          onClick={() => {
            setTab("transcription");
          }}
          className={
            "px-4 duration-200 py-2 " +
            (tab === "transcription"
              ? " bg-blue-300 text-white"
              : " text-blue-400 hover:text-blue-600")
          }
        >
          Transcription
        </button>
        <button
          onClick={() => {
            setTab("translation");
          }}
          className={
            "px-4 duration-200 py-2  " +
            (tab === "translation"
              ? " bg-blue-300 text-white"
              : " text-blue-400 hover:text-blue-600")
          }
        >
          Translation
        </button>
      </div>
      <div className="my-8 flex flex-col">
        {tab === "transcription" ? (
          <Transcription {...props} textElement={textElement} />
        ) : (
          <Translation
            {...props}
            toLanguage={toLanguage}
            translating={translating}
            textElement={textElement}
            setTranslating={setTranslating}
            setTranslation={setTranslation}
            setToLanguage={setToLanguage}
            generateTranslation={generateTranslation}
          />
        )}
      </div>
      <div className="flex items=center gap-4 mx-auto">
        <button
          onClick={handleCopy}
          title="Copy"
          className="bg-white hover:text-blue-500 duration-200 text-blue-300 px-2 rounded aspect-square grid place-items-center"
        >
          <i className="fa-solid fa-copy"></i>
        </button>
        <button
          onClick={handleDownload}
          title="Dowload"
          className="bg-white hover:text-blue-500 duration-200 text-blue-300 px-2 rounded aspect-square grid place-items-center"
        >
          <i className="fa-solid fa-download"></i>
        </button>
      </div>
    </main>
  );
}
