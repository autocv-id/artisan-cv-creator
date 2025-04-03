
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm py-4 fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-resume-primary font-playfair font-bold text-2xl">ArtisanCV</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/templates" className="text-gray-600 hover:text-resume-primary transition-colors">
            Templates
          </Link>
          <Link to="/features" className="text-gray-600 hover:text-resume-primary transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-resume-primary transition-colors">
            Pricing
          </Link>
          <div className="ml-4 flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="font-medium">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="font-medium bg-resume-primary hover:bg-resume-primary/90">
                Sign up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 w-full animate-fade-in shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/templates" className="text-gray-600 hover:text-resume-primary transition-colors py-2">
              Templates
            </Link>
            <Link to="/features" className="text-gray-600 hover:text-resume-primary transition-colors py-2">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-resume-primary transition-colors py-2">
              Pricing
            </Link>
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login">
                <Button variant="outline" className="font-medium w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="font-medium w-full bg-resume-primary hover:bg-resume-primary/90">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
