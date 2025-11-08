import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";

export default function StyleGuidePage() {
	return (
		<div className="min-h-screen bg-base-200 py-12">
			<div className="container">
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4 gradient-text">OneFlow Style Guide</h1>
					<p className="text-muted">Complete UI component library based on color.md palette</p>
				</div>

				{/* Project Cards */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Project Cards</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<ProjectCard
							id="demo-1"
							name="Student Portal Revamp"
							description="UI modernization and performance improvements for the student portal."
							manager="A. Patel"
							status="In Progress"
							progress={65}
							deadline="2025-12-01"
							teamSize={5}
							tasksCompleted={13}
							totalTasks={20}
						/>
						<ProjectCard
							id="demo-2"
							name="HRMS Integration"
							description="Sync HR data with core systems."
							manager="R. Singh"
							status="Planned"
							progress={15}
							deadline="2026-01-15"
							teamSize={3}
							tasksCompleted={2}
							totalTasks={15}
						/>
						<ProjectCard
							id="demo-3"
							name="AI Pilot"
							description="Internal experimentation with ML models."
							manager="N. Shah"
							status="Completed"
							progress={100}
							deadline="2025-10-01"
							teamSize={6}
							tasksCompleted={25}
							totalTasks={25}
						/>
					</div>
				</section>

				{/* Task Cards */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Task Cards</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<TaskCard
							id="demo-t1"
							title="Design Wireframes"
							description="Create low-fidelity wireframes for the new student portal interface"
							project="Student Portal Revamp"
							projectId="p1"
							assignee="Jane"
							due="2025-11-20"
							priority="High"
							state="In Progress"
							tags={["design", "UI"]}
							subtaskProgress={{ completed: 3, total: 5 }}
						/>
						<TaskCard
							id="demo-t2"
							title="HR API Mapping"
							description="Map HR API endpoints to our system data structure"
							project="HRMS Integration"
							projectId="p2"
							assignee="Raj"
							due="2025-12-01"
							priority="Medium"
							state="New"
							tags={["backend", "API"]}
							subtaskProgress={{ completed: 0, total: 8 }}
						/>
						<TaskCard
							id="demo-t3"
							title="Deploy to Production"
							description="Final deployment of AI pilot to production environment"
							project="AI Pilot"
							projectId="p4"
							assignee="Neil"
							due="2025-09-20"
							priority="Low"
							state="Done"
							tags={["deployment"]}
							subtaskProgress={{ completed: 10, total: 10 }}
						/>
					</div>
				</section>

				{/* Color Palette */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Color Palette</h2>
					<div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
						<div className="card">
							<div className="bg-primary h-24 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Primary</h3>
								<p className="text-sm text-muted">#2563EB</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-secondary h-24 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Secondary</h3>
								<p className="text-sm text-muted">#0EA5E9</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-success h-24 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Success</h3>
								<p className="text-sm text-muted">#22C55E</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-warning h-24 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Warning</h3>
								<p className="text-sm text-muted">#F59E0B</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-error h-24 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Error</h3>
								<p className="text-sm text-muted">#EF4444</p>
							</div>
						</div>
					</div>
				</section>

				{/* Buttons */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Buttons</h2>
					<div className="card card-body">
						<div className="space-y-4">
							<div className="flex flex-wrap gap-3">
								<button className="btn btn-primary">Primary Button</button>
								<button className="btn btn-secondary">Secondary Button</button>
								<button className="btn btn-success">Success Button</button>
								<button className="btn btn-warning">Warning Button</button>
								<button className="btn btn-error">Error Button</button>
							</div>
							<div className="flex flex-wrap gap-3">
								<button className="btn btn-outline">Outline</button>
								<button className="btn btn-ghost">Ghost</button>
								<button className="btn btn-primary" disabled>Disabled</button>
							</div>
							<div className="flex flex-wrap gap-3 items-center">
								<button className="btn btn-primary btn-sm">Small</button>
								<button className="btn btn-primary">Normal</button>
								<button className="btn btn-primary btn-lg">Large</button>
							</div>
						</div>
					</div>
				</section>

				{/* Badges */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Badges</h2>
					<div className="card card-body">
						<div className="flex flex-wrap gap-3">
							<span className="badge badge-primary">Primary</span>
							<span className="badge badge-secondary">Secondary</span>
							<span className="badge badge-success">Success</span>
							<span className="badge badge-warning">Warning</span>
							<span className="badge badge-error">Error</span>
							<span className="badge badge-neutral">Neutral</span>
							<span className="badge badge-primary badge-lg">Large Badge</span>
						</div>
					</div>
				</section>

				{/* Alerts */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Alerts</h2>
					<div className="space-y-4">
						<div className="alert alert-info">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>This is an informational alert with useful information.</span>
						</div>
						<div className="alert alert-success">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Your action was completed successfully!</span>
						</div>
						<div className="alert alert-warning">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<span>Warning: Please review your settings before proceeding.</span>
						</div>
						<div className="alert alert-error">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Error: Something went wrong. Please try again.</span>
						</div>
					</div>
				</section>

				{/* Cards */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Cards</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="card">
							<div className="card-body">
								<h3 className="card-title">Default Card</h3>
								<p className="text-muted">A standard card with default styling and shadow.</p>
								<div className="card-actions">
									<button className="btn btn-primary btn-sm">Action</button>
								</div>
							</div>
						</div>
						<div className="card card-primary">
							<div className="card-body">
								<h3 className="card-title">Primary Card</h3>
								<p className="text-muted">Card with blue left border accent.</p>
								<div className="card-actions">
									<button className="btn btn-primary btn-sm">View</button>
								</div>
							</div>
						</div>
						<div className="card card-success">
							<div className="card-body">
								<h3 className="card-title">Success Card</h3>
								<p className="text-muted">Card with green left border accent.</p>
								<div className="card-actions">
									<button className="btn btn-success btn-sm">Open</button>
								</div>
							</div>
						</div>
						<div className="card card-warning">
							<div className="card-body">
								<h3 className="card-title">Warning Card</h3>
								<p className="text-muted">Card with amber left border accent.</p>
								<div className="card-actions">
									<button className="btn btn-warning btn-sm">Check</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Stats/KPIs */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Statistics & KPIs</h2>
					<div className="stats stats-vertical lg:stats-horizontal shadow w-full">
						<div className="stat">
							<div className="stat-title">Total Revenue</div>
							<div className="stat-value metric-revenue">$125,430</div>
							<div className="stat-desc">↗︎ 14% since last month</div>
						</div>
						<div className="stat">
							<div className="stat-title">Total Costs</div>
							<div className="stat-value metric-cost">$45,230</div>
							<div className="stat-desc">↘︎ 8% since last month</div>
						</div>
						<div className="stat">
							<div className="stat-title">Net Profit</div>
							<div className="stat-value metric-profit">$80,200</div>
							<div className="stat-desc">↗︎ 22% since last month</div>
						</div>
						<div className="stat">
							<div className="stat-title">Hours Logged</div>
							<div className="stat-value metric-hours">2,450</div>
							<div className="stat-desc">Across all projects</div>
						</div>
					</div>
				</section>

				{/* Progress Bars */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Progress Bars</h2>
					<div className="card card-body space-y-4">
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">Gradient Progress</span>
								<span className="text-sm text-muted">75%</span>
							</div>
							<div className="progress">
								<div className="progress-bar" style={{ width: '75%' }}></div>
							</div>
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">Primary Progress</span>
								<span className="text-sm text-muted">60%</span>
							</div>
							<div className="progress progress-primary">
								<div className="progress-bar" style={{ width: '60%' }}></div>
							</div>
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">Success Progress</span>
								<span className="text-sm text-muted">90%</span>
							</div>
							<div className="progress progress-success">
								<div className="progress-bar" style={{ width: '90%' }}></div>
							</div>
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">Warning Progress</span>
								<span className="text-sm text-muted">45%</span>
							</div>
							<div className="progress progress-warning">
								<div className="progress-bar" style={{ width: '45%' }}></div>
							</div>
						</div>
					</div>
				</section>

				{/* Role/Module Colors */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Role/Module Colors</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="card">
							<div className="bg-role-project-manager h-16 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Project Manager</h3>
								<p className="text-sm text-muted">Blue #2563EB</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-role-team-member h-16 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Team Member</h3>
								<p className="text-sm text-muted">Indigo #6366F1</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-role-sales-finance h-16 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Sales / Finance</h3>
								<p className="text-sm text-muted">Teal #0D9488</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-role-admin h-16 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Admin</h3>
								<p className="text-sm text-muted">Gray #475569</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-role-billing h-16 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Billing / Invoices</h3>
								<p className="text-sm text-muted">Emerald #10B981</p>
							</div>
						</div>
						<div className="card">
							<div className="bg-role-purchase h-16 rounded-t-lg"></div>
							<div className="card-body">
								<h3 className="font-semibold">Purchase / Vendor</h3>
								<p className="text-sm text-muted">Amber #F59E0B</p>
							</div>
						</div>
					</div>
				</section>

				{/* Forms */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Form Elements</h2>
					<div className="card card-body max-w-2xl">
						<div className="form-control">
							<label className="label">Email Address</label>
							<input type="email" className="input" placeholder="you@example.com" />
						</div>
						<div className="form-control">
							<label className="label">Password</label>
							<input type="password" className="input" placeholder="••••••••" />
						</div>
						<div className="form-control">
							<label className="label">Error State</label>
							<input type="text" className="input input-error" placeholder="Invalid input" />
							<span className="text-error text-sm mt-1">This field has an error</span>
						</div>
						<button className="btn btn-primary">Submit Form</button>
					</div>
				</section>

				{/* Typography */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold mb-6">Typography</h2>
					<div className="card card-body space-y-4">
						<h1 className="text-4xl font-bold">Heading 1</h1>
						<h2 className="text-3xl font-bold">Heading 2</h2>
						<h3 className="text-2xl font-semibold">Heading 3</h3>
						<p className="text-base-content">Regular paragraph text with <span className="text-primary">primary color link</span> and <span className="text-secondary">secondary color link</span>.</p>
						<p className="text-muted">Muted text for secondary information.</p>
						<div className="flex gap-4">
							<a href="#" className="link link-primary">Primary Link</a>
							<a href="#" className="link link-secondary">Secondary Link</a>
							<a href="#" className="link link-neutral">Neutral Link</a>
						</div>
					</div>
				</section>

			</div>
		</div>
	);
}
