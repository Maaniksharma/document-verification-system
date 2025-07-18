import { Button } from "antd";
import DocumentReqTable from "../components/Reader/DocumentReqTable";
import CreateDocReq from "../components/Reader/CreateDocReq";
import { useState } from "react";
import { createDocRequest } from "../api/reader";
import { useParams } from "react-router-dom";
import { ActionTypes } from "../../reducers/ReaderDataReducer";
import useReader from "../hooks/useReader";

const ReaderPage = () => {
  const [open, setOpen] = useState(false);
  const [createDocReqLoading, setCreateDocReqLoading] = useState(false);
  const params = useParams();
  const { dispatch } = useReader();
  async function createDocReqHandler(newDocRequestData: FormData) {
    setCreateDocReqLoading(true);
    const id = params.id;
    if (!id) {
      return;
    }
    newDocRequestData.append("id", id);
    const data = await createDocRequest(newDocRequestData);
    if (!data) {
      setCreateDocReqLoading(false);
      setOpen(false);
      return;
    }
    const newDocRequestDataObj = Object.fromEntries(
      newDocRequestData.entries()
    );
    dispatch({
      type: ActionTypes.CREATE_DOC_REQ,
      payload: {
        ...newDocRequestDataObj,
        id: data.docRequestDetail.insertedId,
      },
    });
    setCreateDocReqLoading(false);
    setOpen(false);
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
        <div className="text-xl font-semibold">Review Requests</div>
        <Button size="middle" type="primary" onClick={showDrawer}>
          + Add New Request
        </Button>
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>
      <DocumentReqTable />
      <CreateDocReq
        onClose={onClose}
        open={open}
        submitHandler={createDocReqHandler}
        isLoading={createDocReqLoading}
      />
    </div>
  );
};

export default ReaderPage;
