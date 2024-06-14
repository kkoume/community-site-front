import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import "../../styles/payment.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import url from "../../config/url";

const Payment = () => {
  const { tier } = useParams();

  const location = useLocation();
  const authSlice = useSelector((state) => state.authSlice);

  const [user, setUser] = useState({
    uid: "",
    name: "",
    email: "",
    hp: "",
    grade: "",
  });

  // 각 플랜에 따른 금액 설정
  const planPrices = {
    Silver: 0,
    Gold: 14000,
    Platinum: 43000,
  };

  // 플랜에 따른 금액 설정
  const initialPrice = planPrices[tier];
  const [price, setPrice] = useState(initialPrice);

  const widgetClientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const customerKey = "Z_nzQqUPqy_zTriKHWWZF";

  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${url.backendUrl}/user/${authSlice.username}`
        );
        if (response) {
          console.log("result : " + JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error User Data : ", error);
      }
    };

    fetchUserData();

    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey
        );
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    };

    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: price },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  useEffect(() => {
    axios
      .get(url.backendUrl + "/user/" + authSlice.username)
      .then((res) => {
        console.log(res.data);
        setUser({
          ...res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(user);
  }, []);

  const handlePaymentRequest = async () => {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.

    console.log("유저 : " + JSON.stringify(user));

    const sanitizedPhone = user.hp.replace(/\D/g, "");
    console.log("전화번호 : " + sanitizedPhone);

    try {
      await paymentWidget
        .requestPayment({
          orderId: nanoid(),
          orderName: `${tier} 플랜 멤버십 구독`,
          customerName: user.name,
          customerEmail: user.email,
          customerMobilePhone: sanitizedPhone,
          successUrl: `${window.location.origin}/user/success`,
          failUrl: `${window.location.origin}/user/fail`,
        })
        .then((res) => {
          console.log(res.data);
          const updateUser = {
            ...user,
            grade: tier,
          };
          console.log("이거 확인해 : " + JSON.stringify(updateUser));
          axios
            .post(url.backendUrl + "/user/updateGrade", updateUser)
            .then((res) => {
              console.log(res.data);
            })
            .catch((e) => {
              console.log(e);
            });
          alert("마 넘어가지마라");
        });
    } catch (error) {
      console.error("결제 요청 오류:", error);
    }
  };

  return (
    <div className="PaymentPage">
      <div className="PaymentPage2">
        <h1>{tier} 플랜 결제</h1>
        <p>여기에서 {tier} 플랜을 결제하세요.</p>
        {/* 할인 쿠폰 */}
        <label htmlFor="coupon-box">
          <input
            id="coupon-box"
            type="checkbox"
            onChange={(event) => {
              setPrice(event.target.checked ? price - 5_000 : price + 5_000);
            }}
          />
          <span>5,000원 쿠폰 적용</span>
        </label>
        {/* 결제 UI, 이용약관 UI 영역 */}
        <div id="payment-widget" />
        <div id="agreement" />
        {/* 결제하기 버튼 */}
        <div className="btnPayment">
          <button onClick={handlePaymentRequest}>결제하기</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
