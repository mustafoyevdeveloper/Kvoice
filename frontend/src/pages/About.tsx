import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { 
  Heart, 
  Users, 
  Film, 
  Star, 
  Globe, 
  Award, 
  Target, 
  Lightbulb,
  Shield,
  Zap,
  Play,
  Download
} from "lucide-react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 md:h-12 md:w-12 text-primary mr-3" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Biz Haqimizda
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Koreya kinolari va seriallarini O'zbek tilida tomosha qilish uchun yaratilgan platforma. Eng mashhur K-dramalar va Koreya filmlarini toping.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Bizning Missiyamiz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Koreya kinolari va seriallarini O'zbek auditoriyasiga taqdim etish va eng yaxshi tomosha tajribasini yaratish.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Eng mashhur K-dramalar va Koreya filmlarini to'plash</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">O'zbek tilida professional tarjima bilan taqdim etish</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Koreya madaniyatini O'zbekistonda targ'ib qilish</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Bizning Vizyonimiz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  O'zbekistonda Koreya kontentlarini tomosha qilish bo'yicha yetakchi platformaga aylanish va K-wave madaniyatini targ'ib qilish.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">1 million+ foydalanuvchi</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">5,000+ Koreya kinolari va seriallari</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Koreya kontentlarida yetakchi platforma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Bizning Yutuqlarimiz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
                  <p className="text-xs md:text-sm text-muted-foreground">Foydalanuvchi</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Film className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-primary">1,200+</div>
                  <p className="text-xs md:text-sm text-muted-foreground">Koreya kinolari</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-primary">4.8</div>
                  <p className="text-xs md:text-sm text-muted-foreground">Reyting</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-primary">15+</div>
                  <p className="text-xs md:text-sm text-muted-foreground">Mamlakat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Nima Uchun Kvoice?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Tez va Qulay</h3>
                  <p className="text-sm text-muted-foreground">
                    Yuqori tezlikda yuklash va qulay interfeys
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Xavfsiz va Ishonchli</h3>
                  <p className="text-sm text-muted-foreground">
                    Shaxsiy ma'lumotlaringizni himoya qilamiz
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Yuqori Sifat</h3>
                  <p className="text-sm text-muted-foreground">
                    Faqat eng yaxshi va yangi kinolar
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Play className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Har Qanday Qurilma</h3>
                  <p className="text-sm text-muted-foreground">
                    Telefon, planshet, kompyuter - hammasida
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Download className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Yuklab Olish</h3>
                  <p className="text-sm text-muted-foreground">
                    Sevimli kinolaringizni yuklab oling
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Kino Sevuvchilar Uchun</h3>
                  <p className="text-sm text-muted-foreground">
                    Har bir kino sevuvchi uchun yaratilgan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Bizning Jamoa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Rivojlanish Jamoa</h3>
                  <p className="text-sm text-muted-foreground">
                    Platformani rivojlantirish va yangi funksiyalar qo'shish
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Film className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Kontent Jamoa</h3>
                  <p className="text-sm text-muted-foreground">
                    Eng yaxshi kinolarni tanlash va sifatini nazorat qilish
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Qo'llab-quvvatlash</h3>
                  <p className="text-sm text-muted-foreground">
                    24/7 foydalanuvchi qo'llab-quvvatlash xizmati
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Biz Bilan Bog'laning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Aloqa Ma'lumotlari</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Veb-sayt</p>
                        <p className="text-sm text-muted-foreground">www.movimedia.uz</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">info@movimedia.uz</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Qo'llab-quvvatlash</p>
                        <p className="text-sm text-muted-foreground">support@movimedia.uz</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Ijtimoiy Tarmoqlar</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Globe className="h-4 w-4 mr-2" />
                      Telegram
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Globe className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Globe className="h-4 w-4 mr-2" />
                      YouTube
                    </Button>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Bizning Maqsadimiz</h4>
                    <p className="text-xs text-muted-foreground">
                      Koreya kinolari va seriallarini O'zbek auditoriyasiga taqdim etish va K-wave madaniyatini targ'ib qilish.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
