import { useOverview, useTrends, useRecentActivity } from '../hooks/useStats';
import StatsCard from '../components/dashboard/StatsCard';
import StatusChart from '../components/dashboard/StatusChart';
import TrendChart from '../components/dashboard/TrendChart';
import RecentActivityList from '../components/dashboard/RecentActivity';
import Spinner from '../components/ui/Spinner';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const { data: overview, isLoading: loadingOverview } = useOverview();
  const { data: trends, isLoading: loadingTrends } = useTrends();
  const { data: activity, isLoading: loadingActivity } = useRecentActivity();

  if (loadingOverview) return <Spinner />;

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Dashboard</h2>

      <div className={styles.stats}>
        <StatsCard label="Total Applications" value={overview?.total ?? 0} />
        <StatsCard label="This Week" value={overview?.this_week ?? 0} color="#3b82f6" />
        <StatsCard label="This Month" value={overview?.this_month ?? 0} color="#8b5cf6" />
        <StatsCard
          label="Interview Rate"
          value={overview && overview.total > 0
            ? `${Math.round(((overview.by_status.find(s => s.status === 'Interview')?.count ?? 0) / overview.total) * 100)}%`
            : '0%'}
          color="#f59e0b"
        />
      </div>

      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h3>Applications by Status</h3>
          {overview && <StatusChart data={overview.by_status} />}
        </div>
        <div className={styles.chartCard}>
          <h3>Monthly Trend</h3>
          {loadingTrends ? <Spinner /> : trends && <TrendChart data={trends} />}
        </div>
      </div>

      <div className={styles.activityCard}>
        <h3>Recent Activity</h3>
        {loadingActivity ? <Spinner /> : activity && <RecentActivityList data={activity} />}
      </div>
    </div>
  );
}
