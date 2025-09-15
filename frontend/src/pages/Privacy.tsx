import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Database, UserCheck, Globe } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Privacy = () => {
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
            <Shield className="h-8 w-8 md:h-12 md:w-12 text-primary mr-3" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Maxfiylik Siyosati
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Bizning foydalanuvchilarimizning shaxsiy ma'lumotlarini himoya qilish bizning eng muhim vazifamizdir.
          </p>
          <Badge variant="secondary" className="mt-4">
            Oxirgi yangilanish: 2025-yil 14-yanvar
          </Badge>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          
          {/* Ma'lumotlar to'planishi */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Ma'lumotlar To'planishi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Biz quyidagi ma'lumotlarni to'playmiz:
              </p>
              <ul className="space-y-2 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Shaxsiy ma'lumotlar (ism, email, telefon raqami)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Foydalanish statistikasi va tomosha tarixi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Qurilma ma'lumotlari va IP manzil</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Cookie'lar va tracking texnologiyalari</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Ma'lumotlardan foydalanish */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Ma'lumotlardan Foydalanish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To'plangan ma'lumotlar quyidagi maqsadlarda ishlatiladi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Xizmat Ko'rsatish</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• Shaxsiylashtirilgan tavsiyalar</li>
                    <li>• Tomosha tarixini saqlash</li>
                    <li>• Foydalanuvchi hisobini boshqarish</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Analitika</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• Xizmat sifatini yaxshilash</li>
                    <li>• Foydalanuvchi tajribasini optimallashtirish</li>
                    <li>• Statistika va hisobotlar</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ma'lumotlarni himoya qilish */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Ma'lumotlarni Himoya Qilish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Biz sizning ma'lumotlaringizni himoya qilish uchun quyidagi choralarni ko'ramiz:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Shifrlash</h4>
                  <p className="text-xs text-muted-foreground">SSL/TLS texnologiyasi</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Xavfsizlik</h4>
                  <p className="text-xs text-muted-foreground">Zamonaviy himoya tizimlari</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Nazorat</h4>
                  <p className="text-xs text-muted-foreground">Cheklangan kirish huquqi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie'lar */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Cookie'lar va Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Biz quyidagi turdagi cookie'lardan foydalanamiz:
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Zaruriy Cookie'lar</h4>
                    <p className="text-xs text-muted-foreground">Saytning asosiy funksiyalari uchun</p>
                  </div>
                  <Badge variant="default">Majburiy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Funksional Cookie'lar</h4>
                    <p className="text-xs text-muted-foreground">Shaxsiylashtirilgan tajriba uchun</p>
                  </div>
                  <Badge variant="secondary">Ixtiyoriy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Analitik Cookie'lar</h4>
                    <p className="text-xs text-muted-foreground">Statistika va tahlil uchun</p>
                  </div>
                  <Badge variant="outline">Ixtiyoriy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Foydalanuvchi huquqlari */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Foydalanuvchi Huquqlari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Sizda quyidagi huquqlar mavjud:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Ma'lumotlarni Ko'rish</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    O'z ma'lumotlaringizni ko'rish va nusxa olish
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Tahrirlash</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Noto'g'ri ma'lumotlarni to'g'rilash
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">O'chirish</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Hisobingizni butunlay o'chirish
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Cheklash</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Ma'lumotlardan foydalanishni cheklash
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aloqa */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Aloqa Ma'lumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Maxfiylik siyosati bilan bog'liq savollar uchun biz bilan bog'laning:
              </p>
              <div className="space-y-2 text-sm md:text-base">
                <p><strong>Email:</strong> privacy@movimedia.uz</p>
                <p><strong>Telefon:</strong> +998 90 123 45 67</p>
                <p><strong>Manzil:</strong> Toshkent shahri, O'zbekiston</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
