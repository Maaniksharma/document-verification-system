import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import DocRequestDetails from "../components/Reader/DocReqDetails";
import ManageDocuments from "../components/Reader/ManageDocuments";
import { fetchAssignedDocRequestDetails } from "../api/officer";
import AssignedDocRequestDetails from "../components/officer/AssignedDocRequestDetails";
import DocumentsToSign from "../components/officer/DocumentsToSign";

interface DocRequestDetails {
  name: string;
  location: string;
  description: string;
  totalDocuments: number;
  totalFields: number;
  totalSignedDocuments: number;
  totalDocumentsSent: number;
  creationDate: Date;
  isLoading: boolean;
}

const AssignedDocReqInfo = () => {
  const params = useParams();
  const [detailsLoading, setDetailsLoading] = useState(true);

  const [docRequestDetails, setDocRequestDetails] = useState<
    DocRequestDetails | undefined
  >();
  async function getReqDetails(id: string, reqId: string) {
    const docRequestDetails = await fetchAssignedDocRequestDetails(id, reqId);
    console.log(docRequestDetails);
    if (!docRequestDetails) {
      setDetailsLoading(false);
      return;
    }
    setDocRequestDetails(docRequestDetails);
    setDetailsLoading(false);
  }

  useEffect(() => {
    const id = params.id;
    const reqId = params.reqId;
    if (id) getReqDetails(id, reqId);
  }, []);

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex flex-col gap-[12px]">
        <div className="text-xl font-semibold">
          Assigned Document Request Information
        </div>
        <AssignedDocRequestDetails
          isLoading={detailsLoading}
          {...docRequestDetails}
        />
      </div>
      <DocumentsToSign />
    </div>
  );
};

export default AssignedDocReqInfo;
