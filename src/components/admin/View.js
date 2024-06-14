import axios from 'axios';
import React, { useEffect, useState } from 'react'
import url from '../../config/url';
import { useLocation } from 'react-router-dom';

const View = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const no = searchParams.get("no");

    const [article , setArticle] = useState({cate:'', title:"", content:'', writer: '' , answer: ''});
    useEffect(()=>{
        axios.get(`${url.backendUrl}/lookView?cate=qna&no=${no}`).then((res)=>
        {
          console.log(res)
          setArticle(res.data);
        }) },[])

        const onChangeHandler = (e)=>{
            setArticle({...article,[e.target.name] : e.target.value})
        }
        const backHandler = ()=>{
            window.location.href= '/admin?cate=qna'
        }
        const subHandler = ()=>{
            axios.post(`${url.backendUrl}/admin/reply` , article).then((rep)=>{
                if(rep.data){
                    alert('답변 (수정) 완료 되었습니다.')
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
        readOnly
        ></input>
      </div>
    </div>
    <br/>
    <br/>
    
    <div>
        <p>질문</p>
       <textarea style={{width: '100%' , minHeight: '300px', border: '1px solid lightgray', fontSize: '20px'}} 
       name="content" value={article.content} readOnly>
       </textarea>
    </div>
    <br></br>
    <div>
        <p>답변</p>
       <textarea style={{width: '100%' , minHeight: '300px', border: '1px solid lightgray', fontSize: '20px'}} 
       name="answer" value={article.answer} placeholder='답변을 입력해주세요' onChange={onChangeHandler}>
       </textarea>
    </div>
    
    
    <div className="editBtn">
      <button className="submitBtn" onClick={backHandler}  >
        목록
      </button>
      <button className="submitBtn" onClick={subHandler} >
        완료(수정)
      </button>
 
    </div>
    </div>
      )
}

export default View;