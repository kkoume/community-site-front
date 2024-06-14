import React, { useEffect, useState } from 'react';
import ChatLayout from '../../layouts/ChatLayout';
import ChatContent from '../../components/chat/ChatContent';
import createWebSocket from '../../config/createWebSocket';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const authSlice = useSelector((state) => state.authSlice);
  if(!authSlice.username){
    alert('잘못된 요청입니다. 로그인 후 이용해주세요.')
    window.location.href='/main';
  }
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const connectSocket = async () => {
      const socket = await createWebSocket(); 
      if (socket.onopen) {
        console.log('WebSocket connection succeed');
        setWs(socket);
        setIsConnected(true);
      }
    };

    connectSocket();
  }, []);

  useEffect(() => {
    if (isConnected) {
      ws.onmessage = (event) => {
        const message = event.data;
        console.log(message + "이건 왜돼22?");
        setChat(prevChat => [...prevChat, message]);
      }
    }
  }, [ws, isConnected]);

  return (
    isConnected ? (
      <ChatLayout ws={ws} chat={chat} >
        <ChatContent  ws={ws} chat={chat} />
      </ChatLayout>
    ) : (
      <div>Loading...</div>
    )
  );
};

export default ChatPage;