import React, { useState } from "react";
import { useSelector } from "react-redux";

const CommentForm = ({ board, onSubmit }) => {
  const [comment, setComment] = useState("");
  const authSlice = useSelector((state) => state.authSlice);

  const changeHandler = (e) => {
    setComment(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment.trim() === "") {
      alert("댓글을 입력해주세요.");
      return;
    }
    const commentData = {
      bno: board.no,
      content: comment,
      cwriter: authSlice.username,
      nick: board.nick,
    };
    onSubmit(commentData);
    console.log("comment: ", commentData);
    setComment("");
  };

  return (
    <form name="commentForm" className="commentForm" onSubmit={submitHandler}>
      <input type="hidden" name="no" value={board.no} />
      <input type="hidden" name="cate" value={board.cate} />
      <h4>댓글</h4>
      <div className="comment">
        <span>{board.nick}</span>
        <br />
        <textarea
          name="content"
          value={comment}
          onChange={changeHandler}
          placeholder="댓글을 남겨주세요."
        ></textarea>
      </div>
      <div className="commentBtn">
        <input type="submit" name="submit" value="등록" />
        <button type="button" onClick={() => setComment("")}>
          취소
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
