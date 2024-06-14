import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import url from "../../config/url";

const FindId = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [emailMessage, setEmailMessage] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeMessage, setEmailCodeMessage] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [showFindId, setShowFindId] = useState(false);
  const [findId, setFindId] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const inputEmail = (e) => {
    const currentEmail = e.target.value;
    setUser({ ...user, email: currentEmail });
    const emailPattern =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!emailPattern.test(currentEmail)) {
      setEmailMessage("올바른 이메일 주소를 입력해주세요.");
    } else {
      setEmailMessage("");
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();

    if (!user.email) {
      alert("이메일을 입력하세요.");
      return;
    }

    axios
      .get(url.backendUrl + "/findIdCheckEmail?email=" + user.email)
      .then((response) => {
        const result = response.data.result;
        const receivedCode = response.data.savedCode;
        setEmailMessage(result);
        setSavedCode(receivedCode);

        if (result === "이메일 전송에 성공하였습니다.") {
          alert("이메일이 성공적으로 전송되었습니다.");
          console.log("시스템 생성 code : " + receivedCode);
          setShowEmailCode(true);
        } else {
          alert("등록되지 않은 이메일 입니다.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEmailCode = (e) => {
    console.log("저장된 코드 : " + savedCode);

    e.preventDefault();

    axios
      .get(url.backendUrl + "/checkEmailCode", {
        params: {
          email: user.email,
          code: emailCode,
          scode: savedCode,
        },
        withCredentials: true,
      })
      .then((response) => {
        const result = response.data.result;
        setEmailCodeMessage(result);
        if (result === "인증 코드 인식에 성공하였습니다.") {
          setIsEmailVerified(true);
        } else {
          setIsEmailVerified(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    console.log(user);

    if (!isEmailVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    axios
      .get(url.backendUrl + "/findId", {
        params: {
          email: user.email,
          name: user.name,
        },
      })
      .then((response) => {
        const result = response.data.result;
        console.log("result : " + result);
        alert("아이디찾기 성공!");
        setShowFindId(true);
        setFindId(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const naviLogin = (e) => {
    navigate("/user/login");
  };

  const naviFindPw = (e) => {
    navigate("/user/findPw");
  };

  return (
    <div className="FindId">
      <div className="container">
        <div className="loginLogo">
          <img src="../images/logo.png" alt="" />
        </div>

        <ul className="links">
          <li>
            <Link to="/user/login" id="signin">
              SIGN IN
            </Link>
          </li>
          <li>
            <Link to="/user/terms" id="signup">
              SIGN UP
            </Link>
          </li>
          <li>
            <Link to="/user/findid" className="findId" id="findId">
              ID
            </Link>
          </li>
          <li>
            <Link to="/user/findpw" id="findPw">
              PASSWORD
            </Link>
          </li>
        </ul>

        <form onSubmit={submitHandler}>
          <div className="first-input input__block first-input__block">
            <input
              type="text"
              placeholder="name"
              className="name"
              name="name"
              value={user.name}
              onChange={changeHandler}
              required
            />
          </div>
          <div className="input__block">
            <div className="emailNum">
              <input
                type="email"
                placeholder="email"
                className="email"
                name="email"
                value={user.email}
                onChange={inputEmail}
              />
              <button
                type="button"
                className="btnEmail"
                onClick={handleSendEmail}
              >
                인증
              </button>
            </div>
            <span class="resultEmail">{emailMessage}</span>
          </div>
          {showEmailCode && (
            <div className="input__block">
              <div className="emailNum">
                <input
                  type="text"
                  placeholder="인증코드 입력"
                  className="email"
                  name="emailCode"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                />
                <button
                  type="button"
                  className="btnEmail"
                  onClick={handleEmailCode}
                >
                  확인
                </button>
              </div>
              <span class="resultEmailCode">{emailCodeMessage}</span>
            </div>
          )}
          <input
            type="submit"
            value="아이디 찾기"
            className="btnFindId"
            disabled={!isEmailVerified}
          />
        </form>
        {showFindId && (
          <div className="separator">
            <p>RESULT</p>
            <br />
            <p className="resultId">아이디 : {findId}</p>
            <br />
            <button type="button" className="btnLogin" onClick={naviLogin}>
              로그인
            </button>
            <button type="button" className="btnFindPw" onClick={naviFindPw}>
              비밀번호 찾기
            </button>
          </div>
        )}
      </div>
      <div className="loginImg">
        <img src="../images/login.png" alt="" />
      </div>
    </div>
  );
};

export default FindId;
