import { Table } from "antd";
import { useDocumentsTableColumns } from "../../hooks/useDocumentsTableColumns";

const DocumentsTable = () => {
  const { columns } = useDocumentsTableColumns();

  return <Table columns={columns} />;
};

export default DocumentsTable;
