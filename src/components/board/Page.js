import React from "react";
import { Link } from "react-router-dom";

const Page = ({ serverData, cate }) => {
  // 페이지번호 생성 함수
  const makePageNums = () => {
    console.log("makePageNums");
    const nums = [];

    for (let i = serverData.start; i <= serverData.end; i++) {
      nums.push(
        <Link
          key={i}
          to={`/board/list?cate=${cate}&pg=${i}`}
          className={`num ${serverData.pg === i && "current"}`}
        >
          {i}
        </Link>
      );
    }
    return nums;
  };

  return (
    <div class="page">
      {/* 이전 */}
      {serverData.prev && (
        <Link
          to={`/board/list?cate=${cate}&pg=${serverData.start - 1}`}
          className="prev"
        >
          이전
        </Link>
      )}
      {/* 페이지번호 */}
      {makePageNums()}

      {/*다음 */}
      {serverData.next && (
        <Link
          to={`/board/list?cate=${cate}&pg=${serverData.start + 1}`}
          className="next"
        >
          다음
        </Link>
      )}
    </div>
  );
};

export default Page;
