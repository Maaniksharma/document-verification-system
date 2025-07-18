import { ArrowRightOutlined } from "@ant-design/icons";
import { Card } from "antd";

interface StatCardProps {
  title: string;
  data?: number;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, data, isLoading }) => {
  return (
    <Card
      className="w-[300px] bg-white flex flex-col justify-between"
      loading={isLoading}
    >
      <div className="text-lg text-gray-500">{title}</div>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">{data}</div>
        <ArrowRightOutlined />
      </div>
    </Card>
  );
};

export default StatCard;
