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
    localStorage.removeItem('isAdminLoggedIn'); // ลบบัตรผ่านออก [cite: 2026-02-25]
    router.push('/admin/login'); // เตะกลับหน้า Login
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      
      {/* 1. Header: Greeting & Logout */}
      <div className="bg-slate-900 pt-12 pb-32 px-6 rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-white">
          <Settings className="w-64 h-64 rotate-12" />
        </div>
        <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <LayoutDashboard className="w-8 h-8" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-white leading-none">สวัสดี แอดมินฟลุ๊ค</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Rawai Trash Bank Command Center</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-rose-500/20 text-white px-5 py-3 rounded-2xl transition-all border border-white/10 font-black text-xs uppercase tracking-widest group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" /> ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 space-y-8 relative z-20">
        
        {/* 2. Real-time Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard label="น้ำหนักรวม" value={(stats?.totalWeight / 1000).toFixed(2) || '0'} unit="ตัน" color="bg-emerald-500" />
          <SummaryCard label="สมาชิกทั้งหมด" value={stats?.totalTransactions || '0'} unit="ราย" color="bg-blue-500" />
          <SummaryCard label="ยอดหมุนเวียน" value={stats?.totalMoney?.toLocaleString() || '0'} unit="฿" color="bg-amber-500" />
        </div>

        {/* 3. Main Navigation Grid (ศุนย์รวมเมนู) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <MenuCard 
            icon={<Users className="w-8 h-8" />} 
            title="จัดการสมาชิก" 
            desc="ลงทะเบียน แก้ไข ค้นหาชื่อชาวบ้าน"
            color="text-blue-600"
            onClick={() => router.push('/admin/members')} 
          />
          
          <MenuCard 
            icon={<BadgeDollarSign className="w-8 h-8" />} 
            title="ตั้งราคาขยะ" 
            desc="ปรับราคากลางตามประกาศเทศบาล"
            color="text-emerald-600"
            onClick={() => router.push('/admin/trash-types')} 
          />

          <MenuCard 
            icon={<Recycle className="w-8 h-8" />} 
            title="รับฝากขยะ" 
            desc="หน้าบันทึกรายการฝาก (ฝั่งเจ้าหน้าที่)"
            color="text-amber-600"
            onClick={() => router.push('/staff/record')} 
          />

          <MenuCard 
            icon={<BarChart3 className="w-8 h-8" />} 
            title="รายงานสถิติ" 
            desc="ดูข้อมูลวิเคราะห์และผลงานโครงการ"
            color="text-purple-600"
            onClick={() => router.push('/admin/reports')} 
          />

        </div>
      </div>
    </div>
  );
}

// Sub-components เพื่อความสะอาดของโค้ด
function SummaryCard({ label, value, unit, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-between overflow-hidden relative">
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-5 rounded-full`} />
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tabular-nums">{value}</span>
          <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
         <Receipt className="w-6 h-6" />
      </div>
    </div>
  );
}

function MenuCard({ icon, title, desc, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-start text-left hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden"
    >
      <div className={`mb-6 p-4 rounded-2xl bg-slate-50 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="font-black text-xl text-slate-900 flex items-center gap-2">
          {title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </h4>
        <p className="text-xs font-medium text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}