// Seed script — populates the database with real document templates,
// advocates, and demo legal requests.
// Run with: bun run /home/z/my-project/scripts/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const db = new PrismaClient();

// ============================================================================
// USERS
// ============================================================================

async function seedUsers() {
  console.log("→ Seeding users...");

  const passwordHash = await bcrypt.hash("Demo1234", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@adolat.uz" },
    update: {},
    create: {
      id: nanoid(),
      email: "admin@adolat.uz",
      phone: "+998901234567",
      name: "Admin User",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const demoClient = await db.user.upsert({
    where: { email: "client@demo.uz" },
    update: {},
    create: {
      id: nanoid(),
      email: "client@demo.uz",
      phone: "+998901111111",
      name: "Demo Mijoz",
      passwordHash,
      role: "CLIENT",
      status: "ACTIVE",
    },
  });

  console.log(`  ✓ Admin: ${admin.email}`);
  console.log(`  ✓ Client: ${demoClient.email}`);

  // Advocates — 8 demo advocates
  const advocatesData = [
    {
      name: "Akmal Rashidov",
      email: "akmal@adolat.uz",
      phone: "+998902222201",
      slug: "akmal-rashidov",
      titleUz: "Senior advokat, Oilaviy huquq bo'yicha mutaxassis",
      titleRu: "Старший адвокат, специалист по семейному праву",
      license: "ADV-2011-0438",
      specialty: "family",
      secondarySpecs: ["civil", "real-estate"],
      region: "tashkent-city",
      city: "Toshkent",
      experience: 14,
      rating: 4.9,
      reviews: 287,
      cases: 412,
      successRate: 92,
      responseHours: 1,
      consFee: 150000,
      hourFee: 500000,
      languages: ["uz", "ru", "en"],
      bioUz: "14 yillik tajribaga ega oilaviy huquq bo'yicha yetakchi advokat. 400+ ajrashish, aliment, mulk bo'linishi ishlarini yakunlagan.",
      bioRu: "Ведущий адвокат по семейному праву с 14-летним опытом.",
      expertise: ["Ajralish protsedurasi", "Aliment undirish", "Mulk bo'linishi", "Bolalar bilan aloqada bo'lish", "Nikoh shartnomasi"],
      education: [
        { degree: "Yuridik fanlar bakalavri", institution: "Toshkent Davlat Yuridik Universiteti", year: 2010 },
        { degree: "Yuridik fanlar magistri", institution: "Toshkent Davlat Yuridik Universiteti", year: 2012 },
      ],
      topRated: true,
    },
    {
      name: "Malika Karimova",
      email: "malika@adolat.uz",
      phone: "+998902222202",
      slug: "malika-karimova",
      titleUz: "Korporativ huquq va soliq bo'yicha ekspert",
      titleRu: "Эксперт по корпоративному и налоговому праву",
      license: "ADV-2014-0612",
      specialty: "corporate",
      secondarySpecs: ["tax", "labor"],
      region: "tashkent-city",
      city: "Toshkent",
      experience: 11,
      rating: 4.8,
      reviews: 198,
      cases: 312,
      successRate: 89,
      responseHours: 2,
      consFee: 250000,
      hourFee: 800000,
      languages: ["uz", "ru", "en"],
      bioUz: "Korporativ huquq bo'yicha yirik ekspert. 100+ MChJ va AJ larni ro'yxatdan o'tkazish ishlarini bajargan.",
      bioRu: "Крупный эксперт по корпоративному праву.",
      expertise: ["MChJ ro'yxatga olish", "Soliq optimallashtirish", "Aksiyadorlar shartnomasi", "Audyat", "M&A bitimlari"],
      education: [
        { degree: "Yuridik fanlar bakalavri", institution: "Toshkent Davlat Yuridik Universiteti", year: 2012 },
        { degree: "MBA", institution: "Westminster International University", year: 2015 },
      ],
      topRated: true,
    },
    {
      name: "Bobur Yo'ldoshev",
      email: "bobur@adolat.uz",
      phone: "+998902222203",
      slug: "bobur-yuldashev",
      titleUz: "Jinoyat ishlari bo'yicha advokat",
      titleRu: "Адвокат по уголовным делам",
      license: "ADV-2007-0156",
      specialty: "criminal",
      secondarySpecs: ["administrative"],
      region: "samarkand",
      city: "Samarqand",
      experience: 18,
      rating: 4.9,
      reviews: 421,
      cases: 587,
      successRate: 87,
      responseHours: 1,
      consFee: 300000,
      hourFee: 1200000,
      languages: ["uz", "ru"],
      bioUz: "18 yillik tajribaga ega jinoyat ishlari bo'yicha yetakchi advokat. 500+ ishni himoya qilgan.",
      bioRu: "Ведущий адвокат по уголовным делам с 18-летним опытом.",
      expertise: ["Jinoyat ishlari himoyasi", "Hibsga olish qarorini shikoyat qilish", "Reabilitatsiya", "Tergov ishlari", "Apellyatsiya"],
      education: [
        { degree: "Yuridik fanlar bakalavri", institution: "Samarqand Davlat Universiteti", year: 2006 },
        { degree: "Yuridik fanlar nomzodi", institution: "O'zR Fanlar Akademiyasi", year: 2011 },
      ],
      topRated: true,
    },
    {
      name: "Dilnoza Ahmedova",
      email: "dilnoza@adolat.uz",
      phone: "+998902222204",
      slug: "dilnoza-ahmedova",
      titleUz: "Ko'chmas mulk va fuqarolik huquqi bo'yicha advokat",
      titleRu: "Адвокат по недвижимости и гражданскому праву",
      license: "ADV-2016-0891",
      specialty: "real-estate",
      secondarySpecs: ["civil", "corporate"],
      region: "tashkent-region",
      city: "Toshkent viloyati",
      experience: 9,
      rating: 4.7,
      reviews: 156,
      cases: 234,
      successRate: 85,
      responseHours: 3,
      consFee: 200000,
      hourFee: 650000,
      languages: ["uz", "ru", "en"],
      bioUz: "Ko'chmas mulk bitimlarini yuridik qo'llab-quvvatlash bo'yicha mutaxassis. 200+ bitimlar muvaffaqiyatli yakunlangan.",
      bioRu: "Специалист по юридическому сопровождению сделок с недвижимостью.",
      expertise: ["Yer uchastkalari bitimlari", "Kadastr ishlari", "Ipoteka shartnomalari", "Mulk huquqi", "Bino qurish"],
      education: [
        { degree: "Yuridik fanlar bakalavri", institution: "Toshkent Davlat Yuridik Universiteti", year: 2014 },
      ],
      topRated: false,
    },
    {
      name: "Sherzod Nazarov",
      email: "sherzod@adolat.uz",
      phone: "+998902222205",
      slug: "sherzod-nazarov",
      titleUz: "Mehnat huquqi va kadrlar ishlari bo'yicha yurist",
      titleRu: "Юрист по трудовому праву и кадровым вопросам",
      license: "ADV-2018-1024",
      specialty: "labor",
      secondarySpecs: ["corporate", "administrative"],
      region: "fergana",
      city: "Farg'ona",
      experience: 7,
      rating: 4.6,
      reviews: 89,
      cases: 134,
      successRate: 82,
      responseHours: 4,
      consFee: 120000,
      hourFee: 400000,
      languages: ["uz", "ru"],
      bioUz: "Mehnat nizolari va kadrlar hujjatlari bo'yicha professional yordam. 100+ ish.",
      bioRu: "Профессиональная помощь по трудовым спорам и кадровым документам.",
      expertise: ["Mehnat shartnomalari", "Ishdan bo'shatish", "Mehnat nizolari", "Kadrlar hujjatlari", "Moddiy javobgarlik"],
      education: [
        { degree: "Yuridik fanlar bakalavri", institution: "Farg'ona Davlat Universiteti", year: 2016 },
      ],
      topRated: false,
    },
    {
      name: "Kamola Saidova",
      email: "kamola@adolat.uz",
      phone: "+998902222206",
      slug: "kamola-saidova",
      titleUz: "Intellektual mulk va IT huquqi bo'yicha mutaxassis",
      titleRu: "Специалист по интеллектуальной собственности и IT-праву",
      license: "ADV-2019-1158",
      specialty: "intellectual",
      secondarySpecs: ["corporate", "international"],
      region: "tashkent-city",
      city: "Toshkent",
      experience: 6,
      rating: 4.8,
      reviews: 67,
      cases: 89,
      successRate: 88,
      responseHours: 2,
      consFee: 280000,
      hourFee: 750000,
      languages: ["uz", "ru", "en"],
      bioUz: "Intellektual mulk huquqi, dasturiy ta'minot litsenziyalash va startaplar uchun huquqiy yordam bo'yicha mutaxassis.",
      bioRu: "Динамичный специалист по интеллектуальной собственности и IT-праву.",
      expertise: ["Patent olish", "Tovar belgilari", "Litsenziya shartnomalari", "NDA", "TOS hujjatlari", "Mualliflik huquqi"],
      education: [
        { degree: "Yuridik fanlar bakalavri", institution: "Westminster International University", year: 2017 },
        { degree: "Intellektual mulk huquqi magistri", institution: "WIPO Academy", year: 2019 },
      ],
      topRated: false,
    },
    {
      name: "Javlon Ergashev",
      email: "javlon@adolat.uz",
      phone: "+998902222207",
      slug: "javlon-ergashev",
      titleUz: "Xalqaro bitimlar va investitsiyalar bo'yicha advokat",
      titleRu: "Адвокат по международным сделкам и инвестициям",
      license: "ADV-2009-0287",
      specialty: "international",
      secondarySpecs: ["corporate", "tax"],
      region: "tashkent-city",
      city: "Toshkent",
      experience: 16,
      rating: 4.9,
      reviews: 234,
      cases: 298,
      successRate: 91,
      responseHours: 1,
      consFee: 500000,
      hourFee: 1500000,
      languages: ["uz", "ru", "en"],
      bioUz: "Xalqaro bitimlar va xorijiy investitsiyalar sohasidagi yetakchi ekspert. 30+ xorijiy investorlarga konsalting.",
      bioRu: "Ведущий эксперт по международным сделкам и иностранным инвестициям.",
      expertise: ["Xalqaro shartnomalar", "Investitsiya bitimlari", "Bilateral shartnomalar", "BIT", "Xalqaro arbitraj"],
      education: [
        { degree: "LLB", institution: "University of Cambridge", year: 2008 },
        { degree: "LLM International Business Law", institution: "London School of Economics", year: 2010 },
      ],
      topRated: true,
    },
    {
      name: "Nigora Usmanova",
      email: "nigora@adolat.uz",
      phone: "+998902222208",
      slug: "nigora-usmanova",
      titleUz: "Ma'muriy huquq va davlat xizmatlari advokati",
      titleRu: "Адвокат по административному праву и госуслугам",
      license: "ADV-2015-0734",
      specialty: "administrative",
      secondarySpecs: ["civil", "tax"],
      region: "bukhara",
      city: "Buxoro",
      experience: 10,
      rating: 4.7,
      reviews: 143,
      cases: 198,
      successRate: 84,
      responseHours: 3,
      consFee: 130000,
      hourFee: 450000,
      languages: ["uz", "ru"],
      bioUz: "Davlat organlari qarorlarini shikoyat qilish, ma'muriy huquqbuzarliklar bo'yicha tajribali advokat. 150+ ish.",
      bioRu: "Опытный адвокат по административному праву и обжалованию решений госорганов.",
      expertise: ["Ma'muriy shikoyatlar", "Davlat xizmatlari", "JARIMALAR", "Litsenziyalash", "Permitlar"],
      education: [
        { degree: "Yuridik fanlar bakalavri", institution: "Buxoro Davlat Universiteti", year: 2013 },
      ],
      topRated: false,
    },
  ];

  for (const a of advocatesData) {
    const user = await db.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        id: nanoid(),
        email: a.email,
        phone: a.phone,
        name: a.name,
        passwordHash,
        role: "ADVOCATE",
        status: "ACTIVE",
      },
    });

    await db.advocateProfile.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        id: nanoid(),
        userId: user.id,
        slug: a.slug,
        titleUz: a.titleUz,
        titleRu: a.titleRu,
        bioUz: a.bioUz,
        bioRu: a.bioRu,
        licenseNumber: a.license,
        licenseVerified: true,
        specialty: a.specialty,
        secondarySpecs: JSON.stringify(a.secondarySpecs),
        expertise: JSON.stringify(a.expertise),
        languages: JSON.stringify(a.languages),
        region: a.region,
        city: a.city,
        experienceYears: a.experience,
        rating: a.rating,
        reviewsCount: a.reviews,
        casesResolved: a.cases,
        successRate: a.successRate,
        responseTimeHours: a.responseHours,
        consultationFee: a.consFee,
        hourlyFee: a.hourFee,
        verified: true,
        topRated: a.topRated,
        availability: "available",
        tagsJson: JSON.stringify(a.topRated ? ["TOP-10"] : []),
        education: JSON.stringify(a.education),
      },
    });
    console.log(`  ✓ Advocate: ${a.name}`);
  }

  return { admin, demoClient };
}

// ============================================================================
// DOCUMENT TEMPLATES — real templates with structured fields + body schemas
// ============================================================================

async function seedDocuments() {
  console.log("→ Seeding documents + templates...");

  // Document 1: Mehnat shartnomasi (Labor contract) — full template
  const laborContract = await db.legalDocument.upsert({
    where: { slug: "mehnat-shartnomasi" },
    update: {},
    create: {
      id: nanoid(),
      slug: "mehnat-shartnomasi",
      titleUz: "Mehnat shartnomasi (kontrakt)",
      titleRu: "Трудовой договор (контракт)",
      category: "contracts",
      subcategory: "Xizmat ko'rsatishga oid",
      descriptionUz:
        "Xodim va ish beruvchi o'rtasidagi standart mehnat shartnomasi namunasi. O'zbekiston Mehnat kodeksiga muvofiq tayyorlangan.",
      descriptionRu:
        "Стандартный образец трудового договора между работником и работодателем.",
      pages: 6,
      downloads: 18432,
      rating: 4.9,
      priceUzs: 0,
      isFree: true,
      isPopular: true,
      legalBasisUz: "O'zR Mehnat kodeksi, 70-moddaga muvofiq",
      lastUpdated: new Date("2026-06-12"),
      tagsJson: JSON.stringify(["mehnat", "shartnoma", "kontrakt"]),
    },
  });

  // The form fields, grouped into sections like yurxizmat.uz
  const laborTemplate = {
    sections: [
      {
        id: "requisites",
        title: "Shartnoma_rekvizitlari",
        description: "Shartnoma tuzilgan sana, raqam va joy",
        fields: [
          { id: "contract_date", label: "Shartnoma tuzilgan sana", type: "date", required: true, hint: "Format: YYYY-MM-DD" },
          { id: "contract_number", label: "Shartnoma raqami", type: "text", required: true, maxLength: 30, placeholder: "Masalan: 12/2026" },
          { id: "contract_place", label: "Tuzilgan joy", type: "text", required: true, maxLength: 100, placeholder: "Toshkent shahri" },
        ],
      },
      {
        id: "employer",
        title: "Ish beruvchi",
        description: "Ish beruvchi korxona ma'lumotlari",
        fields: [
          { id: "employer_name", label: "Korxona nomi", type: "text", required: true, maxLength: 200, placeholder: "MChJ 'Example'" },
          { id: "employer_director", label: "Rahbar F.I.O", type: "text", required: true, maxLength: 100, placeholder: "Familiya Ism Otasining ismi" },
          { id: "employer_stir", label: "STIR", type: "text", required: true, maxLength: 20, placeholder: "9 xonali raqam" },
          { id: "employer_address", label: "Yuridik manzil", type: "text", required: true, maxLength: 300 },
        ],
      },
      {
        id: "employee",
        title: "Xodim",
        description: "Xodimning shaxsiy ma'lumotlari",
        fields: [
          { id: "employee_name", label: "F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "employee_passport", label: "Pasport seria va raqami", type: "text", required: true, maxLength: 20, placeholder: "AA1234567" },
          { id: "employee_pinfl", label: "PINFL", type: "text", required: true, maxLength: 14, placeholder: "14 xonali raqam" },
          { id: "employee_address", label: "Yashash manzili", type: "text", required: true, maxLength: 300 },
        ],
      },
      {
        id: "terms",
        title: "Shartnoma shartlari",
        fields: [
          { id: "position", label: "Lavozimi", type: "text", required: true, maxLength: 100 },
          { id: "salary", label: "Oylik maosh (so'm)", type: "number", required: true, maxLength: 12 },
          { id: "start_date", label: "Ish boshlash sanasi", type: "date", required: true },
          { id: "end_date", label: "Tugash sanasi (muddatli uchun)", type: "date", required: false },
          { id: "trial_period", label: "Sinov muddati (oy)", type: "number", required: false, defaultValue: "3", maxLength: 2 },
        ],
      },
    ],
  };

  // Body — text paragraphs interleaved with field placeholders
  const laborBody = [
    { type: "text", content: "MEHNAT SHARTNOMASI (KONTRAKT)", style: "heading" },
    { type: "spacer" },
    { type: "text", content: "Ushbu mehnat shartnomasi (bundan keyin — «Shartnoma») quyidagi tomonlar tomonidan tuzildi:" },
    { type: "spacer" },
    { type: "text", content: "Ish beruvchi:", style: "subheading" },
    { type: "field", fieldId: "employer_name" },
    { type: "text", content: "nomidan faoliyat yurituvchi rahbar" },
    { type: "field", fieldId: "employer_director" },
    { type: "text", content: "bir tomondan, va" },
    { type: "spacer" },
    { type: "text", content: "Xodim:", style: "subheading" },
    { type: "field", fieldId: "employee_name" },
    { type: "text", content: "pasport:" },
    { type: "field", fieldId: "employee_passport" },
    { type: "text", content: "PINFL:" },
    { type: "field", fieldId: "employee_pinfl" },
    { type: "text", content: "ikkinchi tomondan, ushbu shartnomani quyidagilar haqida tuzdilar." },
    { type: "spacer" },
    { type: "text", content: "1. SHARTNOMA PREDMETI", style: "heading" },
    { type: "text", content: "1.1. Xodim" },
    { type: "field", fieldId: "position" },
    { type: "text", content: "lavozimida ishni bajarishi shart. Ish joyi va shartlari Mehnat kodeksiga muvofiq belgilanadi." },
    { type: "text", content: "1.2. Shartnoma" },
    { type: "field", fieldId: "start_date" },
    { type: "text", content: "sanasidan boshlab kuchga kiradi." },
    { type: "text", content: "1.3. Xodimga oylik maosh miqdori" },
    { type: "field", fieldId: "salary" },
    { type: "text", content: "so'm etib belgilanadi." },
    { type: "spacer" },
    { type: "text", content: "2. TOmonLARNING HUQUQ VA MAJBURIYATLARI", style: "heading" },
    { type: "text", content: "2.1. Ish beruvchi quyidagi majburiyatlarni oladi:" },
    { type: "text", content: "ishni Mehnat kodeksiga muvofiq taqdim etish;", style: "list_item" },
    { type: "text", content: "ish haqini o'z vaqtida to'lash;", style: "list_item" },
    { type: "text", content: "mehnat xavfsizligini ta'minlash;", style: "list_item" },
    { type: "text", content: "ijtimoiy sug'urta badallarini to'lash.", style: "list_item" },
    { type: "text", content: "2.2. Xodim quyidagi majburiyatlarni oladi:" },
    { type: "text", content: "ichki tartib qoidalariga rioya qilish;", style: "list_item" },
    { type: "text", content: "o'z vazifalarini sifatli bajarish;", style: "list_item" },
    { type: "text", content: "ishni o'z vaqtida bajarish.", style: "list_item" },
    { type: "spacer" },
    { type: "text", content: "3. SHARTNOMA MUDDATI", style: "heading" },
    { type: "text", content: "3.1. Ushbu shartnoma" },
    { type: "field", fieldId: "contract_date" },
    { type: "text", content: "sanasida tuzildi va" },
    { type: "field", fieldId: "start_date" },
    { type: "text", content: "sanasidan boshlab amal qiladi." },
    { type: "spacer" },
    { type: "text", content: "4. TOmonLARNING REKVIZITLARI", style: "heading" },
    { type: "text", content: "Ish beruvchi:", style: "subheading" },
    { type: "field", fieldId: "employer_name" },
    { type: "text", content: "STIR:" },
    { type: "field", fieldId: "employer_stir" },
    { type: "text", content: "Manzil:" },
    { type: "field", fieldId: "employer_address" },
    { type: "spacer" },
    { type: "text", content: "Xodim:", style: "subheading" },
    { type: "field", fieldId: "employee_name" },
    { type: "text", content: "Manzil:" },
    { type: "field", fieldId: "employee_address" },
    { type: "spacer" },
    { type: "text", content: "Imzolar:", style: "subheading" },
    { type: "text", content: "Ish beruvchi: ______________________" },
    { type: "text", content: "Xodim: ______________________" },
  ];

  await db.documentTemplate.upsert({
    where: { documentId: laborContract.id },
    update: {},
    create: {
      id: nanoid(),
      documentId: laborContract.id,
      fieldsSchema: JSON.stringify(laborTemplate),
      bodySchema: JSON.stringify(laborBody),
      estimatedFillMinutes: 12,
      version: 1,
    },
  });
  console.log("  ✓ Mehnat shartnomasi (with template)");

  // Document 2: Oldi-sotdi (sale contract)
  const saleContract = await db.legalDocument.upsert({
    where: { slug: "oldi-sotdi-shartnomasi" },
    update: {},
    create: {
      id: nanoid(),
      slug: "oldi-sotdi-shartnomasi",
      titleUz: "Oldi-sotdi shartnomasi",
      titleRu: "Договор купли-продажи",
      category: "contracts",
      subcategory: "Oldi-sotdi",
      descriptionUz:
        "Tovar yoki mulkni sotib olish-sotish bo'yicha universal shartnoma. To'lov tartibi, yetkazib berish muddati, kafolat va javobgarlik shartlari aniq belgilangan.",
      descriptionRu: "Универсальный договор купли-продажи имущества или товаров.",
      pages: 5,
      downloads: 15238,
      rating: 4.8,
      priceUzs: 25000,
      isFree: false,
      isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 367-modda",
      lastUpdated: new Date("2026-05-28"),
      tagsJson: JSON.stringify(["oldi-sotdi", "shartnoma", "mulk"]),
    },
  });

  const saleTemplate = {
    sections: [
      {
        id: "basics",
        title: "Asosiy ma'lumotlar",
        fields: [
          { id: "contract_date", label: "Tuzilgan sana", type: "date", required: true },
          { id: "contract_place", label: "Tuzilgan joy", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "seller",
        title: "Sotuvchi",
        fields: [
          { id: "seller_name", label: "Sotuvchi (F.I.O yoki korxona)", type: "text", required: true, maxLength: 200 },
          { id: "seller_passport", label: "Pasport / STIR", type: "text", required: true, maxLength: 30 },
          { id: "seller_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
        ],
      },
      {
        id: "buyer",
        title: "Sotib oluvchi",
        fields: [
          { id: "buyer_name", label: "Sotib oluvchi (F.I.O yoki korxona)", type: "text", required: true, maxLength: 200 },
          { id: "buyer_passport", label: "Pasport / STIR", type: "text", required: true, maxLength: 30 },
          { id: "buyer_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
        ],
      },
      {
        id: "goods",
        title: "Tovar va to'lov",
        fields: [
          { id: "goods_description", label: "Tovar tavsifi", type: "textarea", required: true, maxLength: 1000 },
          { id: "price", label: "Narx (so'm)", type: "number", required: true, maxLength: 12 },
          { id: "payment_method", label: "To'lov turi", type: "select", required: true, options: ["Naqd", "Bank o'tkazmasi", "Karta orqali", "Bo'lib-bo'lib"] },
          { id: "delivery_date", label: "Yetkazib berish sanasi", type: "date", required: true },
        ],
      },
    ],
  };

  const saleBody = [
    { type: "text", content: "OLDI-SOTDI SHARTNOMASI", style: "heading" },
    { type: "spacer" },
    { type: "field", fieldId: "contract_place" },
    { type: "text", content: "shahri" },
    { type: "field", fieldId: "contract_date" },
    { type: "text", content: "sanasida quyidagi tomonlar ushbu shartnomani tuzdilar." },
    { type: "spacer" },
    { type: "text", content: "Sotuvchi:", style: "subheading" },
    { type: "field", fieldId: "seller_name" },
    { type: "text", content: "Pasport/STIR:" },
    { type: "field", fieldId: "seller_passport" },
    { type: "text", content: "Manzil:" },
    { type: "field", fieldId: "seller_address" },
    { type: "spacer" },
    { type: "text", content: "Sotib oluvchi:", style: "subheading" },
    { type: "field", fieldId: "buyer_name" },
    { type: "text", content: "Pasport/STIR:" },
    { type: "field", fieldId: "buyer_passport" },
    { type: "text", content: "Manzil:" },
    { type: "field", fieldId: "buyer_address" },
    { type: "spacer" },
    { type: "text", content: "1. SHARTNOMA PREDMETI", style: "heading" },
    { type: "text", content: "1.1. Sotuvchi sotib oluvchiga quyidagi tovorni sotadi:" },
    { type: "field", fieldId: "goods_description" },
    { type: "spacer" },
    { type: "text", content: "1.2. Tovar narxi:" },
    { type: "field", fieldId: "price" },
    { type: "text", content: "so'm." },
    { type: "text", content: "1.3. To'lov turi:" },
    { type: "field", fieldId: "payment_method" },
    { type: "text", content: "1.4. Yetkazib berish sanasi:" },
    { type: "field", fieldId: "delivery_date" },
    { type: "spacer" },
    { type: "text", content: "2. TOMONLAR MAJBURIYATLARI", style: "heading" },
    { type: "text", content: "2.1. Sotuvchi tovarni belgilangan muddatda sifatli yetkazib berishi shart.", style: "list_item" },
    { type: "text", content: "2.2. Sotib oluvchi tovarni qabul qilib olish va to'lovni amalga oshirishi shart.", style: "list_item" },
    { type: "spacer" },
    { type: "text", content: "Imzolar:", style: "subheading" },
    { type: "text", content: "Sotuvchi: ______________________" },
    { type: "text", content: "Sotib oluvchi: ______________________" },
  ];

  await db.documentTemplate.upsert({
    where: { documentId: saleContract.id },
    update: {},
    create: {
      id: nanoid(),
      documentId: saleContract.id,
      fieldsSchema: JSON.stringify(saleTemplate),
      bodySchema: JSON.stringify(saleBody),
      estimatedFillMinutes: 10,
      version: 1,
    },
  });
  console.log("  ✓ Oldi-sotdi shartnomasi (with template)");

  // Add 4 more documents (smaller templates) to round out the catalog
  const smallerDocs = [
    {
      slug: "ijara-shartnomasi",
      titleUz: "Ijara shartnomasi",
      titleRu: "Договор аренды",
      category: "contracts",
      subcategory: "Ijara",
      descriptionUz: "Ko'chmas mulk ijaraga berish uchun professional shartnoma namunasi.",
      descriptionRu: "Профессиональный договор аренды недвижимого имущества.",
      pages: 7,
      downloads: 12764,
      rating: 4.7,
      priceUzs: 35000,
      isFree: false,
      isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 542-modda",
      tags: ["ijara", "kvartira", "ko'chmas mulk"],
      sections: [
        { id: "basics", title: "Asosiy", fields: [
          { id: "date", label: "Sana", type: "date", required: true },
          { id: "place", label: "Joy", type: "text", required: true, maxLength: 100 },
        ]},
        { id: "parties", title: "Tomonlar", fields: [
          { id: "landlord", label: "Ijara beruvchi", type: "text", required: true, maxLength: 200 },
          { id: "tenant", label: "Ijara oluvchi", type: "text", required: true, maxLength: 200 },
        ]},
        { id: "terms", title: "Shartlar", fields: [
          { id: "property_address", label: "Mulk manzili", type: "text", required: true, maxLength: 300 },
          { id: "monthly_rent", label: "Oylik ijara (so'm)", type: "number", required: true, maxLength: 12 },
          { id: "duration_months", label: "Muddat (oy)", type: "number", required: true, maxLength: 4 },
        ]},
      ],
      body: [
        { type: "text", content: "IJARA SHARTNOMASI", style: "heading" },
        { type: "spacer" },
        { type: "field", fieldId: "place" }, { type: "text", content: "shahri" },
        { type: "field", fieldId: "date" }, { type: "text", content: "sanasida tuzildi." },
        { type: "spacer" },
        { type: "text", content: "Ijara beruvchi:", style: "subheading" },
        { type: "field", fieldId: "landlord" },
        { type: "text", content: "Ijara oluvchi:", style: "subheading" },
        { type: "field", fieldId: "tenant" },
        { type: "spacer" },
        { type: "text", content: "1. SHARTNOMA PREDMETI", style: "heading" },
        { type: "text", content: "1.1. Ijara beruvchi quyidagi mulkni ijaraga beradi:" },
        { type: "field", fieldId: "property_address" },
        { type: "text", content: "1.2. Oylik ijara to'lovi:" },
        { type: "field", fieldId: "monthly_rent" },
        { type: "text", content: "so'm." },
        { type: "text", content: "1.3. Shartnoma muddati:" },
        { type: "field", fieldId: "duration_months" },
        { type: "text", content: "oy." },
        { type: "spacer" },
        { type: "text", content: "Imzolar:", style: "subheading" },
        { type: "text", content: "Ijara beruvchi: ______________________" },
        { type: "text", content: "Ijara oluvchi: ______________________" },
      ],
    },
    {
      slug: "ariza-raqamli-imzo",
      titleUz: "Elektron raqamli imzo olish uchun ariza",
      titleRu: "Заявление на получение ЭЦП",
      category: "applications",
      subcategory: "Jismoniy shaxslarga oid",
      descriptionUz: "Elektron raqamli imzo olish uchun ariza namunasi.",
      descriptionRu: "Образец заявления на получение ЭЦП.",
      pages: 2,
      downloads: 5432,
      rating: 4.6,
      priceUzs: 0,
      isFree: true,
      isPopular: false,
      isNew: true,
      legalBasisUz: "'Elektron raqamli imzo' to'g'risidagi qonun",
      tags: ["ariza", "elektron imzo", "E-imzo"],
      sections: [
        { id: "applicant", title: "Arizachi", fields: [
          { id: "full_name", label: "F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "passport", label: "Pasport", type: "text", required: true, maxLength: 20 },
          { id: "pinfl", label: "PINFL", type: "text", required: true, maxLength: 14 },
          { id: "phone", label: "Telefon", type: "text", required: true, maxLength: 20 },
        ]},
      ],
      body: [
        { type: "text", content: "ARIZA", style: "heading" },
        { type: "spacer" },
        { type: "text", content: "Men, " },
        { type: "field", fieldId: "full_name" },
        { type: "text", content: ", pasport: " },
        { type: "field", fieldId: "passport" },
        { type: "text", content: ", PINFL: " },
        { type: "field", fieldId: "pinfl" },
        { type: "text", content: ", telefon: " },
        { type: "field", fieldId: "phone" },
        { type: "text", content: ", elektron raqamli imzo olishni so'rayman." },
        { type: "spacer" },
        { type: "text", content: "Sana: ______________" },
        { type: "text", content: "Imzo: ______________" },
      ],
    },
    {
      slug: "davo-arizasi-ajrashish",
      titleUz: "Ajrashish to'g'risida da'vo arizasi",
      titleRu: "Исковое заявление о расторжении брака",
      category: "court",
      subcategory: "Da'vo arizalari",
      descriptionUz: "Sudga nikohni bekor qilish to'g'risida beriladigan da'vo arizasi.",
      descriptionRu: "Исковое заявление о расторжении брака.",
      pages: 4,
      downloads: 11092,
      rating: 4.8,
      priceUzs: 40000,
      isFree: false,
      isPopular: true,
      legalBasisUz: "O'zR Oila kodeksi, 41-modda",
      tags: ["oilaviy", "ajrashish", "da'vo", "sud"],
      sections: [
        { id: "court", title: "Sud", fields: [
          { id: "court_name", label: "Sud nomi", type: "text", required: true, maxLength: 200 },
        ]},
        { id: "plaintiff", title: "Da'vogar", fields: [
          { id: "p_name", label: "F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "p_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
          { id: "p_phone", label: "Telefon", type: "text", required: true, maxLength: 20 },
        ]},
        { id: "defendant", title: "Javobgar", fields: [
          { id: "d_name", label: "F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "d_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
        ]},
        { id: "details", title: "Tafsilotlar", fields: [
          { id: "marriage_date", label: "Nikoh sanasi", type: "date", required: true },
          { id: "marriage_place", label: "Nikoh o'rnatilgan joy", type: "text", required: true, maxLength: 200 },
          { id: "children", label: "Umumiy bolalar (bor/yuq)", type: "select", required: true, options: ["Bor", "Yuq"] },
          { id: "reason", label: "Ajralish sababi", type: "textarea", required: true, maxLength: 500 },
        ]},
      ],
      body: [
        { type: "text", content: "DA'VO ARIZASI", style: "heading" },
        { type: "text", content: "(nikohni bekor qilish to'g'risida)", style: "subheading" },
        { type: "spacer" },
        { type: "field", fieldId: "court_name" },
        { type: "spacer" },
        { type: "text", content: "Da'vogar:", style: "subheading" },
        { type: "field", fieldId: "p_name" },
        { type: "text", content: "Manzil:" },
        { type: "field", fieldId: "p_address" },
        { type: "text", content: "Telefon:" },
        { type: "field", fieldId: "p_phone" },
        { type: "spacer" },
        { type: "text", content: "Javobgar:", style: "subheading" },
        { type: "field", fieldId: "d_name" },
        { type: "text", content: "Manzil:" },
        { type: "field", fieldId: "d_address" },
        { type: "spacer" },
        { type: "text", content: "DA'VO ARIZASI", style: "heading" },
        { type: "text", content: "Men, " },
        { type: "field", fieldId: "p_name" },
        { type: "text", content: ", " },
        { type: "field", fieldId: "marriage_date" },
        { type: "text", content: " sanasida " },
        { type: "field", fieldId: "marriage_place" },
        { type: "text", content: " bilan nikoh o'rnatganman. Javobgar: " },
        { type: "field", fieldId: "d_name" },
        { type: "spacer" },
        { type: "text", content: "Umumiy bolalar: " },
        { type: "field", fieldId: "children" },
        { type: "spacer" },
        { type: "text", content: "Ajralish sababi: " },
        { type: "field", fieldId: "reason" },
        { type: "spacer" },
        { type: "text", content: "So'rov: nikohni bekor qilishni so'rayman." },
        { type: "spacer" },
        { type: "text", content: "Sana: ______________" },
        { type: "text", content: "Imzo: ______________" },
      ],
    },
    {
      slug: "ishdan-boshatish-shikoyat",
      titleUz: "Ishdan bo'shatish ustidan shikoyat",
      titleRu: "Жалоба на увольнение",
      category: "court",
      subcategory: "Mehnat nizolari",
      descriptionUz: "Noto'g'ri ishdan haydalgan xodimning tiklash to'g'risidagi da'vo arizasi.",
      descriptionRu: "Исковое заявление о восстановлении на работе.",
      pages: 4,
      downloads: 8741,
      rating: 4.6,
      priceUzs: 35000,
      isFree: false,
      isPopular: true,
      legalBasisUz: "O'zR Mehnat kodeksi, 211-modda",
      tags: ["mehnat", "tiklash", "da'vo", "sud"],
      sections: [
        { id: "court", title: "Sud", fields: [
          { id: "court_name", label: "Sud nomi", type: "text", required: true, maxLength: 200 },
        ]},
        { id: "plaintiff", title: "Da'vogar", fields: [
          { id: "p_name", label: "F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "p_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
        ]},
        { id: "defendant", title: "Javobgar", fields: [
          { id: "d_company", label: "Korxona nomi", type: "text", required: true, maxLength: 200 },
          { id: "d_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
        ]},
        { id: "case", title: "Izoh", fields: [
          { id: "position", label: "Lavozimi", type: "text", required: true, maxLength: 100 },
          { id: "fired_date", label: "Bo'shatilgan sana", type: "date", required: true },
          { id: "order_number", label: "Buyruq raqami", type: "text", required: true, maxLength: 30 },
          { id: "explanation", label: "Nima noto'g'ri bo'lgan", type: "textarea", required: true, maxLength: 1000 },
        ]},
      ],
      body: [
        { type: "text", content: "DA'VO ARIZASI", style: "heading" },
        { type: "text", content: "(mehnat huquqlarini tiklash to'g'risida)", style: "subheading" },
        { type: "spacer" },
        { type: "field", fieldId: "court_name" },
        { type: "spacer" },
        { type: "text", content: "Da'vogar:", style: "subheading" },
        { type: "field", fieldId: "p_name" },
        { type: "field", fieldId: "p_address" },
        { type: "spacer" },
        { type: "text", content: "Javobgar:", style: "subheading" },
        { type: "field", fieldId: "d_company" },
        { type: "field", fieldId: "d_address" },
        { type: "spacer" },
        { type: "text", content: "DA'VO", style: "heading" },
        { type: "text", content: "Men " },
        { type: "field", fieldId: "p_name" },
        { type: "text", content: ", " },
        { type: "field", fieldId: "d_company" },
        { type: "text", content: " korxonasida " },
        { type: "field", fieldId: "position" },
        { type: "text", content: " lavozimida ishlaganman. " },
        { type: "field", fieldId: "fired_date" },
        { type: "text", content: " sanasida " },
        { type: "field", fieldId: "order_number" },
        { type: "text", content: " -buyruq bilan ishdan bo'shatilganman." },
        { type: "spacer" },
        { type: "text", content: "Bo'shatish noto'g'ri, chunki: " },
        { type: "field", fieldId: "explanation" },
        { type: "spacer" },
        { type: "text", content: "So'rov: ishga qayta tiklash va o'rtancha ish haqini to'lashni so'rayman." },
        { type: "spacer" },
        { type: "text", content: "Sana: ______________" },
        { type: "text", content: "Imzo: ______________" },
      ],
    },
  ];

  for (const d of smallerDocs) {
    const doc = await db.legalDocument.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        id: nanoid(),
        slug: d.slug,
        titleUz: d.titleUz,
        titleRu: d.titleRu,
        category: d.category,
        subcategory: d.subcategory,
        descriptionUz: d.descriptionUz,
        descriptionRu: d.descriptionRu,
        pages: d.pages,
        downloads: d.downloads,
        rating: d.rating,
        priceUzs: d.priceUzs,
        isFree: d.isFree,
        isPopular: d.isPopular ?? false,
        isNew: d.isNew ?? false,
        legalBasisUz: d.legalBasisUz,
        lastUpdated: new Date(),
        tagsJson: JSON.stringify(d.tags),
      },
    });

    await db.documentTemplate.upsert({
      where: { documentId: doc.id },
      update: {},
      create: {
        id: nanoid(),
        documentId: doc.id,
        fieldsSchema: JSON.stringify({ sections: d.sections }),
        bodySchema: JSON.stringify(d.body),
        estimatedFillMinutes: 8,
        version: 1,
      },
    });
    console.log(`  ✓ ${d.titleUz} (with template)`);
  }
}

// ============================================================================
// LEGAL REQUESTS — 4 demo requests
// ============================================================================

async function seedRequests() {
  console.log("→ Seeding legal requests...");

  const client = await db.user.findUnique({ where: { email: "client@demo.uz" } });
  if (!client) throw new Error("Demo client not found");

  const requests = [
    {
      title: "AJ ro'yxatdan o'tkazish va ustav hujjatlarini tayyorlash",
      description: "Yangi qurilayotgan qurilish kompaniyasi uchun Aksiyadorlik jamiyatini ro'yxatdan o'tkazish kerak.",
      category: "corporate",
      region: "tashkent-city",
      city: "Toshkent",
      budgetMin: 3000000,
      budgetMax: 5000000,
      isUrgent: true,
    },
    {
      title: "Ajrashish va bolani onaga qoldirish bo'yicha yordam",
      description: "Er-xotin ajrashmoqchi, 7 yoshli bola bor. Bolani onaga qoldirish va aliment undirish bo'yicha to'liq yuridik yordam kerak.",
      category: "family",
      region: "samarkand",
      city: "Samarqand",
      budgetMin: 1500000,
      budgetMax: 2500000,
      isUrgent: false,
    },
    {
      title: "Mehnat shartnomasini bekor qilish ustidan shikoyat",
      description: "Xodimni ogohlantirishsiz va to'lovlarsiz ishdan haydagan. Tiklash va kompensatsiya undirish uchun da'vo arizasi tuzish kerak.",
      category: "labor",
      region: "tashkent-city",
      city: "Toshkent",
      budgetMin: 800000,
      budgetMax: 1500000,
      isUrgent: false,
    },
    {
      title: "Brend nomi va logotip uchun tovar belgisini ro'yxatga olish",
      description: "Yangi ochilayotgan kafelar tarmog'i uchun brend nomi va logotipni himoya qilish kerak.",
      category: "intellectual",
      region: "tashkent-city",
      city: "Toshkent",
      budgetMin: 2000000,
      budgetMax: 3500000,
      isUrgent: false,
    },
  ];

  for (const r of requests) {
    await db.legalRequest.create({
      data: {
        id: nanoid(),
        userId: client.id,
        title: r.title,
        description: r.description,
        category: r.category,
        region: r.region,
        city: r.city,
        clientType: "individual",
        isUrgent: r.isUrgent,
        status: "OPEN",
        budgetMin: r.budgetMin,
        budgetMax: r.budgetMax,
        viewsCount: Math.floor(Math.random() * 200),
        responsesCount: 0,
        contactName: client.name,
        contactPhone: client.phone,
        contactEmail: client.email,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`  ✓ Request: ${r.title}`);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("🌱 Seeding database...\n");
  await seedUsers();
  await seedDocuments();
  await seedRequests();
  console.log("\n✅ Seed complete.");
  console.log("\nDemo accounts (password: Demo1234):");
  console.log("  • admin@adolat.uz (ADMIN)");
  console.log("  • client@demo.uz (CLIENT)");
  console.log("  • akmal@adolat.uz (ADVOCATE)");
  console.log("  • ... 8 advocate accounts total");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
