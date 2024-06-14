import React, { useEffect, useMemo, useState } from "react";
import useCates from "../../hooks/useCates";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import CustomToolbar from "./CustomToolbar";
import url from "../../config/url";

const Modify = () => {
  const cate1 = useCates();
  const { cate, no } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [title, setTitle] = useState(""); // 제목 상태 추가
  const [content, setContent] = useState(""); // 수정내용 추가된 상태
  const authSlice = useSelector((state) => state.authSlice);
  const navigate = useNavigate();
  const [values, setValues] = useState("");
  const [initialTitle, setInitialTitle] = useState(""); // 초기 제목 상태 추가

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar", // 커스텀 툴바의 ID
      },
    };
  }, []);

  const formats = [
    "size",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
    "font",
  ];

  // 수정 할 글 불러오기
  useEffect(() => {
    console.log(`cate: ${cate}, no: ${no}`);
    axios
      .get(url.backendUrl + `/board/modify/${cate}/${no}`, {
        headers: { Authorization: `Bearer ${authSlice.accessToken}` },
      })

      .then((response) => {
        console.log("response data:", response.data);
        setBoard(response.data);
        setTitle(response.data.title); // 제목 초기값 설정
        setContent(response.data.content); // content 초기값 설정
        setLoading(false); // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // 에러 발생 시 로딩 완료로 설정
      });
  }, [cate, no, authSlice.accessToken]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value; // input 요소의 변경된 값
    setTitle(newTitle);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    const modifiedBoard = {
      ...board,
      title,
      content,
    };

    // 글 수정 데이터 보내기
    axios
      .post(url.backendUrl + `/board/modify/${cate}/${no}`, modifiedBoard, {
        headers: { Authorization: `Bearer ${authSlice.accessToken}` },
      })
      .then((response) => {
        console.log("Save response:", response.data);
        navigate(`/board/view/${modifiedBoard.cate}/${no}`);
      })
      .catch((error) => {
        console.error("Save error:", error);
      });
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  if (!board) {
    return <div>데이터를 불러오지 못했습니다.</div>; // 데이터가 null일 때 표시할 컴포넌트
  }

  return (
    <div className="Board">
      <h2>
        {/*카테고리 값에 따라 게시판 제목 변경 */}
        <span>
          {" "}
          {cate === "notice"
            ? "📌 공지사항"
            : cate === "daily"
            ? "🌞 일상"
            : cate === "report"
            ? "🚨 신고합니다"
            : "커뮤니티 글보기"}
        </span>{" "}
      </h2>
      <div className="modify">
        <div className="mTitle">
          <input
            type="text"
            name="title"
            value={title || initialTitle} // 새 제목이 없을 경우 초기 제목 표시
            onChange={handleTitleChange}
          ></input>
          <div>
            <img src="/images/testAccount_50.png"></img>
            <div className="text">
              <p>{board.nick}</p>
              <p>{board.rdate ? board.rdate.substring(0, 10) : ""}</p>
            </div>
          </div>
        </div>
        {/*vTitle end */}
        <div className="vContent">
          <CustomToolbar />
          <ReactQuill
            theme="snow"
            value={content}
            modules={modules}
            formats={formats}
            name="content"
            onChange={handleContentChange}
          />
        </div>
        {/*vContent end */}
        <div className="btnSet">
          <button onClick={handleSave} className="saveBtn">
            저장
          </button>
          <Link to={`/board/list?cate=${cate}`} className="cancelBtn">
            취소
          </Link>
        </div>
      </div>
      {/*view end */}
    </div>
  );
};

export default Modify;
