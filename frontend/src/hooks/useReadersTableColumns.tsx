import { type TableProps } from "antd";
import { formatTimestamp } from "../utils/generic";

export interface ReaderPageType {
  key: string;
  id: string;
  email: string;
  joiningDate: string;
  documentsIssued: number;
  documentsVerified: number;
}

export const useReadersTableColumns = () => {
  const columns: TableProps<ReaderPageType>["columns"] = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_text, _record, index) => index + 1,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      align: "center",
      render: (value) => formatTimestamp(value),
    },
    {
      title: "Documents Issued",
      dataIndex: "documentsIssued",
      key: "documentsSigned",
      align: "center",
    },
    {
      title: "Documents Verified",
      dataIndex: "documentsVerified",
      key: "documentsVerified",
      align: "center",
    },
  ];

  return { columns };
};
