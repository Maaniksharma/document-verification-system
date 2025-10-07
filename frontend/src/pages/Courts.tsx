import { useEffect, useState } from "react";
import CourtsTable from "../components/Courts/CourtsTable";
import StatCard from "../components/Courts/StatCard";
import { fetchAdminStats } from "../api/court";

export interface StatsData {
  totalCourts: number;
  totalReaders: number;
  totalOfficers: number;
  totalSignatures: number;
}

const Courts = () => {
  const [statsData, setStatsData] = useState<StatsData>();
  const [isError, setIsError] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  async function getAdminStats() {
    const statsData = await fetchAdminStats();
    if (!statsData) {
      setIsError(true);
      return;
    }
    setStatsData(statsData);
    setStatsLoading(false);
  }

  useEffect(() => {
    getAdminStats();
  }, []);

  if (isError) {
    return <div className="">Some error occured</div>;
  }

  return (
    <div>
      <div className="flex gap-[32px] items-center justify-between">
        <StatCard
          title="Courts"
          data={statsData?.totalCourts}
          isLoading={statsLoading}
        />
        <StatCard
          title="Readers"
          data={statsData?.totalReaders}
          isLoading={statsLoading}
        />
        <StatCard
          title="Officers"
          data={statsData?.totalOfficers}
          isLoading={statsLoading}
        />
        <StatCard
          title="Documents Signed"
          data={statsData?.totalSignatures}
          isLoading={statsLoading}
        />
      </div>
      <CourtsTable />
    </div>
  );
};

export default Courts;
