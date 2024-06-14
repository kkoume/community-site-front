import React from "react";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Silver",
    benefits: ["기본 혜택 제공", "월간 뉴스레터", "게시판 이용가능"],
    price: "무료",
    color: "#C0C0C0",
  },
  {
    name: "Gold",
    benefits: [
      "실버 혜택 포함",
      "추가 할인 혜택",
      "프로젝트 관리기능",
      "그룹채팅",
      "달력 스케쥴러",
    ],
    price: "월 14,000원",
    color: "#FFD700",
  },
  {
    name: "Platinum",
    benefits: [
      "골드 혜택 포함",
      "개인 맞춤 컨설팅",
      "VIP 이벤트 초대",
      "BETA버전 체험 가능",
      "우선지원",
      "우선순위 높은 고객상담",
    ],
    price: "월 43,000원",
    color: "#E5E4E2",
  },
];

const TierPlan = () => {
  return (
    <div className="TierPlan">
      <h1>일름보 지원플랜</h1>
      <h4>오직 맴버십만 드리는 특별혜택!</h4>
      <div className="tier-plan">
        {tiers.map((tier, index) => (
          <Link
            key={index}
            to={`/user/payment/${tier.name}`}
            className="tier-link"
          >
            <div className="tier" style={{ borderColor: tier.color }}>
              <h2 style={{ color: tier.color }}>{tier.name}</h2>
              <ul>
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
              <p>{tier.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TierPlan;
