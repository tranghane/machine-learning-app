import React, {useState, useEffect, useRef} from "react";

export default function HomePage(props) {
  const { setAudioStream, setFile } = props; //get the props as function

  //some State variables
  const [recordingStatus, setRecordingStatus] = useState('inactive')
  const [audioChunks, setAudioChunks] = useState ([])
  const [duration, setDuration] = useState(0)

  //useState re-render the component when the state value change
  //useRef does not cause re-render when value change
  const mediaRecorder = useRef(null) //similar to useState
  const mimeType = 'audio/webm' //mimeType for media recorder

  async function startRecording() {
    let tempStream
    console.log('Start recording')

    //checks if the "MediaRecorder" object is available in the browser window.
    try {
      // request permission to access the user’s microphone
      const streamData = await navigator.mediaDevices.getUserMedia({ //miss the await
        audio: true,  
        video: false
      })
      tempStream = streamData
    }catch (err) {
      console.log(err.message)
      return
    }

    setRecordingStatus('recording')

    //create new media recorder instance using the stream
    const media = new MediaRecorder(tempStream, {type: mimeType})

    mediaRecorder.current = media //assign the recorder

    //start recording
    mediaRecorder.current.start()
    let localAudioChunks = []

    //ondataavailable event, fires when audio data becomes available during recording
    mediaRecorder.current.ondataavailable = (event) => {
      //case where there's no data
        if (typeof event.data === 'undefined') {return}
        if (event.data.size === 0) {return}
        localAudioChunks.push(event.data)
    }
    setAudioChunks(localAudioChunks)
  }

  async function stopRecording() {
    //notify that stop recording
    setRecordingStatus('inactive')
    console.log('Stop recording')


    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      //creating a blob from the audio chunks
      const audioBlob = new Blob(audioChunks, {type: mimeType})
      setAudioStream(audioBlob)
      setAudioChunks([]) //reset to default value
      setDuration(0)
    }

  }

  //to see how long user have recorded
  useEffect(() => {
    if (recordingStatus === 'inactive') {return}

    //interval increase every seconds
    const interval = setInterval(() => {
      setDuration(curr => curr + 1) //keep increasing
    }, 1000)

    return () => clearInterval(interval)

  }) 


  return (
    <main
      className="flex-1 p-4 flex flex-col gap-3 sm:gap-4
         justify-center text-center pb-20"
    >
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        <span>Sugoi</span>
        <span className="text-blue-400">Speech</span>
        <span className="text-purple-500">Scribe</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Record <span className="text-blue-500">&rarr; </span>
        Transribe <span className="text-blue-500">&rarr; </span>
        Translate
      </h3>
      <button
        onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
        className="flex items-center text-base justify-between 
                                gap-4 mx-auto w-72 max-w-full my-4
                                specialBtn px-4 py-2 rounded-xl"
      >
        <p className="text-blue-400">{recordingStatus === 'inactive' ? 'Record' : 'Stop recording'}</p>
        <div className="flex items-center gap-2">
          {duration !== 0 && (
            <p className="text-sm "> {duration}s</p>
          )}
          <i className={"fa-solid fa-microphone-lines duration-200 " + (recordingStatus === 'recording' ? ' text-rose-300' : ' ')}></i>
        </div>
      </button>
      <p className="text-base">
        Or{" "}
        <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">
          upload{" "}
          <input
            onChange={(e) => {
              //if the upload has changed, aka a file was uploaded, get that file
              const tempFile = e.target.files[0];
              //and store that file using setFile in useState, app.jsx
              setFile(tempFile);
            }}
            className="hidden"
            type="file"
            accept=".mp3, .wave"
          />
        </label>{" "}
        a mp3 file
      </p>
      <p className="italic text-slate-400"> pour honey in one's ear </p>
    </main>
  );
}
