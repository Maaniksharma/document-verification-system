import { Table } from "antd";
import { useDocReqTableColumns } from "../../hooks/useDocRequestsTable";
import { useEffect, useState } from "react";
import { fetchDocRequests } from "../../api/reader";
import { useParams } from "react-router-dom";
import useReader from "../../hooks/useReader";
import { ActionTypes } from "../../../reducers/ReaderDataReducer";

const DocumentReqTable: React.FC = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { state, dispatch } = useReader();
  const { columns } = useDocReqTableColumns();
  const params = useParams();
  async function getDocRequests() {
    if (!params.id) {
      return;
    }
    const data = await fetchDocRequests(params.id);
    if (data) {
      dispatch({ type: ActionTypes.INIT, payload: { docRequestPage: data } });
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
      dataSource={state.docRequestPage}
    />
  );
};

export default DocumentReqTable;
