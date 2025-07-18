import type { DescriptionsProps } from "antd";
import { Descriptions, Skeleton } from "antd";

interface CourtDetailsProps {
  name?: string;
  location?: string;
  description?: string;
  totalOfficers?: number;
  totalReaders?: number;
  documentSigned?: number;
  documentsYetToSigned?: number;
  isLoading: boolean;
}

const CourtDetails: React.FC<CourtDetailsProps> = ({
  name,
  location,
  description,
  totalOfficers,
  totalReaders,
  documentSigned,
  documentsYetToSigned,
  isLoading,
}) => {
  if (isLoading) return <Skeleton />;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Name",
      children: name,
    },
    {
      key: "2",
      label: "Location",
      children: location,
    },
    {
      key: "3",
      span: 2,
      label: "Documents Not Signed",
      children: documentsYetToSigned,
    },
    {
      key: "4",
      label: "Total Officers",
      children: totalOfficers,
    },
    {
      key: "5",
      label: "Total Readers",
      children: totalReaders,
    },
    {
      key: "6",
      label: "Documents Signed",
      children: documentSigned,
    },
    {
      key: "7",
      label: "Description",
      children: description,
    },
  ];
  return <Descriptions className="" bordered items={items} />;
};

export default CourtDetails;
