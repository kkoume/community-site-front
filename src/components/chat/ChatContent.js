import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FAILSAFE_SCHEMA } from 'js-yaml';
import url from '../../config/url';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import e from 'cors';


const ChatContent = ( props ) => {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);


  const [inviteEmail , setInviteEmail] = useState('');

  const inviteInputHandler = (e)=>{
    e.preventDefault();
    setInviteEmail(e.target.value);
  }

  //찐초대 핸들러
  const inviteSendHandler = (e)=>{
    e.preventDefault();
    fetch(`${url.backendUrl}/chatSearchUser?userEmail=`+document.getElementById('insertEmail').value+'&room='+r)
    .then(response => response.json())
    .then(data => {if(data.result==0){
        alert('해당 사용자가 없습니다.')
    }else if(data.result == -1){
      alert('이미 초대된 사용자입니다.')
    }else{
      alert('초대 되었습니다.')
    }setModalIsOpen(false);})
    .catch(error => console.error('Error fetching user rooms:', error));
  }
  
  const [invites, setInvites] = useState([]);
  const inserEmailHandler = (e)=>{
    console.log(e.target.value+"!")
    fetch(`${url.backendUrl}/searchDm?word=`+e.target.value)
    .then(response => response.json())
    .then(data => {
      console.log(data.result);
      setInvites(data.result);
  })
    .catch(error => console.error('Error fetching user rooms:', error));
  }

  const selectMemberHandler = (e)=>{
    document.getElementById('insertEmail').value = e.target.textContent;
  }

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  var r = searchParams.get('room'); 

  const [room , setRoom] = useState({});

  const [beforeChat, setBeforeChat] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [uploadStatus, setUploadStatus] = useState(0);
  const inviteHandler = (e) => {
    e.preventDefault();
    setModalIsOpen(true); // Open modal on invite button click
  }

  useEffect(() => {
    if (r != null) {
      setUploadStatus(0)
     fetch(`${url.backendUrl}/myRoom?room=`+r+'&userId='+authSlice.username)
        .then(response => response.json())
        .then(data => {setRoom(data.result)
          console.log(data.result + "룸 설정!");
        })
        .catch(error => console.error('Error fetching user rooms:', error));


        fetch(`${url.backendUrl}/beforeChat?room=`+r+'&userId='+authSlice.username)
        .then(response => response.json())
        .then(data => {setBeforeChat(data.result);
        fetch(`${url.backendUrl}/beforeChatRead?room=`+r+'&userId='+authSlice.username)
        .then(response => response.json())
        .then(data => {setUploadStatus(1); console.log(uploadStatus+"업로드 스테터스")})
      }

      )
        .catch(error => console.error('Error fetching user rooms:', error));
    }
  }, [r]);

  

  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };



  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authSlice);
  const [isConnected, setIsConnected] = useState(false);


  
  useEffect(() => {
    setUserName(authSlice.username);
    setIsConnected(true);
  }, [authSlice.username]);

 var ws =  props.ws;
  const chatAll = props.chat;


  useEffect(() => {
    if(ws.readyState === WebSocket.OPEN){

    }else{
      ws= new WebSocket(`wss://api.illrreumbow.store/community/chattings`);
    }

    if ( ws.onopen ) { 
      if (chatAll.length > 0) {
        const [nickname, time, roomNumber, text] = chatAll[chatAll.length - 1].split('*');
        if(nickname.trim()==='file'){
          console.log(chatAll[chatAll.length -1]);
          const [file , oName, sName, nickname , time, room, text] = chatAll[chatAll.length -1].split('*');
          console.log(room.trim())
          if(room.trim() === r){
            setChat(prevChat => [...prevChat, chatAll[chatAll.length - 1]]);
          }
        }
        if(roomNumber.trim() === r){
          console.log(chatAll[chatAll.length-1] + 'zzz');
          setChat(prevChat => [...prevChat, chatAll[chatAll.length - 1]]);
        }
      }
    }
  }, [ ws , chatAll ]);
  const [nowFile , setNowFile] = useState(null);

  const handleSend = () => {
    if (ws.onopen) {
      const time = getCurrentTime();
      if(nowFile != null){
       const formData = new FormData();
       formData.append('file', nowFile);
       formData.append('userName', userName);
       formData.append('time', time);
       formData.append('chatRoomPk', room.chatRoomPk);
       formData.append('message', message);
        var int = 0;
      console.log(formData)
     
       axios.post(`${url.backendUrl}/chat/fileUpload`, formData, {headers: {
        'Content-Type': 'multipart/form-data'
      }}).then((response)=>{
        console.log(response)
        int = response.data;
        console.log('sendNowNowNow!!')
        
        ws.send(`fileUpload*${int}`);
       }).catch((err)=>{
        console.log(err);
       })

      }else{
        console.log('here..22!')
      
          ws.send(`${userName}*${time}*${room.chatRoomPk}*${message}`);
    
      }
      setThumbnailPreview(null);
      setNowFile(null);
      setMessage('');
    }
  };

//멤버보기 기능


const [memberModalIsOpen, setMemberModalIsOpen] = useState(false);
const [members, setMembers] = useState([]);

const openMemberHandler = (e)=>{
  e.preventDefault();

  fetch(`${url.backendUrl}/chatMembers?room=`+r)
  .then(response => response.json())
  .then(data => {
    setMembers(data.result);
    setMemberModalIsOpen(true);
})
  .catch(error => console.error('Error fetching user rooms:', error));

}

  const customStyles = {
    content: {
      top: '40%',
      left: '53%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const navigate = useNavigate();

  //채팅방 나가기 기능
  const deleteChatHandler = (e)=>{
    e.preventDefault();
    if(window.confirm('정말로 나가겠습니까?')){
      fetch(`${url.backendUrl}/outChatRoom?userId=`+authSlice.username+'&room='+r)
      .then(response => response.json())
      .then(data => {if(data.result==0){
          alert('채팅방에 나갔습니다.');
          
          window.location.href = `/chat`;
          location.reload();
      }})
      .catch(error => console.error('Error fetching user rooms:', error));
    }
  }

  //멤버 초대
  const [inviteModalIsOpen, setInviteModalIsOpen ] = useState(false);
  
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '10px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      padding: '10px',
      marginBottom: '50px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    button: {
      padding: '13px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  const [roomName, setRoomName] = useState('');

  const handleInputChange = (e) => {
    setRoomName(e.target.value);}

  const submitHandler = (e)=>{
      e.preventDefault();
      if(window.confirm(`${roomName} 으로 생성하시겠습니까?`)){
        fetch(`${url.backendUrl}/chatRegister?userId=`+authSlice.username+'&chatName='+roomName)
        .then(response => response.json())
        .then(data =>   {
         if(data.result != null){
            alert('생성되었습니다.')
            navigate(`/chat?room=${data.result}`)
         }
        })
        .catch(error => console.error('Error fetching user rooms:', error));
      }
     
  }

  //파일...ㅋ
  const [thumbnail, setThumbnailPreview] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
      // Do something with the files
      if(acceptedFiles.length > 0 ) {
        setNowFile(acceptedFiles[0]);
        const file = acceptedFiles[0];
        const fileURL = URL.createObjectURL(file);
    

        const isImage = file.type.startsWith('image/'); //이미지인지 확인
        const thumbnailData = {
          url: isImage ? fileURL : null,
          name: file.name,
          size: file.size,
        };
        setThumbnailPreview(thumbnailData );
      }
    }, [])
    
    const thumNailHandler = (e)=>{
      setThumbnailPreview(null);
      setNowFile(null);
    }
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  
  return (
   
    <>
      {r === null ? (
        <div id="content">
          <div className='chatSelect'>
            <h1>채팅방을 선택해주세요</h1>
          </div>
        </div>
      ) : (
        <div id="content">
          {room.roomName && uploadStatus == 1 ? (
            <>
            <div className='chatTitle'>
              <h2 className="title"> {room.roomName} 
              <span className='chatBlank'></span>
              {room.status === 0 ? ( <span className='chatMember' onClick={inviteHandler}> 멤버 초대</span> ) : (<> </>)}
              {room.status === 0 ? ( <span className='chatMember' onClick={deleteChatHandler}> 채팅방 나가기</span> ) : (<> </>)}
              {room.status === 0 ? ( <span className='chatMember' onClick={openMemberHandler}> 멤버 보기</span> ) : (<> </>)}
              </h2>
              </div>
              <div id="chatting">
                <div className="chat">
                    {beforeChat.map((chats, index) => (
                      <div key={index}>
                      <p style={{marginLeft: '47%', fontSize: '20px'}}>{format(chats[0].localDateTime, 'yyyy-MM-dd')}</p>   
                      { chats.map((exChat, index)=>{
                        const nickname = exChat.userId;
                        const time =   format(exChat.localDateTime, 'yyyy-MM-dd HH:mm') ;
                        const [date, timePart] = time.trim().split(' ');
                        const text = exChat.message;
                        const oName = exChat.oname;

                        
                        return (
                          <div key={index}   className={exChat.status == 0 ? ('chat-unreadItem') : ('chat-item')}  >           
                            <div>
                              <img className="chat-image" src={url.backendUrl+'/chat/userImage?userId='+nickname.trim()} alt="로고" style={{ marginRight: "10px" }} />
                            </div>
                            <div className="chat-text">
                              <span>{nickname.trim() + ' '}</span>
                            <span>   {date === getCurrentDate() ? (
                                <>{timePart.trim()}</>
                              ) : (
                                <> <span>{date.trim()}</span></>
                              )}</span>
                              <p className="chat-textarea">
                                {text.trim()}
                                <br/>

                                {oName?<Link to={url.backendUrl+'/downloadFile?fileName='+exChat.sname}>{oName}</Link> :<></>
                                
                                }
                              </p>
                            </div>
                          </div>
                        );
                      })
  
                      }
                      </div>
                    ))}
                  


                  {chat.map((msg, index) => {
                    const [nickname, time, roomNumber, text] = msg.split('*');
                    const [date, timePart] = time.trim().split(' ');
                    if(nickname.trim() === "file"){
                      const [file , oName, sName,nickname, time, roomNumber, text] = msg.split('*');
                      const [date, timePart] = time.trim().split(' ');
                      if(roomNumber.trim () !== r){
                        return null;
                      }
                    
                      return (
                        <div key={index} className="chat-item">
                          <div>
                            <img className="chat-image" src={url.backendUrl+'/chat/userImage?userId='+nickname.trim()} alt="로고" style={{ marginRight: "10px" }} />
                          </div>
                          <div className="chat-text">
                            <span>{nickname.trim() + ' '}</span>
                            {date === getCurrentDate() ? (
                              <>{timePart.trim()}</>
                            ) : (
                              <> <span>{date.trim()}</span></>
                            )}
                            <p className="chat-textarea">
                              {text.trim()} <br/>
                              <Link to={`${url.backendUrl}/downloadFile?fileName=${sName.trim()}`} >{oName.trim()}</Link>
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (roomNumber.trim() !== r) {
                      return null;
                    }
               
                    return  (
                      <div key={index} className="chat-item">
                        <div>
                          <img className="chat-image" src={url.backendUrl+'/chat/userImage?userId='+nickname.trim()} alt="로고" style={{ marginRight: "10px" }} />
                        </div>
                        <div className="chat-text">
                          <span>{nickname.trim() + ' '}</span>
                          {date === getCurrentDate() ? (
                            <>{timePart.trim()}</>
                          ) : (
                            <> <span>{date.trim()}</span></>
                          )}
                          <p className="chat-textarea">
                            {text.trim()} 
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {thumbnail && (
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            {thumbnail.url != null?  <img src={thumbnail.url} alt={thumbnail.name} style={{ width: '30px', height: 'auto', objectFit: 'cover', marginRight: '10px' }} />
            : <></>}
         
          <span >{thumbnail.name} - {(thumbnail.size / 1024).toFixed(2)} KB</span>
          <span style={{marginLeft: '20px', fontWeight: 'bold'}} onClick={thumNailHandler} > X</span>
        </div>
      )}


              <div className="chatInsert" style={{ border: "1px solid black", padding: "10px", display: "flex", alignItems: "center" }}>
             <div {...getRootProps()} style={{width: '40px', border: '1px solid gray', textAlign: 'center'}}>    
             <input {...getInputProps()} />      
               <button className="chat-btn-attachment">+</button>
          
               </div>
               
                <input type="text" className="chat-input" value={message} placeholder="메시지 입력..." onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }} />
              
                <button onClick={handleSend} className="chat-btn-send">▶</button>
              </div>

           

              <br />
              <br />
        
            </>
          ) : (
            <p>Loading...</p>
          )}
          
        </div>
      )}
  
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Invite Modal"
      >
        <h2>멤버 초대   <button  style={{marginLeft: '170px', border: 'none', fontSize: '20px'}} onClick={() => setModalIsOpen(false) }>X</button></h2>
        <br/>
        <form onSubmit={inviteSendHandler}>
          <label>
            <input  id="insertEmail" type="text" onChange={inserEmailHandler} style={{width: '100%', height: '50px'}} placeholder='사용자 이메일 입력'/>
            <div className='inviteDiv' style={{border: '1px solid gray', width: '100%', maxHeight: '100px', overflow: 'scroll', marginTop: '2px'}}>
              {invites.map(member =>(
                <p  key={member.uid} onClick={selectMemberHandler} >{member.email}</p>
              )
              )}
            </div>
          </label>
          <br/>
          <br/>
          <br/>
          <button type="submit" className='chatButtonp'  style={{marginLeft: '130px'} }>초대</button>
        </form>
      </Modal>


      <Modal
        isOpen={memberModalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Invite Modal"
      >
        <h2>현재 멤버   <button  style={{marginLeft: '170px', border: 'none', fontSize: '20px'}} onClick={() => setMemberModalIsOpen(false) }>X</button></h2>
        <br/>
        {members.map((user, index) => (
            <p key={index}>{user.name}</p>
          ))}
   
      </Modal>

      <Modal
       isOpen={inviteModalIsOpen}
       onRequestClose={() => setInviteModalIsOpen(false)}
       >
      <div id='content'> 
    <br/>
    <br/>
    <br/>
    <div style={styles.container}>
      <h2>채팅방 만들기</h2>
      <form style={styles.form} onSubmit={submitHandler}>
      <br/>
      <br/>
        <label htmlFor="roomName">채팅방 이름:</label>
        <input type="text" id="roomName" name="roomName"   onChange={handleInputChange}  style={styles.input} />
        <button type="submit" style={styles.button}>채팅방 생성</button>
      </form>
    </div>
    <br/>
    <br/>
    <br/>
    </div>
      </Modal>

    </>
  );
};

export default ChatContent;
