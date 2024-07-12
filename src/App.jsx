import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'
function App() {
  // 2 variable for upload a file or record
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)


  //check if there's any thing, either file or record audio
  const isAudioAvailable = file || audioStream

  //a function allow user to re-take audio
  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
  }

  useEffect(() => {
    console.log(audioStream)
  }, [audioStream])

  return (
    <div className='flex flex-col max-w-[1000px]
    mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header/>
        {isAudioAvailable ? ( //if there's audio, display files
          <FileDisplay handleAudioReset={handleAudioReset} file={file} audioStream={audioStream}/>
        ) : (<HomePage setFile={setFile} setAudioStream={setAudioStream}/>)} //pass in setters as props

      </section>
      <h1 className='text-green-400'>hello</h1>
      <footer></footer>
    </div>
  )
}

export default App
