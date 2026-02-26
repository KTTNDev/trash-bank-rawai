'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ArrowRight, Recycle, Search, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { findMember } from '@/lib/trash-service';

export default function MemberLoginPage() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const brandGradient = "linear-gradient(90deg, hsla(160, 50%, 51%, 1) 0%, hsla(247, 60%, 21%, 1) 100%)";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 13) return setError('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
    
    setLoading(true);
    setError('');
    
    try {
      const member = await findMember(nationalId);
      if (member) {
        router.push(`/member/${nationalId}`);
      } else {
        setError('ไม่พบข้อมูลสมาชิกในระบบ กรุณาติดต่อเจ้าหน้าที่เพื่อลงทะเบียน');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-x-hidden">
      
      {/* 🟢 1. Modern Header: ใช้ Gradient เดียวกับ Dashboard สมาชิก 🟢 [cite: 2026-02-26] */}
      <div className="pt-16 pb-44 px-6 rounded-b-[4rem] text-center relative overflow-hidden shadow-2xl" style={{ background: brandGradient }}>
        {/* ลายน้ำขนาดใหญ่เฉพาะ Desktop */}
        <div className="absolute top-0 left-0 p-10 opacity-10"><Recycle className="w-64 h-64 -rotate-12 text-white" /></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center space-y-6">
          <button 
            onClick={() => router.push('/')} 
            className="absolute left-0 top-0 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="inline-flex w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2.5rem] items-center justify-center text-white shadow-2xl border border-white/20 animate-bounce-slow">
            <CreditCard className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">เข้าสู่ระบบสมาชิก</h1>
            <div className="flex items-center justify-center gap-2 text-emerald-100 font-bold uppercase text-[10px] tracking-[0.3em]">
              <Sparkles className="w-3 h-3" /> Digital Passbook Entry
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 2. Login Form: ลอยทับพร้อม Mobile Watermark 🟢 [cite: 2026-02-26] */}
      <div className="max-w-md w-full mx-auto px-6 -mt-28 relative z-20">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-emerald-900/10 border border-white relative overflow-hidden">
          
          {/* 🟢 Mobile Watermark: ลายน้ำภาพพื้นหลัง (เฉพาะ Mobile) 🟢 [cite: 2026-02-26] */}
          <div className="absolute inset-0 flex items-center justify-center lg:hidden opacity-[0.05] pointer-events-none -z-10 scale-125 rotate-12">
             <img src="https://scontent.furt1-1.fna.fbcdn.net/v/t39.30808-6/634212959_1256933013202535_2453466340996406974_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&oh=00_AftkC1bBKPHoqhkRMS1OoOF03xc50CpFvbF751iXuMMaag&oe=69A548DD" 
             className="w-full h-auto object-contain" alt="" />
          </div>

          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <Search className="w-3 h-3" /> เลขบัตรประชาชน 13 หลัก
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                  <HashIcon />
                </div>
                <input 
                  type="text" 
                  maxLength={13}
                  required
                  placeholder="X-XXXX-XXXXX-XX-X"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none font-black text-xl md:text-2xl tracking-[0.25em] transition-all placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-200"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 text-rose-500 text-xs font-bold bg-rose-50 p-5 rounded-2xl animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[2.5rem] font-black text-lg md:text-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>ดูสมุดเงินฝาก</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-50 text-center space-y-4">
             <p className="text-[10px] md:text-xs text-slate-400 font-bold leading-relaxed px-4">
               ยังไม่เป็นสมาชิก? นำขยะมาฝากครั้งแรก <br/> เพื่อลงทะเบียนที่จุดบริการของเทศบาล
             </p>
             <button 
               onClick={() => router.push('/')} 
               className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:tracking-[0.2em] transition-all"
             >
               ← กลับหน้าหลักโครงการ
             </button>
          </div>
        </div>
      </div>

      <div className="mt-auto py-10 text-center">
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300">
           Rawai Digital Waste Bank Protocol v1.0
         </p>
      </div>
    </div>
  );
}

// 🟢 Icon Helper 🟢
function HashIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"></line>
      <line x1="4" y1="15" x2="20" y2="15"></line>
      <line x1="10" y1="3" x2="8" y2="21"></line>
      <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
  );
}