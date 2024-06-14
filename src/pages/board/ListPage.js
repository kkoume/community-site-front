import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import List from "../../components/board/List";
import "../../styles/board.scss";
import useCates from "../../hooks/useCates";

const ListPage = () => {
  const [cate1] = useCates();
  console.log("cate1:" + cate1);

  return (
    <DefaultLayout>
      <List />
    </DefaultLayout>
  );
};

export default ListPage;
