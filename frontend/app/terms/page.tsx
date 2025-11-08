"use client";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/signup" className="btn btn-ghost btn-sm gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign Up
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1E293B]">Terms and Conditions</h1>
              <p className="text-[#64748B] mt-1">Last updated: November 8, 2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">1. Acceptance of Terms</h2>
              <p className="text-[#64748B] leading-relaxed">
                By accessing and using OneFlow ERP system ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">2. Use License</h2>
              <p className="text-[#64748B] leading-relaxed mb-4">
                Permission is granted to temporarily access the Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained in the Service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">3. User Account</h2>
              <p className="text-[#64748B] leading-relaxed mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="text-[#64748B] leading-relaxed">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">4. Data Privacy</h2>
              <p className="text-[#64748B] leading-relaxed mb-4">
                We are committed to protecting your privacy. Your use of the Service is also governed by our Privacy Policy. We collect and use your information to provide and improve the Service.
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                <li>We do not sell your personal data to third parties</li>
                <li>Your project and financial data is encrypted and stored securely</li>
                <li>You have the right to request deletion of your data at any time</li>
                <li>We may use aggregated, anonymized data for analytics and service improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">5. Intellectual Property</h2>
              <p className="text-[#64748B] leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of OneFlow and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">6. Limitation of Liability</h2>
              <p className="text-[#64748B] leading-relaxed">
                In no event shall OneFlow, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">7. Service Availability</h2>
              <p className="text-[#64748B] leading-relaxed">
                We strive to provide continuous service availability, but we do not guarantee that the Service will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Service, resulting in interruptions, delays, or errors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">8. Termination</h2>
              <p className="text-[#64748B] leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">9. Changes to Terms</h2>
              <p className="text-[#64748B] leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">10. Contact Information</h2>
              <p className="text-[#64748B] leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                <p className="text-[#1E293B] font-medium">OneFlow Support Team</p>
                <p className="text-[#64748B]">Email: support@oneflow.com</p>
                <p className="text-[#64748B]">Phone: +91 1234567890</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">11. Governing Law</h2>
              <p className="text-[#64748B] leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-[#1E293B] font-semibold mb-2">
                By using OneFlow ERP, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/signup" className="btn btn-primary gap-2">
            Return to Sign Up
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
