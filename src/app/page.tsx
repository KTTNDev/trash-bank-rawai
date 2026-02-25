'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Recycle, ChartBar, BadgeDollarSign, Users, 
  ArrowRight, Leaf, ShieldCheck, MapPin, ExternalLink, Lock 
} from 'lucide-react';
import { getTrashTypes, getGlobalStats } from '@/lib/trash-service';

export default function LandingPage() {
  const router = useRouter();
  const [types, setTypes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [typeData, statData] = await Promise.all([
        getTrashTypes(),
        getGlobalStats()
      ]);
      setTypes(typeData.filter(t => t.isActive));
      setStats(statData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* 1. Navbar: ปรับให้กะทัดรัดบนมือถือ */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg">
              <Recycle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-black text-base md:text-xl tracking-tighter uppercase">
              TRASH BANK <span className="text-emerald-600 hidden xs:inline">RAWAI</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 font-bold text-[10px] md:text-sm uppercase tracking-widest text-slate-500">
            <button 
              onClick={() => router.push('/admin/login')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
              <span className="hidden sm:inline">สำหรับเจ้าหน้าที่</span>
            </button>

            <button 
              onClick={() => router.push('/member/login')}
              className="bg-slate-900 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl hover:bg-emerald-600 transition-all shadow-lg text-[10px] md:text-xs"
            >
              เข้าสู่ระบบ<span className="hidden xs:inline">สมาชิก</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: ลด Text Size และ Padding บนมือถือ */}
      <section className="pt-28 pb-12 md:pt-40 md:pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
              <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4" /> เปลี่ยนขยะเป็นทุนชาวราไวย์
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-[1.2] md:leading-[1.1] tracking-tight">
              ธนาคารขยะ <br/>
              <span className="text-emerald-600 italic">ดิจิทัล</span> <span className="text-2xl md:text-4xl lg:text-6xl block md:inline">แห่งแรกของราไวย์</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-lg font-medium max-w-xl mx-auto lg:mx-0">
              เปลี่ยนทุกกิโลกรัมของขยะรีไซเคิลให้กลายเป็นเงินสะสมในบัญชีดิจิทัลของคุณ 
              โปร่งใส ตรวจสอบได้ตลอด 24 ชม.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button onClick={() => router.push('/member/login')} className="bg-emerald-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-2xl shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                เริ่มสะสมเงินวันนี้ <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#prices" className="bg-white border-2 border-slate-100 px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:border-emerald-600 transition-all text-center">
                เช็กราคาขยะ
              </a>
            </div>
          </div>
          
          {/* ซ่อนรูปบนมือถือเพื่อประหยัดที่ หรือปรับขนาดให้เล็กลง */}
          <div className="relative hidden lg:block">
              <div className="w-full h-[400px] lg:h-[500px] bg-emerald-100 rounded-[3rem] lg:rounded-[4rem] rotate-3 relative overflow-hidden shadow-inner">
                 <div className="absolute inset-0 flex items-center justify-center text-emerald-300">
                    <Recycle className="w-48 h-48 lg:w-64 lg:h-64 opacity-20" />
                 </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-emerald-50 max-w-[240px]">
                 <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-emerald-500 w-5 h-5" />
                    <span className="font-black text-slate-800 text-sm">ระบบโปร่งใส 100%</span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 leading-tight">ตรวจสอบยอดเงินผ่านระบบออนไลน์ได้ตลอด 24 ชั่วโมง</p>
              </div>
          </div>
        </div>
      </section>

{/* 3. Stats Section: Bento Grid Style (ไม่น่าเบื่อแน่นอนจารย์จัดให้) */}
<section id="stats" className="py-12 md:py-20 bg-slate-50">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-black">ความสำเร็จของโครงการ</h2>
      <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.3em] mt-2">Impact Dashboard</p>
    </div>
    
    {/* 🟢 Grid 2 ช่องบนมือถือ | 3 ช่องบนจอใหญ่ */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
      {/* ใบแรก: ใหญ่กว่าเพื่อน (Spans 2 cols on mobile) */}
      <div className="col-span-2 md:col-span-1">
        <StatItem 
          icon={<ChartBar className="w-6 h-6 md:w-8 md:h-8" />} 
          label="ขยะลดไปแล้วทั้งสิ้น" 
          value={(stats?.totalWeight / 1000).toFixed(1) || '0'} 
          unit="ตัน" color="text-emerald-600"
          isMain={true} // เพิ่ม Flag พิเศษ
        />
      </div>
      <StatItem 
        icon={<BadgeDollarSign className="w-6 h-6 md:w-8 md:h-8" />} 
        label="เงินในระบบ" 
        value={stats?.totalMoney?.toLocaleString() || '0'} 
        unit="บาท" color="text-blue-600"
      />
      <StatItem 
        icon={<Users className="w-6 h-6 md:w-8 md:h-8" />} 
        label="สมาชิก" 
        value={stats?.totalTransactions || '0'} 
        unit="ราย" color="text-amber-600"
      />
    </div>
  </div>
</section>

{/* 4. Price Table: Grid 2 คอลัมน์บนมือถือแบบ Modern Card */}
<section id="prices" className="py-16 md:py-24 px-4 md:px-6">
  <div className="max-w-5xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4">
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900">ราคารับซื้อขยะวันนี้</h2>
        <p className="text-slate-500 text-xs md:text-sm font-bold">ประกาศราคากลาง เทศบาลตำบลราไวย์</p>
      </div>
      <div className="bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 font-black text-[10px] uppercase tracking-widest shadow-sm">
        {new Date().toLocaleDateString('th-TH')}
      </div>
    </div>
    
    {/* 🟢 Grid 2 คอลัมน์บนมือถือ (grid-cols-2) */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      {types.map((type) => (
        <div key={type.id} className="relative group p-5 md:p-8 bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all overflow-hidden">
          {/* ตกแต่งพื้นหลังไม่ให้น่าเบื่อ */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors mb-4 md:mb-6">
               <Recycle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            
            <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{type.category}</p>
            <h3 className="text-sm md:text-xl font-black text-slate-800 leading-tight mb-4 md:mb-6">{type.name}</h3>
            
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-3xl font-black text-emerald-600">{type.pricePerUnit.toLocaleString()}</span>
              <span className="text-[10px] md:text-sm font-bold text-slate-400">/ {type.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* 5. Footer: จัดระเบียบใหม่ให้เหมาะกับแนวตั้ง */}
      <footer className="bg-slate-900 text-white pt-12 md:pt-20 pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto border-b border-white/10 pb-10 md:pb-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
              <Recycle className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
              <span className="font-black text-lg md:text-2xl tracking-tighter uppercase">Rawai Trash Bank</span>
            </div>
            <p className="text-slate-400 font-medium text-xs md:text-sm max-w-md mx-auto md:mx-0 leading-relaxed">
              โครงการนำร่องจัดการขยะรีไซเคิลดิจิทัล เพื่อความยั่งยืนของชุมชนราไวย์ ภายใต้การดูแลของเทศบาลตำบลราไวย์ จังหวัดภูเก็ต
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-emerald-400">เมนูระบบ</h4>
            <ul className="space-y-3 text-slate-400 font-bold text-[10px] md:text-xs">
              <li><button onClick={() => router.push('/member/login')} className="hover:text-white transition-colors">สมาชิก (Member)</button></li>
              <li><button onClick={() => router.push('/admin/login')} className="hover:text-white transition-colors">เจ้าหน้าที่ (Staff / Admin)</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-emerald-400">ติดต่อ</h4>
            <div className="space-y-3 text-slate-400 font-medium text-[10px] md:text-xs">
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                   <span>เทศบาลตำบลราไวย์ จ.ภูเก็ต</span>
                </div>
                <a href="https://rawai.go.th" className="flex items-center justify-center md:justify-start gap-2 hover:text-white">
                   <ExternalLink className="w-3 h-3 md:w-4 md:h-4" /> <span>www.rawai.go.th</span>
                </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 text-center text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 Rawai Subdistrict Municipality. By Fluke kttndev
        </div>
      </footer>
    </div>
  );
}

function StatItem({ icon, label, value, unit, color, isMain }: any) {
  return (
    <div className={`bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all ${isMain ? 'p-8 md:p-12' : 'p-6 md:p-10'}`}>
      <div className={`${color} bg-slate-50 ${isMain ? 'p-6 md:p-7' : 'p-4 md:p-5'} rounded-2xl md:rounded-3xl group-hover:scale-110 transition-transform mb-4`}>
        {icon}
      </div>
      <div>
        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1.5 justify-center">
          <span className={`${isMain ? 'text-4xl md:text-6xl' : 'text-2xl md:text-5xl'} font-black text-slate-900 tabular-nums`}>{value}</span>
          <span className="text-[10px] md:text-sm font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}