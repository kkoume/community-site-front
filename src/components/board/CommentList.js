import React from "react";

const CommentList = ({ comments }) => {
  return (
    <div className="commentList">
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <span>{comment.nick}</span>
          <p>{comment.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
