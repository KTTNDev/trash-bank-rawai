'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Recycle, Plus, Trash2, Save, 
  User, CreditCard, ArrowLeft, Loader2, Scale 
} from 'lucide-react';
import { findMember, getTrashTypes, saveDeposit } from '@/lib/trash-service';
import { TrashMember, TrashType, TransactionItem } from '@/types/trashBank';

export default function StaffRecordPage() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState('');
  const [member, setMember] = useState<TrashMember | null>(null);
  const [trashTypes, setTrashTypes] = useState<TrashType[]>([]);
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getTrashTypes().then(setTrashTypes);
  }, []);

  const handleSearchMember = async () => {
    if (nationalId.length !== 13) return alert('กรุณากรอกเลขบัตรให้ครบ 13 หลัก');
    setSearching(true);
    const result = await findMember(nationalId);
    if (result) {
      setMember(result);
    } else {
      alert('ไม่พบข้อมูลสมาชิกในระบบราไวย์');
    }
    setSearching(false);
  };

  const addToCart = (type: TrashType) => {
    const existing = cart.find(item => item.typeId === type.id);
    if (existing) return;
    
    setCart([...cart, {
      typeId: type.id || '',
      name: type.name,
      price: type.pricePerUnit,
      unit: type.unit, 
      amount: 0,
      subTotal: 0
    }]);
  };

  const updateAmount = (index: number, value: string) => {
    const newCart = [...cart];
    // 🟢 แก้ปัญหา NaN: ถ้าช่องว่างให้เป็น 0 ถ้ามีเลขให้แปลงเป็น Float
    const amount = value === "" ? 0 : parseFloat(value);
    newCart[index].amount = amount;
    newCart[index].subTotal = amount * newCart[index].price;
    setCart(newCart);
  };

  const handleSave = async () => {
    if (!member || cart.length === 0) return alert('กรุณาเลือกสมาชิกและรายการขยะ');
    if (cart.some(item => item.amount <= 0)) return alert('กรุณาระบุน้ำหนัก/จำนวนให้ถูกต้อง');

    setLoading(true);
    const totalAmount = cart.reduce((sum, item) => sum + item.subTotal, 0);
    
    try {
      await saveDeposit({
        memberId: member.nationalId,
        items: cart,
        totalAmount: totalAmount,
        staffId: 'STAFF_01', 
        balanceBefore: member.totalBalance || 0,
        balanceAfter: (member.totalBalance || 0) + totalAmount
      });
      alert('✅ บันทึกสำเร็จ! ยอดเงินถูกสะสมเข้าบัญชีเรียบร้อย');
      setMember(null);
      setCart([]);
      setNationalId('');
    } catch (e) {
      alert('❌ เกิดข้อผิดพลาด: ' + e);
    }
    setLoading(false);
  };

  const totalBill = cart.reduce((sum, item) => sum + item.subTotal, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <ArrowLeft />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Scale className="text-emerald-500 w-6 h-6" /> บันทึกรายการฝากขยะ
            </h1>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest">
            Staff Session: Active
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Member & Trash Selection */}
        <div className="lg:col-span-2 space-y-8">
          
    {/* 1. ส่วนค้นหาสมาชิก - ปรับให้ Compact ที่สุด [cite: 2026-02-26] */}
<div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
      <User className="w-3.5 h-3.5" /> ข้อมูลผู้มาฝาก
    </h2>
    {member && (
      <button 
        onClick={() => {setMember(null); setNationalId('');}} 
        className="text-[10px] font-black text-rose-500 uppercase hover:underline transition-all"
      >
        เปลี่ยนสมาชิก
      </button>
    )}
  </div>

  {/* แถบค้นหา: ปรับความสูงและขนาดฟอนต์ [cite: 2026-02-26] */}
  {!member ? (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <input 
          type="text" 
          maxLength={13}
          placeholder="เลขบัตร 13 หลัก"
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm md:text-lg tracking-widest placeholder:tracking-normal placeholder:font-medium"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
        />
      </div>
      <button 
        onClick={handleSearchMember}
        disabled={searching}
        className="bg-slate-900 hover:bg-emerald-600 text-white px-5 md:px-8 rounded-xl md:rounded-2xl font-black text-xs transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-slate-200"
      >
        {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        <span className="hidden xs:inline">ค้นหา</span>
      </button>
    </div>
  ) : (
    /* การ์ดสมาชิกหลังค้นหาเจอ: ปรับให้กระทัดรัด [cite: 2026-02-26] */
    <div className="p-3 md:p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between animate-in fade-in zoom-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-lg font-black shadow-md">
          {member.name[0]}
        </div>
        <div className="leading-tight">
          <p className="text-sm md:text-base font-black text-slate-800">{member.name}</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">ID: {member.nationalId}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">ยอดสะสม</p>
        <p className="text-sm md:text-lg font-black text-slate-900">฿{member.totalBalance.toLocaleString()}</p>
      </div>
    </div>
  )}
</div>
          {/* 2. เลือกประเภทขยะ */}
    {/* 2. เลือกประเภทขยะ - ปรับให้กะทัดรัด (Compact Grid) [cite: 2026-02-26] */}
<div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-[15px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Recycle className="w-4 h-4" /> แตะเลือกประเภทขยะ</h2>
            
            {/* Grid Logic: Mobile 2, Tablet 3, Desktop 4 [cite: 2026-02-26] */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {trashTypes.filter(t => t.isActive).map(type => (
                <button 
                  key={type.id} onClick={() => addToCart(type)}
                  className="p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-white hover:shadow-xl transition-all text-left relative group active:scale-95"
                >
                  <p className="font-black text-slate-800 text-sm md:text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">{type.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base md:text-xl font-black text-emerald-600">{type.pricePerUnit}</span>
                    <span className="text-[13px] md:text-[9px] font-bold text-slate-400 uppercase">฿/{type.unit}</span>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"><Plus className="w-4 h-4 text-emerald-500" /></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Receipt-style Cart (Modern Receipt) */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            {/* Receipt Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-lg font-black flex items-center gap-2">
                <CreditCard className="text-emerald-400 w-5 h-5" /> สรุปรายการฝาก
              </h2>
              <Recycle className="w-8 h-8 text-white/10" />
            </div>
            
            <div className="space-y-8 mb-10 min-h-[150px]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                  <Plus className="w-10 h-10 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">ยังไม่มีรายการ...</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-right-2">
                    <div className="flex justify-between items-start">
                      <span className="font-black text-emerald-400 text-sm">{item.name}</span>
                      <button 
                        onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                        className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input 
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-slate-800 border-none rounded-2xl px-5 py-3 text-white font-black text-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          value={item.amount || ''}
                          onChange={(e) => updateAmount(idx, e.target.value)}
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase">
                          {item.unit}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">รวม (฿)</p>
                        <p className="font-black text-white">{item.subTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-800 pt-8 space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest block">ยอดเงินที่จะสะสมเพิ่ม</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-emerald-400 tabular-nums">{totalBill.toLocaleString()}</span>
                    <span className="text-sm font-bold text-emerald-500/50 uppercase">บาท</span>
                  </div>
                </div>
              </div>
              
              <button 
                disabled={loading || cart.length === 0 || !member}
                onClick={handleSave}
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-900 rounded-[2.5rem] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 group"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                {loading ? 'กำลังบันทึก...' : 'ยืนยันและออกสลิป'}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
            Rawai Digital Trash Bank Protocol v1.0
          </p>
        </div>

      </div>
    </div>
  );
}