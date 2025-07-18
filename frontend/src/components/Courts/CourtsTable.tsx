import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import CreateCourt from "./CreateCourt";
import {
  createCourt,
  fetchCourtsPages,
  type CourtDetail,
} from "../../api/Court";
import { ActionTypes } from "../../../reducers/AdminDataReducer";
import useAdmin from "../../hooks/useAdmin";
import { useCourtTableColumns } from "../../hooks/useCourtTableColumns";

const CourtsTable: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [createCourtLoading, setCreateCourtLoading] = useState(false);
  const [courtsLoading, setCourtsLoading] = useState(true);
  const { columns, addMemberModal } = useCourtTableColumns();
  const { state, dispatch } = useAdmin();

  async function getCourtPage() {
    const { data } = await fetchCourtsPages(state.currentPage);
    dispatch({ type: ActionTypes.INIT, payload: { courtPage: data } });
    setCourtsLoading(false);
  }

  useEffect(() => {
    getCourtPage();
  }, []);

  async function createCourtHandler(courtDetails: CourtDetail) {
    setCreateCourtLoading(true);
    const data = await createCourt(courtDetails);
    console.log(data);
    if (!data) {
      setCreateCourtLoading(false);
      setOpen(false);
      return;
    }
    dispatch({ type: ActionTypes.CREATE_COURT, payload: data.courtDetail });
    setCreateCourtLoading(false);
    setOpen(false);
    return;
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className="py-[40px] flex flex-col gap-[12px]">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">Courts Overview</div>
        <Button size="middle" type="primary" onClick={showDrawer}>
          + Add New Court
        </Button>
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>
      <Table
        columns={columns}
        dataSource={state?.courtPage}
        loading={courtsLoading}
      />
      <CreateCourt
        onClose={onClose}
        open={open}
        submitHandler={createCourtHandler}
        isLoading={createCourtLoading}
      />
      {addMemberModal}
    </div>
  );
};

export default CourtsTable;
