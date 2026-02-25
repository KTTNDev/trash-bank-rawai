'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wallet, History, Leaf, ArrowLeft, Recycle, TrendingUp } from 'lucide-react';
import { findMember, getMemberTransactions } from '@/lib/trash-service';
import { TrashMember } from '@/types/trashBank';

export default function MemberDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<TrashMember | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const m = await findMember(id as string);
      if (!m) {
        router.push('/member/login');
        return;
      }
      const t = await getMemberTransactions(id as string); // เดี๋ยวอัปเดต Service ให้ครับ
      setMember(m);
      setTransactions(t);
      setLoading(false);
    };
    loadData();
  }, [id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-emerald-600">กำลังเปิดสมุดบัญชี...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* 1. Header Area */}
      <div className="bg-emerald-600 pt-16 pb-32 px-6 rounded-b-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Recycle className="w-64 h-64 rotate-12" /></div>
        <div className="max-w-4xl mx-auto relative z-10 flex justify-between items-start">
          <button onClick={() => router.push('/member/login')} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors">
            <ArrowLeft />
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-white mb-1">{member?.name}</h1>
            <p className="text-emerald-100 font-mono text-sm tracking-tighter">ID: {member?.nationalId.slice(0,1)}-XXXX-XXXXX-{member?.nationalId.slice(-2)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 space-y-6 relative z-20">
        {/* 2. Balance Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-emerald-200/40 border border-emerald-50 flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">ยอดเงินสะสมปัจจุบัน</p>
            <h2 className="text-6xl font-black text-slate-900 leading-none tracking-tight">
              {member?.totalBalance.toLocaleString()} <span className="text-xl text-emerald-600 ml-1">฿</span>
            </h2>
          </div>
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-200 rotate-6">
            <Wallet className="w-10 h-10" />
          </div>
        </div>

        {/* 3. Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <Leaf className="text-emerald-500 mb-3 w-6 h-6" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ขยะลดไปแล้ว</p>
            <p className="text-2xl font-black text-slate-800">{transactions.length} <span className="text-sm font-medium">ครั้ง</span></p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <TrendingUp className="text-blue-500 mb-3 w-6 h-6" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ความถี่การฝาก</p>
            <p className="text-2xl font-black text-slate-800">ดีเยี่ยม</p>
          </div>
        </div>

        {/* 4. History List */}
       {transactions.map((t, idx) => (
  <div key={idx} className="flex gap-6 relative">
    {/* เส้น Timeline */}
    {idx !== transactions.length - 1 && <div className="absolute left-[23px] top-10 bottom-[-32px] w-0.5 bg-slate-100"></div>}
    
    {/* วันที่ */}
    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm z-10">
      <span className="text-emerald-600 font-black">{new Date(t.timestamp?.seconds * 1000).getDate()}</span>
    </div>

    {/* รายละเอียดรายการ */}
    <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขที่รายการ: {t.id?.slice(-6).toUpperCase()}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            {new Date(t.timestamp?.seconds * 1000).toLocaleTimeString('th-TH')} น.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-emerald-600">+{t.totalAmount.toLocaleString()} ฿</p>
          <p className="text-[9px] font-bold text-slate-400">ยอดสุทธิ</p>
        </div>
      </div>

      {/* 🟢 ส่วนที่ฟลุ๊คต้องการ: รายการขยะแยกชิ้น */}
      <div className="space-y-3 pt-3 border-t border-dashed border-slate-100">
        {t.items.map((item: any, iIdx: number) => (
          <div key={iIdx} className="flex justify-between items-center text-sm">
            <div className="flex flex-col">
              <span className="font-black text-slate-700">{item.name}</span>
              <span className="text-[10px] text-slate-400 font-bold">
                {item.amount} {item.unit} × {item.price} ฿
              </span>
            </div>
            <span className="font-bold text-slate-600">{item.subTotal.toLocaleString()} ฿</span>
          </div>
        ))}
      </div>

      {/* ยอดเงิน ก่อน-หลัง (Timeline ที่เราเพิ่มไว้ใน Service) */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        <span>เงินเดิม: {t.balanceBefore?.toLocaleString() || 0} ฿</span>
        <span className="text-emerald-500">เงินรวม: {t.balanceAfter?.toLocaleString() || t.totalAmount} ฿</span>
      </div>
    </div>
  </div>
))}
      </div>
    </div>
  );
}