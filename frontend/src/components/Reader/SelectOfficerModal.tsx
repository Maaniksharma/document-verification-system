import { Modal, Select } from "antd";
import type { AssignableOfficerData } from "../../api/reader";
import { useState } from "react";

interface SelectOfficerModalProps {
  isModalOpen: boolean;
  assignableOfficers: AssignableOfficerData[];
  docId: string;
  closeModal: () => void;
  handleOk: (officerId: OfficerDetail) => void;
}

export interface OfficerDetail {
  email: string;
  id: string;
}

const SelectOfficerModal: React.FC<SelectOfficerModalProps> = ({
  isModalOpen,
  assignableOfficers,
  closeModal,
  handleOk,
}) => {
  const [selectedOfficerDetail, setSelectedOfficerDetail] = useState<string>();

  const selectOptions = assignableOfficers.map((officerDetail) => ({
    value: JSON.stringify(officerDetail),
    label: officerDetail.email,
  }));

  return (
    <div>
      <Modal
        title="Select Officer"
        open={isModalOpen}
        onCancel={closeModal}
        okText="Assign"
        onOk={() => {
          if (!selectedOfficerDetail) {
            return;
          }
          handleOk(JSON.parse(selectedOfficerDetail));
        }}
      >
        <Select
          placeholder="Select an officer"
          className="w-[200px] !my-[20px]"
          popupMatchSelectWidth={200}
          options={selectOptions}
          onChange={(value) => setSelectedOfficerDetail(value)}
        />
      </Modal>
    </div>
  );
};

export default SelectOfficerModal;
