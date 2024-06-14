import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Dropzone from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import url from "../../config/url";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { useSelector } from "react-redux";

const Mypage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const modalBackground = useRef();
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authSlice);

  const [user, setUser] = useState(
    location.state
      ? location.state.user
      : {
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
          role: "",
          grade: "",
          profileImg: "",
        }
  );

  useEffect(() => {
    console.log(user);
  }, [user]);

  console.log(user);

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const changePass = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const inputPass = (e) => {
    const currentPass = e.target.value;
    setUser({ ...user, pass: currentPass });
    const passPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passPattern.test(currentPass)) {
      setPass("영문, 숫자, 특수문자를 조합하여 8자 이상으로 설정해 주세요.");
    } else {
      setPass("올바른 비밀번호 입니다.");
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
    console.log("프로필1 : ", selectProfile);

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
    console.log("유우저", user);

    axios
      .post(url.backendUrl + "/modify", user, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("회원정보 수정!");

        dispatch(logout());
        navigate("/main");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("파일 업로드 : ", user.profileImg);
  }, [user.profileImg, profile]);

  useEffect(() => {
    axios
      .get(url.backendUrl + "/user/" + authSlice.username)
      .then((res) => {
        console.log(res.data);
        setUser({
          ...res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(user);
  }, []);

  const passChange = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    axios
      .post(url.backendUrl + "/changePw", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const result = response.data;
        if (result === "비밀번호가 재설정 되었습니다.") {
          console.log(response.data);
          alert(response.data);
          dispatch(logout());
          navigate("/main");
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="Mypage">
      <div className="container">
        <h1>마이페이지</h1>

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
                <input
                  type="text"
                  placeholder="test1"
                  className="input"
                  name="uid"
                  value={user.uid}
                  onChange={changeHandler}
                  readOnly
                />
                <span class="resultId">{id}</span>
              </td>
            </tr>
          </div>

          <div className="input_pass">
            <tr>
              <td>
                <label>패스워드</label>
              </td>
              <td>
                <div className="passNum">
                  <button
                    type="button"
                    className="btnPass"
                    onClick={changePass}
                  >
                    비밀번호 변경
                  </button>
                </div>
              </td>
            </tr>
          </div>

          {modalIsOpen && (
            <div
              className="modal"
              ref={modalBackground}
              onClick={(e) => {
                if (e.target === modalBackground.current) {
                  setModalIsOpen(false);
                }
              }}
            >
              <div className="modal-content">
                <form>
                  <div className="first-input input__block first-input__block">
                    <input
                      type="password"
                      placeholder="비밀번호"
                      className="pass1"
                      name="pass1"
                      value={null}
                      onChange={inputPass}
                    />
                    <span class="resultPass">{pass}</span>
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
                    {user.pass === user.pass2 && (
                      <span>비밀번호가 일치합니다.</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btnChangePw"
                    onClick={passChange}
                  >
                    비밀번호 재설정
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="input_block">
            <tr>
              <td>
                <label>이름</label>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="테스트"
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

          <input type="submit" value="수정완료" className="btnRegister" />
        </form>
      </div>
      <div className="registerImg">
        <img src="../images/login.png" alt="" />
      </div>
    </div>
  );
};

export default Mypage;
