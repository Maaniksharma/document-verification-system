import type { DescriptionsProps } from "antd";
import { Descriptions, Skeleton } from "antd";
import { formatTimestamp } from "../../utils/generic";

interface DocRequestDetailsProps {
  name?: string;
  location?: string;
  description?: string;
  totalDocuments?: number;
  totalFields?: number;
  totalSignedDocuments?: number;
  totalDocumentsSent?: number;
  creationDate?: Date;
  isLoading: boolean;
}

const DocRequestDetails: React.FC<DocRequestDetailsProps> = ({
  name,
  description,
  totalFields,
  totalDocuments,
  totalSignedDocuments,
  totalDocumentsSent,
  creationDate,
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
      label: "Total Fields",
      children: totalFields,
    },
    {
      key: "3",
      span: 2,
      label: "Total Documents",
      children: totalDocuments,
    },
    {
      key: "4",
      label: "Total Signed Documents",
      children: totalSignedDocuments,
    },
    {
      key: "4",
      label: "Total Documents Sent",
      children: totalDocumentsSent,
    },
    {
      key: "5",
      label: "Creation Date",
      children: formatTimestamp(creationDate),
    },
    {
      key: "6",
      label: "Description",
      children: description,
    },
  ];
  return <Descriptions className="" bordered items={items} />;
};

export default DocRequestDetails;
