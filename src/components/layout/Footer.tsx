
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10 md:py-12 mt-8 md:mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-resume-primary font-playfair font-bold text-xl">Resuma</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Professional resume builder to create standout resumes in minutes.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/templates" className="text-gray-600 hover:text-resume-primary text-sm">Templates</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-resume-primary text-sm">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-resume-primary text-sm">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-600 hover:text-resume-primary text-sm">Blog</Link></li>
              <li><Link to="/guides" className="text-gray-600 hover:text-resume-primary text-sm">Career Guides</Link></li>
              <li><Link to="/examples" className="text-gray-600 hover:text-resume-primary text-sm">Resume Examples</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-resume-primary text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-resume-primary text-sm">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-resume-primary text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-resume-primary text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 md:pt-8 flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Resuma. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-resume-primary">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-resume-primary">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-resume-primary">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
