import { Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAssignedRequestsTableColumns } from "../../hooks/useAssignedRequestsColumns";
import { fetchAssignedDocRequests } from "../../api/officer";
import { ActionTypes } from "../../../reducers/OfficerInfoReducer";
import useOfficer from "../../hooks/useOfficer";

const AssignedDocRequestsTable: React.FC = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { state, dispatch } = useOfficer();

  const { columns } = useAssignedRequestsTableColumns();
  const params = useParams();
  async function getDocRequests() {
    if (!params.id) {
      return;
    }
    const data = await fetchAssignedDocRequests(params.id);
    if (data) {
      dispatch({
        type: ActionTypes.SET_ASSIGNED_DOCREQUESTS,
        payload: data.assignedDocRequests,
      });
    }
    setIsDataLoading(false);
  }

  useEffect(() => {
    getDocRequests();
  }, []);

  return (
    <Table
      columns={columns}
      loading={isDataLoading}
      dataSource={state.assignedDocRequestPage}
    />
  );
};

export default AssignedDocRequestsTable;
