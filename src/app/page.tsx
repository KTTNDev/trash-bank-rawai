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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. Navbar: เพิ่มปุ่มสำหรับแอดมิน */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Recycle className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">Trash Bank <span className="text-emerald-600">Rawai</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 font-bold text-sm uppercase tracking-widest text-slate-500">
            <a href="#stats" className="hover:text-emerald-600 transition-colors">สถิติโครงการ</a>
            <a href="#prices" className="hover:text-emerald-600 transition-colors">ราคารับซื้อ</a>
            
            {/* 🟢 จุดที่เพิ่ม 1: ลิงก์เข้าหน้า Admin Login */}
            <button 
              onClick={() => router.push('/admin/login')}
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <Lock className="w-4 h-4" /> สำหรับเจ้าหน้าที่
            </button>

            <button 
              onClick={() => router.push('/member/login')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
            >
              เข้าสู่ระบบสมาชิก
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: เปิดตัวอลังการ */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              <Leaf className="w-4 h-4" /> เปลี่ยนขยะเป็นทุน พัฒนาคุณภาพชีวิตชาวราไวย์
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              ธนาคารขยะ <br/><span className="text-emerald-600 italic">ดิจิทัล</span> แห่งแรกของราไวย์
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto lg:mx-0">
              ร่วมสร้างประวัติศาสตร์หน้าใหม่ในการจัดการสิ่งแวดล้อม 
              เปลี่ยนทุกกิโลกรัมของขยะรีไซเคิลให้กลายเป็นเงินสะสมในบัญชีดิจิทัลของคุณ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => router.push('/member/login')} className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                เริ่มสะสมเงินวันนี้ <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#prices" className="bg-white border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg hover:border-emerald-600 transition-all text-center">
                เช็กราคาขยะ
              </a>
            </div>
          </div>
          <div className="relative hidden lg:block">
              <div className="w-full h-[500px] bg-emerald-100 rounded-[4rem] rotate-3 relative overflow-hidden shadow-inner">
                 <div className="absolute inset-0 flex items-center justify-center text-emerald-300">
                    <Recycle className="w-64 h-64 opacity-20" />
                 </div>
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-emerald-50 max-w-[280px] animate-bounce-slow">
                 <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    <span className="font-black text-slate-800">ระบบโปร่งใส 100%</span>
                 </div>
                 <p className="text-xs font-bold text-slate-400">ตรวจสอบยอดเงินผ่านระบบออนไลน์ได้ตลอด 24 ชั่วโมง</p>
              </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section id="stats" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-black">ความสำเร็จของโครงการ</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Real-time Impact Tracking</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatItem 
              icon={<ChartBar className="w-8 h-8" />} 
              label="ขยะลดไปแล้วทั้งสิ้น" 
              value={(stats?.totalWeight / 1000).toFixed(2) || '0'} 
              unit="ตัน"
              color="text-emerald-600"
            />
            <StatItem 
              icon={<BadgeDollarSign className="w-8 h-8" />} 
              label="เงินหมุนเวียนในระบบ" 
              value={stats?.totalMoney?.toLocaleString() || '0'} 
              unit="บาท"
              color="text-blue-600"
            />
            <StatItem 
              icon={<Users className="w-8 h-8" />} 
              label="สมาชิกเข้าร่วมโครงการ" 
              value={stats?.totalTransactions || '0'} 
              unit="ครัวเรือน"
              color="text-amber-600"
            />
          </div>
        </div>
      </section>

      {/* 4. Price Table */}
      <section id="prices" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">ราคารับซื้อขยะวันนี้</h2>
              <p className="text-slate-500 font-bold">ข้อมูลราคากลางจากเทศบาลตำบลราไวย์ อัปเดตล่าสุด</p>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 font-black text-xs uppercase tracking-widest">
              Update: {new Date().toLocaleDateString('th-TH')}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {types.map((type) => (
              <div key={type.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl transition-all group hover:border-emerald-500/30">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                       <Recycle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{type.category}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-4">{type.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600">{type.pricePerUnit.toLocaleString()}</span>
                  <span className="text-sm font-bold text-slate-400">บาท / {type.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Footer: อัปเดตลิงก์แอดมิน */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto border-b border-white/10 pb-16 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Recycle className="w-8 h-8 text-emerald-400" />
              <span className="font-black text-2xl tracking-tighter uppercase">Rawai Trash Bank</span>
            </div>
            <p className="text-slate-400 font-medium max-w-md">
              โครงการนำร่องจัดการขยะรีไซเคิลผ่านระบบดิจิทัล เพื่อความยั่งยืนของสิ่งแวดล้อมและเศรษฐกิจชุมชนราไวย์ ภายใต้การดูแลของเทศบาลตำบลราไวย์ จังหวัดภูเก็ต
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-emerald-400">การเข้าถึงระบบ</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><button onClick={() => router.push('/member/login')} className="hover:text-white transition-colors">สมาชิก (Member)</button></li>
              
              {/* 🟢 จุดที่เพิ่ม 2: เปลี่ยนทุกลิงก์ของ Staff/Admin มาที่หน้า Login ใหม่ */}
              <li><button onClick={() => router.push('/admin/login')} className="hover:text-white transition-colors">เจ้าหน้าที่ (Staff)</button></li>
              <li><button onClick={() => router.push('/admin/login')} className="hover:text-white transition-colors">ผู้บริหาร (Admin)</button></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-emerald-400">ติดต่อสอบถาม</h4>
            <div className="space-y-4 text-slate-400 font-medium text-sm">
                <div className="flex items-start gap-2">
                   <MapPin className="w-4 h-4 shrink-0" />
                   <span>กองสาธารณสุขและสิ่งแวดล้อม เทศบาลตำบลราไวย์ จ.ภูเก็ต</span>
                </div>
                <a href="https://rawai.go.th" className="flex items-center gap-2 hover:text-white">
                   <ExternalLink className="w-4 h-4" /> <span>www.rawai.go.th</span>
                </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 Rawai Subdistrict Municipality. Developed by Fluke kttndev
        </div>
      </footer>
    </div>
  );
}

function StatItem({ icon, label, value, unit, color }: any) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 group hover:shadow-xl transition-all">
      <div className={`${color} bg-slate-50 p-5 rounded-3xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2 justify-center">
          <span className="text-5xl font-black text-slate-900">{value}</span>
          <span className="text-sm font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}