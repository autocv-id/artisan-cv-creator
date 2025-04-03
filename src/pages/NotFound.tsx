
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg mx-auto animate-fade-in">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold text-resume-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          <Link to="/">
            <Button className="bg-resume-primary hover:bg-resume-primary/90 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
