import type { DescriptionsProps } from "antd";
import { Descriptions, Skeleton } from "antd";
import { formatTimestamp } from "../../utils/generic";

interface DocRequestDetailsProps {
  name?: string;
  location?: string;
  description?: string;
  totalAssignedDocuments?: number;
  totalFields?: number;
  totalDocumentsSigned?: number;
  creationDate?: Date;
  isLoading: boolean;
}

const AssignedDocRequestDetails: React.FC<DocRequestDetailsProps> = ({
  name,
  description,
  totalFields,
  totalAssignedDocuments,
  totalDocumentsSigned,
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
      label: "Total Assigned Documents",
      children: totalAssignedDocuments,
    },
    {
      key: "4",
      label: "Total Documents Signed",
      children: totalDocumentsSigned,
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
    {
      key: "7",
      label: "See Preview",
      children: "Click here to see preview",
    },
  ];
  return <Descriptions className="" bordered items={items} />;
};

export default AssignedDocRequestDetails;
