import { useState } from "react";
import useAdmin from "./useAdmin";
import {
  type TableProps,
  Dropdown,
  Button,
  Modal,
  type MenuProps,
  Form,
} from "antd";
import CreateMemberForm from "../components/Courts/CreateMemberForm";
import type { Credentials } from "../api/auth";
import { createMember } from "../api/court";
import { ActionTypes } from "../../reducers/AdminDataReducer";
import { useNavigate } from "react-router-dom";

export interface CourtPageType {
  key: string;
  id: string;
  name: string;
  totalOfficers: number;
  totalReaders: number;
  totalSignaturesCompleted: number;
}

export const useCourtTableColumns = () => {
  const { state, dispatch } = useAdmin();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  async function createMemberHandler(credentials: Credentials) {
    setIsModalLoading(true);
    const data = await createMember({
      ...credentials,
      courtId: selectedCourtId,
    });
    if (!data) {
      setIsModalLoading(false);
      setIsModalOpen(false);
      return;
    }
    dispatch({
      type: ActionTypes.CREATE_MEMBER,
      payload: { role: credentials.role, courtId: selectedCourtId },
    });
    setIsModalLoading(false);
    setIsModalOpen(false);
    return;
  }

  const handleMenuClick = (key: string, id: string) => {
    if (key === "create") {
      console.log(id);
      setIsModalOpen(true);
      setSelectedCourtId(id);
    } else if (key == "information") {
      navigate(`/overview/court/${id}`);
    } else {
      console.log("Other action:", key);
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "create",
      label: "Create member",
    },
    {
      key: "information",
      label: "Show info",
    },
    {
      key: "remove",
      label: "Remove",
      danger: true,
    },
  ];

  const columns: TableProps<CourtPageType>["columns"] = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_text, _record, index) => index + 1,
      align: "center",
    },
    {
      title: "Court Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Officers",
      dataIndex: "totalOfficers",
      key: "officers",
      align: "center",
    },
    {
      title: "Readers",
      dataIndex: "totalReaders",
      key: "totalReaders",
      align: "center",
    },
    {
      title: "Documents signed",
      dataIndex: "documentsSigned",
      key: "documentsSigned",
      align: "center",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_text, record: CourtPageType) => (
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

  const addMemberModal = (
    <Modal
      open={isModalOpen}
      closable={{ "aria-label": "Custom Close Button" }}
      title="Create New Member"
      onCancel={() => setIsModalOpen(false)}
      onOk={async () => {
        const values = (await form.validateFields()) as Credentials;
        createMemberHandler(values);
      }}
      loading={isModalLoading}
      centered
    >
      <CreateMemberForm form={form} />
    </Modal>
  );

  return { columns, addMemberModal };
};
