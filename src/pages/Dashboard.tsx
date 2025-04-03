
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Resume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user?.id)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        setResumes(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching resumes",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchResumes();
    }
  }, [user, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Resumes</h1>
          <Link to="/editor/new">
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <PlusCircle className="h-5 w-5" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover-scale">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg mb-2">{resume.title}</h3>
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <FileText className="h-10 w-10 text-primary/70" />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Link to={`/editor/${resume.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6">Create your first professional resume</p>
            <Link to="/editor/new">
              <Button>Create Resume</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
