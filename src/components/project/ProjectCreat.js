import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import url from '../../config/url';
import useCates from '../../hooks/useCates';
import Page from '../project/Page';

const initState = {
  dtoList: [],
  cate: "",
  pg: 0,
  size: 0,
  total: 0,
  start: 0,
  end: 0,
  prev: false,
  next: false,
};




const ProjectCreate = () => {
  const authSlice = useSelector((state) => state.authSlice); // 유저 정보 가져오기
  const location = useLocation();

  const [projects, setProjects] = useState([]); // 프로젝트 배열 상태
  const [projectBar, setProjectBar] = useState(false); // 프로젝트 생성바 상태
  const [collaboBar, setcollaboBar] = useState(false);
  const [members, setMembers] = useState([]); //멤버
  const [projectTitle, setProjectTitle] = useState(""); // 입력한 프로젝트 제목 상태
  const [projectInfo, setProjectInfo] = useState(""); // 입력한 프로젝트 설명 상태
  
  const [emailLabel, setEmailLabel] = useState(true);
  const [selectedProjectNo, setSelectedProjectNo] = useState(null);

  const [invites, setInvites] = useState([]);
  const projectList = [];
  

  const [searchParams] = useSearchParams();
  const pg = searchParams.get("pg") || 1;
  const [serverData, setServerData] = useState(initState);
  console.log(serverData +'이거 확인~~')

  useEffect(() => {
    axios
      .get(`${url.backendUrl}/project?pg=${pg}&userId=${authSlice.username}`, {
        headers: { Authorization: `Bearer ${authSlice.accessToken}` },
      })
      .then((resp) => {
        console.log(resp.data.dtoList);
       setServerData(resp.data);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pg, projectBar]); // pg값이 변경이 되면 useEffect가 실행
  

  // 새로운 프로젝트 객체 생성
  const addProject = (e) => {
    e.preventDefault()
    if (!projectTitle.trim()) return;
    const newProject = { projectTitle: projectTitle, projectInfo: projectInfo , userId: authSlice.username, projectStatus : "Proceeding" };
    //setProjects((prevProjects) => [...prevProjects, newProject]);
    console.log(newProject)
    console.log(newProject +"이거확인")

    axios.post(`${url.backendUrl}/project/projectinsert`, newProject)
    .then(res => {
      console.log("프로젝트 등록");
  
      setProjects(prevProjects => [...prevProjects, res.data]);
      setProjectTitle(""); 
      setProjectBar(false);
      console.log(projects);
    })
    .catch(function (error) {
      console.log(error);
    });

    //값 초기화
    
    console.log('aa');
  };

  // 프로젝트를 클릭할 때마다 해당 프로젝트 번호를 선택하도록 설정
  const selectProjectHandler = (projectNo) => {
    setSelectedProjectNo(projectNo);
    setcollaboBar(prev => ({ ...prev, [projectNo]: true }));
    setEmailLabel(prev => ({ ...prev, [projectNo]: true }));
  };

  const closeBar = (projectNo) => {
    setcollaboBar(prev => ({ ...prev, [projectNo]: false }));
    setEmailLabel(prev => ({ ...prev, [projectNo]: false }));
  };


  //////////////////////멤버초대//////////////////////////////


  //초대핸들러
  const inviteSendHandler = (e)=>{
    e.preventDefault();
    console.log(e.target.id);
    fetch(`${url.backendUrl}/projectSearchUser?userEmail=`+document.getElementById('insertEmail').value+'&projectNo='+e.target.id)
      .then(response => response.json())
      .then(data => {if(data.result==0){
        alert('해당 사용자가 없습니다.')
    }else if(data.result == -1){
      alert('이미 초대된 사용자입니다.')
    }else{
      alert('초대 되었습니다.')
    }setcollaboBar(false);})
      .catch(error => console.error('Error fetching user rooms:', error));
  }


  //이메일 입력
  const inserEmailHandler = (e)=>{
    e.preventDefault()
    console.log(e.target.value+"!")
    fetch(`${url.backendUrl}/searchDm?word=`+e.target.value)
    .then(response => response.json())
    .then(data => {
      console.log(data.result);
      setInvites(data.result);
  })
    .catch(error => console.error('Error fetching user rooms:', error));
  }


  const selectMemberHandler = (e)=>{
    e.preventDefault()
    document.getElementById('insertEmail').value = e.target.textContent;
  }

  return (
    <div id='ProjectList'>
      <h4>Project Create</h4>
      <div>
        {!projectBar && <button onClick={() => setProjectBar(true)}>프로젝트 생성</button>}
        {projectBar && (
          <div>
            <h3>What is the name of your project?</h3>
            <p> You must enter a title to create your project The name of the project is very important, and I think about how to mock it</p><br/>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="프로젝트 제목 입력"
            />
            <input
              type="text"
              value={projectInfo}
              onChange={(e) => setProjectInfo(e.target.value)}
              placeholder="프로젝트 설명 입력"
            />
            <button onClick={addProject}>Add</button>
          </div>
        )}
      </div>
        <div>
          <h4>Projects List</h4>
          <ul>
            {serverData.dtoList.map((project, index) => (

              <div style={{border : '1px solid black', margin : '5px'}}>
              <li key={index} className='projectList'>
                
                <h2>Project</h2>
                <Link to={`/project/projectboard?projectNo=${project.projectNo}`}>{project.projectTitle}</Link>
                <p  value={project.projectNo} >Project Code : {project.projectNo}</p>
                <p>Project Content : {project.projectInfo}</p>
                <p>Project Status : {project.projectStatus}</p>
                <p>Created by: {project.userId}</p>


               <div>
                {!collaboBar[project.projectNo] && (
                  <button onClick={() => selectProjectHandler(project.projectNo)}>Collaborators add</button>
                )}
                {collaboBar[project.projectNo] && (
                  <form id={project.projectNo} onSubmit={inviteSendHandler}>
                    {emailLabel[project.projectNo] && (
                      <>
                        <label>
                          <input type="text" id="projectNo" value={project.projectNo} />
                          <input type="text" onChange={inserEmailHandler} id="insertEmail" placeholder="이메일 입력" />
                          <p onClick={() => closeBar(project.projectNo)}>x</p>
                          <div className='inviteDiv' style={{ border: '1px solid gray', width: '100%', maxHeight: '100px', overflow: 'scroll', marginTop: '2px' }}>
                            {invites.map(member => (
                              <p key={member.uid} onClick={selectMemberHandler}>{member.email}</p>
                            ))}
                          </div>
                        </label>
                        <button type="submit" className='chatButtonp'>초대</button>
                      </>
                    )}
                  </form>
                )}
              </div>
              
            {/*  참여 멤버    */}
              {members.map((user, index) => (
                <p key={index}>{user.name}</p>
              ))}
           
            </li>
            </div>

          ))}        
        </ul>
        </div>
        <Page serverData={serverData}/>        
    </div>
    );
  
  };

export default ProjectCreate;
