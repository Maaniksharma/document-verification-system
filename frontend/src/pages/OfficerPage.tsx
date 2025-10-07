import React from "react";
import AssignedDocRequestsTable from "../components/Reader/AssignedDocRequestsTable";

const OfficerPage: React.FC = () => {
  return (
    <div className="py-[40px] flex flex-col gap-[12px]">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">Assigned Documents Requests</div>
      </div>
      <AssignedDocRequestsTable />
    </div>
  );
};

export default OfficerPage;
