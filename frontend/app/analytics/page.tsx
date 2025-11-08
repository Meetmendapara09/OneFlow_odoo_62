export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Total Projects", value: 12 },
          { label: "Tasks Completed", value: 340 },
          { label: "Hours Logged", value: 1280 },
        ].map(k => (
          <div key={k.label} className="stat bg-base-100 shadow rounded-box">
            <div className="stat-title">{k.label}</div>
            <div className="stat-value text-primary">{k.value}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Project Progress %</h2>
            <p className="text-sm text-base-content/70">Chart placeholder.</p>
            <progress className="progress progress-primary w-full" value={65} max={100} />
          </div>
        </div>
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Utilization</h2>
            <p className="text-sm text-base-content/70">Chart placeholder.</p>
            <progress className="progress progress-secondary w-full" value={72} max={100} />
          </div>
        </div>
      </div>
    </div>
  );
}

