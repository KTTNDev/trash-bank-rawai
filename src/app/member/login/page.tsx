'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Recycle, ArrowRight, ShieldCheck } from 'lucide-react';
import { findMember } from '@/lib/trash-service';

export default function MemberLoginPage() {
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 13) return alert('กรุณากรอกเลขบัตรประชาชน 13 หลัก');
    
    setLoading(true);
    const member = await findMember(nationalId);
    if (member) {
      router.push(`/member/${nationalId}`);
    } else {
      alert('ไม่พบเลขบัตรประชาชนนี้ในระบบธนาคารขยะ');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-emerald-200/50 p-10 text-center border border-emerald-100">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-100 rotate-3">
          <Recycle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2">ตรวจสอบยอดเงิน</h1>
        <p className="text-slate-500 mb-10 font-medium">ระบุเลขบัตรประชาชนเพื่อดูสมุดบัญชีขยะ</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input 
              required
              type="text" 
              maxLength={13}
              placeholder="เลขบัตรประชาชน 13 หลัก"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 outline-none transition-all text-center text-xl font-bold tracking-[0.2em] placeholder:tracking-normal placeholder:font-medium"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'กำลังค้นหา...' : 'เข้าสู่ระบบสมาชิก'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <p className="mt-10 text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
          โครงการธนาคารขยะดิจิทัล <br/> เทศบาลตำบลราไวย์
        </p>
      </div>
    </div>
  );
}