
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { LockIcon } from 'lucide-react';

// Template categories
const categories = [
  "All Templates",
  "Professional",
  "Modern",
  "Creative",
  "Simple"
];

// Template interface matching database structure
interface Template {
  id: string;
  name: string;
  category: string;
  is_premium: boolean;
  thumbnail: string;
}

// User profile interface
interface Profile {
  subscription_status: string;
}

const TemplatesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch templates from Supabase
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('name');

        if (error) throw error;
        setTemplates(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching templates",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [toast]);

  // Fetch user profile to determine subscription status
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error: any) {
        console.error('Error fetching user profile:', error.message);
        // Don't show toast for this as it's not critical to the user experience
      }
    };

    fetchUserProfile();
  }, [user]);

  const isPaidUser = userProfile?.subscription_status === 'paid';
  
  const filteredTemplates = activeCategory === "All Templates" 
    ? templates 
    : templates.filter(template => template.category === activeCategory);

  const handleTemplateSelection = (template: Template) => {
    if (template.is_premium && !isPaidUser) {
      toast({
        title: "Premium Template",
        description: "You need a paid subscription to use this template.",
        variant: "destructive",
      });
      return;
    }
    
    // If free template or paid user, proceed to editor
    // The template ID will be passed in the URL
    return `/editor/new?template=${template.id}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-resume-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-resume-primary mb-4">Resume Templates</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates optimized to pass Applicant Tracking Systems
          </p>
          {!user && (
            <div className="mt-4">
              <Link to="/login" className="text-resume-primary underline">
                Sign in to access premium templates
              </Link>
            </div>
          )}
          {user && !isPaidUser && (
            <div className="mt-4">
              <Link to="/pricing" className="text-resume-primary underline">
                Upgrade to access premium templates
              </Link>
            </div>
          )}
        </div>

        <div className="mb-8">
          <Tabs defaultValue="All Templates" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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
                  src={template.thumbnail}
                  alt={`${template.name} template`}
                  className="w-full object-cover h-80"
                />
                {template.is_premium && (
                  <Badge variant="secondary" className="absolute top-4 right-4 bg-amber-400 text-amber-900 border-none">
                    <LockIcon className="h-3 w-3 mr-1" /> PREMIUM
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  {template.is_premium && !isPaidUser ? (
                    <Link to="/pricing">
                      <Button className="bg-white text-resume-primary hover:bg-white/90">
                        Upgrade to Use
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/editor/new?template=${template.id}`}>
                      <Button className="bg-white text-resume-primary hover:bg-white/90">
                        Use This Template
                      </Button>
                    </Link>
                  )}
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
