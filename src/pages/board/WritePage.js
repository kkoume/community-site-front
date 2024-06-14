import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/board.scss";
import Write from "../../components/board/Write";

const WritePage = () => {
  return (
    <DefaultLayout>
      <Write />
    </DefaultLayout>
  );
};

export default WritePage;
