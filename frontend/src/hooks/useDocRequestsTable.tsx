import { type TableProps, type MenuProps, Dropdown, Button } from "antd";
import { formatTimestamp } from "../utils/generic";
import { useNavigate } from "react-router-dom";

export interface DocRequestPageType {
  id: string;
  key: string;
  name: string;
  creationDate: string;
  totalDocuments: number;
  totalSignedDocuments: number;
}

export const useDocReqTableColumns = () => {
  const navigate = useNavigate();

  const menuItems: MenuProps["items"] = [
    {
      key: "information",
      label: "Manage Documents",
    },
    {
      key: "1",
      label: "Remove",
      danger: true,
    },
  ];

  const handleMenuClick = (key: string, id: string) => {
    if (key == "information") {
      navigate(`docRequests/${id}`);
    } else {
      console.log("Other action:", key);
    }
  };

  const columns: TableProps<DocRequestPageType>["columns"] = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_text, _record, index) => index + 1,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Creation Date",
      dataIndex: "creationDate",
      key: "creationDate",
      align: "center",
      render: (value) => formatTimestamp(value),
    },
    {
      title: "Total Documents",
      dataIndex: "totalDocuments",
      key: "totalDocuments",
      align: "center",
    },
    {
      title: "Total Signed Documents",
      dataIndex: "totalSignedDocuments",
      key: "totalSignedDocuments",
      align: "center",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_text, record: DocRequestPageType) => (
        <Dropdown
          menu={{
            items: menuItems,
            onClick: ({ key }) => handleMenuClick(key, record.id),
          }}
          placement="bottomLeft"
        >
          <Button type="text" className="!p-2">
            <img src="/svg/ellipse.svg" className="w-[16px]" alt="" />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return { columns };
};
