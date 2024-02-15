import React, { useEffect, useRef, useState } from 'react'
import Editor from '../components/Editor';
import Clients from '../components/Clients';
import { initSocket } from '../socket';
import toast from "react-hot-toast"
import ACTIONS from '../Actions';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom'
 
const EditorPage = () => {
  const codeRef = useRef(null)
  const socketRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const reactNavigator = useNavigate();

  const[clients, setClients] = useState([]);

  
  useEffect( () => {
    const init = async() => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(err) {
        console.log('socket error: ' + err);
        toast.error('Socket connection failed, try again later');
        reactNavigator('/')
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
        if(username !== location.state?.username){
          toast.success(`${username} joined the room`);
          console.log(`${username} joined the room`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        })
          
      })


      socketRef.current.on(ACTIONS.DISCONNECTED, ({username, socketId}) => {
          toast.success(`${username} left the room`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          });

      })
    }
    init()
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, [])


  async function copyRoomID(){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied successfully')
    } catch (error) {
      toast.error('Could not Copy Room ID');
    }
  }

  function leaveRoom(){
    reactNavigator('/')
  }


  if(!location.state){
    return <Navigate to='/'/>
  }
  
  return (
    <div className='flex h-screen'>
      <div className='bg-gray-700 w-1/5 flex flex-col'>
        <div className='flex flex-col items-center mb-4 mt-4'>
          <img src="/program-update-4665611-3868093.webp" alt="" className='mb-4 w-36 h-36' />
          <h3 className='text-white text-lg font-semibold mt-2'>Connected</h3>
          <div className='flex flex-wrap overflow-x-auto'>
            {clients.map((client) => (
              <Clients key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-auto w-full mb-4' onClick={copyRoomID}>COPY ROOM ID</button>
        <button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-2 w-full mb-4' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='bg-gray-700 flex-1 flex flex-col overflow-y-auto'>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current = code}}/>
      </div>
    </div>
  );
  
};

export default EditorPage;
