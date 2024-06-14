import React from "react";
import Header from "../components/main/Header";
import Aside from "../components/main/Aside";
import Footer from "../components/main/Footer";
import Contents from "../components/main/Contents";

const DefaultLayout = ({ children }) => {
  return (
      <div className="wrap">
        <Aside />
        <div className="cont">
          <Header />
          <main>
            <contents>{children}</contents>
          </main>
          <Footer />
        </div>
      </div>
  );
};

export default DefaultLayout;
