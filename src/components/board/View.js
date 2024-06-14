import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCates from "../../hooks/useCates";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useSelector } from "react-redux";
import url from "../../config/url";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const View = () => {
  const cate1 = useCates();
  console.log("cate값:" + cate1[1]);
  const { cate, no } = useParams();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const authSlice = useSelector((state) => state.authSlice);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  // 신고 모달
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleReport = async () => {
    try {
      const response = await axios.post(
        `${url.backendUrl}/board/report`,
        {
          no: no,
          reason: reason,
          uid: authSlice.username,
        },
        {
          headers: {
            Authorization: `Bearer ${authSlice.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("토큰: ", authSlice.accessToken);
      console.log("신고 사유:", reason);
      console.log("서버 응답:", response.data);
      alert("신고가 접수되었습니다.");
    } catch (error) {
      console.error("신고 중 오류 발생:", error);
      alert("신고에 실패하였습니다.");
    } finally {
      closeModal();
    }
  };

  const handleSubmit = async (boardNo, comment) => {
    try {
      const response = await axios.post(
        `${url.backendUrl}/comment`,
        { boardNo, comment },
        {
          headers: {
            Authorization: `Bearer ${authSlice.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setComments([...comments, response.data]);
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);
      alert("댓글 등록에 실패하였습니다.");
    }
  };

  useEffect(() => {
    console.log(url.backendUrl);
    console.log(`cate: ${cate}, no: ${no}`);

    axios
      .get(url.backendUrl + `/board/view/${cate}/${no}`, {
        headers: { Authorization: `Bearer ${authSlice.accessToken}` },
      })
      .then((response) => {
        console.log("response data:", response.data);
        setBoard(response.data);
        setComments(response.data.comments || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [cate, no, authSlice.accessToken]);

  //글 삭제
  const deleteHandler = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      try {
        await axios.post(`${url.backendUrl}/board/delete/${cate}/${no}`, {
          headers: { Authorization: `Bearer ${authSlice.accessToken}` },
        });
        alert("게시글이 삭제되었습니다.");
        navigate(`/board/list?cate=${cate}`);
      } catch (error) {
        console.error("err :", error);
        alert("게시글 삭제에 실패하였습니다.");
      }
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Board">
      <h2>
        <span>
          {cate === "notice"
            ? "📌 공지사항"
            : cate === "daily"
            ? "🌞 일상"
            : cate === "report"
            ? "🚨 신고합니다"
            : "커뮤니티 글보기"}
        </span>
      </h2>
      <div className="view">
        <div className="vTitle">
          <h3>{board.title}</h3>

          <div>
            <img src="/images/testAccount_50.png" alt="profile" />
            <div className="text">
              <p>{board.nick}</p>
              <p>{board.rdate ? board.rdate.substring(0, 10) : ""}</p>
            </div>
          </div>
        </div>
        <div className="vContent">
          <ReactQuill value={board.content} readOnly={true} theme={"bubble"} />
          <button className="reportBtn" onClick={openModal}>
            🚨신고
          </button>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  X
                </span>
                <h2>게시글 신고하기</h2>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="신고 사유를 입력하세요."
                />
                <button className="rSubmit" onClick={handleReport}>
                  신고
                </button>
              </div>
            </div>
          )}
        </div>
        {/*board에 board내용물 담아서 commentForm에 전달 */}
        <CommentForm board={board} onSubmit={handleSubmit} />
        <CommentList board={board} comments={comments} />
      </div>
      <div className="vBtn">
        <div>
          <Link to={`/board/write?cate=${cate}`} className="writeBtn2">
            글쓰기
          </Link>
          <Link to={`/board/modify/${cate}/${no}`}>수정</Link>
          <input
            type="submit"
            value="삭제"
            onClick={deleteHandler}
            className="delBtn"
          />
        </div>
        <div>
          <Link to={`/board/list?cate=${cate}`}>목록</Link>
          <Link to="#" className="topBtn">
            Top
          </Link>
        </div>
      </div>
    </div>
  );
};

export default View;
