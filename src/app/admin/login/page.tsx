'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight, Recycle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  if (username === 'admin' && password === 'rawai2026') {
    // ✅ บันทึกสถานะว่า Login แล้วลงใน LocalStorage
    localStorage.setItem('isAdminLoggedIn', 'true');
    router.push('/admin/dashboard');
  } else {
    alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-8">
        
        {/* ส่วนหัว Logo สไตล์ Tech-Eco */}
        <div className="text-center space-y-4">
          <div className="inline-flex w-20 h-20 bg-emerald-600 rounded-[2.5rem] items-center justify-center text-white shadow-2xl shadow-emerald-200 rotate-3">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Staff Portal</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">
              ระบบบริหารจัดการธนาคารขยะราไวย์
            </p>
          </div>
        </div>

        {/* ฟอร์มการเข้าสู่ระบบ */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold transition-all text-slate-700"
                  placeholder="ชื่อผู้ใช้งาน"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold transition-all text-slate-700"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* ปุ่มกลับหน้าหลัก */}
        <p className="text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-emerald-600 text-xs font-bold flex items-center gap-2 mx-auto transition-colors"
          >
            <Recycle className="w-4 h-4" /> กลับหน้าหลักโครงการ
          </button>
        </p>

      </div>
    </div>
  );
}