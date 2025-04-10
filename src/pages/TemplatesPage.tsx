import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Template } from '@/types/templates';

// Categories for templates
const categories = [
  "All Templates",
  "Professional", 
  "Modern",
  "Creative",
  "Simple",
  "ATS-Optimized"
];

// Default empty state for templates
const initialTemplates: Template[] = [];

const TemplatesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isLoading, setIsLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<string>('free');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch templates and user subscription status
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user subscription status if logged in
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (profileData) {
            setUserSubscription(profileData.subscription_status);
          }
        }
        
        // Fetch templates from Supabase
        const { data: templatesData, error: templatesError } = await supabase
          .from('templates')
          .select('*')
          .order('category');
          
        if (templatesError) throw templatesError;
        
        if (templatesData) {
          // Transform thumbnail URLs to use Supabase storage
          const processedTemplates = templatesData.map(template => ({
            ...template,
            thumbnail: supabase.storage.from('assets').getPublicUrl(template.thumbnail).data.publicUrl
          }));
          
          setTemplates(processedTemplates as Template[]);
        }
        
      } catch (error: unknown) {
        const errorWithMessage = error as { message?: string };
        toast({
          title: "Error fetching templates",
          description: errorWithMessage.message || "Failed to load templates",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  // Filter templates based on category
  const filteredTemplates = activeCategory === "All Templates"
    ? templates
    : templates.filter(template => template.category === activeCategory);

  const handleTemplateClick = (template: Template) => {
    if (template.is_premium && userSubscription === 'free') {
      toast({
        title: "Template Premium",
        description: "Upgrade ke akun premium untuk menggunakan template ini",
        variant: "default",
      });
      
      navigate("/pricing");
      return;
    }
    
    navigate(`/editor/new?template=${template.id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-resume-primary mb-4">Template Resume</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Pilih dari koleksi template kami yang dirancang secara profesional dan dioptimalkan untuk melewati Applicant Tracking Systems
          </p>
          {user && (
            <div className="mt-3">
              <Badge variant={userSubscription === 'premium' ? "default" : "outline"} className="text-sm">
                {userSubscription === 'premium' ? 'Langganan Premium' : 'Tier Gratis'}
              </Badge>
            </div>
          )}
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
              <div className="relative aspect-[210/297]"> {/* Aspect ratio A4 */}
                <img 
                  src={template.thumbnail || `https://placehold.co/420x594/1A365D/FFFFFF/png?text=${template.name}`}
                  alt={`${template.name} template`}
                  className="w-full h-full object-contain"
                />
                
                {/* Premium badge */}
                {template.is_premium && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    PREMIUM
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Button 
                    onClick={() => handleTemplateClick(template)}
                    className={`bg-white text-resume-primary hover:bg-white/90 ${template.is_premium && userSubscription === 'free' ? 'cursor-not-allowed' : ''}`}
                  >
                    {template.is_premium && userSubscription === 'free' ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Template Premium
                      </>
                    ) : (
                      "Gunakan Template Ini"
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{template.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-600">{template.category}</p>
                  {template.is_premium && userSubscription === 'free' && (
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      <Lock className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TemplatesPage;
