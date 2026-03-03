import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatsCard from "@/components/dashboard/StatsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { Database, CheckCircle, Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#3B82F6", "#8B5CF6", "#F97316", "#10B981", "#EC4899", "#F59E0B", "#64748B"];

export default function Dashboard() {
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: () => base44.entities.DataRecord.list("-created_date")
  });

  const stats = {
    total: records.length,
    cities: new Set(records.map((r) => r.city).filter(Boolean)).size,
    pending: records.filter((r) => r.status === "pending").length,
    solved: records.filter((r) => r.status === "solved").length
  };

  // Records by city
  const cityData = Object.entries(
    records.reduce((acc, r) => {
      if (r.city) acc[r.city] = (acc[r.city] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Solved by month
  const solvedByMonth = Object.entries(
    records
      .filter((r) => r.status === "solved")
      .reduce((acc, r) => {
        const month = r.insertion_date?.slice(0, 7) || "Unknown";
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, solved]) => ({
      month: new Date(month + "-01").toLocaleDateString("en", { month: "short", year: "2-digit" }),
      solved
    }));

  // Motivation breakdown
  const motivationData = Object.entries(
    records.reduce((acc, r) => {
      if (r.motivation) acc[r.motivation] = (acc[r.motivation] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Status donut
  const pendingRecords = records.filter((r) => r.status === "pending");
  const countByAge = (min, max) => pendingRecords.filter((r) => {
    if (!r.insertion_date) return false;
    const days = Math.floor((new Date() - new Date(r.insertion_date)) / 86400000);
    return days >= min && (max === null || days <= max);
  }).length;

  const statusData = [
    { name: "Solved", value: stats.solved, color: "#16A34A" },
    { name: "Pending 1–5d", value: countByAge(0, 5), color: "#EAB308" },
    { name: "Pending 6–10d", value: countByAge(6, 10), color: "#F97316" },
    { name: "Pending 11–15d", value: countByAge(11, 15), color: "#EF4444" },
    { name: "Pending 15+d", value: countByAge(16, null), color: "#7F1D1D" },
  ].filter((d) => d.value > 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of all records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Records" value={stats.total} icon={Database} />
        <StatsCard title="Cities" value={stats.cities} icon={MapPin} />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} />
        <StatsCard title="Solved" value={stats.solved} icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Records by City">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="value" name="Records" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Solved by Month">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solvedByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="solved"
                  name="Solved"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Status Distribution">
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Motivation Breakdown">
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={motivationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {motivationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}