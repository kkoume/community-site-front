import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import url from "../../config/url";
import Modal from "react-modal";

const ChatAside = (props) => {
  console.log(props.ws + "이거는 되나???");

    //멤버 초대
    const [inviteModalIsOpen, setInviteModalIsOpen ] = useState(false);
    const roomMakeHandler = (e)=>{
      e.preventDefault();
      setInviteModalIsOpen(true);
    }

    const roomDeleteHandler = (e)=>{
      e.preventDefault();
      setInviteModalIsOpen(false);
    }
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
            console.log(data.result);
           if(data.result != null){
              alert('생성되었습니다.')
              setInviteModalIsOpen(false);
              navigate(`/chat?room=${data.result}`)
           }
          })
          .catch(error => console.error('Error fetching user rooms:', error));
        }
       
    }

  console.log(props.ws+"이거는 되나???")
  
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authSlice);
  const [userRooms, setUserRooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  //socket으로 처리해보자 가보자고

  const searchParams = new URLSearchParams(location.search);
  var r = searchParams.get("room");
  if (r == null) {
    r = -1;
  }

  const ws = props.ws;

  const chatAll = props.chat;

  useEffect(() => {
    if (chatAll.length > 0) {
      const [nickname, time, roomNumber, text] =
        chatAll[chatAll.length - 1].split("*");
      if (roomNumber.trim() != r) {
        fetch(
          `${url.backendUrl}/chattingRoom?userName=` +
            authSlice.username +
            "&room=" +
            r
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data.result);
            setUserRooms(data.result);
          })
          .catch((error) => console.error("Error fetching user rooms:", error));
      }
    }
  }, [ws, chatAll]);


  useEffect(() => {
    console.log("너는 언제 실행되니?");
    fetch(
      `${url.backendUrl}/chattingRoom?userName=` +
        authSlice.username +
        "&room=" +
        r
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);
        setUserRooms(data.result);
      })
      .catch((error) => console.error("Error fetching user rooms:", error));
  }, [r]);

  //모달
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const customStyles = {
    content: {
      top: "40%",
      left: "53%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const openMemberHandler = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  //사용자 dm handler
  const [members, setMembers] = useState([]);

  const inserDmHandler = (e) => {
    console.log(e.target.value + "!");
    fetch(`${url.backendUrl}/searchDm?word=` + e.target.value)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);
        setMembers(data.result);
      })
      .catch((error) => console.error("Error fetching user rooms:", error));
  };
  //dm 상태 선택 핸들러
  const selectDmHandler = (e) => {
    console.log(e.target.textContent);
    document.getElementById("insertDM").value = e.target.textContent;
  };

  //dm 만들기 핸들러
  const makeDmHandler = (e) => {
    e.preventDefault();

    fetch(
      `${url.backendUrl}/makeDm?email=` +
        document.getElementById("insertDM").value +
        "&user=" +
        authSlice.username
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);

        if (data.result === 0) {
          alert("해당 이메일을 가진 사용자가 없습니다.");
        } else {
          window.location.href = `/chat?room=${data.result}`;
          location.reload();

          setModalIsOpen(false);
        }
      })
      .catch((error) => console.error("Error fetching user rooms:", error));
  };


  return (
    <>
      <aside>
        <h1>
          <Link to="/">
            <img src="/images/logo3.png" />
          </Link>
        </h1>

        <div className="chatMenu">
          <br />
          <br />
          <div>
            <Link className="chatLarge" to="/main">
              <img src="/images/dashboard_50.png"></img>DashBoard
            </Link>
          </div>
          <br />
          <br />
          <div>


           <Link onClick={roomMakeHandler} className='chatLarge'>
            <img src='/images/channel_50.png'></img>채널 <span>  + </span></Link><br/>
            {userRooms.map(room => (

              <>
                {room.status === 0 ? (
                  <Link
                    to={`/chat?room=${room.chatRoomPk}`}
                    key={room.chatRoomPk}
                  >
                    {room.roomName}{" "}
                    {room.newChat > 0 ? <>({room.newChat})</> : <></>}
                    <br />
                  </Link>
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
          <br />
          <br />
          <div>
            <Link className="chatLarge" onClick={openMemberHandler}>
              <img src="/images/dm_50.png"></img>DM <span>+</span>
            </Link>
            {userRooms.map((room) => (
              <>
                {room.status === 1 ? (
                  <Link
                    to={`/chat?room=${room.chatRoomPk}`}
                    key={room.chatRoomPk}
                  >
                    {room.roomName}{" "}
                    {room.newChat > 0 ? <>({room.newChat})</> : <></>}
                    <br />
                  </Link>
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        </div>
      </aside>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Invite Modal"
      >
        <h2>
          DM
          <button
            style={{ marginLeft: "230px", border: "none", fontSize: "20px" }}
            onClick={() => setModalIsOpen(false)}
          >
            X
          </button>
        </h2>
        <br />
        <form>
          <label>
            <br></br>
            <input
              id="insertDM"
              onChange={inserDmHandler}
              type="text"
              style={{ width: "100%", height: "40px" }}
              placeholder="사용자 이메일 입력"
            />
            <div
              className="DMdiv"
              style={{
                border: "1px solid gray",
                width: "100%",
                maxHeight: "100px",
                overflow: "scroll",
                marginTop: "2px",
              }}
            >
              {members.map((member) => (
                <p onClick={selectDmHandler} key={member.uid}>
                  {member.email}
                </p>
              ))}
            </div>
          </label>
          <br />
          <br />
          <br />
          <button
            type="submit"
            className="chatButtonp"
            onClick={makeDmHandler}
            style={{ marginLeft: "110px" }}
          >
            대화시작
          </button>
        </form>
      </Modal>


      <Modal
       isOpen={inviteModalIsOpen}
       onRequestClose={() => setInviteModalIsOpen(false)}
       style={customStyles}
       >
     
 
    <div style={styles.container}>
      <h2>채팅방 만들기 <button  style={{marginLeft: '230px', border: 'none', fontSize: '20px'}} onClick={() => setInviteModalIsOpen(false) }>X</button></h2>
      <form style={styles.form} onSubmit={submitHandler}>
      <br/>
      <br/>
        <label htmlFor="roomName">채팅방 이름:</label>
        <input type="text" id="roomName" name="roomName"   onChange={handleInputChange}  style={styles.input} />
        <button type="submit" style={styles.button}>채팅방 생성</button>
      </form>
    </div>
 
 
      </Modal>


    </>
  );
};

export default ChatAside;
