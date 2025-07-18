import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import DocRequestDetails from "../components/Reader/DocReqDetails";
import { fetchDocRequestDetails } from "../api/reader";
import ManageDocuments from "../components/Reader/ManageDocuments";

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

const DocReqInformation = () => {
  const params = useParams();
  const [detailsLoading, setDetailsLoading] = useState(true);

  const [docRequestDetails, setDocRequestDetails] = useState<
    DocRequestDetails | undefined
  >();
  async function getCourtDetails(id: string, reqId: string) {
    const docRequestDetails = await fetchDocRequestDetails(id, reqId);
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
    if (id) getCourtDetails(id, reqId);
  }, []);

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex flex-col gap-[12px]">
        <div className="text-xl font-semibold">
          Document Request Information
        </div>
        <DocRequestDetails isLoading={detailsLoading} {...docRequestDetails} />
      </div>
      <ManageDocuments />
    </div>
  );
};

export default DocReqInformation;
