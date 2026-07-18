// Seed additional real yurxizmat document templates
// Run with: bun run /home/z/my-project/scripts/seed-real-docs.ts
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const db = new PrismaClient();

async function main() {
  console.log("→ Adding real yurxizmat document templates...\n");

  // === 1. Vakillik shartnomasi (Power of Attorney Contract) ===
  const vakillik = await db.legalDocument.upsert({
    where: { slug: "vakillik-shartnomasi" },
    update: {},
    create: {
      id: nanoid(),
      slug: "vakillik-shartnomasi",
      titleUz: "Vakillik shartnomasi",
      titleRu: "Договор поручения",
      category: "contracts",
      subcategory: "Yuridik shaxslarga oid",
      descriptionUz: "Vakolat beruvchi va vakilli qiluvchi tashkilot o'rtasidagi vakillik shartnomasi. Vakilning vositachilik haqqi va vakolat doirasi aniq belgilangan.",
      descriptionRu: "Договор поручения между доверителем и поверенным.",
      pages: 4,
      downloads: 3421,
      rating: 4.7,
      priceUzs: 0,
      isFree: true,
      isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 841-modda",
      lastUpdated: new Date("2026-06-20"),
      tagsJson: JSON.stringify(["vakillik", "shartnoma", "vosita", "power of attorney"]),
    },
  });

  const vakillikTemplate = {
    sections: [
      {
        id: "requisites",
        title: "Shartnoma rekvizitlari",
        fields: [
          { id: "contract_date", label: "Shartnoma tuzilgan sana", type: "date", required: true },
          { id: "contract_number", label: "Shartnoma raqami", type: "text", required: true, maxLength: 30, placeholder: "Masalan: 05/2026" },
          { id: "contract_place", label: "Tuzilgan joy", type: "text", required: true, maxLength: 100, placeholder: "Toshkent shahri" },
        ],
      },
      {
        id: "principal",
        title: "Vakolat beruvchi",
        fields: [
          { id: "principal_name", label: "Tashkilot nomi va tashkiliy-huquqiy shakli", type: "text", required: true, maxLength: 200, placeholder: "Masalan: MChJ 'Example'" },
          { id: "principal_director", label: "Rahbar F.I.O", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "agent",
        title: "Vakilli qiluvchi",
        fields: [
          { id: "agent_name", label: "Tashkilot nomi va tashkiliy-huquqiy shakli", type: "text", required: true, maxLength: 200 },
          { id: "agent_director", label: "Rahbar F.I.O", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "terms",
        title: "Shartnoma shartlari",
        fields: [
          { id: "deal_types", label: "Vakilga vakillik hududida tuzishga ruxsat berilgan bitimlar turlari", type: "textarea", required: true, maxLength: 500, placeholder: "Masalan: Tovar sotish, xizmat ko'rsatish shartnomalari" },
          { id: "commission", label: "Vakilning vositachilik haqqi miqdori (so'm)", type: "number", required: true, maxLength: 12 },
          { id: "prepayment", label: "Oldindan to'lanadigan summa (so'm)", type: "number", required: false, maxLength: 12 },
          { id: "effective_date", label: "Shartnoma amal qiladigan sana", type: "date", required: true },
        ],
      },
      {
        id: "principal_requisites",
        title: "Vakolat beruvchi rekvizitlari",
        fields: [
          { id: "principal_address", label: "Yuridik manzil", type: "text", required: true, maxLength: 300 },
          { id: "principal_account", label: "Hisob raqami", type: "text", required: true, maxLength: 30 },
          { id: "principal_bank_code", label: "Bank kodi", type: "text", required: true, maxLength: 10 },
          { id: "principal_stir", label: "STIR", type: "text", required: true, maxLength: 12 },
          { id: "principal_phone", label: "Telefon", type: "text", required: true, maxLength: 20 },
        ],
      },
      {
        id: "agent_requisites",
        title: "Vakil rekvizitlari",
        fields: [
          { id: "agent_address", label: "Yuridik manzil", type: "text", required: true, maxLength: 300 },
          { id: "agent_account", label: "Hisob raqami", type: "text", required: true, maxLength: 30 },
          { id: "agent_bank_code", label: "Bank kodi", type: "text", required: true, maxLength: 10 },
          { id: "agent_stir", label: "STIR", type: "text", required: true, maxLength: 12 },
          { id: "agent_phone", label: "Telefon", type: "text", required: true, maxLength: 20 },
        ],
      },
    ],
  };

  const vakillikBody = [
    { type: "text", content: "VAKILLIK SHARTNOMASI", style: "heading" },
    { type: "spacer" },
    { type: "field", fieldId: "contract_place" },
    { type: "text", content: "shahrida" },
    { type: "field", fieldId: "contract_date" },
    { type: "text", content: "sanada bizlar, quyida imzo chekuvchilar:" },
    { type: "spacer" },
    { type: "text", content: "Vakolat beruvchi:", style: "subheading" },
    { type: "field", fieldId: "principal_name" },
    { type: "text", content: "nomidan ish yurituvchi rahbar" },
    { type: "field", fieldId: "principal_director" },
    { type: "text", content: "bir tomondan, va" },
    { type: "spacer" },
    { type: "text", content: "Vakilli qiluvchi:", style: "subheading" },
    { type: "field", fieldId: "agent_name" },
    { type: "text", content: "nomidan ish yurituvchi rahbar" },
    { type: "field", fieldId: "agent_director" },
    { type: "text", content: "ikkinchi tomondan, ushbu vakillik shartnomasini quyidagilar haqida tuzdik:" },
    { type: "spacer" },
    { type: "text", content: "1. SHARTNOMA PREDMETI", style: "heading" },
    { type: "text", content: "1.1. Vakil quyidagi bitimlarni tuzishga vakolat berilgan:" },
    { type: "field", fieldId: "deal_types" },
    { type: "spacer" },
    { type: "text", content: "1.2. Vakilning vositachilik haqqi miqdori:" },
    { type: "field", fieldId: "commission" },
    { type: "text", content: "so'm." },
    { type: "text", content: "1.3. Oldindan to'lanadigan summa:" },
    { type: "field", fieldId: "prepayment" },
    { type: "text", content: "so'm." },
    { type: "text", content: "1.4. Shartnoma amal qilish sanasi:" },
    { type: "field", fieldId: "effective_date" },
    { type: "spacer" },
    { type: "text", content: "2. TOMONLARNING REKVIZITLARI", style: "heading" },
    { type: "text", content: "Vakolat beruvchi:", style: "subheading" },
    { type: "field", fieldId: "principal_name" },
    { type: "text", content: "Manzil:" }, { type: "field", fieldId: "principal_address" },
    { type: "text", content: "Hisob raqami:" }, { type: "field", fieldId: "principal_account" },
    { type: "text", content: "Bank kodi:" }, { type: "field", fieldId: "principal_bank_code" },
    { type: "text", content: "STIR:" }, { type: "field", fieldId: "principal_stir" },
    { type: "text", content: "Telefon:" }, { type: "field", fieldId: "principal_phone" },
    { type: "spacer" },
    { type: "text", content: "Vakil:", style: "subheading" },
    { type: "field", fieldId: "agent_name" },
    { type: "text", content: "Manzil:" }, { type: "field", fieldId: "agent_address" },
    { type: "text", content: "Hisob raqami:" }, { type: "field", fieldId: "agent_account" },
    { type: "text", content: "Bank kodi:" }, { type: "field", fieldId: "agent_bank_code" },
    { type: "text", content: "STIR:" }, { type: "field", fieldId: "agent_stir" },
    { type: "text", content: "Telefon:" }, { type: "field", fieldId: "agent_phone" },
    { type: "spacer" },
    { type: "text", content: "Imzolar:", style: "subheading" },
    { type: "text", content: "Vakolat beruvchi: ______________________" },
    { type: "text", content: "Vakil: ______________________" },
  ];

  await db.documentTemplate.upsert({
    where: { documentId: vakillik.id },
    update: {},
    create: {
      id: nanoid(),
      documentId: vakillik.id,
      fieldsSchema: JSON.stringify(vakillikTemplate),
      bodySchema: JSON.stringify(vakillikBody),
      estimatedFillMinutes: 15,
      version: 1,
    },
  });
  console.log("  ✓ Vakillik shartnomasi (18 fields)");

  // === 2. Avtotransport ijarasi (Short-term car rental) ===
  const carRental = await db.legalDocument.upsert({
    where: { slug: "avto-ijara-qisqa-muddatli" },
    update: {},
    create: {
      id: nanoid(),
      slug: "avto-ijara-qisqa-muddatli",
      titleUz: "Avtotransport vositasini qisqa muddatli ijaraga berish shartnomasi",
      titleRu: "Договор краткосрочной аренды автотранспортного средства",
      category: "contracts",
      subcategory: "Avtotransportlarga oid",
      descriptionUz: "Avtomobilni qisqa muddatga ijaraga berish shartnomasi. Ijara narxi, muddati va transport vositasining bozor qiymati aniq belgilangan.",
      descriptionRu: "Договор краткосрочной аренды автомобиля.",
      pages: 5,
      downloads: 5847,
      rating: 4.6,
      priceUzs: 30000,
      isFree: false,
      isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 542, 595-moddalar",
      lastUpdated: new Date("2026-05-15"),
      tagsJson: JSON.stringify(["avto", "ijara", "qisqa muddat", "transport"]),
    },
  });

  const carRentalTemplate = {
    sections: [
      {
        id: "requisites",
        title: "Shartnoma rekvizitlari",
        fields: [
          { id: "contract_date", label: "Tuzilgan sana", type: "date", required: true },
          { id: "contract_number", label: "Shartnoma raqami", type: "text", required: true, maxLength: 30 },
          { id: "contract_place", label: "Tuzilgan joy (ro'yxat)", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "lessor",
        title: "Ijaraga beruvchi",
        fields: [
          { id: "lessor_name", label: "Tashkilot nomi va tashkiliy-huquqiy shakli", type: "text", required: true, maxLength: 200 },
          { id: "lessor_auth_doc", label: "Shartnoma tuzish huquqini beruvchi hujjat", type: "text", required: true, maxLength: 100, hint: "Masalan: Ustav, Nizom yoki ishonchnoma" },
          { id: "lessor_director", label: "Rahbar lavozimi va F.I.O", type: "text", required: true, maxLength: 150 },
          { id: "lessor_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
          { id: "lessor_stir", label: "STIR", type: "text", required: true, maxLength: 12 },
          { id: "lessor_phone", label: "Aloqa raqami", type: "text", required: true, maxLength: 20 },
        ],
      },
      {
        id: "lessee",
        title: "Ijarachi",
        fields: [
          { id: "lessee_name", label: "F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "lessee_address", label: "Yashash manzili", type: "text", required: true, maxLength: 300 },
          { id: "lessee_birth_year", label: "Tug'ilgan yili", type: "number", required: true, maxLength: 4 },
          { id: "lessee_passport", label: "Pasport seria raqami", type: "text", required: true, maxLength: 20, placeholder: "AA1234567" },
          { id: "lessee_passport_date", label: "Pasport berilgan sana", type: "date", required: true },
          { id: "lessee_passport_place", label: "Pasport berilgan hudud", type: "text", required: true, maxLength: 100 },
          { id: "lessee_phone", label: "Aloqa raqami", type: "text", required: true, maxLength: 20 },
        ],
      },
      {
        id: "terms",
        title: "Shartnoma shartlari",
        fields: [
          { id: "vehicle_desc", label: "Avtotransport vositasining nomi, turi, modeli", type: "text", required: true, maxLength: 200, placeholder: "Masalan: Chevrolet Cobalt, 2023, davlat raqami 01A123BC" },
          { id: "rental_start", label: "Foydalanish huquqi boshlanadigan sana", type: "date", required: true },
          { id: "rental_end", label: "Foydalanish huquqi tugaydigan sana", type: "date", required: true },
          { id: "market_value", label: "Bozor qiymatidagi narxi (so'm)", type: "number", required: true, maxLength: 12 },
          { id: "rental_price", label: "Ijara narxi (so'm)", type: "number", required: true, maxLength: 12 },
          { id: "payment_date", label: "To'lanadigan sana", type: "date", required: true },
        ],
      },
    ],
  };

  const carRentalBody = [
    { type: "text", content: "AVTOTRANSPORT VOSITASINI QISQA MUDDATLI IJARAGA BERISH SHARTNOMASI", style: "heading" },
    { type: "spacer" },
    { type: "field", fieldId: "contract_place" },
    { type: "text", content: "shahrida" },
    { type: "field", fieldId: "contract_date" },
    { type: "text", content: "sanada tuzildi." },
    { type: "spacer" },
    { type: "text", content: "Ijaraga beruvchi:", style: "subheading" },
    { type: "field", fieldId: "lessor_name" },
    { type: "text", content: "nomidan" }, { type: "field", fieldId: "lessor_director" },
    { type: "text", content: "bir tomondan, va" },
    { type: "spacer" },
    { type: "text", content: "Ijarachi:", style: "subheading" },
    { type: "field", fieldId: "lessee_name" },
    { type: "text", content: "ikkinchi tomondan, ushbu shartnomani tuzdilar." },
    { type: "spacer" },
    { type: "text", content: "1. SHARTNOMA PREDMETI", style: "heading" },
    { type: "text", content: "1.1. Ijaraga beruvchi ijarachiga quyidagi avtotransport vositasini ijaraga beradi:" },
    { type: "field", fieldId: "vehicle_desc" },
    { type: "text", content: "1.2. Foydalanish muddati:" },
    { type: "field", fieldId: "rental_start" },
    { type: "text", content: "dan" },
    { type: "field", fieldId: "rental_end" },
    { type: "text", content: "gacha." },
    { type: "text", content: "1.3. Bozor qiymati:" }, { type: "field", fieldId: "market_value" }, { type: "text", content: "so'm." },
    { type: "text", content: "1.4. Ijara narxi:" }, { type: "field", fieldId: "rental_price" }, { type: "text", content: "so'm." },
    { type: "text", content: "1.5. To'lov sanasi:" }, { type: "field", fieldId: "payment_date" },
    { type: "spacer" },
    { type: "text", content: "Imzolar:", style: "subheading" },
    { type: "text", content: "Ijaraga beruvchi: ______________________" },
    { type: "text", content: "Ijarachi: ______________________" },
  ];

  await db.documentTemplate.upsert({
    where: { documentId: carRental.id },
    update: {},
    create: {
      id: nanoid(),
      documentId: carRental.id,
      fieldsSchema: JSON.stringify(carRentalTemplate),
      bodySchema: JSON.stringify(carRentalBody),
      estimatedFillMinutes: 12,
      version: 1,
    },
  });
  console.log("  ✓ Avtotransport ijara shartnomasi (19 fields)");

  // === 3. Hakamlik bitimi (Arbitration Agreement) ===
  const arbitration = await db.legalDocument.upsert({
    where: { slug: "hakamlik-bitimi" },
    update: {},
    create: {
      id: nanoid(),
      slug: "hakamlik-bitimi",
      titleUz: "Hakamlik bitimi",
      titleRu: "Арбитражное соглашение",
      category: "contracts",
      subcategory: "Boshqa turdagi shartnomalar",
      descriptionUz: "Nizolarni hakamlik sudida ko'rib chiqish to'g'risidagi bitim. Tomonlar o'zaro nizolarni sud emas, hakamlik orqali hal qilishga kelishadilar.",
      descriptionRu: "Арбитражное соглашение о разрешении споров.",
      pages: 3,
      downloads: 2104,
      rating: 4.5,
      priceUzs: 0,
      isFree: true,
      isNew: true,
      legalBasisUz: "O'zR 'Hakamlik sudi to'g'risida'gi qonuni",
      lastUpdated: new Date("2026-07-01"),
      tagsJson: JSON.stringify(["hakamlik", "arbitraj", "nizo", "bitim"]),
    },
  });

  const arbTemplate = {
    sections: [
      {
        id: "requisites",
        title: "Bitim rekvizitlari",
        fields: [
          { id: "agreement_date", label: "Bitim tuzilgan sana", type: "date", required: true },
          { id: "agreement_number", label: "Bitim raqami", type: "text", required: true, maxLength: 30 },
          { id: "agreement_place", label: "Tuzilgan joy", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "party1",
        title: "Birinchi tomon",
        fields: [
          { id: "party1_org", label: "Tashkilot nomi (birinchi tomon)", type: "text", required: true, maxLength: 200 },
          { id: "party1_rep", label: "Tashkilot nomidan ishda qatnashuvchi shaxs F.I.O", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "party2",
        title: "Ikkinchi tomon",
        fields: [
          { id: "party2_org", label: "Tashkilot nomi (ikkinchi tomon)", type: "text", required: true, maxLength: 200 },
          { id: "party2_rep", label: "Tashkilot nomidan ishda qatnashuvchi shaxs F.I.O", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "terms",
        title: "Bitim shartlari",
        fields: [
          { id: "venue", label: "Hakamlik muhokamasi o'tkaziladigan joy", type: "text", required: true, maxLength: 200, hint: "Tomonlar tomonidan kelishuvga binoan belgilanadi" },
          { id: "party1_email", label: "Birinchi tomon pochta manzili (elektron pochta)", type: "text", required: true, maxLength: 100 },
          { id: "party2_email", label: "Ikkinchi tomon pochta manzili (elektron pochta)", type: "text", required: true, maxLength: 100 },
          { id: "language", label: "Hakamlik muhokamasi tili", type: "select", required: true, options: ["O'zbek tilida", "Rus tilida", "Ingliz tilida"] },
        ],
      },
    ],
  };

  const arbBody = [
    { type: "text", content: "HAKAMLIK BITIMI", style: "heading" },
    { type: "spacer" },
    { type: "field", fieldId: "agreement_place" },
    { type: "text", content: "shahrida" },
    { type: "field", fieldId: "agreement_date" },
    { type: "text", content: "sanada tuzildi." },
    { type: "spacer" },
    { type: "text", content: "Birinchi tomon:", style: "subheading" },
    { type: "field", fieldId: "party1_org" },
    { type: "text", content: "nomidan" }, { type: "field", fieldId: "party1_rep" },
    { type: "spacer" },
    { type: "text", content: "Ikkinchi tomon:", style: "subheading" },
    { type: "field", fieldId: "party2_org" },
    { type: "text", content: "nomidan" }, { type: "field", fieldId: "party2_rep" },
    { type: "spacer" },
    { type: "text", content: "ushbu hakamlik bitimini quyidagilar haqida tuzdilar:" },
    { type: "spacer" },
    { type: "text", content: "1. HAKAMLIK MUHOKAMASI O'TKAZILADIGAN JOY", style: "heading" },
    { type: "field", fieldId: "venue" },
    { type: "spacer" },
    { type: "text", content: "2. POCHTA MANZILLARI", style: "heading" },
    { type: "text", content: "Birinchi tomon:" }, { type: "field", fieldId: "party1_email" },
    { type: "text", content: "Ikkinchi tomon:" }, { type: "field", fieldId: "party2_email" },
    { type: "spacer" },
    { type: "text", content: "3. HAKAMLIK TILI", style: "heading" },
    { type: "text", content: "Hakamlik muhokamasi amalga oshiriladigan til:" },
    { type: "field", fieldId: "language" },
    { type: "spacer" },
    { type: "text", content: "Imzolar:", style: "subheading" },
    { type: "text", content: "Birinchi tomon: ______________________" },
    { type: "text", content: "Ikkinchi tomon: ______________________" },
  ];

  await db.documentTemplate.upsert({
    where: { documentId: arbitration.id },
    update: {},
    create: {
      id: nanoid(),
      documentId: arbitration.id,
      fieldsSchema: JSON.stringify(arbTemplate),
      bodySchema: JSON.stringify(arbBody),
      estimatedFillMinutes: 8,
      version: 1,
    },
  });
  console.log("  ✓ Hakamlik bitimi (11 fields)");

  // === 4. Pudrat shartnomasi (Construction/Work Contract) ===
  const pudrat = await db.legalDocument.upsert({
    where: { slug: "pudrat-shartnomasi" },
    update: {},
    create: {
      id: nanoid(),
      slug: "pudrat-shartnomasi",
      titleUz: "Ishlarni bajarish bo'yicha pudrat shartnomasi",
      titleRu: "Договор подряда на выполнение работ",
      category: "contracts",
      subcategory: "Xizmat ko'rsatishga oid",
      descriptionUz: "Pudrat va buyurtmachi o'rtasidagi ishlarni bajarish shartnomasi. Ishlar nomi, narxi va bajarish muddati aniq belgilangan.",
      descriptionRu: "Договор подряда на выполнение работ.",
      pages: 6,
      downloads: 4521,
      rating: 4.7,
      priceUzs: 35000,
      isFree: false,
      isPopular: true,
      legalBasisUz: "O'zR Fuqarolik kodeksi, 651-modda",
      lastUpdated: new Date("2026-06-08"),
      tagsJson: JSON.stringify(["pudrat", "shartnoma", "ish", "qurilish"]),
    },
  });

  const pudratTemplate = {
    sections: [
      {
        id: "requisites",
        title: "Shartnoma rekvizitlari",
        fields: [
          { id: "contract_date", label: "Tuzilgan sana", type: "date", required: true },
          { id: "contract_number", label: "Shartnoma raqami", type: "text", required: true, maxLength: 30 },
          { id: "contract_place", label: "Tuzilgan joy (ro'yxat)", type: "text", required: true, maxLength: 100 },
        ],
      },
      {
        id: "contractor",
        title: "Pudratchi",
        fields: [
          { id: "contractor_name", label: "Tashkilot to'liq nomi va tashkiliy-huquqiy shakli", type: "text", required: true, maxLength: 200 },
          { id: "contractor_position", label: "Rahbar lavozimi", type: "text", required: true, maxLength: 50, hint: "Masalan: direktori, raisi, boshqaruvchisi" },
          { id: "contractor_director", label: "Rahbar F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "contractor_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
          { id: "contractor_stir", label: "STIR", type: "text", required: true, maxLength: 12 },
          { id: "contractor_phone", label: "Telefon", type: "text", required: true, maxLength: 20 },
        ],
      },
      {
        id: "customer",
        title: "Buyurtmachi",
        fields: [
          { id: "customer_name", label: "Tashkilot to'liq nomi va tashkiliy-huquqiy shakli", type: "text", required: true, maxLength: 200 },
          { id: "customer_position", label: "Rahbar lavozimi", type: "text", required: true, maxLength: 50, hint: "Masalan: direktori, raisi, boshqaruvchisi" },
          { id: "customer_director", label: "Rahbar F.I.O", type: "text", required: true, maxLength: 100 },
          { id: "customer_address", label: "Manzil", type: "text", required: true, maxLength: 300 },
          { id: "customer_stir", label: "STIR", type: "text", required: true, maxLength: 12 },
          { id: "customer_phone", label: "Telefon", type: "text", required: true, maxLength: 20 },
        ],
      },
      {
        id: "terms",
        title: "Shartnoma shartlari",
        fields: [
          { id: "work_name", label: "Bajariladigan ishlar nomi", type: "textarea", required: true, maxLength: 500, placeholder: "Masalan: Ofis ta'mirlash ishlari" },
          { id: "work_price", label: "Ishlar narxi (so'm)", type: "number", required: true, maxLength: 12 },
          { id: "work_deadline", label: "Bajarish muddati", type: "date", required: true },
        ],
      },
    ],
  };

  const pudratBody = [
    { type: "text", content: "ISHLARNI BAJARISH BO'YICHA PUDRAT SHARTNOMASI", style: "heading" },
    { type: "spacer" },
    { type: "field", fieldId: "contract_place" },
    { type: "text", content: "shahrida" },
    { type: "field", fieldId: "contract_date" },
    { type: "text", content: "sanada tuzildi." },
    { type: "spacer" },
    { type: "text", content: "Pudratchi:", style: "subheading" },
    { type: "field", fieldId: "contractor_name" },
    { type: "text", content: "nomidan" }, { type: "field", fieldId: "contractor_director" },
    { type: "text", content: "bir tomondan, va" },
    { type: "spacer" },
    { type: "text", content: "Buyurtmachi:", style: "subheading" },
    { type: "field", fieldId: "customer_name" },
    { type: "text", content: "nomidan" }, { type: "field", fieldId: "customer_director" },
    { type: "text", content: "ikkinchi tomondan, ushbu shartnomani tuzdilar." },
    { type: "spacer" },
    { type: "text", content: "1. SHARTNOMA PREDMETI", style: "heading" },
    { type: "text", content: "1.1. Pudratchi quyidagi ishlarni bajaradi:" },
    { type: "field", fieldId: "work_name" },
    { type: "text", content: "1.2. Ishlar narxi:" }, { type: "field", fieldId: "work_price" }, { type: "text", content: "so'm." },
    { type: "text", content: "1.3. Bajarish muddati:" }, { type: "field", fieldId: "work_deadline" },
    { type: "spacer" },
    { type: "text", content: "Imzolar:", style: "subheading" },
    { type: "text", content: "Pudratchi: ______________________" },
    { type: "text", content: "Buyurtmachi: ______________________" },
  ];

  await db.documentTemplate.upsert({
    where: { documentId: pudrat.id },
    update: {},
    create: {
      id: nanoid(),
      documentId: pudrat.id,
      fieldsSchema: JSON.stringify(pudratTemplate),
      bodySchema: JSON.stringify(pudratBody),
      estimatedFillMinutes: 14,
      version: 1,
    },
  });
  console.log("  ✓ Pudrat shartnomasi (18 fields)");

  console.log("\n✅ Real document templates added successfully!");
  console.log("  Total documents now: " + await db.legalDocument.count());
  console.log("  Total templates now: " + await db.documentTemplate.count());
}

main()
  .catch((err) => { console.error("Seed failed:", err); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
