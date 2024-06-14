import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChatRegister = () => {

  const authSlice = useSelector((state) => state.authSlice);
  const [roomName, setRoomName] = useState('');

  const handleInputChange = (e) => {
    setRoomName(e.target.value);}

  const navigate = useNavigate();
  const submitHandler = (e)=>{
      e.preventDefault();
      if(window.confirm(`${roomName} 으로 생성하시겠습니까?`)){
        fetch('http://localhost:8080/community/chatRegister?userId='+authSlice.username+'&chatName='+roomName)
        .then(response => response.json())
        .then(data =>   {
          console.log(data.result);
         if(data.result != null){
            alert('생성되었습니다.')
            navigate(`/chat?room=${data.result}`)
         }
        })
        .catch(error => console.error('Error fetching user rooms:', error));
      }
     
  }


  return (
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
  );
};

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

export default ChatRegister;