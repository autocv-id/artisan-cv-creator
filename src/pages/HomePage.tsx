import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const HomePage = () => {
  const features = [
    "Professional templates designed by experts",
    "Easy customization and personalization",
    "Instant PDF download",
    "ATS-friendly formats",
    "Step-by-step guidance",
    "Multiple language support"
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-resume-primary leading-tight">
                Create Your Professional Resume in Minutes
              </h1>
              <p className="text-lg text-gray-700 max-w-xl">
                Build a standout resume that gets you hired. Our easy-to-use tools and expert guidance make resume creation simple and effective.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/editor/new">
                  <Button className="bg-resume-primary hover:bg-resume-primary/90 text-white px-6 py-6 text-lg flex gap-2 items-center">
                    Create My Resume 
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button variant="outline" className="border-resume-primary text-resume-primary hover:bg-resume-primary/10 px-6 py-6 text-lg">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-lg shadow-lg p-4 rotate-2 transition-transform hover:rotate-0 hover-scale">
                <img 
                  src="https://wdguqtkfrpxmjzygousk.supabase.co/storage/v1/object/public/assets//prime-suite.jpg"
                  alt="Resume preview"
                  className="rounded-md"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-resume-accent text-white py-2 px-4 rounded shadow-md rotate-3">
                <span className="font-semibold">ATS-friendly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-resume-primary mb-4">Why Choose ArtisanCV</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our resume builder combines professional design with powerful features to help you stand out.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-zoom"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-resume-primary/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-resume-primary" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Templates Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-resume-primary mb-4">Professional Resume Templates</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover-scale">
                  <img 
                    src={`https://placehold.co/400x500/${item === 1 ? '1A365D' : item === 2 ? '38B2AC' : '4299E1'}/FFFFFF/png?text=Template+${item}`}
                    alt={`Resume template ${item}`}
                    className="w-full object-cover h-80"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">{
                      item === 1 ? "Professional" : item === 2 ? "Modern" : "Creative"
                    }</h3>
                    <p className="text-gray-600 mt-1">Perfect for {
                      item === 1 ? "corporate roles" : item === 2 ? "tech industry" : "creative positions"
                    }</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/templates">
              <Button className="bg-resume-primary hover:bg-resume-primary/90">
                View All Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-resume-primary mb-4">Our Users Love ArtisanCV</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              See what people are saying about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Specialist",
                quote: "ArtisanCV helped me land my dream job! The templates are beautiful and the interface is so easy to use."
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                quote: "I was amazed at how quickly I could create a professional resume. The ATS-friendly features were exactly what I needed."
              },
              {
                name: "Emma Roberts",
                role: "Graphic Designer",
                quote: "As a designer, I appreciate good aesthetics, and ArtisanCV delivers. My resume looks amazing and I've received so many compliments."
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 animate-fade-in"
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-resume-primary py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Your Professional Resume?</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of job seekers who have successfully landed jobs with resumes made on ArtisanCV
          </p>
          <Link to="/editor/new">
            <Button className="bg-white text-resume-primary hover:bg-gray-100 text-lg px-8 py-6">
              Create My Resume
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
