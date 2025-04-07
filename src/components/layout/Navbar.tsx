import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    const name = user.user_metadata.full_name as string;
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <nav className="bg-white shadow-sm py-4 fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary font-playfair font-bold text-2xl">Resuma</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/templates" className="text-gray-600 hover:text-primary transition-colors">
            Templates
          </Link>
          <Link to="/features" className="text-gray-600 hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors">
            Pricing
          </Link>
          
          {user ? (
            <div className="ml-4 flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  My Resumes
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                    <Avatar>
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Resumes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="ml-4 flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="font-medium">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="font-medium bg-primary hover:bg-primary/90">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 w-full animate-in shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/templates" className="text-gray-600 hover:text-primary transition-colors py-2">
              Templates
            </Link>
            <Link to="/features" className="text-gray-600 hover:text-primary transition-colors py-2">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors py-2">
              Pricing
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors py-2">
                  My Resumes
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors py-2">
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-left text-gray-600 hover:text-primary transition-colors py-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login">
                  <Button variant="outline" className="font-medium w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="font-medium w-full bg-primary hover:bg-primary/90">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
