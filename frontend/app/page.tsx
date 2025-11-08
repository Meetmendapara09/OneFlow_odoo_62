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
				<div className="grid grid-flow-col gap-4">
					<a href="#features" className="link link-hover">Features</a>
					<a href="#" className="link link-hover">Documentation</a>
					<a href="mailto:support@oneflow.com" className="link link-hover">Support</a>
					<a href="#" className="link link-hover">Privacy Policy</a>
				</div>
				<div>
					<div className="grid grid-flow-col gap-4">
						<a href="#" className="link" aria-label="Twitter">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
								<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
							</svg>
						</a>
						<a href="#" className="link" aria-label="GitHub">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
							</svg>
						</a>
						<a href="#" className="link" aria-label="LinkedIn">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
								<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
							</svg>
						</a>
					</div>
				</div>
				<div>
					<p className="font-semibold">OneFlow Portal</p>
					<p className="text-sm opacity-70">© {new Date().getFullYear()} OneFlow. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
