import { Link } from 'react-router-dom';
import { Mail, FileText, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1E293B] border-t border-gray-800 mt-auto">
      <div className="max-w-[120rem] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">AI Fruit Analysis</h3>
            <p className="text-light-gray font-paragraph text-sm leading-relaxed">
              Advanced AI-powered fruit quality assessment system. Precision analysis for optimal harvest decisions.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-light-gray hover:text-primary transition-colors font-paragraph text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Home
              </Link>
              <Link to="/instructions" className="text-light-gray hover:text-primary transition-colors font-paragraph text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Instructions
              </Link>
              <Link to="/dashboard" className="text-light-gray hover:text-primary transition-colors font-paragraph text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-4">Support</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@aifruitanalysis.com" className="text-light-gray hover:text-primary transition-colors font-paragraph text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@aifruitanalysis.com
              </a>
              <p className="text-light-gray font-paragraph text-sm">
                Available 24/7 for technical assistance
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-light-gray font-paragraph text-sm">
            © {new Date().getFullYear()} AI Fruit Analysis. All rights reserved. Powered by advanced machine learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
