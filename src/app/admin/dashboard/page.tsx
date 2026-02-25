'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, BadgeDollarSign, Receipt, BarChart3, 
  Settings, LogOut, Recycle, ChevronRight, LayoutDashboard 
} from 'lucide-react';
import { getGlobalStats } from '@/lib/trash-service';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getGlobalStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 md:pb-20 font-sans text-slate-900 overflow-x-hidden">
      
      {/* 1. Header: ปรับขนาดบนมือถือ */}
      <div className="bg-slate-900 pt-8 pb-24 md:pt-12 md:pb-32 px-4 md:px-6 rounded-b-[2.5rem] md:rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 text-white">
          <Settings className="w-40 h-40 md:w-64 md:h-64 rotate-12" />
        </div>
        <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
             <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg">
                <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8" />
             </div>
             <div>
                <h1 className="text-lg md:text-2xl font-black text-white leading-none">แอดมินฟลุ๊ค</h1>
                <p className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Rawai Command Center</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-rose-500/20 text-white px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl transition-all border border-white/10 font-black text-[10px] md:text-xs uppercase tracking-widest group"
          >
            <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110" /> <span className="hidden xs:inline">ออก</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16 space-y-6 md:space-y-8 relative z-20">
        
        {/* 2. Summary Bar: 2 คอลัมน์บนมือถือ โดยใบแรกเด่นสุด */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <div className="col-span-2 md:col-span-1">
            <SummaryCard label="น้ำหนักรวม" value={(stats?.totalWeight / 1000).toFixed(2) || '0'} unit="ตัน" color="bg-emerald-500" isMain={true} />
          </div>
          {/* 🟢 แก้บั๊ก: ใช้ stats?.totalMembers แทน totalTransactions */}
          <SummaryCard label="สมาชิก" value={stats?.totalMembers || '0'} unit="ราย" color="bg-blue-500" />
          <SummaryCard label="ยอดหมุนเวียน" value={stats?.totalMoney?.toLocaleString() || '0'} unit="฿" color="bg-amber-500" />
        </div>

        {/* 3. Main Navigation Grid: 2 คอลัมน์บนมือถือแบบไม่น่าเบื่อ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <MenuCard 
            icon={<Users className="w-6 h-6 md:w-8 md:h-8" />} 
            title="จัดการสมาชิก" 
            desc="ลงทะเบียน/แก้ไขชื่อชาวบ้าน"
            color="text-blue-600"
            onClick={() => router.push('/admin/members')} 
          />
          <MenuCard 
            icon={<BadgeDollarSign className="w-6 h-6 md:w-8 md:h-8" />} 
            title="ตั้งราคาขยะ" 
            desc="ปรับราคาตามประกาศล่าสุด"
            color="text-emerald-600"
            onClick={() => router.push('/admin/trash-types')} 
          />
          <MenuCard 
            icon={<Recycle className="w-6 h-6 md:w-8 md:h-8" />} 
            title="รับฝากขยะ" 
            desc="หน้าบันทึกรายการฝากขยะ"
            color="text-amber-600"
            onClick={() => router.push('/staff/record')} 
          />
          <MenuCard 
            icon={<BarChart3 className="w-6 h-6 md:w-8 md:h-8" />} 
            title="รายงานสถิติ" 
            desc="ดูข้อมูลวิเคราะห์รายเดือน"
            color="text-purple-600"
            onClick={() => router.push('/admin/reports')} 
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, unit, color, isMain }: any) {
  return (
    <div className={`bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-between overflow-hidden relative ${isMain ? 'p-6 md:p-8' : 'p-4 md:p-8'}`}>
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 md:w-24 md:h-24 ${color} opacity-5 rounded-full`} />
      <div className="relative z-10">
        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1 md:gap-2">
          <span className={`${isMain ? 'text-2xl md:text-3xl' : 'text-xl md:text-3xl'} font-black text-slate-900 tabular-nums`}>{value}</span>
          <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0`}>
         <Receipt className="w-5 h-5 md:w-6 md:h-6" />
      </div>
    </div>
  );
}

function MenuCard({ icon, title, desc, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center md:items-start md:text-left hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden h-full"
    >
      <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="space-y-1 md:space-y-2">
        <h4 className="font-black text-sm md:text-xl text-slate-900 flex items-center justify-center md:justify-start gap-1">
          {title} <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </h4>
        <p className="text-[10px] md:text-xs font-medium text-slate-400 leading-tight md:leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}