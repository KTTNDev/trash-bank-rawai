'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Recycle, ChartBar, BadgeDollarSign, Users, ArrowRight, Leaf, ShieldCheck, MapPin, 
  Lock, Megaphone, Globe, ExternalLink, LayoutGrid, X, Sparkles, TrendingDown, 
  Landmark, Wallet 
} from 'lucide-react';
import { 
  getTrashTypes, getGlobalStats, getAnnouncements, handleVisitorAnalytics 
} from '@/lib/trash-service';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [visitorStats, setVisitorStats] = useState({ today: 0, total: 0 });

  const brandGradient = "linear-gradient(90deg, hsla(160, 50%, 51%, 1) 0%, hsla(247, 60%, 21%, 1) 100%)";

  const quickLinks = [
    { name: "หน้าหลักรวมบริการ", url: "https://e-service-rawai-center.vercel.app/", imageUrl: "https://www.rawai.go.th/images/header-72-1/logo_0004.png",  color:  "bg-blue-50" },
    { name: "กิจกรรมราไวย์", url: "https://www.rawai.go.th/event.php", imageUrl: "https://www.rawai.go.th/images/header-72-1/logo_0004.png", color: "bg-blue-50"  },
    { name: "Rawai One Map", url: "https://rawai-one-map.web.app/",imageUrl: "https://www.rawai.go.th/images/header-72-1/logo_0004.png", color: "bg-blue-50" },
    { name: "Traffy Fondue", url: "https://landing.traffy.in.th?key=elqOlHUe",  imageUrl: "https://www.nstda.or.th/nac/2023/wp-content/uploads/2023/03/ex-faeature-image_ex07.webp", color: "bg-blue-50"  },
    { name: "ระบบ E-Office", url: "https://rawai.s.eoffice.go.th/portal/home", imageUrl: "https://www.eoffice.go.th/img/Logo-e-Office.png", color: "bg-indigo-50" },
    { name: "ศูนย์บริการ OSS", url: "https://www.dla.go.th/land/oss.do", imageUrl: "https://www.dla.go.th/images/logo.png", color: "bg-blue-50"  }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeData, statData, prData, vData] = await Promise.all([
          getTrashTypes(),
          getGlobalStats(),
          getAnnouncements(),
          handleVisitorAnalytics()
        ]);
        setTypes(typeData.filter(t => t.isActive));
        setStats(statData);
        setAnnouncements(prData);
        setVisitorStats(vData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-emerald-100">
      
      {/* 🛠️ 1. Floating Quick Access: DNA จากโปรเจกต์ CCTV */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        {isMenuOpen && (
          <div className="mb-2 w-64 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="p-6 bg-slate-900/5 border-b border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rawai Services</p>
              <h4 className="text-sm font-bold text-slate-800">ทางเข้าบริการอื่นๆ</h4>
            </div>
            <div className="p-3 space-y-1">
              {quickLinks.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}><Recycle className="w-5 h-5 text-emerald-600" /></div>
                  <div className="flex-1 text-left"><p className="text-xs font-black text-slate-700 leading-tight">{link.name}</p></div>
                  <ExternalLink className="w-3 h-3 text-slate-300" />
                </a>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 hover:scale-110 text-white" style={{ background: isMenuOpen ? '#0f172a' : brandGradient }}>
          {isMenuOpen ? <X className="w-8 h-8" /> : <LayoutGrid className="w-8 h-8" />}
          {!isMenuOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white rounded-full animate-ping"></span>}
        </button>
      </div>

      {/* 2. Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200"><Recycle className="w-5 h-5 md:w-6 md:h-6" /></div>
            <span className="font-black text-sm md:text-xl tracking-tighter uppercase">ธนาคารขยะ<span className="text-emerald-600">RAWAI สบายซิตี้</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/admin/login')} className="text-slate-400 hover:text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-1"><Lock className="w-3 h-3" /> Staff</button>
            <button onClick={() => router.push('/member/login')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase shadow-lg">Login</button>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section: Quick Access Grid (Compact Version) */}
      <section className="pt-28 pb-12 md:pt-44 md:pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase"><Sparkles className="w-3.5 h-3.5" /> Sustainable Rawai Sabai City</div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">ธนาคารขยะ <br/><span className="text-transparent bg-clip-text italic" style={{ backgroundImage: brandGradient }}>ดิจิทัล</span> ราไวย์</h1>
              <p className="text-slate-500 text-sm md:text-lg font-medium max-w-xl mx-auto lg:mx-0">คืนงบประมาณกำจัดขยะ 20,262.73 ตัน/ปี งบประมาณปีละ 12 ล้านบาท กลับสู่การพัฒนาตำบลอย่างยั่งยืน</p>
            </div>

            {/* Quick Access Menu: ปรับความสูง Compact */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="col-span-2 md:col-span-1">
                <HeroActionCard icon={<Wallet className="w-7 h-7" />} label="START" title="เริ่มสะสมเงิน" color="bg-emerald-600" textColor="text-white" isMain={true} onClick={() => router.push('/member/login')} />
              </div>
              <HeroActionCard icon={<BadgeDollarSign className="w-6 h-6" />} label="PRICES" title="ราคารับซื้อ" color="bg-white" textColor="text-slate-800" borderColor="border-slate-100" iconColor="text-emerald-500" onClick={() => document.getElementById('prices')?.scrollIntoView({ behavior: 'smooth' })} />
              <HeroActionCard icon={<Megaphone className="w-6 h-6" />} label="NEWS" title="ตารางงาน" color="bg-slate-900" textColor="text-white" iconColor="text-amber-400" onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          </div>
          
          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right duration-1000">
             <div className="w-full h-[500px] bg-white rounded-[4rem] overflow-hidden rotate-2 relative shadow-2xl border-[12px] border-white">
                <img src="https://scontent.furt1-1.fna.fbcdn.net/v/t39.30808-6/634212959_1256933013202535_2453466340996406974_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeErMBV-Z_5aPWnUcjFFNXKWlBMtQMwRj_KUEy1AzBGP8uvqSjm7SQJJEVSB47zfOJs&_nc_ohc=Y6qszB1e7-MQ7kNvwFEPnNl&_nc_oc=AdkxcWE-4t4r4IO_gqf1csIj_KZOMAmMmklsEDkiyj1l-OgNPGiqjGo_gJjchMPOUO4&_nc_zt=23&_nc_ht=scontent.furt1-1.fna&_nc_gid=m-5YhIES_0WCFQDp5G15Bg&oh=00_AftkC1bBKPHoqhkRMS1OoOF03xc50CpFvbF751iXuMMaag&oe=69A548DD" className="w-full h-full object-cover opacity-90" alt="Hero" />
             </div>
             <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-emerald-50 max-w-[240px] z-10 animate-bounce-slow">
                <ShieldCheck className="text-emerald-500 w-8 h-8 mb-3" />
                <h5 className="font-black text-slate-800 text-sm">โปร่งใส 100%</h5>
                <p className="text-[10px] font-bold text-slate-400 leading-tight">บันทึกข้อมูลแบบดิจิทัล ตรวจสอบยอดเงินได้ตลอด 24 ชม.</p>
             </div>
          </div>
        </div>
      </section>
{/* 4. Awareness Section: 🟢 ปรับสูตรคำนวณ 725 บาท/ตัน 🟢 [cite: 2026-02-26] */}
      <section id="impact" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none"><Landmark className="w-96 h-96" /></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 text-center lg:text-left">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-black leading-tight italic">
              ภารกิจลดงบประมาณ <br/>
              <span className="text-emerald-400">กำจัดขยะมวลรวม 20,262 ตัน</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">ทุกๆ 1 ตันที่คุณช่วยแยก ช่วยลดภาระงบประมาณเทศบาลได้ <span className="text-white font-black underline">725 บาท</span> [cite: 2026-02-26]</p>
            <div className="grid grid-cols-2 gap-4">
              {loading ? <><SkeletonCard height="h-28"/><SkeletonCard height="h-28"/></> : <>
                <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">ประหยัดงบได้แล้ว</p>
                  <p className="text-2xl md:text-3xl font-black italic">฿{((stats?.totalWeight / 1000) * 725).toLocaleString()}</p>
                </div>
                <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">ขยะรีไซเคิลรวม</p>
                  <p className="text-2xl md:text-3xl font-black italic">{(stats?.totalWeight / 1000).toFixed(1)} ตัน</p>
                </div>
              </>}
            </div>
          </div>
          <div className="bg-emerald-600 p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform"><Landmark className="w-32 h-32" /></div>
             <TrendingDown className="w-12 h-12 mb-6 text-white" />
             <h4 className="text-2xl font-black mb-4">คืนงบสู่ชุมชนราไวย์</h4>
             <p className="text-emerald-100 font-medium leading-relaxed">ต้นทุนบริหารจัดการขยะ 725 บาท/ตัน ที่เราประหยัดได้ จะเปลี่ยนเป็นทุนพัฒนาสาธารณูปโภคและสุขภาพชาวราไวย์ทุกคน [cite: 2026-02-26]</p>
          </div>
        </div>
      </section>
      {/* 5. Success Stats: 🟢 แก้บั๊กครัวเรือน (อ้างอิง Member จริง) 🟢 */}
      <section id="stats" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12 uppercase tracking-tight">ความสำเร็จของโครงการ</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {loading ? <><div className="col-span-2 md:col-span-1"><SkeletonCard height="h-64"/></div><SkeletonCard height="h-64"/><SkeletonCard height="h-64"/></> : <>
              <div className="col-span-2 md:col-span-1"><StatItem icon={<ChartBar />} label="ช่วยกันลดขยะไปแล้ว" value={(stats?.totalWeight / 1000).toFixed(1) || '0'} unit="ตัน" color="text-emerald-600" isMain={true} /></div>
              <StatItem icon={<BadgeDollarSign />} label="เงินในระบบ" value={stats?.totalMoney?.toLocaleString() || '0'} unit="บาท" color="text-blue-600" />
              {/* 🟢 อ้างอิง Member จริงแล้วครับ 🟢 */}
              <StatItem icon={<Users />} label="ครัวเรือนที่ร่วม" value={stats?.totalMembers || '0'} unit="ราย" color="text-amber-600" />
            </>}
          </div>
        </div>
      </section>

      {/* 6. PR Schedule & Prices (Skeleton Ready) */}
      <section id="schedule" className="py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center md:text-left tracking-tight">ตารางจุดรับฝากขยะ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? [1, 2, 3].map(i => <SkeletonCard key={i} height="h-64" />) : announcements.map((item: any) => (
              <div key={item.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-emerald-500/20 hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><MapPin className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full uppercase">{item.date}</span>
                </div>
                <h4 className="text-xl font-black mb-2 leading-tight">{item.title}</h4>
                <p className="text-slate-400 font-bold text-xs mb-4 uppercase tracking-widest">{item.location}</p>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prices" className="py-20 px-4 md:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-10 text-center md:text-left tracking-tight">ราคารับซื้อวันนี้</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {loading ? [1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} height="h-44" />) : types.map((type) => (
              <div key={type.id} className="p-5 md:p-8 bg-white border border-slate-100 rounded-[2.2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors"><Recycle className="w-5 h-5 md:w-6 md:h-6" /></div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{type.category}</p>
                <h3 className="text-sm md:text-xl font-black text-slate-800 leading-tight mb-4">{type.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-3xl font-black text-emerald-600">{type.pricePerUnit.toLocaleString()}</span>
                  <span className="text-[10px] md:text-sm font-bold text-slate-400">/ {type.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer: สถิติผู้เข้าชมแบบ CCTV */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 px-6 text-center">
         <div className="flex items-center justify-center gap-6 mb-8 text-slate-400 font-black text-[10px] uppercase">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> เข้าชมวันนี้: {visitorStats.today.toLocaleString()}</span>
            <div className="w-px h-3 bg-slate-700" />
            <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> ทั้งหมด: {visitorStats.total.toLocaleString()}</span>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600">© 2026 Rawai Subdistrict Municipality. By Fluke kttndev</p>
      </footer>
    </div>
  );
}

// 🟢 Helper Components 🟢

function HeroActionCard({ icon, label, title, color, textColor, iconColor, isMain, borderColor, onClick }: any) {
  return (
    <button onClick={onClick} className={`${color} ${textColor} ${borderColor || 'border-transparent'} border rounded-[2rem] md:rounded-[3rem] py-4 md:py-6 px-4 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center text-center justify-center h-full group w-full`}>
      <div className={`${isMain ? 'bg-white/20' : 'bg-slate-50'} ${iconColor} p-3 md:p-4 rounded-xl md:rounded-2xl mb-2 group-hover:scale-110 transition-transform`}>{icon}</div>
      <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest mb-0.5 opacity-60">{label}</p>
      <h4 className="text-xs md:text-base font-black leading-tight">{title}</h4>
    </button>
  );
}

function StatItem({ icon, label, value, unit, color, isMain }: any) {
  return (
    <div className={`bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all h-full ${isMain ? 'md:p-14' : ''}`}>
      <div className={`${color} bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl mb-4 group-hover:scale-110 transition-transform`}>{icon}</div>
      <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-1 justify-center">
        <span className={`${isMain ? 'text-4xl md:text-6xl' : 'text-2xl md:text-5xl'} font-black text-slate-900 tabular-nums`}>{value || '0'}</span>
        <span className="text-[10px] md:text-sm font-bold text-slate-400 uppercase ml-1">{unit}</span>
      </div>
    </div>
  );
}

function SkeletonCard({ height }: { height: string }) {
  return (
    <div className={`${height} w-full bg-slate-200/60 rounded-[2.5rem] animate-pulse relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}