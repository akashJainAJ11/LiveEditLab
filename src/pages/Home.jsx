import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

const Home = () => {
    const navigate = useNavigate();
    const[roomid, setRoomId] = useState('');
    const[username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        toast.success('Created new room')
    }

    const joinRoom = () => {
        if(!roomid || !username){
            toast.error('ROOM ID & username is required')
            return;
        }

        navigate(`/editor/${roomid}`, {
            state: {
                username,
            }
        }); 
    }

    const handleInputEnter = (e) => {
        if(e.code === 'Enter'){
            e.preventDefault();
            joinRoom();
        }
    }
  return (
    <div className='flex items-center justify-center h-screen  '>
      <div className='max-w-md p-6 bg-white rounded-lg shadow-md flex flex-col '>
        <img src="./program-update-4665611-3868093.webp" alt="" className='mx-auto mb-4 w-36 h-36 '/>
        <h4 className='text-xl font-semibold mb-4 text-center'>Paste Invitation ROOM ID</h4>
        <div className='mb-4 '>
            <input type="text" className='w-full mb-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500' placeholder='ROOM ID' value={roomid} onChange={(e) => setRoomId(e.target.value)} onKeyUp = {handleInputEnter}/>
            <input type="text" className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)}  onKeyUp = {handleInputEnter}/>
        </div>
        <button className='w-full mb-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600' onClick={joinRoom}>Join</button>
        <span className='mt-2 block text-center'>
            Create your Own ROOM &nbsp;
            <a onClick={createNewRoom} href="" className='text-blue-500 hover:underline font-semibold'>newRoom</a>
        </span>
      </div>
    </div>
  )
}

export default Home
