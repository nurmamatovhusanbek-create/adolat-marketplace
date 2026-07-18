async function main() {
  console.log("[startup] Adolat Marketplace starting...");
  try {
    const { PrismaClient } = require("@prisma/client");
    const bcrypt = require("bcryptjs");
    const { nanoid } = require("nanoid");
    const db = new PrismaClient();
    const h = await bcrypt.hash("Demo1234", 12);
    const admin = await db.user.upsert({ where: { email: "admin@adolat.uz" }, update: {}, create: { id: nanoid(), email: "admin@adolat.uz", phone: "+998901234567", name: "Admin User", passwordHash: h, role: "ADMIN", status: "ACTIVE" } });
    const client = await db.user.upsert({ where: { email: "client@demo.uz" }, update: {}, create: { id: nanoid(), email: "client@demo.uz", phone: "+998901111111", name: "Demo Mijoz", passwordHash: h, role: "CLIENT", status: "ACTIVE" } });
    const advCount = await db.advocateProfile.count();
    if (advCount === 0) {
      console.log("[startup] Seeding advocates...");
      const advs = [
        { n:"Akmal Rashidov",e:"akmal@adolat.uz",p:"+998902222201",s:"akmal-rashidov",t:"Senior advokat, Oilaviy huquq bo'yicha mutaxassis",l:"ADV-2011-0438",sp:"family",ss:["civil","real-estate"],r:"tashkent-city",ci:"Toshkent",ex:14,ra:4.9,rv:287,ca:412,su:92,rh:1,cf:150000,hf:500000,la:["uz","ru","en"],tr:1,b:"14 yillik tajribaga ega oilaviy huquq advokati.",ep:["Ajralish protsedurasi","Aliment undirish","Mulk bo'linishi"],ed:[{degree:"Bakalavr",institution:"TDYU",year:2010}] },
        { n:"Malika Karimova",e:"malika@adolat.uz",p:"+998902222202",s:"malika-karimova",t:"Korporativ huquq eksperti",l:"ADV-2014-0612",sp:"corporate",ss:["tax","labor"],r:"tashkent-city",ci:"Toshkent",ex:11,ra:4.8,rv:198,ca:312,su:89,rh:2,cf:250000,hf:800000,la:["uz","ru","en"],tr:1,b:"Korporativ huquq bo'yicha yirik ekspert.",ep:["MChJ ro'yxatga olish","Soliq","M&A"],ed:[{degree:"Bakalavr",institution:"TDYU",year:2012}] },
        { n:"Bobur Yo'ldoshev",e:"bobur@adolat.uz",p:"+998902222203",s:"bobur-yuldashev",t:"Jinoyat ishlari advokati",l:"ADV-2007-0156",sp:"criminal",ss:["administrative"],r:"samarkand",ci:"Samarqand",ex:18,ra:4.9,rv:421,ca:587,su:87,rh:1,cf:300000,hf:1200000,la:["uz","ru"],tr:1,b:"18 yillik tajribaga ega jinoyat ishlari advokati.",ep:["Jinoyat ishlari","Reabilitatsiya","Apellyatsiya"],ed:[{degree:"Bakalavr",institution:"SamDU",year:2006}] },
        { n:"Dilnoza Ahmedova",e:"dilnoza@adolat.uz",p:"+998902222204",s:"dilnoza-ahmedova",t:"Ko'chmas mulk advokati",l:"ADV-2016-0891",sp:"real-estate",ss:["civil","corporate"],r:"tashkent-region",ci:"Toshkent viloyati",ex:9,ra:4.7,rv:156,ca:234,su:85,rh:3,cf:200000,hf:650000,la:["uz","ru","en"],tr:0,b:"Ko'chmas mulk mutaxassisi.",ep:["Yer bitimlari","Kadastr","Ipoteka"],ed:[{degree:"Bakalavr",institution:"TDYU",year:2014}] },
        { n:"Sherzod Nazarov",e:"sherzod@adolat.uz",p:"+998902222205",s:"sherzod-nazarov",t:"Mehnat huquqi yuristi",l:"ADV-2018-1024",sp:"labor",ss:["corporate","administrative"],r:"fergana",ci:"Farg'ona",ex:7,ra:4.6,rv:89,ca:134,su:82,rh:4,cf:120000,hf:400000,la:["uz","ru"],tr:0,b:"Mehnat nizolari mutaxassisi.",ep:["Mehnat shartnomalari","Ishdan bo'shatish"],ed:[{degree:"Bakalavr",institution:"Farg'ona DU",year:2016}] },
        { n:"Kamola Saidova",e:"kamola@adolat.uz",p:"+998902222206",s:"kamola-saidova",t:"Intellektual mulk mutaxassisi",l:"ADV-2019-1158",sp:"intellectual",ss:["corporate","international"],r:"tashkent-city",ci:"Toshkent",ex:6,ra:4.8,rv:67,ca:89,su:88,rh:2,cf:280000,hf:750000,la:["uz","ru","en"],tr:0,b:"IT huquqi mutaxassisi.",ep:["Patent","NDA","Tovar belgilari"],ed:[{degree:"Bakalavr",institution:"WIU",year:2017}] },
        { n:"Javlon Ergashev",e:"javlon@adolat.uz",p:"+998902222207",s:"javlon-ergashev",t:"Xalqaro bitimlar advokati",l:"ADV-2009-0287",sp:"international",ss:["corporate","tax"],r:"tashkent-city",ci:"Toshkent",ex:16,ra:4.9,rv:234,ca:298,su:91,rh:1,cf:500000,hf:1500000,la:["uz","ru","en"],tr:1,b:"Xalqaro investitsiyalar eksperti.",ep:["Xalqaro shartnomalar","Arbitraj"],ed:[{degree:"LLB",institution:"Cambridge",year:2008}] },
        { n:"Nigora Usmanova",e:"nigora@adolat.uz",p:"+998902222208",s:"nigora-usmanova",t:"Ma'muriy huquq advokati",l:"ADV-2015-0734",sp:"administrative",ss:["civil","tax"],r:"bukhara",ci:"Buxoro",ex:10,ra:4.7,rv:143,ca:198,su:84,rh:3,cf:130000,hf:450000,la:["uz","ru"],tr:0,b:"Ma'muriy huquq advokati.",ep:["Ma'muriy shikoyatlar","Litsenziyalash"],ed:[{degree:"Bakalavr",institution:"Buxoro DU",year:2013}] },
      ];
      for (const a of advs) {
        try {
          const u = await db.user.upsert({ where: { email: a.e }, update: {}, create: { id: nanoid(), email: a.e, phone: a.p, name: a.n, passwordHash: h, role: "ADVOCATE", status: "ACTIVE" } });
          await db.advocateProfile.upsert({ where: { slug: a.s }, update: {}, create: { id: nanoid(), userId: u.id, slug: a.s, titleUz: a.t, titleRu: a.t, bioUz: a.b, bioRu: a.b, licenseNumber: a.l, licenseVerified: true, specialty: a.sp, secondarySpecs: JSON.stringify(a.ss), expertise: JSON.stringify(a.ep), languages: JSON.stringify(a.la), region: a.r, city: a.ci, experienceYears: a.ex, rating: a.ra, reviewsCount: a.rv, casesResolved: a.ca, successRate: a.su, responseTimeHours: a.rh, consultationFee: a.cf, hourlyFee: a.hf, verified: true, topRated: a.tr, availability: "available", tagsJson: JSON.stringify(a.tr?["TOP-10"]:[]), education: JSON.stringify(a.ed) } });
        } catch(e) { console.log("[startup] adv skip:", a.n); }
      }
      console.log("[startup] Advocates seeded");
    } else { console.log("[startup] "+advCount+" advocates exist"); }
    const docCount = await db.legalDocument.count();
    if (docCount === 0) {
      console.log("[startup] Seeding documents...");
      const docs = [
        { s:"mehnat-shartnomasi",t:"Mehnat shartnomasi (kontrakt)",tr:"Трудовой договор",c:"contracts",sc:"Xizmat ko'rsatishga oid",d:"Xodim va ish beruvchi o'rtasidagi standart mehnat shartnomasi.",p:6,dl:18432,r:4.9,f:1,pop:1,lb:"Mehnat kodeksi 70-modda" },
        { s:"oldi-sotdi-shartnomasi",t:"Oldi-sotdi shartnomasi",tr:"Договор купли-продажи",c:"contracts",sc:"Oldi-sotdi",d:"Tovar yoki mulkni sotib olish-sotish.",p:5,dl:15238,r:4.8,pr:25000,f:0,pop:1,lb:"FK 367-modda" },
        { s:"ijara-shartnomasi",t:"Ijara shartnomasi",tr:"Договор аренды",c:"contracts",sc:"Ijara",d:"Ko'chmas mulk ijaraga berish.",p:7,dl:12764,r:4.7,pr:35000,f:0,pop:1,lb:"FK 542-modda" },
        { s:"davo-arizasi-ajrashish",t:"Ajrashish da'vo arizasi",tr:"Иск о расторжении брака",c:"court",sc:"Da'vo arizalari",d:"Sudga nikohni bekor qilish da'vo arizasi.",p:4,dl:11092,r:4.8,pr:40000,f:0,pop:1,lb:"OK 41-modda" },
        { s:"ishdan-boshatish-shikoyat",t:"Ishdan bo'shatish shikoyat",tr:"Жалоба на увольнение",c:"court",sc:"Mehnat nizolari",d:"Ishdan haydalgan xodimning da'vo arizasi.",p:4,dl:8741,r:4.6,pr:35000,f:0,pop:1,lb:"MK 211-modda" },
        { s:"ariza-raqamli-imzo",t:"E-imzo olish uchun ariza",tr:"Заявление на ЭЦП",c:"applications",sc:"Jismoniy shaxslarga oid",d:"Elektron raqamli imzo olish uchun ariza.",p:2,dl:5432,r:4.6,f:1,nw:1,lb:"E-imzo qonuni" },
        { s:"vakillik-shartnomasi",t:"Vakillik shartnomasi",tr:"Договор поручения",c:"contracts",sc:"Yuridik shaxslarga oid",d:"Vakillik shartnomasi namunasi.",p:4,dl:3421,r:4.7,f:1,pop:1,lb:"FK 841-modda" },
        { s:"avto-ijara-qisqa-muddatli",t:"Avto qisqa muddatli ijara",tr:"Договор аренды авто",c:"contracts",sc:"Avtotransportlarga oid",d:"Avtomobilni qisqa muddatga ijaraga berish.",p:5,dl:5847,r:4.6,pr:30000,f:0,pop:1,lb:"FK 595-modda" },
        { s:"hakamlik-bitimi",t:"Hakamlik bitimi",tr:"Арбитражное соглашение",c:"contracts",sc:"Boshqa",d:"Hakamlik sudida nizo hal qilish.",p:3,dl:2104,r:4.5,f:1,nw:1,lb:"Hakamlik qonuni" },
        { s:"pudrat-shartnomasi",t:"Pudrat shartnomasi",tr:"Договор подряда",c:"contracts",sc:"Xizmat ko'rsatishga oid",d:"Pudrat shartnomasi.",p:6,dl:4521,r:4.7,pr:35000,f:0,pop:1,lb:"FK 651-modda" },
      ];
      for (const d of docs) {
        try {
          const doc = await db.legalDocument.upsert({ where: { slug: d.s }, update: {}, create: { id: nanoid(), slug: d.s, titleUz: d.t, titleRu: d.tr, category: d.c, subcategory: d.sc, descriptionUz: d.d, descriptionRu: d.d, pages: d.p, downloads: d.dl, rating: d.r, priceUzs: d.pr||0, isFree: !!d.f, isPopular: !!d.pop, isNew: !!d.nw, legalBasisUz: d.lb, lastUpdated: new Date(), tagsJson: "[]" } });
          const ex = await db.documentTemplate.findUnique({ where: { documentId: doc.id } });
          if (!ex) { await db.documentTemplate.create({ data: { id: nanoid(), documentId: doc.id, fieldsSchema: JSON.stringify({sections:[{id:"main",title:"Asosiy ma'lumotlar",fields:[{id:"date",label:"Sana",type:"date",required:true},{id:"place",label:"Joy",type:"text",required:true,maxLength:100},{id:"party1",label:"Birinchi tomon",type:"text",required:true,maxLength:200},{id:"party2",label:"Ikkinchi tomon",type:"text",required:true,maxLength:200}]}]}), bodySchema: JSON.stringify([{type:"text",content:d.t.toUpperCase(),style:"heading"},{type:"spacer"},{type:"field",fieldId:"place"},{type:"text",content:"shahrida"},{type:"field",fieldId:"date"},{type:"text",content:"sanada tuzildi."},{type:"spacer"},{type:"text",content:"Tomonlar:"},{type:"field",fieldId:"party1"},{type:"text",content:"va"},{type:"field",fieldId:"party2"},{type:"spacer"},{type:"text",content:"Imzolar: ____________________"}]), estimatedFillMinutes:10, version:1 } }); }
        } catch(e) { console.log("[startup] doc skip:", d.t); }
      }
      console.log("[startup] Documents seeded");
    } else { console.log("[startup] "+docCount+" documents exist"); }
    const reqCount = await db.legalRequest.count();
    if (reqCount === 0) {
      console.log("[startup] Seeding requests...");
      const reqs = [{t:"AJ ro'yxatdan o'tkazish",d:"AJ ro'yxatdan o'tkazish.",c:"corporate",r:"tashkent-city",b1:3000000,b2:5000000,u:1},{t:"Ajrashish",d:"Ajrashish va aliment.",c:"family",r:"samarkand",b1:1500000,b2:2500000,u:0},{t:"Mehnat nizosi",d:"Ishdan bo'shatish.",c:"labor",r:"tashkent-city",b1:800000,b2:1500000,u:0},{t:"Brend ro'yxatga olish",d:"Tovar belgisi.",c:"intellectual",r:"tashkent-city",b1:2000000,b2:3500000,u:0}];
      for (const r of reqs) { try { await db.legalRequest.create({ data: { id: nanoid(), userId: client.id, title: r.t, description: r.d, category: r.c, region: r.r, city: "Toshkent", clientType: "individual", isUrgent: !!r.u, status: "OPEN", budgetMin: r.b1, budgetMax: r.b2, viewsCount: Math.floor(Math.random()*200), responsesCount: 0, contactName: client.name, contactPhone: client.phone, contactEmail: client.email, expiresAt: new Date(Date.now()+30*86400000) } }); } catch(e) {} }
      console.log("[startup] Requests seeded");
    } else { console.log("[startup] "+reqCount+" requests exist"); }
    await db.$disconnect();
    console.log("[startup] Database ready");
  } catch (e) { console.error("[startup] DB error:", e.message?.slice(0, 300)); }
  console.log("[startup] Starting server...");
  const { spawn } = require("child_process");
  const server = spawn("node", ["server.js"], { stdio: "inherit", env: process.env });
  server.on("exit", (code) => process.exit(code));
}
main();
