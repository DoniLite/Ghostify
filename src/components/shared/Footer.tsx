import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Send,
	Twitter,
} from 'lucide-react'; // Assuming lucide-react for icons
import { Button } from '../utils/button';
import { Ghostify } from './Icons';

const Footer = () => {
	return (
		<footer className="bg-card text-card-foreground border-border border-t px-6 py-16 lg:px-12">
			<div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
				{/* Section 1: Ghostify branding and newsletter */}
				<div className="flex flex-col items-center text-center md:items-start md:text-left">
					<div className="mb-4 flex items-center space-x-2">
						<Ghostify className="text-primary h-8 w-8" />
						<span className="font-nunito text-3xl font-bold">Ghostify.</span>
					</div>
					<p className="text-muted-foreground font-inter mb-4">
						Souscris à la newsletter!
					</p>
					<div className="flex w-full max-w-sm">
						<input
							type="email"
							placeholder="Passez nous votre mail et on s'y"
							className="bg-input text-foreground border-border focus:ring-ring flex-1 rounded-l-md border px-4 py-2 focus:ring-2 focus:outline-none"
						/>
						<Button className="bg-primary text-primary-foreground hover:bg-accent rounded-r-md p-3 transition-colors">
							<Send size={20} />
						</Button>
					</div>
					<div className="mt-6 flex space-x-6">
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Facebook size={24} />
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Instagram size={24} />
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Twitter size={24} />
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Github size={24} />
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Linkedin size={24} />
						</a>
					</div>
				</div>

				{/* Section 2: Services */}
				<div>
					<h4 className="font-nunito mb-6 text-center text-xl font-bold md:text-left">
						Services
					</h4>
					<ul className="text-muted-foreground font-inter space-y-3 text-center md:text-left">
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Poster for blog and documents parsing
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Try the basic web search
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Gaming & Testing
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Marketing & Data-analyzes support
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Web Dev &gt; backend &amp; front &amp; security &amp; smart net
							</a>
						</li>
					</ul>
				</div>

				{/* Section 3: Help & Support */}
				<div>
					<h4 className="font-nunito mb-6 text-center text-xl font-bold md:text-left">
						Help & Support
					</h4>
					<ul className="text-muted-foreground font-inter space-y-3 text-center md:text-left">
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Contact
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								About
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								FAQ
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Contact
							</a>
						</li>{' '}
						{/* Duplicate in original, keeping for fidelity */}
					</ul>
				</div>

				{/* Section 4: Legal */}
				<div>
					<h4 className="font-nunito mb-6 text-center text-xl font-bold md:text-left"></h4>{' '}
					{/* Placeholder for alignment */}
					<ul className="text-muted-foreground font-inter space-y-3 text-center md:text-left">
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Terms & Conditions
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Privacy Policy
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-primary transition-colors">
								Conditions of use
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="border-border text-muted-foreground font-inter mt-12 border-t pt-8 text-center text-sm">
				© 2024. Ghostify. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
