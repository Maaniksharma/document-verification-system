import { Modal, Upload, Button } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import useTriggerEffect from "../../hooks/useTriggerEffect";
import type { UploadFile } from "antd/es/upload/interface";
import { useParams } from "react-router-dom";
import { createSignature } from "../../api/officer";

interface UploadBulkSheetModalProps {
  triggerOpen: boolean;
}

const UploadSignatureModal: React.FC<UploadBulkSheetModalProps> = ({
  triggerOpen,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const params = useParams();

  //   const { dispatch } = useReader();

  useTriggerEffect(triggerOpen, () => {
    setIsModalOpen(true);
  });

  if (!params.id) {
    return <div className="">Something went wrong</div>;
  }

  function resetModal() {
    setIsModalOpen(false);
    setFileList([]);
  }
  function handleOk() {
    setIsModalOpen(false);
  }
  function handleCancel() {
    setIsModalOpen(false);
  }

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  async function submitSignature() {
    const newSignatureData = new FormData();
    if (!params.id) {
      return;
    }
    newSignatureData.append("signature", fileList[0].originFileObj as File);

    await createSignature(params.id, newSignatureData);

    resetModal();
  }

  return (
    <div>
      <Modal
        title="Upload Signature"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="my-[40px] flex flex-col gap-[20px]">
          <div className="flex gap-[20px]">
            <h3>Upload Signature</h3>
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} size="small">
                Click to Upload
              </Button>
            </Upload>
          </div>
          <div className="flex flex-col w-fit" onClick={submitSignature}>
            <Button type="primary" disabled={fileList.length === 0}>
              Create Signature
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadSignatureModal;
