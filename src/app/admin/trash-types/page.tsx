'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Recycle, Save, X, Trash2 } from 'lucide-react';
import { getTrashTypes, updateTrashType, addTrashType } from '@/lib/trash-service'; // เดี๋ยวจารย์เพิ่มฟังก์ชันพวกนี้ให้ใน Service ครับ
import { TrashType } from '@/types/trashBank';
import TrashTypeModal from '@/components/trash-bank/TrashTypeModal';

export default function TrashTypeManagement() {
  const [types, setTypes] = useState<TrashType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<TrashType | null>(null);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลมาแสดงผล
  const loadTypes = async () => {
    setLoading(true);
    const data = await getTrashTypes();
    setTypes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleOpenModal = (type?: TrashType) => {
    setEditingType(type || { name: '', category: 'ขยะรีไซเคิล', pricePerUnit: 0, unit: 'กก.', isActive: true });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header ส่วนหัว */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">📦 จัดการประเภทขยะ</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">ตั้งค่าราคากลางสำหรับเทศบาลตำบลราไวย์</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> เพิ่มประเภทขยะ
          </button>
        </div>

        {/* ตาราง/การ์ดแสดงรายการ */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold">กำลังโหลดราคากลาง...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {types.map((type) => (
              <div key={type.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Recycle className="w-8 h-8" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${type.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {type.isActive ? '🟢 เปิดรับ' : '🔴 ปิดรับ'}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-1">{type.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{type.category}</p>
                
                <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ราคาต่อหน่วย</p>
                    <p className="text-2xl font-black text-emerald-600">
                      {type.pricePerUnit.toLocaleString()} <span className="text-sm text-slate-400">บาท/{type.unit}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => handleOpenModal(type)}
                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
<TrashTypeModal 
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={loadTypes}
  editData={editingType}
/>
      {/* เดี๋ยวสเต็ปหน้าเรามาทำ Modal Form สำหรับเพิ่ม/แก้ไขกันครับ */}
    </div>
  );
}