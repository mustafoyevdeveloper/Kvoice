import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">AsilMedia</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              O'zbek tilidagi eng yangi va sifatli kinolar, seriallar va premyeralar. 
              Barcha kontentlar HD sifatida mavjud.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tezkor havolalar</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Bosh sahifa</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Premyeralar</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Kinolar</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Seriallar</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Yangiliklar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Bog'lanish</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@asilmedia.uz</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+998 90 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Toshkent, O'zbekiston</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            © 2025 AsilMedia. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex space-x-6 text-xs">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Maxfiylik siyosati</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Foydalanish shartlari</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Biz haqimizda</a>
          </div>
        </div>

        {/* Made with love */}
        <div className="text-center mt-6 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for Uzbek cinema lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};