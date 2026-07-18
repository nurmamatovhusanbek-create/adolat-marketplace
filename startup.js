async function main() {
  console.log("[startup] Adolat starting...");
  const { PrismaClient } = require("@prisma/client");
  const bcrypt = require("bcryptjs");
  const { nanoid } = require("nanoid");
  const db = new PrismaClient();
  try {
    const h = await bcrypt.hash("Demo1234", 12);
    const admin = await db.user.upsert({where:{email:"admin@adolat.uz"},update:{},create:{id:nanoid(),email:"admin@adolat.uz",phone:"+998901234567",name:"Admin User",passwordHash:h,role:"ADMIN",status:"ACTIVE"}});
    const client = await db.user.upsert({where:{email:"client@demo.uz"},update:{},create:{id:nanoid(),email:"client@demo.uz",phone:"+998901111111",name:"Demo Mijoz",passwordHash:h,role:"CLIENT",status:"ACTIVE"}});
    console.log("[startup] Users OK");
    let advCount = await db.advocateProfile.count();
    console.log("[startup] Advocate count:", advCount);
    if (advCount === 0) {
      const advs = [
        {n:"Akmal Rashidov",e:"akmal@adolat.uz",p:"+998902222201",s:"akmal-rashidov",t:"Senior advokat, Oilaviy huquq",l:"ADV-2011-0438",sp:"family",ss:["civil","real-estate"],r:"tashkent-city",ci:"Toshkent",ex:14,ra:4.9,rv:287,ca:412,su:92,rh:1,cf:150000,hf:500000,la:["uz","ru","en"],tr:1,b:"14 yillik tajriba",ep:["Ajralish","Aliment","Mulk bo'linishi"],ed:[{degree:"Bakalavr",institution:"TDYU",year:2010}]},
        {n:"Malika Karimova",e:"malika@adolat.uz",p:"+998902222202",s:"malika-karimova",t:"Korporativ huquq eksperti",l:"ADV-2014-0612",sp:"corporate",ss:["tax","labor"],r:"tashkent-city",ci:"Toshkent",ex:11,ra:4.8,rv:198,ca:312,su:89,rh:2,cf:250000,hf:800000,la:["uz","ru","en"],tr:1,b:"Korporativ ekspert",ep:["MChJ","Soliq","M&A"],ed:[{degree:"Bakalavr",institution:"TDYU",year:2012}]},
        {n:"Bobur Yo'ldoshev",e:"bobur@adolat.uz",p:"+998902222203",s:"bobur-yuldashev",t:"Jinoyat ishlari advokati",l:"ADV-2007-0156",sp:"criminal",ss:["administrative"],r:"samarkand",ci:"Samarqand",ex:18,ra:4.9,rv:421,ca:587,su:87,rh:1,cf:300000,hf:1200000,la:["uz","ru"],tr:1,b:"18 yillik tajriba",ep:["Jinoyat","Apellyatsiya"],ed:[{degree:"Bakalavr",institution:"SamDU",year:2006}]},
        {n:"Dilnoza Ahmedova",e:"dilnoza@adolat.uz",p:"+998902222204",s:"dilnoza-ahmedova",t:"Ko'chmas mulk advokati",l:"ADV-2016-0891",sp:"real-estate",ss:["civil"],r:"tashkent-region",ci:"Toshkent viloyati",ex:9,ra:4.7,rv:156,ca:234,su:85,rh:3,cf:200000,hf:650000,la:["uz","ru","en"],tr:0,b:"Ko'chmas mulk mutaxassisi",ep:["Yer bitimlari","Kadastr"],ed:[{degree:"Bakalavr",institution:"TDYU",year:2014}]},
        {n:"Sherzod Nazarov",e:"sherzod@adolat.uz",p:"+998902222205",s:"sherzod-nazarov",t:"Mehnat huquqi yuristi",l:"ADV-2018-1024",sp:"labor",ss:["corporate"],r:"fergana",ci:"Farg'ona",ex:7,ra:4.6,rv:89,ca:134,su:82,rh:4,cf:120000,hf:400000,la:["uz","ru"],tr:0,b:"Mehnat nizolari",ep:["Mehnat shartnomalari"],ed:[{degree:"Bakalavr",institution:"Farg'ona DU",year:2016}]},
        {n:"Kamola Saidova",e:"kamola@adolat.uz",p:"+998902222206",s:"kamola-saidova",t:"Intellektual mulk mutaxassisi",l:"ADV-2019-1158",sp:"intellectual",ss:["corporate"],r:"tashkent-city",ci:"Toshkent",ex:6,ra:4.8,rv:67,ca:89,su:88,rh:2,cf:280000,hf:750000,la:["uz","ru","en"],tr:0,b:"IT huquqi",ep:["Patent","NDA"],ed:[{degree:"Bakalavr",institution:"WIU",year:2017}]},
        {n:"Javlon Ergashev",e:"javlon@adolat.uz",p:"+998902222207",s:"javlon-ergashev",t:"Xalqaro bitimlar advokati",l:"ADV-2009-0287",sp:"international",ss:["corporate"],r:"tashkent-city",ci:"Toshkent",ex:16,ra:4.9,rv:234,ca:298,su:91,rh:1,cf:500000,hf:1500000,la:["uz","ru","en"],tr:1,b:"Xalqaro investitsiyalar",ep:["Xalqaro shartnomalar","Arbitraj"],ed:[{degree:"LLB",institution:"Cambridge",year:2008}]},
        {n:"Nigora Usmanova",e:"nigora@adolat.uz",p:"+998902222208",s:"nigora-usmanova",t:"Ma'muriy huquq advokati",l:"ADV-2015-0734",sp:"administrative",ss:["civil"],r:"bukhara",ci:"Buxoro",ex:10,ra:4.7,rv:143,ca:198,su:84,rh:3,cf:130000,hf:450000,la:["uz","ru"],tr:0,b:"Ma'muriy huquq",ep:["Ma'muriy shikoyatlar"],ed:[{degree:"Bakalavr",institution:"Buxoro DU",year:2013}]},
      ];
      for (const a of advs) {
        try {
          const u = await db.user.upsert({where:{email:a.e},update:{},create:{id:nanoid(),email:a.e,phone:a.p,name:a.n,passwordHash:h,role:"ADVOCATE",status:"ACTIVE"}});
          await db.advocateProfile.upsert({where:{slug:a.s},update:{},create:{id:nanoid(),userId:u.id,slug:a.s,titleUz:a.t,titleRu:a.t,bioUz:a.b,bioRu:a.b,licenseNumber:a.l,licenseVerified:true,specialty:a.sp,secondarySpecs:JSON.stringify(a.ss),expertise:JSON.stringify(a.ep),languages:JSON.stringify(a.la),region:a.r,city:a.ci,experienceYears:a.ex,rating:a.ra,reviewsCount:a.rv,casesResolved:a.ca,successRate:a.su,responseTimeHours:a.rh,consultationFee:a.cf,hourlyFee:a.hf,verified:true,topRated:!!a.tr,availability:"available",tagsJson:JSON.stringify(a.tr?["TOP-10"]:[]),education:JSON.stringify(a.ed)}});
        } catch(e) {console.log("[startup] adv skip:",a.n);}
      }
      console.log("[startup] Advocates seeded:", await db.advocateProfile.count());
    }
    let reqCount = await db.legalRequest.count();
    if (reqCount === 0) {
      const reqs = [{t:"AJ ro'yxatdan o'tkazish",d:"AJ ro'yxatdan o'tkazish kerak.",c:"corporate",r:"tashkent-city",b1:3000000,b2:5000000,u:true},{t:"Ajrashish bo'yicha yordam",d:"Ajrashish va aliment.",c:"family",r:"samarkand",b1:1500000,b2:2500000,u:false},{t:"Mehnat nizosi",d:"Ishdan bo'shatish.",c:"labor",r:"tashkent-city",b1:800000,b2:1500000,u:false},{t:"Brend ro'yxatga olish",d:"Tovar belgisi.",c:"intellectual",r:"tashkent-city",b1:2000000,b2:3500000,u:false}];
      for (const r of reqs) { try {await db.legalRequest.create({data:{id:nanoid(),userId:client.id,title:r.t,description:r.d,category:r.c,region:r.r,city:"Toshkent",clientType:"individual",isUrgent:!!r.u,status:"OPEN",budgetMin:r.b1,budgetMax:r.b2,viewsCount:Math.floor(Math.random()*200),responsesCount:0,contactName:client.name,contactPhone:client.phone,contactEmail:client.email,expiresAt:new Date(Date.now()+30*86400000)}});} catch(e){} }
      console.log("[startup] Requests seeded");
    }
    await db.$disconnect();
    console.log("[startup] DB ready");
  } catch(e) {console.error("[startup] DB error:",e.message?.slice(0,300));}
  console.log("[startup] Starting server...");
  const {spawn} = require("child_process");
  const s = spawn("node",["server.js"],{stdio:"inherit",env:process.env});
  s.on("exit",c=>process.exit(c));
}
main();
