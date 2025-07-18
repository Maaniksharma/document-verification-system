import { Button, message, Space } from "antd";
import DocumentsTable from "./DocumentsTable";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchDocRequestFields } from "../../api/reader";
import { useParams } from "react-router-dom";
import { downloadExcelTemplate } from "../../utils/downloadExcelTemplate";
import UploadBulkSheetModal from "./UploadBulkSheetModal";

const ManageDocuments = () => {
  const [isFieldsLoaded, setIsFieldsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fields, setFields] = useState([]);
  const { id: readerId, reqId: docRequestId } = useParams();
  const [modalTrigger, setModalTrigger] = useState(true);

  async function getDocRequestFields() {
    if (!readerId || !docRequestId) {
      setIsFieldsLoaded(false);
      return;
    }
    const fields = await fetchDocRequestFields(readerId, docRequestId);
    if (fields) {
      setFields(fields);
      setIsFieldsLoaded(true);
      return;
    }
    setIsFieldsLoaded(false);
  }

  const createBulkSheet = () => {
    if (!isFieldsLoaded) {
      message.info("Try after sometime");
      return;
    }
    setIsDownloading(true);
    downloadExcelTemplate(fields);
    setIsDownloading(false);
  };

  useEffect(() => {
    getDocRequestFields();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-[12px]">
        <div className=" flex justify-between items-center">
          <div className="text-xl font-semibold">Documents</div>
          <Space>
            <Button
              icon={<UploadOutlined />}
              type="primary"
              onClick={() => {
                setModalTrigger((current) => !current);
              }}
            >
              Upload Bulk Sheet
            </Button>
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              onClick={createBulkSheet}
              loading={isDownloading}
            >
              Download Bulk Upload Sheet
            </Button>
          </Space>
        </div>
        <DocumentsTable />
        <UploadBulkSheetModal triggerOpen={modalTrigger} />
      </div>
    </div>
  );
};

export default ManageDocuments;
