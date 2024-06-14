import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/board.scss";
import Modify from "../../components/board/Modify";

const ModifyPage = () => {
  return (
    <DefaultLayout>
      <Modify />
    </DefaultLayout>
  );
};

export default ModifyPage;
