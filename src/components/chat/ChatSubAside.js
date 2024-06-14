import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const ChatAside = () => {
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authSlice);
  const [userRooms, setUserRooms] = useState([]);

  useEffect(() => {

      fetch('http://localhost:8080/community/chattingRoom?userName='+authSlice.username)
          .then(response => response.json())
          .then(data =>   {
            
            console.log(data.result);
            setUserRooms(data.result);

          })
          .catch(error => console.error('Error fetching user rooms:', error));
  }, []); 


  return (
    <>
    <aside class="chatside">
    <div class="sideBar">
      <div>
        <p >채널</p><br></br>
        <a href="#">새로만들기</a> <br/>
        {userRooms.map(room => (
         <Link to={`/chat?room=${room.chatRoomPk}`} key={room.chatRoomPk}>
          {room.roomName}<br/>
            </Link>
          ))}
    
        </div>
      <div>
        <a href="#">다이렉트 메세지</a>
      </div>
    </div>
  </aside>
  </>
  )
}

export default ChatAside;