'use client';

import React, { useState, useEffect } from 'react';
import { Search, Recycle, Plus, Trash2, Save, User, CreditCard } from 'lucide-react';
import { findMember, getTrashTypes, saveDeposit } from '@/lib/trash-service';
import { TrashMember, TrashType, TransactionItem } from '@/types/trashBank';

export default function StaffRecordPage() {
  const [nationalId, setNationalId] = useState('');
  const [member, setMember] = useState<TrashMember | null>(null);
  const [trashTypes, setTrashTypes] = useState<TrashType[]>([]);
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. โหลดประเภทขยะมารอไว้
  useEffect(() => {
    getTrashTypes().then(setTrashTypes);
  }, []);

  // 2. ค้นหาสมาชิก
  const handleSearchMember = async () => {
    if (nationalId.length !== 13) return alert('กรุณากรอกเลขบัตรให้ครบ 13 หลัก');
    setLoading(true);
    const result = await findMember(nationalId);
    if (result) {
      setMember(result);
    } else {
      alert('ไม่พบข้อมูลสมาชิกคนนี้ในระบบ');
    }
    setLoading(false);
  };

  // 3. เพิ่มขยะลงในบิล (Cart)
  const addToCart = (type: TrashType) => {
    const existing = cart.find(item => item.typeId === type.id);
    if (existing) return; // ถ้ามีในบิลแล้วไม่ให้เพิ่มซ้ำ (ให้ไปแก้ตัวเลขเอา)
    
    setCart([...cart, {
      typeId: type.id || '',
      name: type.name,
      price: type.pricePerUnit,
      amount: 0,
      subTotal: 0
    }]);
  };

  // 4. อัปเดตปริมาณขยะและคำนวณเงิน
  const updateAmount = (index: number, amount: number) => {
    const newCart = [...cart];
    newCart[index].amount = amount;
    newCart[index].subTotal = amount * newCart[index].price;
    setCart(newCart);
  };

  // 5. บันทึกธุรกรรม (ใช้ Transaction ของ Firebase ที่เราเขียนไว้)
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
        staffId: 'STAFF_01' // ในอนาคตใช้ ID จากระบบ Login
      });
      alert('บันทึกสำเร็จ! ยอดเงินถูกสะสมเข้าบัญชีเรียบร้อย');
      // ล้างค่าเพื่อรับคนถัดไป
      setMember(null);
      setCart([]);
      setNationalId('');
    } catch (e) {
      alert('เกิดข้อผิดพลาด: ' + e);
    }
    setLoading(false);
  };

  const totalBill = cart.reduce((sum, item) => sum + item.subTotal, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* คอลัมน์ซ้าย: ค้นหาสมาชิก และ เลือกประเภทขยะ */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <User className="text-blue-600" /> ค้นหาสมาชิกผู้มาฝาก
            </h2>
            <div className="flex gap-3">
              <input 
                type="text" 
                maxLength={13}
                placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg tracking-widest"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
              />
              <button 
                onClick={handleSearchMember}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl font-black transition-all"
              >
                <Search />
              </button>
            </div>
            {member && (
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center font-black">{member.name[0]}</div>
                <div>
                  <p className="font-black text-slate-800">{member.name}</p>
                  <p className="text-xs text-blue-600 font-bold">ยอดเงินสะสมปัจจุบัน: {member.totalBalance.toLocaleString()} ฿</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Recycle className="text-emerald-600" /> เลือกประเภทขยะ
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trashTypes.filter(t => t.isActive).map(type => (
                <button 
                  key={type.id}
                  onClick={() => addToCart(type)}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
                >
                  <p className="font-black text-slate-800 group-hover:text-emerald-700">{type.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{type.pricePerUnit} ฿ / {type.unit}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* คอลัมน์ขวา: บิลการฝาก (Cart) */}
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl h-fit sticky top-10">
          <h2 className="text-xl font-black mb-8 flex items-center gap-2">
            <CreditCard className="text-emerald-400" /> รายการฝากวันนี้
          </h2>
          
          <div className="space-y-6 mb-10 min-h-[200px]">
            {cart.length === 0 ? (
              <p className="text-slate-500 italic text-center py-10">ยังไม่มีรายการในบิล...</p>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 pb-4 border-b border-slate-800">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-emerald-400">{item.name}</span>
                    <button onClick={() => setCart(cart.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4 text-rose-500" /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number"
                      placeholder="น้ำหนัก/จำนวน"
                      className="w-full bg-slate-800 border-none rounded-xl px-4 py-2 text-white font-bold"
                      value={item.amount || ''}
                      onChange={(e) => updateAmount(idx, parseFloat(e.target.value))}
                    />
                    <span className="shrink-0 text-sm font-bold text-slate-400">× {item.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">ยอดเงินรวมทั้งสิ้น</span>
              <span className="text-4xl font-black text-emerald-400">{totalBill.toLocaleString()} <span className="text-sm">฿</span></span>
            </div>
            <button 
              disabled={loading || cart.length === 0 || !member}
              onClick={handleSave}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
            >
              <Save /> {loading ? 'กำลังบันทึก...' : 'ยืนยันการฝากขยะ'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}