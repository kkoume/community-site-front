import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/style.scss";
import Example from "../../components/main/Example";

const MainPage = () => {
  return (
    <DefaultLayout>
      <Example />
    </DefaultLayout>
  );
};

export default MainPage;
