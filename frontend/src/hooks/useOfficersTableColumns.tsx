import { type TableProps } from "antd";
import { formatTimestamp } from "../utils/generic";

export interface OfficerPageType {
  key: string;
  id: string;
  email: string;
  joiningDate: string;
  documentsSigned: number;
}

export const useOfficersTableColumns = () => {
  const columns: TableProps<OfficerPageType>["columns"] = [
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
      title: "Documents Signed",
      dataIndex: "documentsSigned",
      key: "documentsSigned",
      align: "center",
    },
  ];

  return { columns };
};
