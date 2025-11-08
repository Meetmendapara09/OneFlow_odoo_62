"use client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Sample data based on our projects and tasks
const projectProgressData = [
  { name: "Student Portal Revamp", progress: 65, status: "In Progress" },
  { name: "HRMS Integration", progress: 15, status: "Planned" },
  { name: "Finance Workflows", progress: 35, status: "On Hold" },
  { name: "AI Pilot", progress: 100, status: "Completed" },
  { name: "Campus IoT Network", progress: 68, status: "In Progress" },
  { name: "Library Management", progress: 5, status: "Planned" },
];

const taskStatusData = [
  { name: "New", value: 1, color: "#E2E8F0" },
  { name: "In Progress", value: 3, color: "#2563EB" },
  { name: "Blocked", value: 1, color: "#EF4444" },
  { name: "Done", value: 1, color: "#22C55E" },
];

const monthlyProgressData = [
  { month: "Jun", completed: 45, inProgress: 12, planned: 8 },
  { month: "Jul", completed: 68, inProgress: 15, planned: 10 },
  { month: "Aug", completed: 89, inProgress: 18, planned: 12 },
  { month: "Sep", completed: 125, inProgress: 22, planned: 15 },
  { month: "Oct", completed: 156, inProgress: 25, planned: 18 },
  { month: "Nov", completed: 178, inProgress: 28, planned: 20 },
];

const teamUtilizationData = [
  { member: "Jane", hours: 160, capacity: 180 },
  { member: "Raj", hours: 145, capacity: 180 },
  { member: "Sara", hours: 172, capacity: 180 },
  { member: "Neil", hours: 155, capacity: 180 },
  { member: "V. Mehta", hours: 168, capacity: 180 },
  { member: "K. Desai", hours: 140, capacity: 180 },
];

const financialData = [
  { month: "Jun", revenue: 125000, cost: 45000 },
  { month: "Jul", revenue: 138000, cost: 48000 },
  { month: "Aug", revenue: 152000, cost: 52000 },
  { month: "Sep", revenue: 145000, cost: 49000 },
  { month: "Oct", revenue: 168000, cost: 55000 },
  { month: "Nov", revenue: 182000, cost: 58000 },
];

export default function AnalyticsPage() {
  const totalProjects = projectProgressData.length;
  const tasksCompleted = taskStatusData.find(t => t.name === "Done")?.value || 0;
  const totalTasks = taskStatusData.reduce((sum, t) => sum + t.value, 0);
  const totalHours = teamUtilizationData.reduce((sum, m) => sum + m.hours, 0);
  const avgProgress = Math.round(
    projectProgressData.reduce((sum, p) => sum + p.progress, 0) / projectProgressData.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <select className="input input-sm">
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
          <option>Last Month</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Projects</div>
          <div className="stat-value text-primary">{totalProjects}</div>
          <div className="stat-desc">Across all statuses</div>
        </div>
        <div className="stat">
          <div className="stat-title">Tasks Completed</div>
          <div className="stat-value metric-profit">{tasksCompleted}/{totalTasks}</div>
          <div className="stat-desc">↗︎ {Math.round((tasksCompleted / totalTasks) * 100)}% completion rate</div>
        </div>
        <div className="stat">
          <div className="stat-title">Hours Logged</div>
          <div className="stat-value metric-hours">{totalHours}</div>
          <div className="stat-desc">This month</div>
        </div>
        <div className="stat">
          <div className="stat-title">Avg Progress</div>
          <div className="stat-value text-secondary">{avgProgress}%</div>
          <div className="stat-desc">Across active projects</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Progress Chart */}
        <div className="card card-primary">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Project Progress Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="progress" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="card card-success">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Task Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Progress Trend */}
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Monthly Task Completion Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="1"
                  stroke="#22C55E" 
                  fill="#22C55E" 
                  name="Completed"
                />
                <Area 
                  type="monotone" 
                  dataKey="inProgress" 
                  stackId="1"
                  stroke="#2563EB" 
                  fill="#2563EB" 
                  name="In Progress"
                />
                <Area 
                  type="monotone" 
                  dataKey="planned" 
                  stackId="1"
                  stroke="#0EA5E9" 
                  fill="#0EA5E9" 
                  name="Planned"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Utilization */}
        <div className="card card-warning">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Team Utilization (Hours)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamUtilizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="member" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="hours" fill="#6366F1" name="Hours Logged" radius={[0, 8, 8, 0]} />
                <Bar dataKey="capacity" fill="#E2E8F0" name="Capacity" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Chart */}
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Financial Overview (Revenue vs Cost)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '0.5rem'
                }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#16A34A" 
                strokeWidth={3}
                name="Revenue"
                dot={{ fill: '#16A34A', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Cost"
                dot={{ fill: '#EF4444', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

