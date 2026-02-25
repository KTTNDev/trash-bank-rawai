'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wallet, History, Leaf, ArrowLeft, Recycle, TrendingUp, ChevronRight, Hash } from 'lucide-react';
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
      const t = await getMemberTransactions(id as string);
      setMember(m);
      setTransactions(t);
      setLoading(false);
    };
    loadData();
  }, [id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-emerald-600 animate-pulse">กำลังเปิดสมุดบัญชีดิจิทัล...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      {/* 1. Modern Gradient Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 pt-16 pb-36 px-6 rounded-b-[4rem] relative overflow-hidden shadow-2xl shadow-emerald-200/50">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Recycle className="w-64 h-64 rotate-12" /></div>
        <div className="max-w-4xl mx-auto relative z-10 flex justify-between items-center">
          <button onClick={() => router.push('/member/login')} className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl text-white transition-all shadow-lg">
            <ArrowLeft />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-white mb-1">{member?.name}</h1>
            <p className="text-emerald-100 font-mono text-xs tracking-widest opacity-80">
              ID: {member?.nationalId.slice(0,1)}-XXXX-XXXXX-{member?.nationalId.slice(-2)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-24 space-y-6 relative z-20">
        {/* 2. Glassmorphism Balance Card */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-xl border border-white flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">ยอดเงินสะสมปัจจุบัน</p>
            <h2 className="text-6xl font-black text-slate-900 leading-none tracking-tight tabular-nums">
              {member?.totalBalance.toLocaleString()} <span className="text-xl text-emerald-600 ml-1">฿</span>
            </h2>
          </div>
          <div className="w-20 h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-emerald-200 rotate-6 group-hover:rotate-0 transition-transform duration-500">
            <Wallet className="w-10 h-10" />
          </div>
        </div>

        {/* 3. Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatMiniCard icon={<Leaf className="text-emerald-500" />} label="จำนวนครั้งที่ฝาก" value={`${transactions.length} ครั้ง`} />
          <StatMiniCard icon={<TrendingUp className="text-blue-500" />} label="สถานะบัญชี" value="ดีเยี่ยม" />
        </div>

        {/* 4. Detailed History List (คงรายละเอียดครบถ้วน) */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <History className="text-emerald-500 w-6 h-6" /> ประวัติรายการโดยละเอียด
          </h3>
          <div className="space-y-10">
            {transactions.length === 0 ? (
              <p className="text-center py-10 text-slate-400 font-bold italic">ยังไม่มีประวัติการฝากขยะในขณะนี้</p>
            ) : (
              transactions.map((t, idx) => (
                <div key={idx} className="flex gap-6 relative">
                  {/* Timeline Line */}
                  {idx !== transactions.length - 1 && <div className="absolute left-[23px] top-12 bottom-[-40px] w-0.5 bg-slate-100"></div>}
                  
                  {/* Date Icon */}
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-inner z-10 group-hover:bg-emerald-50 transition-colors">
                    <span className="text-emerald-600 font-black leading-none">{new Date(t.timestamp?.seconds * 1000).getDate()}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(t.timestamp?.seconds * 1000).toLocaleDateString('th-TH', { month: 'short' })}</span>
                  </div>

                  {/* Transaction Content (The "Detailed Receipt") */}
                  <div className="flex-1 bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Hash className="w-3 h-3" /> {t.id?.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs font-bold text-slate-500">
                          {new Date(t.timestamp?.seconds * 1000).toLocaleTimeString('th-TH')} น.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-emerald-600">+{t.totalAmount.toLocaleString()} ฿</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ยอดรวมบิลนี้</p>
                      </div>
                    </div>

                    {/* รายการแยกย่อย (Detailed Items)/page.tsx] */}
                    <div className="space-y-3 py-4 border-y border-dashed border-slate-200">
                      {t.items.map((item: any, iIdx: number) => (
                        <div key={iIdx} className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-700 text-sm">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              {item.amount} {item.unit} × {item.price} ฿
                            </span>
                          </div>
                          <span className="font-black text-slate-600">{item.subTotal.toLocaleString()} ฿</span>
                        </div>
                      ))}
                    </div>

                    {/* ยอดเงินสะสมที่เปลี่ยนไป (Audit Trail) */}
                    <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-slate-400">เงินเดิม: {t.balanceBefore?.toLocaleString() || 0} ฿</span>
                      <span className="text-emerald-500">รวมปัจจุบัน: {t.balanceAfter?.toLocaleString() || t.totalAmount} ฿</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component สำหรับการ์ดสถิติเล็ก
function StatMiniCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-lg font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}