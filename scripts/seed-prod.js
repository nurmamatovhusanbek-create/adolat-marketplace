// Database initialization script for production (Node.js compatible)
// Run with: node scripts/seed-prod.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  const passwordHash = await bcrypt.hash("Demo1234", 12);

  // === ADMIN ===
  const admin = await db.user.upsert({
    where: { email: "admin@adolat.uz" },
    update: {},
    create: {
      id: nanoid(), email: "admin@adolat.uz", phone: "+998901234567",
      name: "Admin User", passwordHash, role: "ADMIN", status: "ACTIVE",
    },
  });
  console.log("  ✓ Admin:", admin.email);

  // === CLIENT ===
  const client = await db.user.upsert({
    where: { email: "client@demo.uz" },
    update: {},
    create: {
      id: nanoid(), email: "client@demo.uz", phone: "+998901111111",
      name: "Demo Mijoz", passwordHash, role: "CLIENT", status: "ACTIVE",
    },
  });
  console.log("  ✓ Client:", client.email);

  // === ADVOCATES ===
  const advocates = [
    { name: "Akmal Rashidov", email: "akmal@adolat.uz", phone: "+998902222201", slug: "akmal-rashidov",
      titleUz: "Senior advokat, Oilaviy huquq bo'yicha mutaxassis",
      license: "ADV-2011-0438", specialty: "family", secondarySpecs: ["civil", "real-estate"],
      region: "tashkent-city", city: "Toshkent", experience: 14, rating: 4.9, reviews: 287,
      cases: 412, successRate: 92, responseHours: 1, consFee: 150000, hourFee: 500000,
      languages: ["uz", "ru", "en"], topRated: true,
      bioUz: "14 yillik tajribaga ega oilaviy huquq bo'yicha yetakchi advokat.",
      expertise: ["Ajralish protsedurasi", "Aliment undirish", "Mulk bo'linishi"],
      education: [{ degree: "Bakalavr", institution: "TDYU", year: 2010 }],
    },
    { name: "Malika Karimova", email: "malika@adolat.uz", phone: "+998902222202", slug: "malika-karimova",
      titleUz: "Korporativ huquq va soliq bo'yicha ekspert",
      license: "ADV-2014-0612", specialty: "corporate", secondarySpecs: ["tax", "labor"],
      region: "tashkent-city", city: "Toshkent", experience: 11, rating: 4.8, reviews: 198,
      cases: 312, successRate: 89, responseHours: 2, consFee: 250000, hourFee: 800000,
      languages: ["uz", "ru", "en"], topRated: true,
      bioUz: "Korporativ huquq bo'yicha yirik ekspert. 100+ MChJ va AJ larni ro'yxatdan o'tkazgan.",
      expertise: ["MChJ ro'yxatga olish", "Soliq optimallashtirish", "M&A bitimlari"],
      education: [{ degree: "Bakalavr", institution: "TDYU", year: 2012 }],
    },
    { name: "Bobur Yo'ldoshev", email: "bobur@adolat.uz", phone: "+998902222203", slug: "bobur-yuldashev",
      titleUz: "Jinoyat ishlari bo'yicha advokat",
      license: "ADV-2007-0156", specialty: "criminal", secondarySpecs: ["administrative"],
      region: "samarkand", city: "Samarqand", experience: 18, rating: 4.9, reviews: 421,
      cases: 587, successRate: 87, responseHours: 1, consFee: 300000, hourFee: 1200000,
      languages: ["uz", "ru"], topRated: true,
      bioUz: "18 yillik tajribaga ega jinoyat ishlari bo'yicha yetakchi advokat.",
      expertise: ["Jinoyat ishlari himoyasi", "Reabilitatsiya", "Apellyatsiya"],
      education: [{ degree: "Bakalavr", institution: "SamDU", year: 2006 }],
    },
    { name: "Dilnoza Ahmedova", email: "dilnoza@adolat.uz", phone: "+998902222204", slug: "dilnoza-ahmedova",
      titleUz: "Ko'chmas mulk va fuqarolik huquqi bo'yicha advokat",
      license: "ADV-2016-0891", specialty: "real-estate", secondarySpecs: ["civil", "corporate"],
      region: "tashkent-region", city: "Toshkent viloyati", experience: 9, rating: 4.7, reviews: 156,
      cases: 234, successRate: 85, responseHours: 3, consFee: 200000, hourFee: 650000,
      languages: ["uz", "ru", "en"], topRated: false,
      bioUz: "Ko'chmas mulk bitimlarini yuridik qo'llab-quvvatlash bo'yicha mutaxassis.",
      expertise: ["Yer uchastkalari bitimlari", "Kadastr ishlari", "Ipoteka shartnomalari"],
      education: [{ degree: "Bakalavr", institution: "TDYU", year: 2014 }],
    },
    { name: "Sherzod Nazarov", email: "sherzod@adolat.uz", phone: "+998902222205", slug: "sherzod-nazarov",
      titleUz: "Mehnat huquqi va kadrlar ishlari bo'yicha yurist",
      license: "ADV-2018-1024", specialty: "labor", secondarySpecs: ["corporate", "administrative"],
      region: "fergana", city: "Farg'ona", experience: 7, rating: 4.6, reviews: 89,
      cases: 134, successRate: 82, responseHours: 4, consFee: 120000, hourFee: 400000,
      languages: ["uz", "ru"], topRated: false,
      bioUz: "Mehnat nizolari va kadrlar hujjatlari bo'yicha professional yordam.",
      expertise: ["Mehnat shartnomalari", "Ishdan bo'shatish", "Mehnat nizolari"],
      education: [{ degree: "Bakalavr", institution: "Farg'ona DU", year: 2016 }],
    },
    { name: "Kamola Saidova", email: "kamola@adolat.uz", phone: "+998902222206", slug: "kamola-saidova",
      titleUz: "Intellektual mulk va IT huquqi bo'yicha mutaxassis",
      license: "ADV-2019-1158", specialty: "intellectual", secondarySpecs: ["corporate", "international"],
      region: "tashkent-city", city: "Toshkent", experience: 6, rating: 4.8, reviews: 67,
      cases: 89, successRate: 88, responseHours: 2, consFee: 280000, hourFee: 750000,
      languages: ["uz", "ru", "en"], topRated: false,
      bioUz: "Intellektual mulk huquqi, dasturiy ta'minot litsenziyalash va startaplar uchun huquqiy yordam.",
      expertise: ["Patent olish", "Tovar belgilari", "Litsenziya shartnomalari", "NDA"],
      education: [{ degree: "Bakalavr", institution: "WIU", year: 2017 }],
    },
    { name: "Javlon Ergashev", email: "javlon@adolat.uz", phone: "+998902222207", slug: "javlon-ergashev",
      titleUz: "Xalqaro bitimlar va investitsiyalar bo'yicha advokat",
      license: "ADV-2009-0287", specialty: "international", secondarySpecs: ["corporate", "tax"],
      region: "tashkent-city", city: "Toshkent", experience: 16, rating: 4.9, reviews: 234,
      cases: 298, successRate: 91, responseHours: 1, consFee: 500000, hourFee: 1500000,
      languages: ["uz", "ru", "en"], topRated: true,
      bioUz: "Xalqaro bitimlar va xorijiy investitsiyalar sohasidagi yetakchi ekspert.",
      expertise: ["Xalqaro shartnomalar", "Investitsiya bitimlari", "Xalqaro arbitraj"],
      education: [{ degree: "LLB", institution: "Cambridge", year: 2008 }],
    },
    { name: "Nigora Usmanova", email: "nigora@adolat.uz", phone: "+998902222208", slug: "nigora-usmanova",
      titleUz: "Ma'muriy huquq va davlat xizmatlari advokati",
      license: "ADV-2015-0734", specialty: "administrative", secondarySpecs: ["civil", "tax"],
      region: "bukhara", city: "Buxoro", experience: 10, rating: 4.7, reviews: 143,
      cases: 198, successRate: 84, responseHours: 3, consFee: 130000, hourFee: 450000,
      languages: ["uz", "ru"], topRated: false,
      bioUz: "Davlat organlari qarorlarini shikoyat qilish, ma'muriy huquqbuzarliklar bo'yicha tajribali advokat.",
      expertise: ["Ma'muriy shikoyatlar", "Davlat xizmatlari", "Litsenziyalash"],
      education: [{ degree: "Bakalavr", institution: "Buxoro DU", year: 2013 }],
    },
  ];

  for (const a of advocates) {
    const user = await db.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        id: nanoid(), email: a.email, phone: a.phone, name: a.name,
        passwordHash, role: "ADVOCATE", status: "ACTIVE",
      },
    });
    await db.advocateProfile.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        id: nanoid(), userId: user.id, slug: a.slug,
        titleUz: a.titleUz, bioUz: a.bioUz,
        licenseNumber: a.license, licenseVerified: true,
        specialty: a.specialty, secondarySpecs: JSON.stringify(a.secondarySpecs),
        expertise: JSON.stringify(a.expertise), languages: JSON.stringify(a.languages),
        region: a.region, city: a.city, experienceYears: a.experience,
        rating: a.rating, reviewsCount: a.reviews, casesResolved: a.cases,
        successRate: a.successRate, responseTimeHours: a.responseHours,
        consultationFee: a.consFee, hourlyFee: a.hourFee,
        verified: true, topRated: a.topRated, availability: "available",
        tagsJson: JSON.stringify(a.topRated ? ["TOP-10"] : []),
        education: JSON.stringify(a.education),
      },
    });
    console.log("  ✓ Advocate:", a.name);
  }

  // === DOCUMENTS ===
  const docs = [
    { slug: "mehnat-shartnomasi", titleUz: "Mehnat shartnomasi (kontrakt)", category: "contracts",
      subcategory: "Xizmat ko'rsatishga oid", descriptionUz: "Xodim va ish beruvchi o'rtasidagi standart mehnat shartnomasi.",
      pages: 6, downloads: 18432, rating: 4.9, isFree: true, isPopular: true,
      legalBasisUz: "O'zR Mehnat kodeksi, 70-modda", fieldsCount: 16 },
    { slug: "oldi-sotdi-shartnomasi", titleUz: "Oldi-sotdi shartnomasi", category: "contracts",
      subcategory: "Oldi-sotdi", descriptionUz: "Tovar yoki mulkni sotib olish-sotish bo'yicha universal shartnoma.",
      pages: 5, downloads: 15238, rating: 4.8, priceUzs: 25000, isFree: false, isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 367-modda", fieldsCount: 12 },
    { slug: "ijara-shartnomasi", titleUz: "Ijara shartnomasi", category: "contracts",
      subcategory: "Ijara", descriptionUz: "Ko'chmas mulk ijaraga berish uchun professional shartnoma.",
      pages: 7, downloads: 12764, rating: 4.7, priceUzs: 35000, isFree: false, isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 542-modda", fieldsCount: 7 },
    { slug: "davo-arizasi-ajrashish", titleUz: "Ajrashish to'g'risida da'vo arizasi", category: "court",
      subcategory: "Da'vo arizalari", descriptionUz: "Sudga nikohni bekor qilish to'g'risida beriladigan da'vo arizasi.",
      pages: 4, downloads: 11092, rating: 4.8, priceUzs: 40000, isFree: false, isPopular: true,
      legalBasisUz: "O'zR Oila kodeksi, 41-modda", fieldsCount: 10 },
    { slug: "ishdan-boshatish-shikoyat", titleUz: "Ishdan bo'shatish ustidan shikoyat", category: "court",
      subcategory: "Mehnat nizolari", descriptionUz: "Noto'g'ri ishdan haydalgan xodimning tiklash to'g'risidagi da'vo arizasi.",
      pages: 4, downloads: 8741, rating: 4.6, priceUzs: 35000, isFree: false, isPopular: true,
      legalBasisUz: "O'zR Mehnat kodeksi, 211-modda", fieldsCount: 9 },
    { slug: "ariza-raqamli-imzo", titleUz: "Elektron raqamli imzo olish uchun ariza", category: "applications",
      subcategory: "Jismoniy shaxslarga oid", descriptionUz: "Elektron raqamli imzo olish uchun ariza namunasi.",
      pages: 2, downloads: 5432, rating: 4.6, isFree: true, isNew: true,
      legalBasisUz: "'Elektron raqamli imzo' to'g'risidagi qonun", fieldsCount: 4 },
    { slug: "vakillik-shartnomasi", titleUz: "Vakillik shartnomasi", category: "contracts",
      subcategory: "Yuridik shaxslarga oid", descriptionUz: "Vakolat beruvchi va vakilli qiluvchi o'rtasidagi vakillik shartnomasi.",
      pages: 4, downloads: 3421, rating: 4.7, isFree: true, isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 841-modda", fieldsCount: 18 },
    { slug: "avto-ijara-qisqa-muddatli", titleUz: "Avtotransport vositasini qisqa muddatli ijaraga berish shartnomasi",
      category: "contracts", subcategory: "Avtotransportlarga oid",
      descriptionUz: "Avtomobilni qisqa muddatga ijaraga berish shartnomasi.",
      pages: 5, downloads: 5847, rating: 4.6, priceUzs: 30000, isFree: false, isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 542, 595-moddalar", fieldsCount: 19 },
    { slug: "hakamlik-bitimi", titleUz: "Hakamlik bitimi", category: "contracts",
      subcategory: "Boshqa turdagi shartnomalar", descriptionUz: "Nizolarni hakamlik sudida ko'rib chiqish to'g'risidagi bitim.",
      pages: 3, downloads: 2104, rating: 4.5, isFree: true, isNew: true,
      legalBasisUz: "O'zR 'Hakamlik sudi to'g'risida'gi qonuni", fieldsCount: 11 },
    { slug: "pudrat-shartnomasi", titleUz: "Ishlarni bajarish bo'yicha pudrat shartnomasi", category: "contracts",
      subcategory: "Xizmat ko'rsatishga oid", descriptionUz: "Pudrat va buyurtmachi o'rtasidagi ishlarni bajarish shartnomasi.",
      pages: 6, downloads: 4521, rating: 4.7, priceUzs: 35000, isFree: false, isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 651-modda", fieldsCount: 18 },
  ];

  for (const d of docs) {
    const doc = await db.legalDocument.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        id: nanoid(), slug: d.slug, titleUz: d.titleUz, category: d.category,
        subcategory: d.subcategory, descriptionUz: d.descriptionUz,
        pages: d.pages, downloads: d.downloads, rating: d.rating,
        priceUzs: d.priceUzs || 0, isFree: d.isFree ?? false,
        isPopular: d.isPopular ?? false, isNew: d.isNew ?? false,
        legalBasisUz: d.legalBasisUz, lastUpdated: new Date(),
        tagsJson: JSON.stringify([]),
      },
    });
    // Create a simple template if it doesn't exist
    const existingTemplate = await db.documentTemplate.findUnique({ where: { documentId: doc.id } });
    if (!existingTemplate) {
      await db.documentTemplate.create({
        data: {
          id: nanoid(), documentId: doc.id,
          fieldsSchema: JSON.stringify({ sections: [{ id: "main", title: "Asosiy ma'lumotlar", fields: [
            { id: "date", label: "Sana", type: "date", required: true },
            { id: "place", label: "Joy", type: "text", required: true, maxLength: 100 },
            { id: "party1", label: "Birinchi tomon", type: "text", required: true, maxLength: 200 },
            { id: "party2", label: "Ikkinchi tomon", type: "text", required: true, maxLength: 200 },
          ]}] }),
          bodySchema: JSON.stringify([
            { type: "text", content: d.titleUz.toUpperCase(), style: "heading" },
            { type: "spacer" },
            { type: "field", fieldId: "place" },
            { type: "text", content: "shahrida" },
            { type: "field", fieldId: "date" },
            { type: "text", content: "sanada tuzildi." },
            { type: "spacer" },
            { type: "text", content: "Tomonlar:" },
            { type: "field", fieldId: "party1" },
            { type: "text", content: "va" },
            { type: "field", fieldId: "party2" },
            { type: "spacer" },
            { type: "text", content: "Imzolar:" },
            { type: "text", content: "______________________" },
          ]),
          estimatedFillMinutes: 10,
          version: 1,
        },
      });
    }
    console.log("  ✓ Document:", d.titleUz);
  }

  // === REQUESTS ===
  const requests = [
    { title: "AJ ro'yxatdan o'tkazish va ustav hujjatlarini tayyorlash",
      description: "Yangi qurilish kompaniyasi uchun Aksiyadorlik jamiyatini ro'yxatdan o'tkazish kerak.",
      category: "corporate", region: "tashkent-city", city: "Toshkent",
      budgetMin: 3000000, budgetMax: 5000000, isUrgent: true },
    { title: "Ajrashish va bolani onaga qoldirish bo'yicha yordam",
      description: "Er-xotin ajrashmoqchi, 7 yoshli bola bor.",
      category: "family", region: "samarkand", city: "Samarqand",
      budgetMin: 1500000, budgetMax: 2500000, isUrgent: false },
    { title: "Mehnat shartnomasini bekor qilish ustidan shikoyat",
      description: "Xodimni ogohlantirishsiz va to'lovlarsiz ishdan haydagan.",
      category: "labor", region: "tashkent-city", city: "Toshkent",
      budgetMin: 800000, budgetMax: 1500000, isUrgent: false },
    { title: "Brend nomi va logotip uchun tovar belgisini ro'yxatga olish",
      description: "Yangi ochilayotgan kafelar tarmog'i uchun brend nomi va logotipni himoya qilish kerak.",
      category: "intellectual", region: "tashkent-city", city: "Toshkent",
      budgetMin: 2000000, budgetMax: 3500000, isUrgent: false },
  ];

  for (const r of requests) {
    await db.legalRequest.create({
      data: {
        id: nanoid(), userId: client.id, title: r.title, description: r.description,
        category: r.category, region: r.region, city: r.city, clientType: "individual",
        isUrgent: r.isUrgent, status: "OPEN", budgetMin: r.budgetMin, budgetMax: r.budgetMax,
        viewsCount: Math.floor(Math.random() * 200), responsesCount: 0,
        contactName: client.name, contactPhone: client.phone, contactEmail: client.email,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log("  ✓ Request:", r.title);
  }

  console.log("\n✅ Seed complete!");
  console.log("\nDemo accounts (password: Demo1234):");
  console.log("  • admin@adolat.uz (ADMIN)");
  console.log("  • client@demo.uz (CLIENT)");
  console.log("  • akmal@adolat.uz (ADVOCATE)");
}

main()
  .catch((err) => { console.error("Seed failed:", err); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
