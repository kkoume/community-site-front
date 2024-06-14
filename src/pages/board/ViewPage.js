import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/board.scss";
import View from "../../components/board/View";
import useCates from "../../hooks/useCates";

const ViewPage = () => {
  const [cate1] = useCates();
  console.log("cate1:" + cate1);

  return (
    <DefaultLayout>
      <View />
    </DefaultLayout>
  );
};

export default ViewPage;
