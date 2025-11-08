"use client";

import { 
	LayoutDashboard,
	CheckSquare,
	TrendingUp,
	Wallet,
	Timer,
	Shield,
	Rocket,
	Lightbulb,
	Smartphone,
	Target,
	Users,
	FolderKanban,
	BarChart3
} from "lucide-react";

const features = [
	{
		icon: LayoutDashboard,
		title: "Project Management",
		description: "Create, track, and manage projects with ease. Assign tasks, set deadlines, and monitor progress in real-time with intuitive dashboards.",
		color: "from-blue-500 to-cyan-500"
	},
	{
		icon: CheckSquare,
		title: "Task Tracking",
		description: "Break down projects into actionable tasks. Set priorities, track time, and collaborate with team members seamlessly.",
		color: "from-green-500 to-emerald-500"
	},
	{
		icon: TrendingUp,
		title: "Advanced Analytics",
		description: "Get deep insights into your workflow with powerful analytics. Track productivity, resource allocation, and project metrics.",
		color: "from-purple-500 to-pink-500"
	},
	{
		icon: Wallet,
		title: "Financial Management",
		description: "Manage invoices, expenses, and financial documents in one place. Track budgets and generate financial reports effortlessly.",
		color: "from-orange-500 to-red-500"
	},
	{
		icon: Timer,
		title: "Time Tracking",
		description: "Log hours worked, track billable time, and generate accurate timesheets for payroll and client billing.",
		color: "from-indigo-500 to-blue-500"
	},
	{
		icon: Shield,
		title: "Secure & Reliable",
		description: "Enterprise-grade security with role-based access control. Your data is encrypted and backed up automatically.",
		color: "from-teal-500 to-green-500"
	}
];

const howItWorks = [
	{
		number: "01",
		title: "Sign Up & Set Up",
		description: "Create your account in seconds. Set up your organization profile and invite your team members.",
		icon: Users
	},
	{
		number: "02",
		title: "Create Projects",
		description: "Start by creating projects. Define goals, set timelines, and establish milestones for tracking progress.",
		icon: FolderKanban
	},
	{
		number: "03",
		title: "Assign & Collaborate",
		description: "Break projects into tasks, assign them to team members, and collaborate in real-time with comments and updates.",
		icon: Users
	},
	{
		number: "04",
		title: "Track & Analyze",
		description: "Monitor progress with dashboards, generate reports, and make data-driven decisions to optimize your workflow.",
		icon: BarChart3
	}
];

const benefits = [
	{
		icon: Rocket,
		title: "Boost Productivity",
		description: "Streamline workflows and eliminate bottlenecks. Our platform helps teams work 40% faster on average.",
		color: "text-blue-500"
	},
	{
		icon: Lightbulb,
		title: "Better Collaboration",
		description: "Keep everyone on the same page with centralized communication, file sharing, and real-time updates.",
		color: "text-yellow-500"
	},
	{
		icon: Smartphone,
		title: "Access Anywhere",
		description: "Fully responsive design works on desktop, tablet, and mobile. Work from anywhere, anytime.",
		color: "text-purple-500"
	},
	{
		icon: Target,
		title: "Stay Organized",
		description: "No more scattered tools and lost information. Everything you need in one unified platform.",
		color: "text-green-500"
	}
];

	const stats = [
		{ value: "5000+", label: "Projects Completed", icon: Target },
		{ value: "10K+", label: "Active Users", icon: Users },
		{ value: "99.9%", label: "Uptime", icon: Shield }
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
			{/* Hero Section - Professional clean design */}
			<section className="relative min-h-[85vh] bg-white">
				<div className="hero min-h-[85vh]">
					<div className="hero-content text-center max-w-5xl">
						<div className="space-y-8">
							{/* Badge */}
							<div className="inline-block animate-fade-in">
								<div className="badge badge-primary badge-lg gap-2 px-4 py-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									Trusted by Teams Worldwide
								</div>
							</div>
							
							{/* Main heading */}
							<h1 className="text-5xl md:text-7xl font-black leading-tight animate-fade-in-up text-[#1E293B]">
								Manage Everything in{" "}
								<span className="text-[#2563EB]">
									OneFlow
								</span>
							</h1>
							
							{/* Subheading */}
							<p className="text-xl md:text-2xl text-[#64748B] max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
								The all-in-one platform for project management, task tracking, and team collaboration. 
								Built for modern teams who demand efficiency.
							</p>
							
							{/* Feature highlights */}
							<div className="flex flex-wrap justify-center gap-6 text-sm animate-fade-in-up animation-delay-300">
								<div className="flex items-center gap-2 text-[#64748B]">
									<svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
									</svg>
									No credit card required
								</div>
								<div className="flex items-center gap-2 text-[#64748B]">
									<svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
									</svg>
									Free forever plan
								</div>
								<div className="flex items-center gap-2 text-[#64748B]">
									<svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
									</svg>
									Setup in 2 minutes
								</div>
							</div>
							
							{/* CTA Buttons */}
							<div className="flex flex-wrap justify-center gap-4 pt-6 animate-fade-in-up animation-delay-400">
								<a href="/signup" className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-shadow">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
									</svg>
									Start Free Trial
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
									</svg>
								</a>
								<a href="/signin" className="btn btn-outline btn-lg gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									Sign In
								</a>
								<a href="#features" className="btn btn-ghost btn-lg gap-2">
									Learn More
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-[#F8FAFC] py-16 border-t border-[#E2E8F0]">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
						{stats.map((stat, idx) => (
							<div key={idx} className="group">
								<div className="card bg-white shadow hover:shadow-lg transition-all duration-300 border border-[#E2E8F0]">
									<div className="card-body items-center text-center p-6">
										<div className="text-4xl md:text-5xl font-black text-[#2563EB] mb-2">
											{stat.value}
										</div>
										<div className="text-sm font-semibold text-[#64748B] uppercase tracking-wide">
											{stat.label}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16 space-y-4">
						<div className="inline-block">
							<div className="badge badge-primary badge-lg gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
								</svg>
								Features
							</div>
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-[#1E293B]">Powerful Features</h2>
						<p className="text-xl text-[#64748B] max-w-3xl mx-auto">
							Everything you need to manage projects, collaborate with teams, and drive success—all in one integrated platform.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, idx) => {
							const Icon = feature.icon;
							return (
							<div key={idx} className="group">
								<div className="card bg-white shadow hover:shadow-lg transition-all duration-300 border border-[#E2E8F0] h-full">
									<div className="card-body">
										<div className="w-16 h-16 rounded-xl bg-[#2563EB] p-3 mb-4 group-hover:scale-105 transition-transform duration-300">
											<Icon className="w-full h-full text-white" />
										</div>
										<h3 className="card-title text-2xl mb-3 text-[#1E293B]">
											{feature.title}
										</h3>
										<p className="text-[#64748B] leading-relaxed">
											{feature.description}
										</p>
										<div className="card-actions justify-end mt-4">
											<button className="btn btn-ghost btn-sm gap-2 text-[#2563EB] hover:gap-3 transition-all">
												Learn more
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						);
						})}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 bg-[#F8FAFC]">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4 text-[#1E293B]">How It Works</h2>
						<p className="text-lg text-[#64748B] max-w-2xl mx-auto">
							Get started in four simple steps and transform the way your team works together.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{howItWorks.map((step, idx) => {
							const Icon = step.icon;
							return (
							<div key={idx} className="relative">
								<div className="flex flex-col items-center text-center space-y-4">
									<div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg">
										<Icon className="w-10 h-10 text-white" />
									</div>
									<div className="text-sm font-bold text-[#2563EB]">{step.number}</div>
									<h3 className="font-bold text-xl text-[#1E293B]">{step.title}</h3>
									<p className="text-[#64748B]">{step.description}</p>
								</div>
								{idx < howItWorks.length - 1 && (
									<div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#E2E8F0]"></div>
								)}
							</div>
						);
						})}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4 text-[#1E293B]">Why Choose OneFlow?</h2>
						<p className="text-lg text-[#64748B] max-w-2xl mx-auto">
							Experience the benefits of a unified platform designed specifically for academic and administrative workflows.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{benefits.map((benefit, idx) => {
							const Icon = benefit.icon;
							return (
							<div key={idx} className="card bg-white shadow hover:shadow-lg transition-shadow border border-[#E2E8F0]">
								<div className="card-body items-center text-center">
									<div className="w-16 h-16 text-[#2563EB] mb-2">
										<Icon className="w-full h-full" />
									</div>
									<h3 className="card-title text-lg text-[#1E293B]">{benefit.title}</h3>
									<p className="text-sm text-[#64748B]">{benefit.description}</p>
								</div>
							</div>
						);
						})}
					</div>
				</div>
			</section>

			{/* Quick Access Section */}
			<section className="py-20 bg-[#F8FAFC]">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4 text-[#1E293B]">Quick Access</h2>
						<p className="text-lg text-[#64748B] max-w-2xl mx-auto">
							Jump directly to the module you need. Streamlined navigation for faster workflows.
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						{[
							{ name: "Projects", desc: "Create and manage all your projects", icon: "📊", href: "/projects" },
							{ name: "Tasks", desc: "Track tasks and collaborate with teams", icon: "✅", href: "/tasks" },
							{ name: "Analytics", desc: "View insights and performance metrics", icon: "📈", href: "/analytics" }
						].map((item, idx) => (
							<div key={idx} className="card bg-white shadow-lg border border-[#E2E8F0] hover:border-[#2563EB] transition-all">
								<div className="card-body">
									<div className="text-4xl mb-2">{item.icon}</div>
									<h3 className="card-title text-[#1E293B]">{item.name}</h3>
									<p className="text-sm text-[#64748B]">{item.desc}</p>
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
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4 text-[#1E293B]">Frequently Asked Questions</h2>
						<p className="text-lg text-[#64748B] max-w-2xl mx-auto">
							Have questions? We&apos;ve got answers. Find out everything you need to know about OneFlow.
						</p>
					</div>
					<div className="max-w-3xl mx-auto space-y-4">
						{faqs.map((faq, idx) => (
							<div key={idx} className="collapse collapse-plus bg-white shadow border border-[#E2E8F0]">
								<input type="radio" name="faq-accordion" defaultChecked={idx === 0} />
								<div className="collapse-title text-lg font-semibold text-[#1E293B]">
									{faq.question}
								</div>
								<div className="collapse-content">
									<p className="text-[#64748B]">{faq.answer}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-[#2563EB] text-white">
				<div className="container mx-auto px-4 text-center">
					<div className="max-w-3xl mx-auto space-y-6">
						<h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Workflow?</h2>
						<p className="text-xl opacity-90">
							Join hundreds of users who are already managing their projects more efficiently with OneFlow.
						</p>
						<div className="flex flex-wrap justify-center gap-4 pt-4">
							<a href="/signup" className="btn btn-lg bg-white text-[#2563EB] hover:bg-[#F8FAFC] border-none">
								Create Free Account
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</a>
							<a href="mailto:support@oneflow.com" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-[#2563EB]">
								Contact Support
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="footer footer-center p-10 bg-[#F8FAFC] text-[#64748B] border-t border-[#E2E8F0]">
				<div>
					<p className="font-semibold text-[#1E293B]">OneFlow Portal</p>
					<p className="text-sm">© {new Date().getFullYear()} OneFlow. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
