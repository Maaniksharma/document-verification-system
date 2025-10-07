import { type TableProps, type MenuProps, Dropdown, Button, Tag } from "antd";
import { formatTimestamp } from "../utils/generic";
import { useParams } from "react-router-dom";
import { useState } from "react";

export interface DocumentPageType {
  id: string;
  key: string;
  name: string;
  creationDate: string;
  status: "draft" | "signature-pending" | "signed";
  assignedOfficer: string;
}

export const useDocumentsTableColumns = () => {
  const { id, reqId } = useParams();
  const [triggerModal, setTriggerModal] = useState(false);
  const [docId, setDocId] = useState<string>("");

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

  const handleMenuClick = async (key: string, docId: string) => {
    if (key == "information") {
      const anchorTag = document.createElement("a");
      anchorTag.href =
        import.meta.env.VITE_backend_url +
        `/api/reader/${id}/docRequests/${reqId}/documents/${docId}/download`;
      anchorTag.style.display = "none";
      anchorTag.target = "blank";
      document.body.appendChild(anchorTag);
      anchorTag.click();
      document.body.removeChild(anchorTag);
    } else if (key == "send") {
      setDocId(docId);
      setTriggerModal(!triggerModal);
    } else {
      console.log("Other action:", key);
    }
  };

  const statusColors = {
    draft: "gray",
    "signature-pending": "yellow",
    signed: "green",
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
      align: "center",
      width: 180,
      ellipsis: true,
      render: (value) => formatTimestamp(value),
    },
    {
      title: <div className="text-center w-full">Status</div>,
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140,
      render: (status: DocumentPageType["status"]) => {
        return (
          <Tag color={statusColors[status]} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: <div className="text-center w-full">Assigned Officer</div>,
      dataIndex: "assignedOfficer",
      key: "assignedOfficer",
      align: "center",
      width: 180,
      ellipsis: true,
      render: (value) => value || "Unassigned",
    },
    {
      title: <div className="text-center w-full">Actions</div>,
      dataIndex: "actions",
      key: "actions",
      width: 140,
      align: "center",
      render: (_text, record: DocumentPageType) => {
        const filteredMenu = [...menuItems];
        if (record.status == "draft") {
          filteredMenu.splice(2, 0, {
            key: "send",
            label: "Send for signature",
          });
        }
        return (
          <Dropdown
            menu={{
              items: filteredMenu,
              onClick: ({ key }) => handleMenuClick(key, record.id),
            }}
            placement="bottomLeft"
          >
            <Button type="text" className="!p-2">
              <img src="/svg/ellipse.svg" className="w-[16px]" alt="" />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return { triggerModal, docId, columns };
};
