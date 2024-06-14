import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

/*
    라우팅 주소에서 cate1, cate2를 반환하는 커스텀 훅
*/

const useCates = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const paths = location.pathname.split("/");
  let board = paths[1];
  let cate = paths[2];

  // 라우팅 주소가 게시판(board)이면
  if (board === "board") {
    cate = searchParams.get("cate");
  }

  return [board, cate];
};

export default useCates;
