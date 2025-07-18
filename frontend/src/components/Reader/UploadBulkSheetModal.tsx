import { Modal, Upload, Button, Progress, message } from "antd";
import { useState, useRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import useTriggerEffect from "../../hooks/useTriggerEffect";
import type { UploadFile } from "antd/es/upload/interface";
import { parseExcelFile } from "../../utils/parseExcelFile";
import { useParams } from "react-router-dom";
import { createDocument } from "../../api/reader";

interface UploadBulkSheetModalProps {
  triggerOpen: boolean;
}
function randomDelay() {
  const delay = Math.random() * 10000;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

const UploadBulkSheetModal: React.FC<UploadBulkSheetModalProps> = ({
  triggerOpen,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isDocumentCreating, setIsDocumentCreating] = useState(false);
  const [docCreationPercentage, setDocCreationPercentage] = useState(0);
  const documentCreatedRef = useRef(0);
  const params = useParams();

  useTriggerEffect(triggerOpen, () => {
    setIsModalOpen(true);
  });

  if (!params.id || !params.reqId) {
    return <div className="">Something went wrong</div>;
  }

  function resetModal() {
    setIsModalOpen(false);
    setFileList([]);
    setIsDocumentCreating(false);
    setDocCreationPercentage(0);
  }
  function handleOk() {
    setIsModalOpen(false);
  }
  function handleCancel() {
    setIsModalOpen(false);
  }

  async function createDocuments() {
    documentCreatedRef.current = 0;
    setIsDocumentCreating(true);
    const rawDocuments = await parseExcelFile(
      fileList[0].originFileObj as File
    );
    const totalDocuments = rawDocuments.length;
    await Promise.all(
      rawDocuments.map(async (rawDocument) => {
        await createDocument(
          params.id as string,
          params.reqId as string,
          rawDocument
        );
        await randomDelay();
        documentCreatedRef.current++;
        setDocCreationPercentage(
          (documentCreatedRef.current / totalDocuments) * 100
        );
      })
    );
    resetModal();
    message.success("All documents created successfully");
  }

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
    <div>
      <Modal
        title="Create Documents"
        closable={!isDocumentCreating}
        open={isModalOpen}
        maskClosable={!isDocumentCreating}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="my-[40px] flex flex-col gap-[20px]">
          <div className="flex gap-[20px]">
            <h3>Upload Bulk Sheet</h3>
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />} size="small">
                Click to Upload
              </Button>
            </Upload>
          </div>
          <div className="flex flex-col w-fit">
            <Button
              type="primary"
              disabled={fileList.length === 0 || isDocumentCreating}
              onClick={createDocuments}
            >
              Create Documents
            </Button>
            {isDocumentCreating && (
              <Progress percent={Math.round(docCreationPercentage)} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadBulkSheetModal;
