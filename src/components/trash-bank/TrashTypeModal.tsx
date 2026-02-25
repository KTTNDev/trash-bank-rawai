'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Tag, DollarSign, Package, Layers, Power } from 'lucide-react';
import { TrashType } from '@/types/trashBank';
import { addTrashType, updateTrashType } from '@/lib/trash-service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: TrashType | null;
}

export default function TrashTypeModal({ isOpen, onClose, onSuccess, editData }: Props) {
  const [formData, setFormData] = useState<TrashType>({
    name: '',
    category: 'ขยะรีไซเคิล',
    pricePerUnit: 0,
    unit: 'กก.',
    isActive: true
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ name: '', category: 'ขยะรีไซเคิล', pricePerUnit: 0, unit: 'กก.', isActive: true });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editData?.id) {
        await updateTrashType(editData.id, formData);
      } else {
        const { id, ...cleanData } = formData;
        await addTrashType(cleanData as any); 
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Firebase Save Error:", error);
      alert('เกิดข้อผิดพลาด: ' + (error.message || 'ตรวจสอบระบบอีกครั้ง'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header: ดีไซน์แบบ Modern Emerald */}
        <div className="relative p-8 bg-emerald-600 text-white overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-10">
            <Package className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {editData?.id ? 'แก้ไขข้อมูลขยะ' : 'เพิ่มประเภทขยะใหม่'}
              </h2>
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
                Trash Type Configuration System
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          
          {/* ชื่อประเภทขยะ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ชื่อประเภทขยะ</label>
            <div className="relative">
              <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                required
                type="text"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                placeholder="เช่น พลาสติกใส, กระป๋องอลูมิเนียม"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* ราคาต่อหน่วย */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ราคา (บาท)</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input 
                  required
                  type="number"
                  step="0.01"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-xl"
                  value={formData.pricePerUnit || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({...formData, pricePerUnit: val === "" ? 0 : parseFloat(val)})
                  }}
                />
              </div>
            </div>

            {/* หน่วยเรียก */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">หน่วยเรียก</label>
              <div className="relative">
                <Package className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="กก.">กก.</option>
                  <option value="ชิ้น">ชิ้น</option>
                  <option value="เครื่อง">เครื่อง</option>
                  <option value="ขวด">ขวด</option>
                </select>
              </div>
            </div>
          </div>

          {/* หมวดหมู่ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">หมวดหมู่ขยะ</label>
            <div className="relative">
              <Layers className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <select 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="ขยะรีไซเคิล">ขยะรีไซเคิล</option>
                <option value="ขยะอิเล็กทรอนิกส์">ขยะอิเล็กทรอนิกส์</option>
                <option value="ของเก่าอื่นๆ">ของเก่าอื่นๆ</option>
              </select>
            </div>
          </div>

          {/* สวิตช์เปิด/ปิดสถานะ */}
          <div 
            onClick={() => setFormData({...formData, isActive: !formData.isActive})}
            className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              formData.isActive 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
              : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${formData.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                <Power className="w-4 h-4" />
              </div>
              <span className="font-black text-sm uppercase tracking-widest">สถานะการรับซื้อ</span>
            </div>
            <span className="font-black text-xs">{formData.isActive ? 'เปิดรับซื้อ' : 'ปิดชั่วคราว'}</span>
          </div>

          {/* ปุ่มบันทึก */}
          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 mt-4 group"
          >
            <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {editData?.id ? 'อัปเดตข้อมูลราคา' : 'เพิ่มรายการใหม่'}
          </button>
        </form>
      </div>
    </div>
  );
}