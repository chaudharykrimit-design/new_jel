import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl mb-1">
              <span className="gold-text font-bold">AURUM</span>
              <span className="font-light ml-1">JEWELS</span>
            </h3>
            <p className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase font-body mb-4">
              Heritage & Luxury Since 1985
            </p>
            <p className="text-secondary-foreground/60 text-sm font-body leading-relaxed">
              Crafting timeless jewelry pieces with unmatched artistry and the finest quality gold.
              Every piece tells a story of heritage and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm mb-5 text-primary">Quick Links</h4>
            <nav className="flex flex-col gap-2.5">
              {["Rings", "Earrings", "Necklaces", "Bangles", "Bracelets", "Chains", "Pendants"].map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat.toLowerCase()}`}
                  className="text-secondary-foreground/60 text-xs font-body tracking-wide hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-display text-sm mb-5 text-primary">Customer Service</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/about" className="text-secondary-foreground/60 text-xs font-body tracking-wide hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-secondary-foreground/60 text-xs font-body tracking-wide hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/policies/shipping" className="text-secondary-foreground/60 text-xs font-body tracking-wide hover:text-primary transition-colors">
                Shipping Policy
              </Link>
              <Link to="/policies/returns" className="text-secondary-foreground/60 text-xs font-body tracking-wide hover:text-primary transition-colors">
                Return Policy
              </Link>
              <Link to="/policies/privacy" className="text-secondary-foreground/60 text-xs font-body tracking-wide hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/policies/terms" className="text-secondary-foreground/60 text-xs font-body tracking-wide hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm mb-5 text-primary">Get in Touch</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-secondary-foreground/60 text-xs font-body leading-relaxed">
                  123 Heritage Lane, Zaveri Bazaar,<br />Mumbai, Maharashtra 400002
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                <span className="text-secondary-foreground/60 text-xs font-body">+91 63566 47453</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                <span className="text-secondary-foreground/60 text-xs font-body">info@aurumjewels.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-muted-foreground/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-[10px] font-body tracking-wide">
            © 2025 Aurum Jewels. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 opacity-40" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-40" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
