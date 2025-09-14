# MoviMedia


PROMPT



Oʻzbekcha prompt (kopiya — toʻliq va aniqlik bilan)
Men istayman: http://asilmedia.org
 saytining vizual jihatdan va funksional jihatdan imkon qadar yaqin klon saytini yarating. Quyidagilarni aniq bajarilsin:

Umumiy:

Dizayn: asl saytga (asilmedia.org) maksimum darajada o‘xshash: sarlavha (hero), rang palitrasi, shriftlar, kartochkalar, footer va navigatsiya tartibi.

Responsive: mobil (<= 480px), planshet (768px) va desktop (>= 1200px) uchun optimallashtirilgan.

CMS: maqolalar, yangiliklar, kategoriya va mualliflar uchun boshqaruv paneli (Headless CMS — Contentful/Strapi/Netlify CMS yoki Wix/WordPress CMS).

Kod: toza, semantik HTML5, BEM yoki Tailwind sinflari bilan; sahifalar statik yoki jamlangan (SSG) qilib Next.js/Vercel uchun tayyor bo‘lsin (agar mumkin bo‘lsa).

Performance: sahifa yuklanishi < 2s (svet optimallashtirish: lazy-loading rasmlar, SVG ikonlar, minify CSS/JS).

SEO: har bir sahifa uchun meta title, meta description, Open Graph (og:) va Twitter card
Accessibility: WCAG 2.1 AA standartiga mos (alt teglar, kontrast, fokus ko‘rsatkichlari).
Analytics va Forms: Google Analytics yoki Matomo, kontakt/form submit uchun back-end (Formspree yoki serverless function).

Sahifa tuzilishi (kamida):
Home (asosiy) — hero (katta sarlavha + qisqacha tagline), yangiliklar/maqolalar grid yoki karusel, xizmatlar qisqacha, mijozlar logolari (agar bor), oxirida kontakt va subscription form.
About — tashkilot haqida: missiya, jamoa (rasm + lavozim), tarix/yo‘l xaritasi.
Services / Xizmatlar — har bir xizmat uchun kartochka (nom, qisqa tasvir, CTA “ko‘proq”).
Blog / Yangiliklar — toifalar, search, tag filter, single-post sahifa (muallif, sana, share knopkalar).
Contact — kontakt form, manzil, telefon, email, Google Maps embedd.
Privacy / Terms — oddiy, tayyor namunaviy huquqiy sahifalar.
404 va Search natijalari — mos xabarlar.

Dizayn detalilari:

Ranglar: asosiy fon, aksent (asosiy sayt ranglari bilan mos), matnning qora/gray tonlari. (Agar aniq rang kodlari kerak bo‘lsa, AIdan “extract color palette from the site” deb so‘rang.)

Shrifts: Google Fonts ga mos — sarlavhalar uchun sans-serif (masalan: Poppins yoki Inter), body uchun OTF/serif kerak emas — lekin AI saytdagi shriftga tenglashtirsin.

Ikonkalar: SVG ikonalar (FontAwesome yoki Heroicons).

Rasmlar: hero uchun yuqori sifatli rasmlar (lazy load, srcset), maqola thumbnail’lari 16:9.

Funktsiyalar & Interaktivlik:
Navbar sticky; mobilda hamburger menyu
Search (client-side yoki algolia) va category filter.
Social share knopkalar (Facebook, Twitter, Telegram).
Newsletter subscription (email validation, success & error xabari).
Breadcrumbs single-post sahifalarda.
Pagination yoki infinite scroll blog ro‘yxatida.

Kontent & Placeholder tekstlari:
Barcha sahifalar uchun real kontent olinmaguncha lorem + UX-friendly placeholder text qo‘ying; ammo blog post sahifalari uchun 2 ta example article bilan to‘ldiring (title, excerpt, body, author, publish date).

Deliverables (yetkazib beriladigan fayllar):
To‘liq HTML/CSS/JS yoki Next.js loyiha papkasi (GitHub repo).
CMS konfiguratsiyasi (migration/seed fayllari bilan).

README fayli: qanday o‘rnatish, deploy (Vercel/Netlify), qayerni tahrirlash.
Figma yoki SVG eskiz (agar mumkin bo‘lsa, asosiy sahifa prototipi).

Tekshiruv mezonlari (QA):
Desktop va mobile screenshot’lari (Chrome devtools 375×812, 768×1024, 1440×900).

Lighthouse audit: Performance >= 80, Accessibility >= 90, Best Practices >= 90, SEO >= 90
Broken link va console error tekshiruvi.

Maxsus talablar (agar kerak bo‘lsa):
Til almashtirish: sayt 3 tilga tarjima qilinsin (uz, ru, en) — URL struktura: /uz/, /ru/, /en/. (Agar AIda avtomatik tarjima imkoniyati bo‘lsa, YOLO; agar bo‘lmasa, placeholder translations qo‘ying.)

Legal: Cookie consent popup (EU-friendly).

Versiya/Deployment:
Birinchi versiya — statik build(HTML/CSS/JS) + CMS README.
Takomillashtirilgan — Next.js + Headless CMS + Netlify/Vercel deployment.

Qo‘shimcha eslatma (AIga):
Iltimos, saytni toʻliq vizual klon sifatida yarating, lekin original kontent (matn, rasmlar)ni uning egasidan ruxsat olinmaguncha nusxalamaslik uchun placeholder yoki litsenziyaga mos bepul fotosuratlar (Unsplash) ishlating.
Barcha muhim qism va komponentlarni nomlab (component: Header, Hero, ArticleCard va hokazo) va komponent darajasida kod yozib bering.

2) English prompt (for AI tools that understand English better)

Create a near-identical visual and functional clone of http://asilmedia.org
. Please implement the following exactly:

Overview:
Visual design: match hero, color palette, typography, cards, footer and navigation layout.
Responsive for mobile (<=480px), tablet (768px) and desktop (>=1200px).
CMS-enabled for articles, categories and authors (suggest Headless CMS: Contentful/Strapi/Netlify CMS or WordPress).
Clean semantic HTML5, structured CSS (Tailwind or BEM), ideally as a Next.js project ready to deploy to Vercel.
Performance optimized (lazy-load images, SVG icons, minimize CSS/JS).

SEO: meta title, description, Open Graph, Twitter card for every page.
Accessibility: WCAG 2.1 AA compliance (alt text, keyboard focus, contrast).
Analytics (Google Analytics or Matomo) and contact form (Formspree/serverless).

Pages:

Home: hero, latest posts grid/carousel, services, client logos, email subscription.

About: mission, team (photo + role), timeline.

Services: service cards with CTA.

Blog: category & tag filters, search, single post page (author, date, share).
Contact: contact form, address, phone, map.
Privacy/Terms, 404, search results.

Design specifics:
Extract site color palette; use Google Fonts similar to site (e.g., Poppins/Inter).
SVG icons, responsive images (srcset), thumbnails 16:9.

Interactions:
Sticky header, hamburger menu on mobile.
Search (client-side or Algolia), category filter, social share buttons, newsletter subscription, breadcrumbs, pagination or infinite scroll.

Content:
Use placeholders until real content is available; include two sample blog posts with full fields (title, excerpt, body, author, date).

Deliverables:
Complete GitHub repo with HTML/CSS/JS or Next.js project.
CMS configuration and seed data.
README with install/deploy instructions (Vercel/Netlify).
Figma or SVG mockup of main page (if possible).

QA & Metrics:
Provide screenshots for mobile/tablet/desktop.
Lighthouse targets: Performance >= 80, Accessibility >= 90, Best Practices >= 90, SEO >= 90.
Remove console errors and broken links.

Extra:
Multi-language support (uz/ru/en) with /uz/, /ru/, /en/ paths.
Cookie consent popup.
Do not copy copyrighted text/images — use placeholders or Unsplash/free assets.
