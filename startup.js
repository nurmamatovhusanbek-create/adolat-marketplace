const { execSync } = require("child_process");
async function main() {
  console.log("[startup] Adolat starting...");
  try { execSync("node node_modules/prisma/build/index.js db push --accept-data-loss", { stdio: "inherit", timeout: 30000 }); console.log("[startup] Tables created"); } catch(e) { console.error("[startup] db push warning:", e.message?.slice(0,200)); }
  try {
    const { PrismaClient } = require("@prisma/client");
    const bcrypt = require("bcryptjs");
    const { nanoid } = require("nanoid");
    const db = new PrismaClient();
    if (await db.user.count() > 0) { console.log("[startup] Already seeded"); await db.$disconnect(); }
    else {
      console.log("[startup] Seeding...");
      const h = await bcrypt.hash("Demo1234", 12);
      await db.user.create({data:{id:nanoid(),email:"admin@adolat.uz",phone:"+998901234567",name:"Admin",passwordHash:h,role:"ADMIN",status:"ACTIVE"}});
      const c = await db.user.create({data:{id:nanoid(),email:"client@demo.uz",phone:"+998901111111",name:"Demo Mijoz",passwordHash:h,role:"CLIENT",status:"ACTIVE"}});
      const advs=[
        {n:"Akmal Rashidov",e:"akmal@adolat.uz",p:"+998902222201",s:"akmal-rashidov",t:"Oilaviy huquq",l:"ADV-2011-0438",sp:"family",ss:["civil"],r:"tashkent-city",ci:"Toshkent",ex:14,ra:4.9,rv:287,ca:412,su:92,rh:1,cf:150000,hf:500000,la:["uz","ru"],tr:1,b:"14 yillik tajriba",ep:["Ajralish","Aliment"],ed:[{d:"Bakalavr",i:"TDYU",y:2010}]},
        {n:"Malika Karimova",e:"malika@adolat.uz",p:"+998902222202",s:"malika-karimova",t:"Korporativ huquq",l:"ADV-2014-0612",sp:"corporate",ss:["tax"],r:"tashkent-city",ci:"Toshkent",ex:11,ra:4.8,rv:198,ca:312,su:89,rh:2,cf:250000,hf:800000,la:["uz","ru"],tr:1,b:"Korporativ ekspert",ep:["MChJ","Soliq"],ed:[{d:"Bakalavr",i:"TDYU",y:2012}]},
        {n:"Bobur Yo'ldoshev",e:"bobur@adolat.uz",p:"+998902222203",s:"bobur-yuldashev",t:"Jinoyat ishlari",l:"ADV-2007-0156",sp:"criminal",ss:["administrative"],r:"samarkand",ci:"Samarqand",ex:18,ra:4.9,rv:421,ca:587,su:87,rh:1,cf:300000,hf:1200000,la:["uz","ru"],tr:1,b:"18 yillik tajriba",ep:["Jinoyat","Apellyatsiya"],ed:[{d:"Bakalavr",i:"SamDU",y:2006}]},
        {n:"Dilnoza Ahmedova",e:"dilnoza@adolat.uz",p:"+998902222204",s:"dilnoza-ahmedova",t:"Ko'chmas mulk",l:"ADV-2016-0891",sp:"real-estate",ss:["civil"],r:"tashkent-region",ci:"Toshkent viloyati",ex:9,ra:4.7,rv:156,ca:234,su:85,rh:3,cf:200000,hf:650000,la:["uz","ru"],tr:0,b:"Ko'chmas mulk mutaxassisi",ep:["Yer bitimlari","Kadastr"],ed:[{d:"Bakalavr",i:"TDYU",y:2014}]},
        {n:"Sherzod Nazarov",e:"sherzod@adolat.uz",p:"+998902222205",s:"sherzod-nazarov",t:"Mehnat huquqi",l:"ADV-2018-1024",sp:"labor",ss:["corporate"],r:"fergana",ci:"Farg'ona",ex:7,ra:4.6,rv:89,ca:134,su:82,rh:4,cf:120000,hf:400000,la:["uz","ru"],tr:0,b:"Mehnat nizolari",ep:["Mehnat shartnomalari"],ed:[{d:"Bakalavr",i:"Farg'ona DU",y:2016}]},
        {n:"Kamola Saidova",e:"kamola@adolat.uz",p:"+998902222206",s:"kamola-saidova",t:"Intellektual mulk",l:"ADV-2019-1158",sp:"intellectual",ss:["corporate"],r:"tashkent-city",ci:"Toshkent",ex:6,ra:4.8,rv:67,ca:89,su:88,rh:2,cf:280000,hf:750000,la:["uz","ru"],tr:0,b:"IT huquqi mutaxassisi",ep:["Patent","NDA"],ed:[{d:"Bakalavr",i:"WIU",y:2017}]},
        {n:"Javlon Ergashev",e:"javlon@adolat.uz",p:"+998902222207",s:"javlon-ergashev",t:"Xalqaro bitimlar",l:"ADV-2009-0287",sp:"international",ss:["corporate"],r:"tashkent-city",ci:"Toshkent",ex:16,ra:4.9,rv:234,ca:298,su:91,rh:1,cf:500000,hf:1500000,la:["uz","ru"],tr:1,b:"Xalqaro investitsiyalar",ep:["Xalqaro shartnomalar","Arbitraj"],ed:[{d:"LLB",i:"Cambridge",y:2008}]},
        {n:"Nigora Usmanova",e:"nigora@adolat.uz",p:"+998902222208",s:"nigora-usmanova",t:"Ma'muriy huquq",l:"ADV-2015-0734",sp:"administrative",ss:["civil"],r:"bukhara",ci:"Buxoro",ex:10,ra:4.7,rv:143,ca:198,su:84,rh:3,cf:130000,hf:450000,la:["uz","ru"],tr:0,b:"Ma'muriy huquq advokati",ep:["Ma'muriy shikoyatlar"],ed:[{d:"Bakalavr",i:"Buxoro DU",y:2013}]},
      ];
      for(const a of advs){const u=await db.user.create({data:{id:nanoid(),email:a.e,phone:a.p,name:a.n,passwordHash:h,role:"ADVOCATE",status:"ACTIVE"}});await db.advocateProfile.create({data:{id:nanoid(),userId:u.id,slug:a.s,titleUz:a.t,bioUz:a.b,licenseNumber:a.l,licenseVerified:true,specialty:a.sp,secondarySpecs:JSON.stringify(a.ss),expertise:JSON.stringify(a.ep),languages:JSON.stringify(a.la),region:a.r,city:a.ci,experienceYears:a.ex,rating:a.ra,reviewsCount:a.rv,casesResolved:a.ca,successRate:a.su,responseTimeHours:a.rh,consultationFee:a.cf,hourlyFee:a.hf,verified:true,topRated:a.tr,availability:"available",tagsJson:JSON.stringify(a.tr?["TOP-10"]:[]),education:JSON.stringify(a.ed)}});}
      console.log("[startup] Advocates done");
      const docs=[
        {s:"mehnat-shartnomasi",t:"Mehnat shartnomasi",c:"contracts",sc:"Xizmat",d:"Mehnat shartnomasi",p:6,dl:18432,r:4.9,f:1,pop:1,lb:"Mehnat kodeksi 70"},
        {s:"oldi-sotdi-shartnomasi",t:"Oldi-sotdi shartnomasi",c:"contracts",sc:"Oldi-sotdi",d:"Oldi-sotdi",p:5,dl:15238,r:4.8,pr:25000,f:0,pop:1,lb:"FK 367"},
        {s:"ijara-shartnomasi",t:"Ijara shartnomasi",c:"contracts",sc:"Ijara",d:"Ijara",p:7,dl:12764,r:4.7,pr:35000,f:0,pop:1,lb:"FK 542"},
        {s:"davo-arizasi-ajrashish",t:"Ajrashish da'vo arizasi",c:"court",sc:"Da'vo",d:"Ajrashish",p:4,dl:11092,r:4.8,pr:40000,f:0,pop:1,lb:"OK 41"},
        {s:"ishdan-boshatish-shikoyat",t:"Ishdan bo'shatish shikoyat",c:"court",sc:"Mehnat",d:"Ishdan bo'shatish",p:4,dl:8741,r:4.6,pr:35000,f:0,pop:1,lb:"MK 211"},
        {s:"ariza-raqamli-imzo",t:"E-imzo ariza",c:"applications",sc:"Ariza",d:"E-imzo",p:2,dl:5432,r:4.6,f:1,nw:1,lb:"E-imzo qonuni"},
        {s:"vakillik-shartnomasi",t:"Vakillik shartnomasi",c:"contracts",sc:"Vakillik",d:"Vakillik",p:4,dl:3421,r:4.7,f:1,pop:1,lb:"FK 841"},
        {s:"avto-ijara-qisqa-muddatli",t:"Avto ijara",c:"contracts",sc:"Avto",d:"Avto ijara",p:5,dl:5847,r:4.6,pr:30000,f:0,pop:1,lb:"FK 595"},
        {s:"hakamlik-bitimi",t:"Hakamlik bitimi",c:"contracts",sc:"Boshqa",d:"Hakamlik",p:3,dl:2104,r:4.5,f:1,nw:1,lb:"Hakamlik qonuni"},
        {s:"pudrat-shartnomasi",t:"Pudrat shartnomasi",c:"contracts",sc:"Pudrat",d:"Pudrat",p:6,dl:4521,r:4.7,pr:35000,f:0,pop:1,lb:"FK 651"},
      ];
      for(const d of docs){const doc=await db.legalDocument.create({data:{id:nanoid(),slug:d.s,titleUz:d.t,category:d.c,subcategory:d.sc,descriptionUz:d.d,pages:d.p,downloads:d.dl,rating:d.r,priceUzs:d.pr||0,isFree:d.f??0,isPopular:d.pop??0,isNew:d.nw??0,legalBasisUz:d.lb,lastUpdated:new Date(),tagsJson:"[]"}});await db.documentTemplate.create({data:{id:nanoid(),documentId:doc.id,fieldsSchema:JSON.stringify({sections:[{id:"main",title:"Asosiy",fields:[{id:"date",label:"Sana",type:"date",required:true},{id:"place",label:"Joy",type:"text",required:true,maxLength:100},{id:"p1",label:"Tomon 1",type:"text",required:true,maxLength:200},{id:"p2",label:"Tomon 2",type:"text",required:true,maxLength:200}]}]}),bodySchema:JSON.stringify([{type:"text",content:d.t.toUpperCase(),style:"heading"},{type:"spacer"},{type:"field",fieldId:"place"},{type:"text",content:"shahrida"},{type:"field",fieldId:"date"},{type:"text",content:"sanada"},{type:"text",content:"Tomonlar:"},{type:"field",fieldId:"p1"},{type:"text",content:"va"},{type:"field",fieldId:"p2"},{type:"text",content:"Imzolar: ____"}]),estimatedFillMinutes:10,version:1}});}
      console.log("[startup] Documents done");
      const reqs=[{t:"AJ ro'yxatdan o'tkazish",d:"AJ ro'yxatdan o'tkazish",c:"corporate",r:"tashkent-city",b1:3000000,b2:5000000,u:1},{t:"Ajrashish",d:"Ajrashish",c:"family",r:"samarkand",b1:1500000,b2:2500000,u:0},{t:"Mehnat nizosi",d:"Ishdan bo'shatish",c:"labor",r:"tashkent-city",b1:800000,b2:1500000,u:0},{t:"Brend ro'yxatga olish",d:"Tovar belgisi",c:"intellectual",r:"tashkent-city",b1:2000000,b2:3500000,u:0}];
      for(const r of reqs){await db.legalRequest.create({data:{id:nanoid(),userId:c.id,title:r.t,description:r.d,category:r.c,region:r.r,city:"Toshkent",clientType:"individual",isUrgent:r.u,status:"OPEN",budgetMin:r.b1,budgetMax:r.b2,viewsCount:Math.floor(Math.random()*200),responsesCount:0,contactName:c.name,contactPhone:c.phone,contactEmail:c.email,expiresAt:new Date(Date.now()+30*86400000)}});}
      console.log("[startup] Requests done");
      console.log("[startup] Seed complete!");
      await db.$disconnect();
    }
  } catch(e) { console.error("[startup] Seed error:", e.message?.slice(0,300)); }
  console.log("[startup] Starting server...");
  const{spawn}=require("child_process");
  const s=spawn("node",["server.js"],{stdio:"inherit",env:process.env});
  s.on("exit",c=>process.exit(c));
}
main();
