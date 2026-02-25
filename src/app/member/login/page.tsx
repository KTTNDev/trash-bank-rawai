'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ArrowRight, Recycle, Search, AlertCircle } from 'lucide-react';
import { findMember } from '@/lib/trash-service';

export default function MemberLoginPage() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 13) return setError('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
    
    setLoading(true);
    setError('');
    
    try {
      // 🔍 ค้นหาข้อมูลสมาชิกจาก Firebase ด้วยเลขบัตร
      const member = await findMember(nationalId);
      
      if (member) {
        // ถ้าเจอสมาชิก ให้พาไปหน้าสมุดบัญชีดิจิทัล/page.tsx]
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* ส่วนบน: ตกแต่งสวยงามสไตล์ Modern Eco */}
      <div className="bg-emerald-600 pt-20 pb-40 px-6 rounded-b-[4rem] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 p-10 opacity-10"><Recycle className="w-64 h-64 -rotate-12" /></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2.5rem] items-center justify-center text-white shadow-2xl">
            <CreditCard className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">สมุดบัญชีดิจิทัล</h1>
          <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-[0.3em]">
            Digital Waste Bank Passbook
          </p>
        </div>
      </div>

      {/* ส่วนฟอร์ม: ลอยทับขึ้นมาเล็กน้อย */}
      <div className="max-w-md w-full mx-auto px-6 -mt-24 relative z-20">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-emerald-200/50 border border-emerald-50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                กรอกเลขบัตรประชาชน 13 หลัก
              </label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  maxLength={13}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none font-black text-xl tracking-[0.2em] transition-all"
                  placeholder="X-XXXX-XXXXX-XX-X"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-50 p-4 rounded-2xl animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'ดูยอดเงินสะสม'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center space-y-4">
             <p className="text-xs text-slate-400 font-medium">ยังไม่เป็นสมาชิก? นำขยะมาฝากครั้งแรกเพื่อลงทะเบียนที่จุดบริการ</p>
             <button onClick={() => router.push('/')} className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">
               กลับหน้าหลักโครงการ
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}