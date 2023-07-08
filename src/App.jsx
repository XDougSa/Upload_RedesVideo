import Webcam from "react-webcam"
import Peer from "peerjs"
import { useEffect, useState, useRef } from "react"
export default function App() {
  const [peer, setPeer] = useState();
  const [id, setId] = useState();
  const [video, setVideo] = useState();
  const localvideo = useRef(null);
  const remotevideo = useRef(null);
  useEffect(() => {
    let conection = new Peer();
    setPeer(conection)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localvideo.current.srcObject = stream
        setVideo(stream)

        conection.on("open", userId => {
          console.log(userId)
          setId(userId)
          conection.on("call", call => {
            call.answer(stream)
            call.on("stream", remoteStream => {
              remotevideo.current.srcObject = remoteStream
            })
          })
        })
      })
  }, [])

  function iniciarCall(e) {
    e.preventDefault();
    let pessoa1 = document.getElementById("pessoa1").value
    let call = peer.call(pessoa1, video)
    call.on("stream", remoteStream => {
      remotevideo.current.srcObject = remoteStream
    })
  }
  return (

    < div className="grid justify-items-stretch" >


      <div className="flex w-1/2 justify-self-center">
        <div className="grid h-80 flex-grow card bg-base-300 rounded-box place-items-center">
          <video width="400px" height="400px" ref={remotevideo} autoPlay />

        </div>
        <div className="divider divider-horizontal">OR</div>
        <div className="grid h-80 flex-grow card bg-base-300 rounded-box place-items-center">
          <Webcam width="400px" height="400px" ref={localvideo} audio={false} />
          <form onSubmit={iniciarCall}>

            <input type="text" id="pessoa1" placeholder="Digite o ID da chamada" className="input input-bordered input-secondary w-full max-w-xs" />
            <input type="submit" value="Conectar" className="btn btn-primary" />
          </form>
          <p className="text-white">
            {id}
          </p>
        </div>
      </div>



    </div >
  )
}
