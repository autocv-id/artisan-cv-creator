
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    title: "Professional Templates",
    description: "Choose from dozens of expertly designed templates suitable for all industries and career stages.",
    imageSrc: "https://placehold.co/600x400/1A365D/FFFFFF/png?text=Professional+Templates",
    imageAlt: "Professional resume templates",
    align: "right",
  },
  {
    title: "ATS-Optimized Formatting",
    description: "Our resumes are designed to pass through Applicant Tracking Systems and reach human recruiters.",
    imageSrc: "https://placehold.co/600x400/38B2AC/FFFFFF/png?text=ATS+Optimization",
    imageAlt: "ATS optimization visualization",
    align: "left",
  },
  {
    title: "Easy Content Editing",
    description: "Intuitive editor makes adding and updating your professional information simple and fast.",
    imageSrc: "https://placehold.co/600x400/4299E1/FFFFFF/png?text=Content+Editor",
    imageAlt: "Resume content editor interface",
    align: "right",
  },
  {
    title: "Multiple Download Formats",
    description: "Download your resume as PDF, DOCX, TXT, or share a direct link with employers.",
    imageSrc: "https://placehold.co/600x400/2C7A7B/FFFFFF/png?text=Download+Options",
    imageAlt: "Resume download options",
    align: "left",
  },
];

const additionalFeatures = [
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Create and edit your resume on any device - desktop, tablet, or smartphone."
  },
  {
    icon: "🔒",
    title: "Data Security",
    description: "Your information is encrypted and securely stored with industry-standard protocols."
  },
  {
    icon: "💬",
    title: "Expert Support",
    description: "Get help from our team of resume experts whenever you need it."
  },
  {
    icon: "🔄",
    title: "Unlimited Updates",
    description: "Update your resume as often as you like with our premium plans."
  },
  {
    icon: "✉️",
    title: "Cover Letters",
    description: "Create matching cover letters to complete your professional application."
  },
  {
    icon: "🔍",
    title: "Keyword Optimization",
    description: "Analyze and optimize your resume for job-specific keywords."
  },
];

const FeaturesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-resume-primary mb-4">Features</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover all the powerful tools and features that make ArtisanCV the best resume builder
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-24 mb-20">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col ${feature.align === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
              <div className={`lg:w-1/2 animate-fade-in`} style={{ animationDelay: `${0.2 * index}s` }}>
                <img 
                  src={feature.imageSrc} 
                  alt={feature.imageAlt}
                  className="rounded-lg shadow-lg w-full hover-scale transition-all"
                />
              </div>
              <div className="lg:w-1/2 space-y-4 animate-fade-in" style={{ animationDelay: `${0.3 * index}s` }}>
                <h2 className="text-3xl font-bold text-resume-primary">{feature.title}</h2>
                <p className="text-lg text-gray-700">{feature.description}</p>
                <Link to="/templates">
                  <Button variant="outline" className="flex gap-2 items-center">
                    Try It Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-gray-50 rounded-xl p-8 lg:p-12 mb-16">
          <h2 className="text-3xl font-bold text-resume-primary mb-10 text-center">More Great Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all animate-zoom"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-resume-primary mb-8 text-center">How We Compare</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Features</th>
                  <th className="p-4 text-center">ArtisanCV</th>
                  <th className="p-4 text-center">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "ATS-Optimized Templates", artisan: true, competitors: "Limited" },
                  { feature: "Custom Fonts & Colors", artisan: true, competitors: "Limited" },
                  { feature: "Multiple Download Formats", artisan: true, competitors: true },
                  { feature: "AI Content Suggestions", artisan: true, competitors: false },
                  { feature: "Cover Letter Builder", artisan: true, competitors: "Extra Fee" },
                  { feature: "Multiple Languages", artisan: true, competitors: "Limited" },
                  { feature: "Real-time Preview", artisan: true, competitors: "Limited" },
                  { feature: "Expert Career Advice", artisan: true, competitors: false },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center text-green-500">
                      {row.artisan === true ? "✓" : row.artisan}
                    </td>
                    <td className="p-4 text-center">
                      {row.competitors === true ? "✓" : row.competitors === false ? "✗" : row.competitors}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-resume-primary text-white py-12 px-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Professional Resume?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have built stunning resumes and advanced their careers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/editor/new">
              <Button className="bg-white text-resume-primary hover:bg-gray-100 px-8 py-6 text-lg">
                Create My Resume
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeaturesPage;
