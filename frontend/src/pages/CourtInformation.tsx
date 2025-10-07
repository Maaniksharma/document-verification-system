import { useEffect, useState } from "react";
import CourtDetails from "../components/Courts/CourtDetails";
import { fetchCourtDetails } from "../api/court";
import { useParams } from "react-router-dom";
import MembersDetails from "../components/Courts/MembersDetails";

export interface CourtDetails {
  name: string;
  location: string;
  description: string;
  totalReaders: number;
  totalOfficers: number;
  documentSigned: number;
  documentsYetToSigned: number;
}

const CourtInformation = () => {
  const params = useParams();
  const [detailsLoading, setDetailsLoading] = useState(true);

  const [courtDetails, setCourtDetails] = useState<CourtDetails | undefined>();
  async function getCourtDetails(id: string) {
    const courtDetails = await fetchCourtDetails(id);
    if (!courtDetails) {
      setDetailsLoading(false);
      return;
    }
    setCourtDetails(courtDetails);
    setDetailsLoading(false);
  }

  useEffect(() => {
    const id = params.courtId;
    if (id) getCourtDetails(id);
  }, []);

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex flex-col gap-[12px]">
        <div className="text-xl font-semibold">Court Information</div>
        <CourtDetails isLoading={detailsLoading} {...courtDetails} />
      </div>
      <MembersDetails />
    </div>
  );
};

export default CourtInformation;
