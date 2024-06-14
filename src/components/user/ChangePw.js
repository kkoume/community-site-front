import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import url from "../../config/url";

const ChangePw = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const member = location.state?.user;

  const [user, setUser] = useState({
    uid: member,
    pass: "",
    pass2: "",
  });

  console.log(user);

  const [isChange, setIsChange] = useState(false);
  const [passMessage, setPassMessage] = useState("");

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };

  const inputPass = (e) => {
    const currentPass = e.target.value;
    setUser({ ...user, pass: currentPass });
    const passPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passPattern.test(currentPass)) {
      setPassMessage(
        "영문, 숫자, 특수문자를 조합하여 8자 이상으로 설정해 주세요."
      );
    } else {
      setPassMessage("올바른 비밀번호 입니다.");
    }
  };

  const passChange = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    axios
      .post(url.backendUrl + "/changePw", user, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const result = response.data;
        if (result === "비밀번호가 재설정 되었습니다.") {
          console.log(response.data);
          alert(response.data);
          navigate("/user/login");
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const isPassChange = passMessage === "올바른 비밀번호 입니다.";
    const isPassSame = user.pass === user.pass2;
    setIsChange(isPassChange && isPassSame);
  }, [user, passMessage]);

  return (
    <div className="ChangePw">
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
            <Link to="/user/findid" id="findId">
              ID
            </Link>
          </li>
          <li>
            <Link to="/user/findpw" id="findPw">
              PASSWORD
            </Link>
          </li>
        </ul>

        <form onSubmit={passChange}>
          <div className="first-input input__block first-input__block">
            <input
              type="password"
              placeholder="비밀번호"
              className="pass1"
              name="pass1"
              value={null}
              onChange={inputPass}
            />
            <span class="resultPass">{passMessage}</span>
          </div>
          <div className="input__block">
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="pass2"
              name="pass2"
              value={user.pass2}
              onChange={changeHandler}
            />
            {user.pass !== user.pass2 && (
              <span>비밀번호가 일치하지 않습니다.</span>
            )}
            {user.pass === user.pass2 && <span>비밀번호가 일치합니다.</span>}
          </div>
          <input
            type="submit"
            value="비밀번호 재설정"
            className="btnChangePw"
            disabled={!isChange}
          />
        </form>
      </div>
      <div className="loginImg">
        <img src="../images/login.png" alt="" />
      </div>
    </div>
  );
};

export default ChangePw;
