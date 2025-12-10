"use client";

import Link from "next/link";
import { Routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Download, CheckCircle } from "lucide-react";

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			<nav className="container mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
						<FileText className="w-6 h-6 text-white" />
					</div>
					<span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">I-CV</span>
				</div>
				<div className="flex items-center gap-4">
					<Link href={Routes.signIn}>
						<Button variant="ghost" className="text-gray-600 hover:text-gray-900">
							Sign In
						</Button>
					</Link>
					<Link href={Routes.signUp}>
						<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
							Get Started
						</Button>
					</Link>
				</div>
			</nav>

			<main className="container mx-auto px-6">
				<section className="py-20 text-center">
					<div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
						<Sparkles className="w-4 h-4" />
						AI-Powered Resume Builder
					</div>
					<h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
						Build Your Dream
						<br />
						<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Resume in Minutes</span>
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
						Create professional, ATS-friendly resumes with our intelligent builder. Let AI enhance your content and stand out from the crowd.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href={Routes.signUp}>
							<Button
								size="lg"
								className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-xl shadow-blue-500/30">
								Start Building for Free
							</Button>
						</Link>
					</div>
				</section>

				<section className="py-16">
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<FeatureCard
							icon={<Sparkles className="w-8 h-8 text-blue-600" />}
							title="AI-Enhanced Content"
							description="Let our AI improve your bullet points, summaries, and skills to make your resume shine."
						/>
						<FeatureCard
							icon={<FileText className="w-8 h-8 text-indigo-600" />}
							title="Professional Templates"
							description="Choose from beautifully designed templates that are optimized for applicant tracking systems."
						/>
						<FeatureCard
							icon={<Download className="w-8 h-8 text-purple-600" />}
							title="Export Anywhere"
							description="Download your resume as a perfectly formatted PDF ready for any job application."
						/>
					</div>
				</section>

				<section className="py-16 text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose I-CV?</h2>
					<div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
						<BenefitItem text="Create unlimited resumes" />
						<BenefitItem text="AI-powered content enhancement" />
						<BenefitItem text="Import existing resumes" />
						<BenefitItem text="ATS-optimized formatting" />
						<BenefitItem text="Real-time preview" />
						<BenefitItem text="Export to PDF instantly" />
					</div>
				</section>

				<section className="py-20 text-center">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
						<p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
							Join thousands of professionals who have transformed their careers with I-CV.
						</p>
						<Link href={Routes.signUp}>
							<Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
								Create Your Resume Now
							</Button>
						</Link>
					</div>
				</section>
			</main>

			<footer className="border-t border-gray-200 py-8 mt-12">
				<div className="container mx-auto px-6 text-center text-gray-500">
					<p>&copy; {new Date().getFullYear()} I-CV. Build your future, one resume at a time.</p>
				</div>
			</footer>
		</div>
	);
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
	<div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-shadow">
		<div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-6">{icon}</div>
		<h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
		<p className="text-gray-600">{description}</p>
	</div>
);

const BenefitItem = ({ text }: { text: string }) => (
	<div className="flex items-center gap-3">
		<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
		<span className="text-gray-700">{text}</span>
	</div>
);

export default LandingPage;
