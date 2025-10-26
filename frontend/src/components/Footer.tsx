import { Mail, Phone, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useSettingsStore from "@/store/settings";

export const Footer = () => {
  // Site settings are now loaded from backend
  const { settings } = useSettingsStore();
  return (
    <footer className="bg-card/30 border-t border-border/30 py-8 md:py-12 mt-12 md:mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">
              {settings?.siteName || "MovieMedia"}
            </h3>
            <p className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed">
              {settings?.siteDescription || "O'zbek tilidagi eng yangi va sifatli kinolar, seriallar va premyeralar."}
            </p>
            <div className="flex space-x-2">
              {settings?.socialMedia?.facebook && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-white hover:bg-black touch-feedback btn-interactive transition-colors duration-200"
                  asChild
                >
                  <a href={settings?.socialMedia?.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                </Button>
              )}
              {settings?.socialMedia?.instagram && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-white hover:bg-black touch-feedback btn-interactive transition-colors duration-200"
                  asChild
                >
                  <a href={settings?.socialMedia?.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                </Button>
              )}
              {settings?.socialMedia?.telegram && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-white hover:bg-black touch-feedback btn-interactive transition-colors duration-200"
                  asChild
                >
                  <a href={settings?.socialMedia?.telegram} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                </Button>
              )}
              {settings?.socialMedia?.youtube && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-white hover:bg-black touch-feedback btn-interactive transition-colors duration-200"
                  asChild
                >
                  <a href={settings?.socialMedia?.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Tezkor havolalar</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors duration-200">Bosh sahifa</Link></li>
              <li><Link to="/premieres" className="text-muted-foreground hover:text-primary transition-colors duration-200">{settings?.sectionNames?.premieres || "Premyeralar"}</Link></li>
              <li><Link to="/movies" className="text-muted-foreground hover:text-primary transition-colors duration-200">{settings?.sectionNames?.movies || "Kinolar"}</Link></li>
              <li><Link to="/series" className="text-muted-foreground hover:text-primary transition-colors duration-200">{settings?.sectionNames?.series || "Seriallar"}</Link></li>
              <li><Link to="/trailers" className="text-muted-foreground hover:text-primary transition-colors duration-200">{settings?.sectionNames?.trailers || "Treylerlar"}</Link></li>
              <li><Link to="/new" className="text-muted-foreground hover:text-primary transition-colors duration-200">{settings?.sectionNames?.new || "Yangi"}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Bog'lanish</h4>
            <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-3 w-3 md:h-4 md:w-4" />
                <a href={`mailto:${settings?.contactEmail || "info@moviemedia.uz"}`} className="hover:text-primary transition-colors duration-200">
                  {settings?.contactEmail || "info@moviemedia.uz"}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-3 w-3 md:h-4 md:w-4" />
                <a href={`tel:${settings?.contactPhone || "+998901234567"}`} className="hover:text-primary transition-colors duration-200">
                  {settings?.contactPhone || "+998901234567"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-3 md:mb-0">
            © 2025 MovieMedia. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">Maxfiylik</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">Shartlar</Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">Biz haqimizda</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};