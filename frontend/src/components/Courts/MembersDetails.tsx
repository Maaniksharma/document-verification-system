import { Tabs, type TabsProps } from "antd";
import ReadersTable from "./ReadersTable";
import OfficersTable from "./OfficersTable";

const MembersDetails = () => {
  const onChange = (key: string) => {};

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Readers",
      children: <ReadersTable />,
    },
    {
      key: "2",
      label: "Officers",
      children: <OfficersTable />,
    },
  ];

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text-xl font-semibold">Member Details</div>
      {/* <div className="w-full h-[1px] bg-gray-200"></div> */}
      <Tabs defaultActiveKey="1" items={tabs} onChange={onChange} />
    </div>
  );
};

export default MembersDetails;
