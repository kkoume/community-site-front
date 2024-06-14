import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import url from '../../config/url';
import { useStateHistory } from '@mantine/hooks';
import authSlice from '../../slices/authSlice';
import { useSelector } from 'react-redux';


const View = () => {

  const location = useLocation();
const searchParams = new URLSearchParams(location.search);
var cate = searchParams.get('cate'); 
const no = searchParams.get("no");
const authSlice = useSelector((state) => state.authSlice);
console.log(authSlice.username)

const [article , setArticle] = useState({cate:'', title:"", content:'', writer: '' , answer: ''});

useEffect(()=>{
axios.get(`${url.backendUrl}/lookView?cate=${cate}&no=${no}`).then((res)=>
{
  console.log(res)
  setArticle(res.data);
}) },[])



const redirectHandler = ()=>{
 window.location.href='/qna?cate=qna'
}


const modifyHandler = ()=>{
  window.location.href = '/qna/modify?no='+article.qnaPk+'&cate=qna';
}
const deleteHandler = ( )=>{
  if(window.confirm('정말로 삭제하시겠습니까?')){
    axios.get(`${url.backendUrl}/qna/delete?no=${article.qnaPk}`).then((res)=>{
      if(res){
        alert('삭제 되었습니다.')
        window.location.href='/qna?cate=qna'
      }
    })
  }
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
    readOnly
    ></input>
  </div>
</div>
<br/>
<br/>

<div>
   <textarea style={{width: '100%' , minHeight: '300px', border: '1px solid lightgray', fontSize: '20px'}} 
   name="content" value={article.content} readOnly>
   </textarea>
</div>
<br></br>
{article.answer ? (<div>
  <h4>답변</h4>
   <textarea style={{width: '100%' , minHeight: '300px', border: '1px solid lightgray', fontSize: '20px'}} 
   name="answer" value={article.answer} readOnly>
   </textarea>
</div>
) : (<></>)}

<div className="editBtn">
  <button className="submitBtn"  onClick={redirectHandler} >
    목록
  </button>

  {authSlice.username === article.writer ? ( <button className="submitBtn"  onClick={deleteHandler} >
    삭제
  </button>) : (<></>)}

  {authSlice.username === article.writer ? ( <button className="submitBtn"  onClick={modifyHandler} >
    수정
  </button>) : (<></>)}
</div>
</div>
  )
}

export default View