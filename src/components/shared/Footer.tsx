import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Send,
  Twitter,
} from 'lucide-react'; // Assuming lucide-react for icons
import { Ghostify } from './Icons.tsx';
import { Button } from '../utils/button.tsx';

const Footer = () => {
  return (
    <footer className='py-16 px-6 lg:px-12 bg-card text-card-foreground border-t border-border'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
        {/* Section 1: Ghostify branding and newsletter */}
        <div className='flex flex-col items-center md:items-start text-center md:text-left'>
          <div className='flex items-center space-x-2 mb-4'>
            <Ghostify className='h-8 w-8 text-primary' />
            <span className='font-bold text-3xl font-nunito'>Ghostify.</span>
          </div>
          <p className='text-muted-foreground mb-4 font-inter'>
            Souscris à la newsletter!
          </p>
          <div className='flex w-full max-w-sm'>
            <input
              type='email'
              placeholder="Passez nous votre mail et on s'y"
              className='flex-1 px-4 py-2 rounded-l-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring'
            />
            <Button className='bg-primary text-primary-foreground p-3 rounded-r-md hover:bg-accent transition-colors'>
              <Send size={20} />
            </Button>
          </div>
          <div className='flex space-x-6 mt-6'>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              <Facebook size={24} />
            </a>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              <Instagram size={24} />
            </a>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              <Twitter size={24} />
            </a>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              <Github size={24} />
            </a>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        {/* Section 2: Services */}
        <div>
          <h4 className='text-xl font-bold mb-6 font-nunito text-center md:text-left'>
            Services
          </h4>
          <ul className='space-y-3 text-muted-foreground text-center md:text-left font-inter'>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Poster for blog and documents parsing
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Try the basic web search
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Gaming & Testing
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Marketing & Data-analyzes support
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Web Dev &gt; backend &amp; front &amp; security &amp; smart net
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Help & Support */}
        <div>
          <h4 className='text-xl font-bold mb-6 font-nunito text-center md:text-left'>
            Help & Support
          </h4>
          <ul className='space-y-3 text-muted-foreground text-center md:text-left font-inter'>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Contact
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                About
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                FAQ
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Contact
              </a>
            </li>{' '}
            {/* Duplicate in original, keeping for fidelity */}
          </ul>
        </div>

        {/* Section 4: Legal */}
        <div>
          <h4 className='text-xl font-bold mb-6 font-nunito text-center md:text-left'>
          </h4>{' '}
          {/* Placeholder for alignment */}
          <ul className='space-y-3 text-muted-foreground text-center md:text-left font-inter'>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-primary transition-colors'>
                Conditions of use
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm font-inter'>
        © 2024. Ghostify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
