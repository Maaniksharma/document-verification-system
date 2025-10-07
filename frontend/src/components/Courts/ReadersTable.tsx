import { Table } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReaderPages } from "../../api/court";
import { useReadersTableColumns } from "../../hooks/useReadersTableColumns";

const ReadersTable = () => {
  const { columns } = useReadersTableColumns();
  const [readersData, setReadersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  async function getReadersData(id: string) {
    const { data } = await fetchReaderPages(currentPage, id);
    if (!data) {
      setIsLoading(false);
    }
    setReadersData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    const id = params.courtId;
    if (id) getReadersData(id);
  }, []);

  return (
    <Table dataSource={readersData} columns={columns} loading={isLoading} />
  );
};

export default ReadersTable;
