
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Template categories
const categories = [
  "All Templates",
  "Professional",
  "Modern",
  "Creative",
  "Simple",
  "ATS-Optimized"
];

// Mock template data
const templates = [
  {
    id: 1,
    name: "Executive",
    category: "Professional",
    color: "1A365D", // dark blue
    popular: true,
  },
  {
    id: 2,
    name: "Milano",
    category: "Modern",
    color: "38B2AC", // teal
    popular: false,
  },
  {
    id: 3,
    name: "Creative Studio",
    category: "Creative",
    color: "4299E1", // blue
    popular: true,
  },
  {
    id: 4,
    name: "Minimalist",
    category: "Simple",
    color: "718096", // gray
    popular: false,
  },
  {
    id: 5,
    name: "Corporate",
    category: "Professional",
    color: "2D3748", // dark gray
    popular: false,
  },
  {
    id: 6,
    name: "Digital",
    category: "Modern",
    color: "4C51BF", // indigo
    popular: true,
  },
  {
    id: 7,
    name: "Artisan",
    category: "Creative",
    color: "B83280", // pink
    popular: false,
  },
  {
    id: 8,
    name: "Clean Resume",
    category: "Simple",
    color: "2C7A7B", // teal dark
    popular: true,
  },
  {
    id: 9,
    name: "ATS Pro",
    category: "ATS-Optimized",
    color: "333333", // dark
    popular: true,
  }
];

const TemplatesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Templates");

  const filteredTemplates = activeCategory === "All Templates" 
    ? templates 
    : templates.filter(template => template.category === activeCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-resume-primary mb-4">Resume Templates</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates optimized to pass Applicant Tracking Systems
          </p>
        </div>

        <div className="mb-8">
          <Tabs defaultValue="All Templates" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="data-[state=active]:bg-resume-primary data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all animate-zoom"
            >
              <div className="relative">
                <img 
                  src={`https://placehold.co/400x500/${template.color}/FFFFFF/png?text=${template.name}`}
                  alt={`${template.name} template`}
                  className="w-full object-cover h-80"
                />
                {template.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    POPULAR
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Link to={`/editor/new?template=${template.id}`}>
                    <Button className="bg-white text-resume-primary hover:bg-white/90">
                      Use This Template
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{template.name}</h3>
                <p className="text-gray-600 mt-1">{template.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TemplatesPage;
