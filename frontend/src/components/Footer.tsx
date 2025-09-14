import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="bg-card/30 border-t border-border/30 py-8 md:py-12 mt-12 md:mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4 animate-fade-in">AsilMedia</h3>
            <p className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed">
              O'zbek tilidagi eng yangi va sifatli kinolar, seriallar va premyeralar.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary touch-feedback btn-interactive">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary touch-feedback btn-interactive">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary touch-feedback btn-interactive">
                <Youtube className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Tezkor havolalar</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Bosh sahifa</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Premyeralar</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Kinolar</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Seriallar</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Yangiliklar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Bog'lanish</h4>
            <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-3 w-3 md:h-4 md:w-4" />
                <span>info@asilmedia.uz</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-3 w-3 md:h-4 md:w-4" />
                <span>+998 90 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                <span>Toshkent, O'zbekiston</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-3 md:mb-0">
            © 2025 AsilMedia. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Maxfiylik</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Shartlar</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Biz haqimizda</a>
          </div>
        </div>

      </div>
    </footer>
  );
};