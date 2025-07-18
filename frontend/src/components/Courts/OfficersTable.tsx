import { Table } from "antd";
import { fetchOfficerPages } from "../../api/Court";
import { useParams } from "react-router-dom";
import { useOfficersTableColumns } from "../../hooks/useOfficersTableColumns";
import { useEffect, useState } from "react";

const OfficersTable = () => {
  const { columns } = useOfficersTableColumns();
  const [officersData, setOfficersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  async function getOfficersData(id: string) {
    const { data } = await fetchOfficerPages(currentPage, id);
    console.log("officerData", data);
    if (!data) {
      setIsLoading(false);
    }
    setOfficersData(data);
    setIsLoading(false);
  }
  useEffect(() => {
    const id = params.courtId;
    if (id) getOfficersData(id);
  }, []);
  return (
    <Table dataSource={officersData} columns={columns} loading={isLoading} />
  );
};

export default OfficersTable;
