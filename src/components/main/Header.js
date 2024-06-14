import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import url from "../../config/url";
import createWebSocket from "../../config/createWebSocket";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import axios from "axios";

const Header = (props) => {
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authSlice);

  const [user, setUser] = useState({
    uid: "",
    grade: "",
  });

  //알림
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  var r = searchParams.get("room");
  if (r == null) {
    r = -1;
  }

  var ws = props.ws;
  var [chatAll, setChatAll] = useState([]);
  if (ws != null) {
    chatAll = props.chat;
  }

  useEffect(() => {
    if (ws == null) {
      if (authSlice.username) {
        ws = createWebSocket();
      }
    }
    if (ws != null) {
      ws.onmessage = (event) => {
        r = searchParams.get("room");
        const message = event.data;
        setChatAll((prevChat) => [...prevChat, message]);
        console.log(chatAll.length);
      };
    }
  }, [ws]);

  useEffect(() => {
    console.log(r);
    if (chatAll.length > 0) {
      const [nickname, time, roomNumber, text] =
        chatAll[chatAll.length - 1].split("*");
      if (roomNumber.trim() != r) {
        fetch(
          `${url.backendUrl}/chatAlarm?userName=` +
            authSlice.username +
            "&r=" +
            r
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data.result);
            document.getElementById("chatchat").textContent = data.result;
          })
          .catch((error) => console.error("Error fetching user rooms:", error));
      }
    }
  }, [chatAll]);

  useEffect(() => {
    fetch(
      `${url.backendUrl}/chatAlarm?userName=` + authSlice.username + "&r=" + r
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);
        document.getElementById("chatchat").textContent = data.result;
      })
      .catch((error) => console.error("Error fetching user rooms:", error));
  }, [r]);

  useEffect(() => {
    fetch(
      `${url.backendUrl}/chatAlarm?userName=` + authSlice.username + "&r=" + r
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);
        document.getElementById("chatchat").textContent = data.result;
      })
      .catch((error) => console.error("Error fetching user rooms:", error));
  }, []);

  const navigate = useNavigate();

  const logoutHandler = () => {
    if (ws) {
      console.log(ws);
      ws.close();
    }
    dispatch(logout());
    navigate("/main");
  };

  const memberHandler = async () => {
    try {
      const response = await axios.get(
        `${url.backendUrl}/user/${authSlice.username}`
      );
      if (response.data) {
        navigate("/user/mypage", { state: { user: response.data } });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const planHandler = async () => {
    navigate("/user/tierplan");
  };

  return (
    <>
      <header>
        <div>
          <div className="navRight">
            {authSlice.userRole === "ROLE_ADMIN" ? (
              <Link to="/admin?cate=user">
                <img src="/images/setting_50.png" alt="bell" />
                <p>관리자</p>
              </Link>
            ) : (
              <></>
            )}

            <Link to="/chat">
              <img src="/images/chat_50.png" alt="bell" />
              <p>채팅</p>
            </Link>
            <Link to="/chat">
              <img src="/images/alarm_40.png" alt="bell" />
              <p className="alert" id="chatchat">
                0
              </p>
            </Link>

            {!authSlice.username ? (
              <>
                <Link to="/user/login">
                  <img src="/images/user_50.png" alt="user" />
                  <p>로그인</p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/user/logout" onClick={logoutHandler}>
                  <img src="/images/user_50.png" alt="user" />
                  <p>로그아웃</p>
                </Link>
                <Link to="/user/mypage" onClick={memberHandler}>
                  <p>회원수정</p>
                </Link>
                <Link to="/user/tierplan" onClick={planHandler}>
                  <p>멤버십플랜</p>
                </Link>
              </>
            )}
            <Link to="/user/terms">
              <img src="/images/join_50.png" alt="user" />
              <p>회원가입</p>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
