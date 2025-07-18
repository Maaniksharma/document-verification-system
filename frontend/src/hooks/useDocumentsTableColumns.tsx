import { type TableProps, type MenuProps, Dropdown, Button } from "antd";
import { formatTimestamp } from "../utils/generic";
import { useNavigate } from "react-router-dom";

export interface DocumentPageType {
  id: string;
  key: string;
  name: string;
  creationDate: string;
  status: string;
  assignedOfficer: string;
}

export const useDocumentsTableColumns = () => {
  const navigate = useNavigate();

  const menuItems: MenuProps["items"] = [
    {
      key: "information",
      label: "Download",
    },
    {
      key: "1",
      label: "Preview",
    },
    {
      key: "2",
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

  const columns: TableProps<DocumentPageType>["columns"] = [
    {
      title: <div className="text-center w-full">No.</div>,
      dataIndex: "index",
      key: "index",
      render: (_text, _record, index) => index + 1,
      align: "left",
      width: 60,
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
      className: "max-w-[200px]",
    },
    {
      title: <div className="text-center w-full">Creation Date</div>,
      dataIndex: "creationDate",
      key: "creationDate",
      align: "right",
      width: 140,
      ellipsis: true,
      render: (value) => formatTimestamp(value),
    },
    {
      title: <div className="text-center w-full">Status</div>,
      dataIndex: "status",
      key: "status",
      align: "right",
      width: 120,
      ellipsis: true,
    },
    {
      title: <div className="text-center w-full">Assigned Officer</div>,
      dataIndex: "assignedOfficer",
      key: "assignedOfficer",
      align: "right",
      width: 160,
      ellipsis: true,
    },
    {
      title: <div className="text-center w-full">Actions</div>,
      dataIndex: "actions",
      key: "actions",
      width: 140,
      render: (_text, record: DocumentPageType) => (
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
