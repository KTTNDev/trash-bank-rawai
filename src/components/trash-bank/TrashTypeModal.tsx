'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
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

  // ถ้ามีการส่งข้อมูลมาแก้ไข ให้เอาข้อมูลมาใส่ในฟอร์ม
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
        await addTrashType(formData);
      }
      onSuccess(); // โหลดข้อมูลใหม่
      onClose();   // ปิดหน้าต่าง
    } catch (error: any) {
  console.error("Firebase Error:", error); // 👈 เพิ่มบรรทัดนี้เพื่อดู Error ใน F12
  alert('เกิดข้อผิดพลาด: ' + error.message); // 👈 ให้มันบอกเลยว่าผิดตรงไหน
}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-emerald-50/50">
          <h2 className="text-xl font-black text-slate-800">
            {editData?.id ? '📝 แก้ไขข้อมูลขยะ' : '✨ เพิ่มประเภทขยะใหม่'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ชื่อประเภทขยะ</label>
            <input 
              required
              type="text"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
              placeholder="เช่น พลาสติกใส, กระป๋องอลูมิเนียม"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ราคา (บาท)</label>
              <input 
                required
                type="number"
                step="0.01"
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({...formData, pricePerUnit: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">หน่วยเรียก</label>
              <select 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
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

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">หมวดหมู่</label>
            <select 
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="ขยะรีไซเคิล">ขยะรีไซเคิล</option>
              <option value="ขยะอิเล็กทรอนิกส์">ขยะอิเล็กทรอนิกส์</option>
              <option value="ของเก่าอื่นๆ">ของเก่าอื่นๆ</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox"
              id="isActive"
              className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-600 cursor-pointer">เปิดรับซื้อรายการนี้</label>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-5 h-5" /> บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}