"use client"
import react, { useState, useRef } from "react";
import { IoReload } from "react-icons/io5";
import { SlReload } from "react-icons/sl";
import { FaRegFolderClosed } from "react-icons/fa6";
import { UploadHandler } from "@/handlers/upload.handler";
import { FaRegFileAlt } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { Dropzone, ExtFile, FileMosaic, readAsArrayBuffer } from "@dropzone-ui/react";
import UploadProgress from "@/components/UploadProgress";
import { useRouter } from 'next/navigation'
import { clear } from "console";
import Header from "@/components/Header";
import AudioPlayer from "@/components/Audio.Player/AudioPlayer";
import { useSelector } from 'react-redux';
import { RootState } from "@/Redux/store"

// interface ExtFile extends File {
//   fileType: string; // additional property to store the file type
//   fileUrl: string;
// }

export default function TextToSpeech() {

  const user = useSelector((state: RootState) => state?.user)

  const [text, setText] = useState("");
  const [uploadProgress, setuploadProgress] = useState<number>(0);
  const [isVoices, setVoices] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [volume, setVolume] = useState(50);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(50);
  const [toggle, setToggle] = useState(true);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [buttonHTML, setButtonHTML] = useState(
    <div className="flex items-center justify-center">
      <FaPlay color="white" />
      <h2 className="ml-3">CONVERT TO SPEECH</h2>
    </div>
  );
  const [menuToggle, setMenuToggle] = useState(false);

  const [freq, setFreq] = useState(48000);
  // const [files, setFiles] = useState<File[]>([]);
  const [file, setFile] = useState(null) || "";
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState('');
  const [modifiedContent, setModifiedContent] = useState('');

  // const handleFileChange = (e: any) => {
  //   const file = e.target.files[0];
  //   setFiles(file);
  //   console.log(file)
  //   const reader = new FileReader();
  //   reader.readAsText(file);

  //   reader.onload = () => {
  //     // setFileName(file.name);
  //     setFileContent(reader.result)
  //     setIsPreview((prev) => !prev)
  //   }
  // }

  const handleFileChange = (e: any) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile) {
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onload = (event: any) => {
        setFileContent(event.target.result);
      };
      setIsPreview((prev) => !prev)
      reader.readAsText(uploadedFile);
    }
  };
  const handleProgressUpdate = (progress: number) => {
    setuploadProgress(progress)
  }

  const readFileDataAsBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsArrayBuffer(file);

    });
  };

  const handleSaveFile = async () => {
    const blob = new Blob([modifiedContent], { type: 'text/plain' });
    const modifiedFile = new File([blob], "modifiedFile", { type: 'text/plain' });
    console.log(modifiedFile)
    const uploadPath = `${user?.userData?._id}/text-to-speech/${new Date().toDateString()}/${new Date().getTime()}`
    console.log(blob);
    const url = URL.createObjectURL(blob);
    console.log("URL generated is :", url);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modified_file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    const buffer = await readFileDataAsBuffer(modifiedFile);
    const uploader = new UploadHandler(modifiedFile, uploadPath)
    console.log({ buffer })
    const fileUrl = await uploader.upload(buffer, handleProgressUpdate);
    console.log({ fileUrl });

  };

  const handleTextAreaChange = (e: any) => {
    setFileContent(e.target.value)
    setModifiedContent(e.target.value);
  };

  function handleVolumeChange(event: any) {
    setVolume(event.target.value);
  }
  function handleSpeedChange(event: any) {
    setSpeed(event.target.value);
  }
  function handlePitchChange(event: any) {
    setPitch(event.target.value);
  }
  // function handleClick1() {
  //   setToggle(true);
  // }
  // function handleClick2() {
  //   setToggle(false);
  // }
  // const handleUploadFile = async (incommingFiles: ExtFile[]) => {
  //   setFiles(incommingFiles);
  //   setIsFileSelected((prev) => !prev);
  // }
  function handleLoader() {
    setButtonHTML(
      <div className="flex items-center justify-center">
        <div className="ml-1 h-2 w-2 rounded-full bg-white"></div>
        <div className="ml-1 h-4 w-4 rounded-full bg-white"></div>
        <div className="ml-1 h-2 w-2 rounded-full bg-white"></div>
      </div>);

    setTimeout(() => {
      setButtonHTML(<h2>DOWNLOAD SPEECH</h2>);
    }, 2000);
  }



  const handleIsVoices = () => {
    setVoices((prev) => !prev)
  }
  function handleMenu() {
    let val = menuToggle;
    setMenuToggle(!val);
  }
  const handleFreq = (f: any) => {
    setFreq(f);
    setMenuToggle(prev => !prev)

  }
  const stop = function (e: any) {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  document.querySelectorAll('input[type="range"]').forEach((input) => {
    // input['draggable'] = true;
    input.addEventListener('dragstart', stop);
  });

  const renderDropzone = () => {
    return (
      <div className="bg-[#5B5959] w-full h-80 border-dashed border-2 border-white justify-center items-center flex rounded-2xl">
        <div className="flex justify-center pl-16 pr-0">
          <input type="file" onChange={handleFileChange} /></div>
      </div>
      //  <div className="bg-[#5B5959] w-full h-80 border-dashed border-2 border-white justify-center items-center flex flex-col rounded-2xl mx-auto">
      //   <Dropzone
      //     minHeight="20rem"
      //     color="#fff"
      //     header={false}
      //     footer={false}
      //     onChange={onClickUpload}
      //     value={files}
      //     maxFiles={1}
      //     maxFileSize={500 * 1024 * 1024}
      //     accept={"video/*"}
      //   >
      //     {/* {files.map((file) => (
      //       <FileMosaic
      //         {...file}
      //         key={file.id}
      //         preview
      //       />
      //     ))} */}
      //   </Dropzone>
      // </div>
    )
  }

  return (
    <>
      <Header />
      <div className="bg-black w-full mx-auto md:w-[90%] xl:w-[95%] h-full flex flex-col gap-2">
        <div className="text-white mx-auto sm:mx-0 w-[90%] md:w-1/4 p-4 rounded  bg-[#252427]">
          <div className="flex gap-4">
            <FaRegFolderClosed size={20} />
            <input type="text" placeholder="Enter project name" />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row w-full gap-4">
          <div className=" mx-auto flex flex-col w-full xl:w-2/3 xl:min-h-[65vh] rounded-xl">

            <div className="flex items-center space-x-4 h-18 w-[90%] rounded-md sm:w-full mx-auto p-5 bg-[#252427]">
              <IoReload size={20} className="text-white" />
              <SlReload size={20} className="text-white" />

              {/* <div className="flex" onClick={handleUploadFile}> */}
              <span className="gap-1 flex items-center">
                <FaRegFileAlt className="text-white" size={20} />
                <p className="text-white ml-3" onClick={() => setIsFileSelected((prev) => !prev)}>Import text</p>
              </span>

            </div>


            <hr className="border w-[90%] sm:w-full mx-auto border-gray-500" />

            {!isFileSelected ?
              (
                <textarea placeholder="Type, import, choose a voice. We'll do the rest, turning your words into an enchanting voice experience. Ready for the magic?"
                  onChange={handleTextAreaChange} className="min-h-[50vh] w-[90%] sm:w-full h-full mx-auto resize-none p-5 text-white rounded-md bg-[#252527]">
                </textarea>
              )
              :
              (
                isPreview ? (
                  <>
                    <h1>{fileName}</h1>
                    <textarea onChange={handleTextAreaChange} value={fileContent} className="min-h-[50vh] w-[90%] mx-auto xl:w-full h-full resize-none p-5 text-white rounded-md bg-[#252527]">{fileContent}</textarea>
                    <button onClick={() => handleSaveFile()}>Modify</button>
                  </>
                ) :
                  (
                    <div className='h-full w-[80%] mx-auto flex flex-col text-white'>
                      <div className='w-[90%] bg-gradient-to-r from-[#7F7EFE] to-[#C96AEF] mx-auto my-8 rounded-2xl py-4 px-24 text-xl text-center '>
                        <h1 className=''>Add file<br />Upload text file to convert to speech</h1>
                      </div>
                      {renderDropzone()}
                    </div>
                  )


              )
            }
          </div>

          <div className=" text-black p-4 rounded-md w-[90%] sm:w-full mx-auto xl:w-1/3 min-h-[50vh] xl:min-h-[65vh] bg-[#252427]">

            <div className="flex flex-col justify-center items-center w-full">

              <div className="text-white flex justify-between items-center w-full mx-auto">
                <div className='border-b-2 border-grey-500 xl:px-16 py-3' onClick={handleIsVoices}>Volume Settings</div>
                <div className='border-b-2 border-grey-500 xl:px-16 py-3' onClick={handleIsVoices}>Voice Settings</div>
              </div>
              {isVoices ?
                (
                  <div className="text-white hover:text-gray-300 justify-center items-center w-full h-full">


                    <div className="flex flex-wrap gap-8">
                      <div>
                        <img className="mb-2 h-18 w-12 rounded-full" src="https://m.media-amazon.com/images/M/MV5BMTU2NTg1OTQzMF5BMl5BanBnXkFtZTcwNjIyMjkyMg@@._V1_FMjpg_UX1000_.jpg" />
                        <button className="border flex border-gray-500 items-center">

                          <FaPlay color="white" />
                          <h3 className="ml-2">Audio01</h3>

                        </button>
                      </div>
                      <div>
                        <img className="mb-2 h-18 w-12 rounded-full" src="https://m.media-amazon.com/images/M/MV5BMTU2NTg1OTQzMF5BMl5BanBnXkFtZTcwNjIyMjkyMg@@._V1_FMjpg_UX1000_.jpg" />
                        <button className="border flex border-gray-500 items-center">

                          <FaPlay color="white" />
                          <h3 className="ml-2">Audio01</h3>

                        </button>
                      </div>
                      <div>
                        <img className="mb-2 h-18 w-12 rounded-full" src="https://m.media-amazon.com/images/M/MV5BMTU2NTg1OTQzMF5BMl5BanBnXkFtZTcwNjIyMjkyMg@@._V1_FMjpg_UX1000_.jpg" />
                        <button className="border flex border-gray-500 items-center">

                          <FaPlay color="white" />
                          <h3 className="ml-2">Audio01</h3>

                        </button>
                      </div>
                      <div>
                        <img className="mb-2 h-18 w-12 rounded-full" src="https://m.media-amazon.com/images/M/MV5BMTU2NTg1OTQzMF5BMl5BanBnXkFtZTcwNjIyMjkyMg@@._V1_FMjpg_UX1000_.jpg" />
                        <button className="border flex border-gray-500 items-center">

                          <FaPlay color="white" />
                          <h3 className="ml-2">Audio01</h3>

                        </button>
                      </div>

                    </div>

                  </div>
                )
                :
                (
                  <div className="text-white hover:text-gray-300 flex flex-col  justify-center items-center w-full gap-8">
                    <div className="slider flex flex-col w-full p-4">

                      <h1 className="p-3 white">Voice Volume</h1>
                      <div className="flex w-full justify-center items-center">
                        <input className="w-full" type="range" min="0" max="100" step="1" onChange={handleVolumeChange}></input>
                        <h2 className="text-center justify-center ml-4 p-2 h-10 w-16 text-black bg-white rounded-md">{volume}%</h2>
                      </div>

                      <h1 className="p-3 white">Voice Speed</h1>
                      <div className="flex w-full justify-center items-center">
                        <input className="w-full" type="range" min="0" max="2.0" step="0.25" onChange={handleSpeedChange}></input>
                        <h2 className="text-center justify-center ml-4 p-2 h-10 w-16 text-black bg-white rounded-md">{speed}X</h2>
                      </div>

                      <h1 className="p-3 white">Voice Pitch</h1>
                      <div className="flex w-full justify-center items-center">
                        <input className="w-full" type="range" min="0" max="100" step="1" onChange={handlePitchChange}></input>
                        <h2 className="text-center justify-center ml-4 p-2 h-10 w-16 text-black bg-white rounded-md">{pitch}%</h2>
                      </div>
                    </div>

                    <div className="w-full">
                     <div className="flex justify-between"> <h1 className="text-white">Audio Settings</h1>
                      <button onClick={handleMenu}>
                          <h2 className="text-[#8885B2]">Change</h2>
                        </button></div>
                      <div className="flex justify-between mt-4 mb-6">
                        <div className="flex-col">
                          <h2>MP3 - {freq}Hz</h2>
                          {menuToggle && <ul>
                            <li onClick={() => handleFreq(24000)}>24000 Hz</li>
                            <li onClick={() => handleFreq(36000)}>36000 Hz</li>
                            <li onClick={() => handleFreq(48000)}>48000 Hz</li>
                          </ul>}
                        </div>

                        
                      </div>

                    </div>
                  </div>

                )
              }

              <button onClick={handleLoader} className="w-full h-10 text-white rounded-md bg-[#B76FEC]">
                {buttonHTML}
              </button>
            </div>
          </div>

        </div>

        {/* <div className="w-2/3 bg-red-200 flex items-center p-3 justify-between">
          <h1>Listen to the T-Rex:</h1>
          <span className="w-2/3 bg-blue-300"><audio controls src="/media/cc0-audio/t-rex-roar.mp3" /></span>
          <a href="/media/cc0-audio/t-rex-roar.mp3"> Download audio </a>
        </div> */}

        <div className="py-4 my-4 bg-[#252427] rounded-md w-[90%] sm:w-full mx-auto">
          <AudioPlayer />
        </div>

      </div>
    </>
    // </div>
  )
}
