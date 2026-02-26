'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Wallet, History, Leaf, ArrowLeft, Recycle, TrendingUp, 
  ChevronRight, Hash, Clock, ArrowUpRight 
} from 'lucide-react';
import { findMember, getMemberTransactions } from '@/lib/trash-service';
import { TrashMember } from '@/types/trashBank';

export default function MemberDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<TrashMember | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const brandGradient = "linear-gradient(90deg, hsla(160, 50%, 51%, 1) 0%, hsla(247, 60%, 21%, 1) 100%)";

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

  // 🟢 1. Skeleton Loading State [cite: 2026-02-26]
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-slate-900 overflow-x-hidden">
      
      {/* 🟢 2. Compact Digital Header [cite: 2026-02-26] */}
      <div className="pt-8 pb-32 px-4 md:px-6 rounded-b-[3rem] relative overflow-hidden shadow-2xl" style={{ background: brandGradient }}>
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Recycle className="w-64 h-64" /></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => router.push('/member/login')} className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-emerald-400/20 px-3 py-1 rounded-full text-emerald-100 text-[10px] font-black uppercase tracking-widest border border-emerald-400/30">
              Live Account
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl md:text-3xl font-black text-white">{member?.name}</h1>
            <p className="text-emerald-100/60 font-mono text-[10px] md:text-xs tracking-[0.2em]">
              ID: {member?.nationalId.slice(0,1)}-XXXX-XXXXX-{member?.nationalId.slice(-2)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-16 space-y-4 md:space-y-6 relative z-20">
        
        {/* 🟢 3. Wallet Balance Card (Responsive Text) [cite: 2026-02-26] */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-white flex items-center justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform"><Wallet className="w-32 h-32" /></div>
          <div className="space-y-1 md:space-y-2 relative z-10">
            <p className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2">
               <Wallet className="w-3 h-3 text-emerald-500" /> ยอดเงินสะสมรวม
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tabular-nums">
              {member?.totalBalance.toLocaleString()} <span className="text-lg md:text-2xl text-emerald-600 ml-1">฿</span>
            </h2>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 rotate-3 group-hover:rotate-0 transition-transform relative z-10 shrink-0">
             <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
          </div>
        </div>

        {/* 🟢 4. Quick Stats (Compact Grid) [cite: 2026-02-26] */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <StatMiniCard icon={<Leaf className="text-emerald-500 w-4 h-4 md:w-5 md:h-5" />} label="ฝากสะสม" value={`${transactions.length} ครั้ง`} />
          <StatMiniCard icon={<ArrowUpRight className="text-blue-500 w-4 h-4 md:w-5 md:h-5" />} label="คุณภาพขยะ" value="ดีเยี่ยม" />
        </div>

        {/* 🟢 5. Detailed History Timeline (Mobile Optimized) [cite: 2026-02-26] */}
        <div className="bg-white rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base md:text-xl font-black text-slate-800 flex items-center gap-3">
              <History className="text-emerald-500 w-5 h-5 md:w-6 md:h-6" /> ประวัติรายการ
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Last 50 Records</span>
          </div>

          <div className="space-y-8">
            {transactions.length === 0 ? (
              <div className="text-center py-16 opacity-30 italic font-bold text-sm">ยังไม่มีประวัติการฝากขยะ...</div>
            ) : (
              transactions.map((t, idx) => (
                <div key={idx} className="flex gap-4 md:gap-6 relative group">
                  {/* Timeline Line */}
                  {idx !== transactions.length - 1 && <div className="absolute left-[19px] md:left-[23px] top-12 bottom-[-32px] w-0.5 bg-slate-100" />}
                  
                  {/* Date Badge */}
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl flex flex-col items-center justify-center shrink-0 z-10 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                    <span className="text-emerald-600 font-black text-xs md:text-sm leading-none">{new Date(t.timestamp?.seconds * 1000).getDate()}</span>
                    <span className="text-[10px] md:text-[10px] font-bold text-slate-400 uppercase">{new Date(t.timestamp?.seconds * 1000).toLocaleDateString('th-TH', { month: 'short' })}</span>
                  </div>

                  {/* Transaction Content [cite: 2026-02-26] */}
                  <div className="flex-1 bg-slate-50/50 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 border border-slate-50 group-hover:bg-white group-hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-0.5">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 flex items-center gap-1">
                          <Hash className="w-2.5 h-2.5" /> {t.id?.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[8px] md:text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(t.timestamp?.seconds * 1000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base md:text-2xl font-black text-emerald-600">+{t.totalAmount.toLocaleString()} ฿</p>
                      </div>
                    </div>

                    {/* รายการแยกย่อย (Compact on Mobile) [cite: 2026-02-26] */}
                    <div className="space-y-2 py-3 border-y border-dashed border-slate-200">
                      {t.items.map((item: any, iIdx: number) => (
                        <div key={iIdx} className="flex justify-between items-center text-[15px] md:text-xs font-bold">
                          <div className="text-slate-600 flex flex-col md:flex-row md:gap-2">
                             <span>{item.name}</span>
                             <span className="text-slate-400 font-medium md:before:content-['|'] md:before:mr-2">
                               {item.amount} {item.unit}
                             </span>
                          </div>
                          <span className="text-slate-800 tabular-nums">{item.subTotal.toLocaleString()} ฿</span>
                        </div>
                      ))}
                    </div>

                    {/* Balance Audit Trail [cite: 2026-02-26] */}
                    <div className="mt-3 flex justify-between items-center text-[13px] md:text-[14px] font-black uppercase tracking-tighter">
                      <span className="text-slate-400">เงินตั้งต้น: {t.balanceBefore?.toLocaleString() || 0} ฿</span>
                      <div className="flex items-center gap-1 text-emerald-500">
                         <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                         รวมสุทธิ: {t.balanceAfter?.toLocaleString() || t.totalAmount} ฿
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Powered by Rawai Digital Trash Bank Protocol</p>
    </div>
  );
}

// 🟢 6. Helper Components & Skeletons [cite: 2026-02-26]

function StatMiniCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4 transition-all active:scale-95">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-[px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm md:text-lg font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 animate-pulse">
      <div className="h-64 bg-slate-200 rounded-b-[3rem]" />
      <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-6">
        <div className="h-32 bg-white rounded-[2.5rem] shadow-xl" />
        <div className="grid grid-cols-2 gap-4"><div className="h-24 bg-white rounded-[1.5rem]" /><div className="h-24 bg-white rounded-[1.5rem]" /></div>
        <div className="h-96 bg-white rounded-[2.5rem]" />
      </div>
    </div>
  );
}