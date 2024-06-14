import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../slices/authSlice";
import url from "../../config/url";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    uid: "",
    pass: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(url.backendUrl + "/user/login", user)
      .then((resp) => {
        console.log(resp.data);

        // 리덕스 액션 실행
        dispatch(login(resp.data));

        // 메인 전환
        navigate("/main");
      })
      .catch((err) => {
        console.log(err);
        alert("가입된 회원이 아닙니다. 회원가입을 먼저 해주세요.");
        navigate("/user/terms");
      });
  };

  const changeHandler = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="Login">
      <div className="container">
        <div className="loginLogo">
          <img src="../images/logo.png" alt="" />
        </div>
        <h1>LOGIN</h1>

        <ul className="links">
          <li>
            <a href="#" id="signin">
              SIGN IN
            </a>
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

        <form onSubmit={submitHandler}>
          <div className="first-input input__block first-input__block">
            <input
              type="text"
              placeholder="id"
              name="uid"
              value={user.uid}
              onChange={changeHandler}
            />
          </div>
          <div className="input__block">
            <input
              type="password"
              placeholder="password"
              name="pass"
              value={user.pass}
              onChange={changeHandler}
            />
          </div>
          <input type="submit" value="Sign in" className="btnLogin" />
        </form>
        <div className="separator">
          <p>OR</p>
        </div>
        <button className="google__btn">
          <i className="fa fa-google"></i>
          Sign in with Google
        </button>

        <div>
          <p style={{ textAlign: "center", color: "gray" }}>
            SNAP-SHOT: {process.env.REACT_APP_VERSION}
          </p>
        </div>
      </div>
      <div className="loginImg">
        <img src="../images/login.png" alt="" />
      </div>
    </div>
  );
};

export default Login;
