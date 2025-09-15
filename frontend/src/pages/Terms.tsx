import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Terms = () => {
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
            <FileText className="h-8 w-8 md:h-12 md:w-12 text-primary mr-3" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Foydalanish Shartlari
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            MovieMedia platformasidan foydalanish shartlari va qoidalari.
          </p>
          <Badge variant="secondary" className="mt-4">
            Oxirgi yangilanish: 2025-yil 14-yanvar
          </Badge>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          
          {/* Umumiy shartlar */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Umumiy Shartlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ushbu shartlar MovieMedia platformasidan foydalanishni tartibga soladi. 
                Platformadan foydalanish orqali siz ushbu shartlarni qabul qilganingizni bildiradi.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Muhim:</h4>
                <p className="text-sm text-muted-foreground">
                  Agar siz ushbu shartlar bilan rozi bo'lmasangiz, platformadan foydalanishni to'xtating.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Xizmat tavsifi */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Xizmat Tavsifi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                MovieMedia quyidagi xizmatlarni taqdim etadi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Kino Ko'rish</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• O'zbek tilidagi kinolar</li>
                    <li>• Turli janrlar va yillar</li>
                    <li>• Yuqori sifatli video</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Qo'shimcha Xizmatlar</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• Shaxsiy ro'yxatlar</li>
                    <li>• Tavsiyalar</li>
                    <li>• Izohlar va baholash</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Foydalanuvchi majburiyatlari */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Foydalanuvchi Majburiyatlari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Platformadan foydalanishda quyidagi qoidalarga rioya qilishingiz kerak:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">Qonuniy Foydalanish</h4>
                    <p className="text-xs text-green-700 dark:text-green-300">Faqat qonuniy maqsadlar uchun foydalaning</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">Himoya Qilish</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Hisob ma'lumotlarini himoya qiling</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-sm text-yellow-800 dark:text-yellow-200">Hurmat</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">Boshqa foydalanuvchilarga hurmat ko'rsating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Taqiqlangan harakatlar */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Taqiqlangan Harakatlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Quyidagi harakatlar qat'iyan taqiqlanadi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base text-destructive">Texnik Taqiqlar</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• Kontentni yuklab olish</li>
                    <li>• Reverse engineering</li>
                    <li>• Bot yoki avtomatik dasturlar</li>
                    <li>• Tizimga zarar yetkazish</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base text-destructive">Ijtimoiy Taqiqlar</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• Nohaq izohlar yozish</li>
                    <li>• Spam yuborish</li>
                    <li>• Soxta hisob yaratish</li>
                    <li>• Boshqalarni bezovta qilish</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mualliflik huquqi */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                Mualliflik Huquqi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Barcha kontent mualliflik huquqi bilan himoyalangan:
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Kino Kontentlari</h4>
                    <p className="text-xs text-muted-foreground">Mualliflik huquqi bilan himoyalangan</p>
                  </div>
                  <Badge variant="destructive">Qonuniy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Platforma Dizayni</h4>
                    <p className="text-xs text-muted-foreground">MovieMedia kompaniyasiga tegishli</p>
                  </div>
                  <Badge variant="default">Himoyalangan</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Foydalanuvchi Kontentlari</h4>
                    <p className="text-xs text-muted-foreground">Foydalanuvchilarga tegishli</p>
                  </div>
                  <Badge variant="secondary">Shaxsiy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Javobgarlik cheklovlari */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Javobgarlik Cheklovlari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-destructive">Diqqat:</h4>
                <p className="text-sm text-muted-foreground">
                  MovieMedia quyidagi holatlar uchun javobgar emas:
                </p>
              </div>
              <ul className="space-y-2 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Internet aloqasi uzilishi yoki texnik muammolar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Foydalanuvchi tomonidan kiritilgan noto'g'ri ma'lumotlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Uchinchi tomon xizmatlarining ishlamasligi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Kutilmagan tizim ishlamasligi</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Shartlarni o'zgartirish */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Shartlarni O'zgartirish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Biz ushbu shartlarni istalgan vaqtda o'zgartirish huquqini o'zimizda saqlaymiz. 
                O'zgarishlar haqida sizni xabardor qilamiz:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <h4 className="font-semibold text-sm">Xabar Berish</h4>
                  <p className="text-xs text-muted-foreground">Email orqali xabar beramiz</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <h4 className="font-semibold text-sm">Ko'rib Chiqish</h4>
                  <p className="text-xs text-muted-foreground">30 kun ichida ko'rib chiqing</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <h4 className="font-semibold text-sm">Qabul Qilish</h4>
                  <p className="text-xs text-muted-foreground">Foydalanish orqali qabul qilasiz</p>
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
                Foydalanish shartlari bilan bog'liq savollar uchun biz bilan bog'laning:
              </p>
              <div className="space-y-2 text-sm md:text-base">
                <p><strong>Email:</strong> legal@movimedia.uz</p>
                <p><strong>Telefon:</strong> +998 90 123 45 67</p>
                <p><strong>Manzil:</strong> Toshkent shahri, O'zbekiston</p>
                <p><strong>Ish Vaqti:</strong> Dushanba - Juma, 9:00 - 18:00</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
