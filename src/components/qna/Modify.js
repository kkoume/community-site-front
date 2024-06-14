import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import url from '../../config/url';

const Modify = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  var cate = searchParams.get('cate'); 
  const no = searchParams.get("no");
  const authSlice = useSelector((state) => state.authSlice);
  console.log(authSlice.username)
  
  const [article , setArticle] = useState({cate:'', title:"", content:'', writer: ''});
  
  useEffect(()=>{
  axios.get(`${url.backendUrl}/lookView?cate=${cate}&no=${no}`).then((res)=>
  {
    console.log(res.data)
    setArticle(res.data);
  }) },[])
  
  const redirectHandler = ()=>{
   window.history.back();
  }
  const onChangeHandler = (e)=>{
      setArticle({...article,[e.target.name] : e.target.value})
  }

  const submitHandler = ()=>{
      axios.post(`${url.backendUrl}/qna/modify` , article).then((rep)=>{
        if(rep){
          alert('수정이 되었습니다.')
          window.location.href='/qna/view?cate=qna&no='+article.qnaPk
        }
      })
  }
  
  return (

    <div className="Board">
    <div className="eTop">
    
      <div className="eTitle">
      <span style={{width: '100px', border: '1px solid gray', textAlign: 'center'}}>{article.cate}</span>  
        <input
          type="text"
          name="title"
          value={article.title}
          onChange={onChangeHandler}
        ></input>
      </div>
    </div>
    <br/>
    <br/>
    
    <div>
       <textarea style={{width: '100%' , minHeight: '300px', border: '1px solid lightgray', fontSize: '20px'}} 
       name="content" value={article.content} onChange={onChangeHandler}>
       </textarea>
    </div>
    
    
    <div className="editBtn">
      <button className="submitBtn"  onClick={redirectHandler} >
        취소
      </button>
      {authSlice.username === article.writer ? ( <button className="submitBtn" onClick={submitHandler} >
        수정 완료
      </button>) : (<></>)}
    </div>
    </div>
      )
}

export default Modify