import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../../config/url";

const Footer = () => {

  //백엔드 요청
  const [ data, setData ] = useState('');

  useEffect(() => { 
        snpapshot();
    },[])
    
  async function snpapshot() { 
    await axios
    .get(`${url.backend}/snapshot`) 
    .then((res)=>{
      	console.log(res);
        setData(res.data);
    })
    .catch((err)=>{
        console.log(err);
    })
  }

  return (
    <>
      <footer>
        <div className="footer">
             <ul className="footerContent">
                <li>(주)일름보</li>&nbsp;&nbsp;
                <li>부산시 해운대구 반여1동</li><br/>
                <li>대표이사 : 김준형</li>&nbsp;&nbsp;&nbsp;
                <li>임원진 : 조영흥, 이예나, 이승윤, 이가희</li><br/>
                <li>SNAP-SHOT: {process.env.REACT_APP_VERSION}</li>
                <li>서버받기: {data}</li>
                
             </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
