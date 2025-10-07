import { Table } from "antd";
import { useDocumentsTableColumns } from "../../hooks/useDocumentsTableColumns";
import useOfficer from "../../hooks/useOfficer";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { ActionTypes } from "../../../reducers/OfficerInfoReducer";
// import SelectOfficerModal from "./SelectOfficerModal";
import type { AssignableOfficerData } from "../../api/reader";
import useTriggerEffect from "../../hooks/useTriggerEffect";
import type { OfficerDetail } from "./SelectOfficerModal";
import { fetchAssignedDocuments } from "../../api/officer";
const DocumentsToSign = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignableOfficers, setAssignableOfficers] = useState<
    AssignableOfficerData[]
  >([]);
  const { columns, triggerModal, docId } = useDocumentsTableColumns();
  const params = useParams();
  const { state, dispatch } = useOfficer();
  async function getDocuments() {
    if (!params.id || !params.reqId!) {
      return;
    }
    const { documents } = await fetchAssignedDocuments(params.id, params.reqId);
    dispatch({ type: ActionTypes.SET_DOCUMENTS, payload: documents });
  }

  async function getAssignableOfficers() {
    // const { officers } = await fetchAssignableOfficers(params.id as string);

    setAssignableOfficers(officers as AssignableOfficerData[]);
    setIsModalOpen(true);
  }

  useEffect(() => {
    getDocuments();
  }, []);

  function closeModal() {
    setIsModalOpen(false);
  }

  useTriggerEffect(triggerModal, () => {
    getAssignableOfficers();
  });

  async function handleOk(officerDetail: OfficerDetail) {
    const data = await assignOfficer(
      params.id as string,
      params.reqId as string,
      docId,
      officerDetail.id
    );
    if (data) {
      setIsModalOpen(false);
      dispatch({
        type: ActionTypes.ASSIGN_OFFICER,
        payload: { email: officerDetail.email, id: docId },
      });
    }
  }

  return (
    <>
      <Table columns={columns} dataSource={state.currentDocumentsToShow} />
      {/* <SelectOfficerModal
        isModalOpen={isModalOpen}
        assignableOfficers={assignableOfficers}
        docId={docId}
        closeModal={closeModal}
        handleOk={handleOk}
      /> */}
    </>
  );
};

export default DocumentsToSign;
