import React from "react";
import TierPlan from "../../components/user/TierPlan";
import "../../styles/tierPlan.scss";
import DefaultLayout from "../../layouts/DefaultLayout";

const TierPlanPage = () => {
  return (
    <DefaultLayout>
      <TierPlan />
    </DefaultLayout>
  );
};

export default TierPlanPage;
