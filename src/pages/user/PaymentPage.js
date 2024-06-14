import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/payment.scss";
import Payment from "../../components/user/Payment";

const PaymentPage = () => {
  return (
    <DefaultLayout>
      <Payment />
    </DefaultLayout>
  );
};

export default PaymentPage;
