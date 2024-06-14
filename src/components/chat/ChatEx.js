import React, { useState, useEffect, useRef } from 'react';


const ChatEx = () => {
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        if (isConnected) {
            ws.current = new WebSocket('ws://localhost:8080/community/chattings');
            
            ws.current.onopen = () => {
                console.log('WebSocket connection established');
            };
            
            ws.current.onmessage = (event) => {
                setChat(prevChat => [...prevChat, event.data]);
            };
            
            return () => {
                ws.current.close();
            };
        }
    }, [isConnected]);

    const handleSend = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(`${userName} : ${message}`);
            setMessage('');
        }
    };

    return (
        <div className='chatEx'>
        <div className="container">
            <h1>채팅</h1>
            <div className="chating">
                {chat.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            
                <div id="yourName">
                    <table className="inputTable">
                        <tr>
                            <th>사용자명</th>
                            <th>
                                <input 
                                    type="text" 
                                    name="userName" 
                                    id="userName"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </th>
                            <th>
                                <button onClick={() => setIsConnected(true)} id="startBtn">
                                    이름 등록
                                </button>
                            </th>
                        </tr>
                    </table>
                </div>e
       
                <div id="yourMsg">
                    <table className="inputTable">
                        <tr>
                            <th>메시지</th>
                            <th>
                                <input 
                                    id="chatting" 
                                    placeholder="보내실 메시지를 입력하세요."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSend();
                                        }
                                    }}
                                />
                            </th>
                            <th>
                                <button onClick={handleSend} id="sendBtn">
                                    보내기
                                </button>
                            </th>
                        </tr>
                    </table>
                </div>
        
        </div>
        </div>
    );
};

export default ChatEx;