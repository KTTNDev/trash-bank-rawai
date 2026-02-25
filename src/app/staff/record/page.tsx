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
          
          {/* 1. ค้นหาสมาชิก */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <User className="w-4 h-4" /> ข้อมูลผู้มาฝาก
            </h2>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  maxLength={13}
                  placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none font-black text-lg tracking-[0.1em]"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
              <button 
                onClick={handleSearchMember}
                disabled={searching}
                className="bg-slate-900 hover:bg-emerald-600 text-white px-10 rounded-3xl font-black transition-all flex items-center gap-2"
              >
                {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} ค้นหา
              </button>
            </div>

            {member && (
              <div className="mt-8 p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-200">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-800">{member.name}</p>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-0.5">สมาชิกชุมชนราไวย์</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ยอดเงินคงเหลือ</p>
                  <p className="text-2xl font-black text-slate-900">฿{member.totalBalance.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. เลือกประเภทขยะ */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Recycle className="w-4 h-4" /> ประเภทขยะที่รับฝาก
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trashTypes.filter(t => t.isActive).map(type => (
                <button 
                  key={type.id}
                  onClick={() => addToCart(type)}
                  className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-xl hover:-translate-y-1 transition-all text-left group relative overflow-hidden"
                >
                  <div className="absolute -right-2 -top-2 opacity-5 text-emerald-600">
                    <Recycle className="w-16 h-16 rotate-12" />
                  </div>
                  <p className="font-black text-slate-800 group-hover:text-emerald-700 leading-tight mb-2">{type.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-emerald-600">{type.pricePerUnit}</span>
                    <span className="text-[10px] font-bold text-slate-400 lowercase">฿ / {type.unit}</span>
                  </div>
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