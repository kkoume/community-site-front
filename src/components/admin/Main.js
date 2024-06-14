import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import url from "../../config/url";
import { useSelector } from "react-redux";
import Page from "./Page";
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '40%',
      left: '53%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

const initState = {
  dtoList: [],
  cate: "",
  pg: 1,
  size: 10,
  total: 0,
  start: 0,
  end: 0,
  orderBy :1,
  prev: false,
  next: false,
};

const Main = () => {
    const authSlice = useSelector((state) => state.authSlice);
    if(authSlice.userRole != 'ROLE_ADMIN'){
        window.location.href = '/main';
    }

    //현재 카테고리 알기
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    var cate = searchParams.get('cate'); 
    initState.cate = cate;
    const pg = searchParams.get("pg") || 1;
    initState.pg=pg;
    
    const [serverData, setServerData] = useState(initState)
    
//modal
const [openModal, setOpenModal] = useState(false);
var indexUser = 0;
const [selectedUser, setSelectedUser] = useState(null);

const memberDetailHandler = (index)=>{
    indexUser = index;
    console.log(index + "길이!")
    console.log(serverData.dtoList[index] + "길이!")
    console.log(serverData.dtoList[index].uid)
    setSelectedUser(serverData.dtoList[index]);
    setOpenModal(true);
}


//article Modal..
const [openArticleModal, setArticleModal] = useState(false);
var indexUser = 0;
const [selectedArticle, setSelectedArticle] = useState(null);

const [selectCause , setSelectCause] = useState([]);

const articleDetailHandler = (index)=>{
    indexUser = index;
   setSelectedArticle(serverData.dtoList[index]);
   axios.get(url.backendUrl+'/admin/searchArticleCause?no='+serverData.dtoList[index].no)
   .then((response)=>{
    setSelectCause(response.data);
   })
    setArticleModal(true);
}


const stopArticleHandler = (userId)=>{
    axios.get(`${url.backendUrl}/admin/stopArticle?no=`+userId).then((response)=>{
        alert('배공개 처리되었습니다.')
       setArticleModal(false);

       const updatedUser = response.data;

       const updatedDtoList = serverData.dtoList.map(article => 
         article.no === response.data.no ? updatedUser : article
       );
       setServerData({
         ...serverData,
         dtoList: updatedDtoList
       });
    }).catch((err)=>{
    console.log(err);
    });
}

const unStopArticleHandler = (userId)=>{
    axios.get(`${url.backendUrl}/admin/unStopArticle?no=`+userId).then((response)=>{
        alert('배공개 처리되었습니다.')
       setArticleModal(false);

       const updatedUser = response.data;

       const updatedDtoList = serverData.dtoList.map(article => 
         article.no === response.data.no ? updatedUser : article
       );
       setServerData({
         ...serverData,
         dtoList: updatedDtoList
       });
    }).catch((err)=>{
    console.log(err);
    });
}


var type = searchParams.get('type'); 
initState.type = type;



//article 받은신고횟수 orderBy
const articleOrderHandler =()=>{
  if(initState.orderBy===1){
    initState.orderBy++;
  }else if(initState.orderBy ===2){
    initState.orderBy ++;
  }else if(initState.orderBy === 3){
    initState.orderBy --;
  }
  axios.post(url.backendUrl+'/admin', initState)
  .then((response)=>{
    setServerData(response.data)
  })
}

//컨텐츠
    useEffect(()=>{
        axios.post(`${url.backendUrl}/admin`, initState).then((response)=>{
            setServerData(response.data)
    
        }).catch((err)=>{
            console.log(err);
        });
    },[]);

    useEffect(()=>{
        axios.post(`${url.backendUrl}/admin`, initState).then((response)=>{
                console.log(response.data.dtoList )
                setServerData(response.data)
                
        }).catch((err)=>{
            console.log(err);
        });
    },[cate , pg , type]);



//정지먹이기 (유저)
const stopUserHandler = (userId)=>{
    axios.get(`${url.backendUrl}/admin/stopUser?uid=`+userId).then((response)=>{
        console.log(response.data.dtoList )
        alert('정지 되었습니다.')
       setOpenModal(false);

       const updatedUser = response.data;

       const updatedDtoList = serverData.dtoList.map(user => 
         user.uid === response.data.uid ? updatedUser : user
       );
       
       setServerData({
         ...serverData,
         dtoList: updatedDtoList
       });
 

    }).catch((err)=>{
    console.log(err);
    });
}

//정지풀어주기 (유저)
const unStopUserHandler = (userId)=>{
    axios.get(`${url.backendUrl}/admin/unStopUser?uid=`+userId).then((response)=>{
        alert('정지 해제되었습니다.')

        const updatedUser = response.data;

        const updatedDtoList = serverData.dtoList.map(user => 
          user.uid === response.data.uid ? updatedUser : user
        );
        
        setServerData({
          ...serverData,
          dtoList: updatedDtoList
        });

       setOpenModal(false);

 

    }).catch((err)=>{
    console.log(err);
    });

}
const [state , setState] = useState(new Array(serverData.dtoList.length).fill(false));
useEffect(()=>{
  setState(new Array(serverData.dtoList.length).fill(false));
  setShow(true)
  setFaq({title: '', content: '', cate: ''})
},[type])
//faq 아코디언

const yameAcoHandler = (index)=>{
    const newVisibleAnswers = [...state];
    newVisibleAnswers[index] = !newVisibleAnswers[index];
    setState(newVisibleAnswers);
}

//faq + - button
const [bubutonShow, setShow] = useState(true);

const buttonHandler =()=> {
  setShow(!bubutonShow);
}

const faqChangeHandler = (e)=>{
  setFaq({...faq,[e.target.name] : e.target.value})

}

const faqSubmitHandler = ()=>{
  faq.cate= type;
  if(window.confirm('제출하시겠습니까?')){
    axios.post(`${url.backendUrl}/admin/faqInsert` , faq)
    .then((rep)=>{
      const newDto = rep.data;
      const updatedDtoList = [...serverData.dtoList, newDto];
      setServerData({
        ...serverData,
        dtoList: updatedDtoList
      });
      setFaq({title: '', content: '', cate: ''})
    })
  }
}

//faq insert
const [faq , setFaq]=  useState({title: '', content: '', cate: ''})

//faq delete
const delteFaqHandler = (no)=>{
  if(window.confirm('삭제하시겠습니까?')){
    axios.get(`${url.backendUrl}/admin/deleteFaq?no=`+no).then((rep)=>{
      const newInt = rep.data; // 서버에서 받은 데이터
      const updatedDtoList = serverData.dtoList.filter(item => item.no !== newInt); 

      setServerData({
        ...serverData,
        dtoList: updatedDtoList
      });
    })
  }

  
 
}

//qna Modal
const [openQna, setOpenQna] = useState(false);

const openQnaHandler = ()=>{
  setOpenQna(true);
}
  return (
    <>
      <div className="Board">
        <div className="freeBoard" >
          <div className="commu_title"  style={{backgroundColor: 'gray'}}s>
            <div className="ctext">
              <h2>관리자 페이지</h2>
              <p>일름보 사이트를 관리하는 공간입니다.</p>
            </div>
            <div className="cimg">
              <img src="../images/community.png" alt="커뮤니티"></img>
            </div>
          </div>

          <div className="cate">
            <Link to="/admin?cate=user" className={cate ==='user'? 'backGround' : ''}>악성 유저</Link>
            <Link to="/admin?cate=article" className={cate ==='article'? 'backGround' : ''}>악성 게시물</Link>
            <Link to="/admin?cate=qna" className={cate ==='article'? 'backGround' : ''}>QnA</Link>
            <Link to="/admin?cate=faq&type=회원/탈퇴" className={cate ==='article'? 'backGround' : ''}>FAQ</Link>

          </div>

        <br/>

        {/*악성유저페이지 */}
        {initState.cate === 'user' ?(     
        <table style={{borderTop: '1px solid gray', width: '100%', padding: '4px', overflow: 'hidden'}}>
        <thead  >
        <tr >
            <th style={{ width: '15%' }}>번호</th>
            <th style={{ width: '20%' }}>아이디</th>
            <th style={{ width: '20%' }}>받은신고횟수 <span>
            <Link  ><img src="/images/upDown.png" style={{width: '17px', verticalAlign: 'middle', marginLeft: '2px'}}/></Link>
            </span>
            </th>
            <th style={{ width: '30%' }}>상태
            </th>
            <th style={{ width: '15%' }} >자세히</th>
        </tr>
        </thead>
        <hr style={{width: '1000%', margin: '5px 0px', border: '1px solid 3467ffcf', marginLeft: '0px'}}/>
        <tbody style={{textAlign: 'center'}}>
            {serverData.dtoList.map((user, index)=>{
                console.log(serverData.dtoList + "왜?")
                return(
                    <tr key={index}>
            <td style={{ width: '15%' }}>{serverData.startNo - index}</td>
            <td style={{ width: '20%' }}> {user.uid} </td>
            <td style={{ width: '20%' }}> {user.report}  </td>
            <td style={{ width: '30%' }}><span style={{marginLeft: '10px'}} id="status">{user.reportStart == null ? 
                (<span>미정지</span>)
                : (<span>정지: {user.reportStart}~{user.reportEnd}</span>)}</span> </td>
            <td style={{ width: '15%'}}><p onClick={ ()=> memberDetailHandler(index)}
            ><img src="/images/magnifier_50.png" style={{width: '28px'}}/></p></td>
                    </tr>
                )
            })}
            <hr style={{width: '1000%', margin: '5px 0px', border: '1px solid 3467ffcf', marginLeft: '0px'}}/>
        </tbody>

       </table>):(<></>)}
         
          {/*악성게시물 */}

          {initState.cate === 'article' ?(     
        <table style={{borderTop: '1px solid gray', width: '100%', padding: '10px', overflow: 'hidden'}}>
        <thead  >
        <tr >
            <th style={{ width: '10%' }}>번호</th>
            <th style={{ width: '30%' }}>글제목</th>
            <th style={{ width: '15%' }}>받은신고횟수 <span  onClick={articleOrderHandler}>
            <img src="/images/upDown.png" style={{width: '17px', verticalAlign: 'middle', marginLeft: '2px'}}/>
            </span>
            </th>

            <th style={{ width: '10%' }}>공개여부
            </th>

            <th style={{ width: '20%' }}>작성자
            </th>
            <th style={{ width: '15%' }} >자세히</th>
        </tr>
        </thead>
        <hr style={{width: '1000%', margin: '5px 0px', border: '1px solid 3467ffcf', marginLeft: '0px'}}/>
        <tbody style={{textAlign: 'center'}}>
            {serverData.dtoList.map((article, index)=>{
                return(
                    <tr key={index}>
            <td style={{ width: '10%' }}>{serverData.startNo - index}</td>
            <td style={{ width: '30%' , whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}> {article.title} </td>
            <td style={{ width: '15%' }}>   {article.report} </td>
            <td style={{ width: '10%' }}>   {article.status=== 1 ? (<>비공개</>): (<>공개</>)} </td>
            <td style={{ width: '20%' }}> {article.writer} </td>
            <td style={{ width: '15%'}}><p onClick={ ()=> articleDetailHandler(index)}
            ><img src="/images/magnifier_50.png" style={{width: '28px'}}/></p></td>
                    </tr>
                )
            })}
            <hr style={{width: '1000%', margin: '5px 0px', border: '1px solid 3467ffcf', marginLeft: '0px'}}/>
        </tbody>

       </table>):(<></>)}


                
          {/*qna*/}
          {initState.cate === 'qna' ?(     
        <table style={{borderTop: '1px solid gray', width: '100%', padding: '10px', overflow: 'hidden'}}>
        <thead  >
        <tr >
            <th style={{ width: '10%' , padding: '5px' }}>번호</th>
            <th style={{ width: '15%' ,  padding: '5px'}}>유형</th>
            <th style={{ width: '30%', padding: '5px' }}> 제목 <span>
            </span>
            </th>

            <th style={{ width: '20%' }}>작성자
            </th>

            <th style={{ width: '15%'  }}>상태
            </th>
        </tr>
        </thead>
        <hr style={{width: '1000%', margin: '5px 0px', border: '1px solid 3467ffcf', marginLeft: '0px'}}/>
        <tbody style={{textAlign: 'center' }}>
            {serverData.dtoList.map((article, index)=>{
                return(
                    <tr key={index}>
            <td style={{ width: '10%' ,padding: '6px' }}>{serverData.startNo - index}</td>
            <td style={{ width: '15%' , whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}> {article.cate} </td>
            <td style={{ width: '30%' }}>  <Link to={`/admin/view?no=${article.qnaPk}`} >{article.title}</Link>  </td>
            <td style={{ width: '20%' }}>   {article.writer} </td>
            <td style={{ width: '15%' }}> {article.status} </td>
                    </tr>
                )
            })}
            <hr style={{width: '1000%', margin: '5px 0px', border: '1px solid 3467ffcf', marginLeft: '0px'}}/>
        </tbody>

       </table>):(<></>)}

      {/*faq*/}
      {initState.cate === 'faq' ?(     
        <>
<div >
<Link to="/admin?cate=faq&type=회원/탈퇴" className='myCate' >회원/탈퇴</Link>
<Link to="/admin?cate=faq&type=채팅"  className='myCate'>채팅</Link>
<Link to="/admin?cate=faq&type=프로젝트" className='myCate' >프로젝트</Link>
<Link to="/admin?cate=faq&type=캘린더" className='myCate'>캘린더</Link>
<Link to="/admin?cate=faq&type=페이지" className='myCate'>페이지</Link>
<Link to="/admin?cate=faq&type=기타" className='myCate'>기타</Link>
</div>
<br/>
<br/>
<div>
{serverData.dtoList.map((data, index)=>{
    return(
      <>
      <p className='qnaTitle' onClick={() => yameAcoHandler(index)}>Q {data.title}  
      <span className="deleteGahee" onClick={()=>delteFaqHandler(data.no)} style={{cursor: 'pointer'}}> delete</span></p>
      
      <p className='qnaAnswer'
      style={{ display: state[index] ? 'block' : 'none' }}
       >A {data.content}</p>
      <br/>
   
      </>
    )
   
})}
 <p className="addBox" style={{display: bubutonShow ? 'block' : 'none'}} onClick={ buttonHandler}>+</p>
 <p className="addBox"  style={{display: !bubutonShow ? 'block' : 'none'}} onClick={ buttonHandler}>-</p>
 <br/>
 <div style={{border: '1px solid #dfdfdf', padding: '14px', display: !bubutonShow ? 'block' : 'none'}}> 
  <input type="text" className='insertQuestion' placeholder="질문을 작성해주세요"
   style={{marginBottom: '8px'}} value={faq.title} name="title" onChange={faqChangeHandler} ></input>
 <input type="text" className='insertQuestion' placeholder="답변을 작성해주세요"
 value={faq.content} onChange={faqChangeHandler} name="content"></input>
<br/>
<br/>
 <button type="button" className="gaheeButton" onClick={faqSubmitHandler}>완료</button>
 </div>

</div>

</>
        ):(<></>)}
        </div>

        <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        style={customStyles}
        contentLabel="Invite Modal"
      >
        <h2>멤버 상세 정보  
            <button  style={{marginLeft: '250px', border: 'none', fontSize: '20px'}} onClick={() => setOpenModal(false) }>X</button></h2>
            <br/>
            <div style={{fontSize: '20px', padding: '5px'}}>
                {selectedUser? (  <> <p>아이디 : <span style={{marginLeft: '10px'}} id="id"> {selectedUser.uid} </span> </p>
                <p>닉네임 : <span style={{marginLeft: '10px'}} id="nick">{selectedUser.nick}</span> </p>
                <p>이름 : <span style={{marginLeft: '10px'}} id="name">{selectedUser.name}</span> </p>
                <p>상태 : <span style={{marginLeft: '10px'}} id="status">{selectedUser.reportStart == null ? 
                (<span>미정지</span>)
                : (<span>정지: {selectedUser.reportStart}~{selectedUser.reportEnd}</span>)}</span> </p>
                <p>신고횟수 : <span style={{marginLeft: '10px'}} id="report">{selectedUser.report}</span> </p>
                <p id="reason">신고사유</p>
                <div style={{border: '1px solid black', maxHeight: '100px', overflow: 'scroll'}}>

                </div>

                <br/>

                {selectedUser.reportStart == null ? (   <button type="button" className='chatButtonp'  style={{marginLeft: '41%'}} onClick={ ()=> stopUserHandler(selectedUser.uid)}
            >정지하기</button>) : (
                <button type="button" className='chatButtonp'  style={{marginLeft: '41%'}} onClick={ ()=> unStopUserHandler(selectedUser.uid)}
                >정지해제</button>
            )}
                </>


                ) : (<></>)}
             
            </div>
        
         
      </Modal>


      
      <Modal
        isOpen={openArticleModal}
        onRequestClose={() => setArticleModal(false)}
        style={customStyles}
        contentLabel="Invite Modal"
      >
        <h2>게시물 상세 정보  
            <button  style={{marginLeft: '250px', border: 'none', fontSize: '20px'}} onClick={() => setArticleModal(false) }>X</button></h2>
            <br/>
            <div style={{fontSize: '20px', padding: '5px'}}>
                {selectedArticle? (  <> <p>작성자 : <span style={{marginLeft: '10px'}} id="id"> {selectedArticle.writer} </span> </p>
                <p>제목 : <span style={{marginLeft: '10px'}} id="nick">{selectedArticle.title}</span> </p>
                <p>내용 : <span style={{marginLeft: '10px'}} id="name"> 
                  <Link to={"/board/view/"+selectedArticle.cate+"/"+selectedArticle.no} style={{textDecoration: 'underLine'}}>보러가기</Link></span> </p>
                <p>상태 : <span style={{marginLeft: '10px'}} id="status">{selectedArticle.status === 0 ? 
                (<span>공개</span>)
                : (<span>비공개</span>)}</span> </p>
                <p>신고횟수 : <span style={{marginLeft: '10px'}} id="report">{selectedArticle.report}</span> </p>
                <p id="reason">신고사유</p>
            
                <div style={{border: '1px solid black', maxHeight: '100px', overflow: 'scroll'}}>
                {selectCause.map((article, index)=>{
                  return(
                    <>
                    <p>{article.reason}</p>
                    </>
                  )

                })}
                </div>

                <br/>

                {selectedArticle.status === 0 ? (   <button type="button" className='chatButtonp'  style={{marginLeft: '41%'}} onClick={ ()=> stopArticleHandler(selectedArticle.no)}
                 >비공개처리</button>) : (
                <button type="button" className='chatButtonp'  style={{marginLeft: '41%'}} onClick={ ()=> unStopArticleHandler(selectedArticle.no)}
                >공개처리</button>
            )}
                </>


                ) : (<></>)}
             
            </div>
        
         
      </Modal>


    


        {/*table end 
        <div className="writeBtn">
          <Link  className="btn btnWrite">
            글쓰기
          </Link>
        </div>
        */}
  {initState.cate != 'faq' ? ( <Page serverData={serverData} cate={cate} />) : (<></>)}
   
      </div>

      

    </>
  );
};

export default Main;
