import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";
import url from "../../config/url";

const Register = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pass, setPass] = useState();
  const [name, setName] = useState();
  const [nick, setNick] = useState();
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState();
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeMessage, setEmailCodeMessage] = useState("");
  const [savedCode, setSavedCode] = useState(null);

  const [user, setUser] = useState({
    uid: "",
    pass: "",
    pass2: "",
    name: "",
    nick: "",
    email: "",
    hp: "",
    zip: "",
    addr1: "",
    addr2: "",
    role: "USER",
    grade: "Silver",
    profileImg: null,
  });

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const inputUid = (e) => {
    const currentUid = e.target.value;
    setUser({ ...user, uid: currentUid });
    const uidPattern = /^[a-zA-Z0-9_]{4,20}$/;
    if (!uidPattern.test(currentUid)) {
      setId("영문, 숫자로 4~20자까지 설정해 주세요.");
    } else {
      setId("");
    }
  };

  const inputPass = (e) => {
    const currentPass = e.target.value;
    setUser({ ...user, pass: currentPass });
    const passPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passPattern.test(currentPass)) {
      setPass("영문, 숫자, 특수문자를 조합하여 8자 이상으로 설정해 주세요.");
    } else {
      setPass("");
    }
  };

  const inputName = (e) => {
    const currentName = e.target.value;
    setUser({ ...user, name: currentName });
    if (!currentName) {
      setName("이름은 필수입력 사항입니다.");
    } else {
      setName("");
    }
  };

  const inputNick = (e) => {
    const currentNick = e.target.value;
    setUser({ ...user, nick: currentNick });
    if (!currentNick) {
      setNick("닉네임은 필수입력 사항입니다.");
    } else {
      setNick("");
    }
  };

  const inputEmail = (e) => {
    const currentEmail = e.target.value;
    setUser({ ...user, email: currentEmail });
    const emailPattern =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!emailPattern.test(currentEmail)) {
      setEmail("올바른 이메일 주소를 입력해주세요.");
    } else {
      setEmail("");
    }
  };

  const inputHp = (e) => {
    const currentHp = e.target.value;
    setUser({ ...user, hp: currentHp });
    const hpPattern = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!hpPattern.test(currentHp)) {
      setHp("올바른 휴대폰번호 형식으로 입력해주세요.");
    } else {
      setHp("");
    }
  };

  //검색버튼을 클릭하면 주소창 팝업
  const openDaumPostcode = useDaumPostcodePopup();

  //우편주소
  const handlePostcode = () => {
    openDaumPostcode({
      onComplete: (data) => {
        setUser({ ...user, zip: data.zonecode, addr1: data.address });
      },
    });
  };

  const handleUid = (e) => {
    e.preventDefault();

    if (!user.uid) {
      alert("아이디를 입력하세요.");
      return;
    }

    axios
      .get(url.backendUrl + "/checkUid?uid=" + user.uid)
      .then((response) => {
        const result = response.data.result;
        setId(result);

        if (result === "사용 가능한 아이디 입니다.") {
          alert("사용 가능한 아이디 입니다.");
        } else {
          alert("이미 존재하는 아이디 입니다.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendEmail = (e) => {
    e.preventDefault();

    if (!user.email) {
      alert("이메일을 입력하세요.");
      return;
    }

    axios
      .get(url.backendUrl + "/checkEmail?email=" + user.email)
      .then((response) => {
        const result = response.data.result;
        const receivedCode = response.data.savedCode;
        setEmail(result);
        setSavedCode(receivedCode);

        if (result === "이메일 전송에 성공하였습니다.") {
          alert("이메일이 성공적으로 전송되었습니다.");
          console.log("시스템 생성 code : " + receivedCode);
          setShowEmailCode(true);
        } else {
          alert("이미 가입된 이메일 주소입니다.");
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const handleProfile = (files) => {
    const selectProfile = files[0];
    setProfile(selectProfile);
    console.log("이거 잘 뜨나? : ", selectProfile);

    // 선택한 프로필 사진 미리보기
    const preview = URL.createObjectURL(selectProfile);
    setProfilePreview(preview);
    console.log("프리뷰 : ", preview);

    setUser((updateUser) => ({
      ...updateUser,
      profileImg: selectProfile,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    formData.append("profile", profile);
    console.log("formData : ", formData);
    console.log("user", user);

    axios
      .post(url.backendUrl + "/uploads", user, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("회원가입 완료!");

        navigate("/user/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("파일 업로드 : ", user.profileImg);
  }, [user.profileImg, profile]);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isAllValid = Object.values(user).every(
      (value) => value !== "" || value === null
    );
    const isIdValid = id === "사용 가능한 아이디 입니다.";
    const isPassValid = pass === "";
    const isPass2Valid = user.pass === user.pass2;
    const isNameValid = name === "";
    const isNickValid = nick === "";
    const isEmailValid = email === "이메일 전송에 성공하였습니다.";
    const isEmailCodeValid =
      emailCodeMessage === "인증 코드 인식에 성공하였습니다.";
    const isHpValid = hp === "";
    setIsFormValid(
      isAllValid &&
        isIdValid &&
        isPassValid &&
        isPass2Valid &&
        isNameValid &&
        isNickValid &&
        isEmailValid &&
        isEmailCodeValid &&
        isHpValid
    );
  }, [user, id, pass, name, nick, email, emailCodeMessage, hp]);

  return (
    <div className="Register">
      <div className="container">
        <h1>Register</h1>

        <form onSubmit={submitHandler}>
          <div>
            <div className="profileImage">
              <Dropzone onDrop={handleProfile}>
                {({ getRootProps, getInputProps }) => (
                  <div className="rootProps" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="profilePreview"
                        className="profilePreview"
                      />
                    ) : (
                      <img
                        src="../images/default_thumbnail.png"
                        alt="profilePreview"
                        className="profilePreview"
                      />
                    )}
                  </div>
                )}
              </Dropzone>
              <div>
                <div className="profileTitle">프로필 이미지</div>
                <p className="profileText">
                  프로필 이미지를 업로드 해주세요.
                  <br />
                  (사이즈 1:1)
                </p>
              </div>
            </div>
          </div>
          <div className="input_block">
            <tr>
              <td>
                <label>아이디</label>
              </td>
              <td>
                <div className="uidNum">
                  <input
                    type="text"
                    placeholder="아이디 입력"
                    className="uid"
                    name="uid"
                    value={user.uid}
                    onChange={inputUid}
                  />
                  <button type="button" className="btnUid" onClick={handleUid}>
                    중복검색
                  </button>
                </div>
                <span class="resultId">{id}</span>
              </td>
            </tr>
          </div>

          <div className="input_block">
            <tr>
              <td>
                <label>패스워드</label>
              </td>
              <td>
                <input
                  type="password"
                  placeholder="패스워드 입력"
                  className="input"
                  name="pass"
                  value={user.pass}
                  onChange={inputPass}
                />
                <span class="resultPass">{pass}</span>
              </td>
            </tr>
          </div>

          <div className="input_block">
            <tr>
              <td>
                <label>확인</label>
              </td>
              <td>
                <input
                  type="password"
                  placeholder="패스워드 입력 확인"
                  className="input"
                  name="pass2"
                  onChange={changeHandler}
                />
                {user.pass !== user.pass2 && (
                  <span class="resultPass2">비밀번호가 일치하지 않습니다.</span>
                )}
                {user.pass === user.pass2 && <span class="resultPass2"></span>}
              </td>
            </tr>
          </div>

          <div className="input_block">
            <tr>
              <td>
                <label>이름</label>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="이름 입력"
                  className="input"
                  name="name"
                  value={user.name}
                  onChange={inputName}
                />
                <span class="resultName">{name}</span>
              </td>
            </tr>
          </div>

          <div className="input_block">
            <tr>
              <td>
                <label>닉네임</label>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="닉네임 입력"
                  className="input"
                  name="nick"
                  value={user.nick}
                  onChange={inputNick}
                />
                <span class="resultNick">{nick}</span>
              </td>
            </tr>
          </div>

          <div className="input_block">
            <tr>
              <td>
                <label>이메일</label>
              </td>
              <td>
                <div className="emailNum">
                  <input
                    type="email"
                    placeholder="이메일 입력"
                    id="email"
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
                <span class="resultEmail">{email}</span>
              </td>
            </tr>
          </div>

          {showEmailCode && (
            <div className="input_block">
              <tr>
                <td>
                  <label>인증 코드</label>
                </td>
                <td>
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
                </td>
              </tr>
            </div>
          )}

          <div className="input_block">
            <tr>
              <td>
                <label>휴대폰</label>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="- 포함 13자리 입력"
                  className="input"
                  name="hp"
                  minlength="13"
                  maxlength="13"
                  value={user.hp}
                  onChange={inputHp}
                />
                <span class="resultHp">{hp}</span>
              </td>
            </tr>
          </div>

          <div className="input_block">
            <tr>
              <td>
                <label>주소</label>
              </td>
              <td>
                <div className="zipNum">
                  <input
                    type="text"
                    placeholder="우편번호"
                    className="zip"
                    name="zip"
                    readOnly
                    value={user.zip}
                    onChange={changeHandler}
                  />
                  <button
                    type="button"
                    className="btnZip"
                    onClick={handlePostcode}
                  >
                    우편번호 찾기
                  </button>
                </div>
                <br />
                <input
                  type="text"
                  placeholder="주소를 검색하세요."
                  className="input"
                  name="addr1"
                  readOnly
                  value={user.addr1}
                  onChange={changeHandler}
                />
                <br />
                <input
                  type="text"
                  placeholder="상세주소를 입력하세요."
                  className="input"
                  name="addr2"
                  value={user.addr2}
                  onChange={changeHandler}
                />
              </td>
            </tr>
          </div>

          <input
            type="submit"
            value="Sign up"
            className="btnRegister"
            disabled={!isFormValid}
          />
        </form>
      </div>
      <div className="registerImg">
        <img src="../images/login.png" alt="" />
      </div>
    </div>
  );
};

export default Register;
