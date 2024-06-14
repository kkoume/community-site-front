import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import url from '../../config/url';

const Write = () => {
  const authSlice = useSelector((state) => state.authSlice);
  const [qna, setQna ] = useState({cate:'회원/탈퇴', title:"", content:'', writer: ''})
  qna.writer = authSlice.username;

  const inputChangeHandler = (e)=>{
    setQna({...qna, [e.target.name] : e.target.value});
};



  //전송
  const submitHandler = ()=>{
    console.log(qna)

    axios.post(`${url.backendUrl}/qnaWrite`, qna).then((resp)=>{
          if(resp != null){
            alert('글이 등록되었습니다.')
            window.location.href='/qna?cate=qna'
          }
    }).catch((err)=>{
      console.log(err)
    })
  }
  return (
    <div className="Board">
        <h2>문의하기</h2>
      <div className="eTop">

      <div className="eCate">
          <select value={qna.cate} onChange={inputChangeHandler} name='cate'>
            <option value="회원/탈퇴">회원/탈퇴</option>
            <option value="채팅">채팅</option>
            <option value="프로젝트">프로젝트</option>
            <option value="페이지">페이지</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className="eTitle">
          <input
            type="text"
            name="title"
            placeholder="제목을 입력해주세요."
            value={qna.title}
            onChange={inputChangeHandler}
          ></input>
        </div>
      </div>
      <br/>
      <br/>

      <div>
         <textarea style={{width: '100%' , minHeight: '300px', border: '1px solid lightgray', fontSize: '20px'}} value={qna.content}
         onChange={inputChangeHandler}
         name="content">
         </textarea>
      </div>


      <div className="editBtn">
        <Link to={`/qna?cate=qna`}>취소</Link>
        <button className="submitBtn" onClick={submitHandler}  >
          완료
        </button>
      </div>
    </div>
  )
}

export default Write