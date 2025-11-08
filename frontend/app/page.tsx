interface Feature {
	icon: string;
	title: string;
	description: string;
}

interface Step {
	number: string;
	title: string;
	description: string;
}

interface Benefit {
	icon: string;
	title: string;
	description: string;
}

const features: Feature[] = [
	{
		icon: "📊",
		title: "Project Management",
		description: "Create, track, and manage projects with ease. Assign tasks, set deadlines, and monitor progress in real-time with intuitive dashboards."
	},
	{
		icon: "✅",
		title: "Task Tracking",
		description: "Break down projects into actionable tasks. Set priorities, track time, and collaborate with team members seamlessly."
	},
	{
		icon: "📈",
		title: "Advanced Analytics",
		description: "Get deep insights into your workflow with powerful analytics. Track productivity, resource allocation, and project metrics."
	},
	{
		icon: "💰",
		title: "Financial Management",
		description: "Manage invoices, expenses, and financial documents in one place. Track budgets and generate financial reports effortlessly."
	},
	{
		icon: "⏱️",
		title: "Time Tracking",
		description: "Log hours worked, track billable time, and generate accurate timesheets for payroll and client billing."
	},
	{
		icon: "🔐",
		title: "Secure & Reliable",
		description: "Enterprise-grade security with role-based access control. Your data is encrypted and backed up automatically."
	}
];

const howItWorks: Step[] = [
	{
		number: "01",
		title: "Sign Up & Set Up",
		description: "Create your account in seconds. Set up your organization profile and invite your team members."
	},
	{
		number: "02",
		title: "Create Projects",
		description: "Start by creating projects. Define goals, set timelines, and establish milestones for tracking progress."
	},
	{
		number: "03",
		title: "Assign & Collaborate",
		description: "Break projects into tasks, assign them to team members, and collaborate in real-time with comments and updates."
	},
	{
		number: "04",
		title: "Track & Analyze",
		description: "Monitor progress with dashboards, generate reports, and make data-driven decisions to optimize your workflow."
	}
];

const benefits: Benefit[] = [
	{
		icon: "🚀",
		title: "Boost Productivity",
		description: "Streamline workflows and eliminate bottlenecks. Our platform helps teams work 40% faster on average."
	},
	{
		icon: "💡",
		title: "Better Collaboration",
		description: "Keep everyone on the same page with centralized communication, file sharing, and real-time updates."
	},
	{
		icon: "📱",
		title: "Access Anywhere",
		description: "Fully responsive design works on desktop, tablet, and mobile. Work from anywhere, anytime."
	},
	{
		icon: "🎯",
		title: "Stay Organized",
		description: "No more scattered tools and lost information. Everything you need in one unified platform."
	}
];

const stats = [
	{ value: "500+", label: "Active Users" },
	{ value: "2,500+", label: "Projects Completed" },
	{ value: "15,000+", label: "Tasks Managed" },
	{ value: "99.9%", label: "Uptime" }
];

const faqs = [
	{
		question: "What is OneFlow?",
		answer: "OneFlow is an integrated project and task management platform designed for streamlined workflows. It consolidates project tracking, task management, time tracking, and financial oversight into a single, easy-to-use interface."
	},
	{
		question: "Who can use OneFlow?",
		answer: "OneFlow is designed for teams, organizations, and individuals who need efficient project and task management. Different roles have customized access to features relevant to their needs."
	},
	{
		question: "Is my data secure?",
		answer: "Yes! We use enterprise-grade encryption, secure authentication, and regular backups. Your data is stored securely and only accessible to authorized users with proper permissions."
	},
	{
		question: "Can I integrate with existing Odoo modules?",
		answer: "Absolutely! OneFlow is built as a modern interface layer over existing Odoo modules, providing seamless integration with your current systems while offering a better user experience."
	},
	{
		question: "How do I get started?",
		answer: "Simply click 'Create Account' to sign up. Once registered, you can create your first project and start inviting team members immediately."
	},
	{
		question: "Is there mobile support?",
		answer: "Yes! OneFlow is fully responsive and works seamlessly on mobile devices, tablets, and desktops. Access your projects anywhere, anytime."
	}
];

export default function Home() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="hero min-h-[70vh] bg-linear-to-br from-primary/10 via-base-200 to-secondary/10">
				<div className="hero-content text-center">
					<div className="max-w-3xl space-y-6">
						<div className="badge badge-primary badge-lg">OneFlow Portal</div>
						<h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
							Manage Projects, Tasks & Finances in <span className="text-primary">One Place</span>
						</h1>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							OneFlow is your centralized platform for project management, task tracking, time logging, and financial oversight. 
							Built for efficiency, designed for teams.
						</p>
						<div className="flex flex-wrap justify-center gap-4 pt-4">
							<a href="/signup" className="btn btn-primary btn-lg">
								Get Started Free
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</a>
							<a href="/signin" className="btn btn-outline btn-lg">Sign In</a>
							<a href="#features" className="btn btn-ghost btn-lg">Learn More</a>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-base-100 py-12">
				<div className="container mx-auto px-4">
					<div className="stats stats-vertical lg:stats-horizontal shadow w-full">
						{stats.map((stat, idx) => (
							<div key={idx} className="stat place-items-center">
								<div className="stat-value text-primary">{stat.value}</div>
								<div className="stat-desc text-base font-medium">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-base-200">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							Everything you need to manage projects, collaborate with teams, and drive success—all in one integrated platform.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature, idx) => (
							<div key={idx} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
								<div className="card-body">
									<div className="text-5xl mb-3">{feature.icon}</div>
									<h3 className="card-title text-xl">{feature.title}</h3>
									<p className="text-base-content/70">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 bg-base-100">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4">How It Works</h2>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							Get started in four simple steps and transform the way your team works together.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{howItWorks.map((step, idx) => (
							<div key={idx} className="relative">
								<div className="flex flex-col items-center text-center space-y-4">
									<div className="w-20 h-20 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold shadow-lg">
										{step.number}
									</div>
									<h3 className="font-bold text-xl">{step.title}</h3>
									<p className="text-base-content/70">{step.description}</p>
								</div>
								{idx < howItWorks.length - 1 && (
									<div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-base-300"></div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-base-200">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4">Why Choose OneFlow?</h2>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							Experience the benefits of a unified platform designed specifically for academic and administrative workflows.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{benefits.map((benefit, idx) => (
							<div key={idx} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
								<div className="card-body items-center text-center">
									<div className="text-5xl mb-2">{benefit.icon}</div>
									<h3 className="card-title text-lg">{benefit.title}</h3>
									<p className="text-sm text-base-content/70">{benefit.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Quick Access Section */}
			<section className="py-20 bg-base-100">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4">Quick Access</h2>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							Jump directly to the module you need. Streamlined navigation for faster workflows.
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						{[
							{ name: "Projects", desc: "Create and manage all your projects", icon: "📊", href: "/projects" },
							{ name: "Tasks", desc: "Track tasks and collaborate with teams", icon: "✅", href: "/tasks" },
							{ name: "Analytics", desc: "View insights and performance metrics", icon: "📈", href: "/analytics" }
						].map((item, idx) => (
							<div key={idx} className="card bg-base-100 shadow-lg border border-base-300 hover:border-primary transition-all">
								<div className="card-body">
									<div className="text-4xl mb-2">{item.icon}</div>
									<h3 className="card-title">{item.name}</h3>
									<p className="text-sm text-base-content/70">{item.desc}</p>
									<div className="card-actions justify-end mt-4">
										<a href={item.href} className="btn btn-primary btn-sm">
											Open
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
											</svg>
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20 bg-base-200">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							Have questions? We&apos;ve got answers. Find out everything you need to know about OneFlow.
						</p>
					</div>
					<div className="max-w-3xl mx-auto space-y-4">
						{faqs.map((faq, idx) => (
							<div key={idx} className="collapse collapse-plus bg-base-100 shadow-md">
								<input type="radio" name="faq-accordion" defaultChecked={idx === 0} />
								<div className="collapse-title text-lg font-semibold">
									{faq.question}
								</div>
								<div className="collapse-content">
									<p className="text-base-content/70">{faq.answer}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-linear-to-br from-primary to-secondary text-primary-content">
				<div className="container mx-auto px-4 text-center">
					<div className="max-w-3xl mx-auto space-y-6">
						<h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Workflow?</h2>
						<p className="text-xl opacity-90">
							Join hundreds of users who are already managing their projects more efficiently with OneFlow.
						</p>
						<div className="flex flex-wrap justify-center gap-4 pt-4">
							<a href="/signup" className="btn btn-lg bg-white text-primary hover:bg-base-100">
								Create Free Account
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</a>
							<a href="mailto:support@oneflow.com" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
								Contact Support
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="footer footer-center p-10 bg-base-200 text-base-content">
				<div>
					<p className="font-semibold">OneFlow Portal</p>
					<p className="text-sm opacity-70">© {new Date().getFullYear()} OneFlow. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
