'use client';

import React, { useEffect, useState } from 'react';
import { 
  BadgeDollarSign, Plus, Search, Edit2, Trash2, 
  ArrowLeft, Tag, Info, Power, PowerOff, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// 🟢 ปรับ Path ให้คลีนขึ้นและเรียกใช้ deleteTrashType
import { getTrashTypes, deleteTrashType } from '@/lib/trash-service'; 
import { TrashType } from '@/types/trashBank';
import TrashTypeModal from '@/components/trash-bank/TrashTypeModal';

export default function TrashPriceManagementPage() {
  const router = useRouter();
  const [trashTypes, setTrashTypes] = useState<TrashType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TrashType | null>(null);

  // 🟢 ฟังก์ชันโหลดข้อมูลใหม่
  const loadTrashTypes = async () => {
    setLoading(true);
    try {
      const data = await getTrashTypes();
      setTrashTypes(data);
    } catch (error) {
      console.error("Load Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrashTypes();
  }, []);

  // 🟢 ฟังก์ชันจัดการการลบ (เพิ่มเข้าไปใหม่) [cite: 2026-02-25]
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`⚠️ ยืนยันการลบประเภทขยะ "${name}"?\nการลบนี้จะไม่สามารถย้อนคืนได้`)) {
      try {
        await deleteTrashType(id);
        alert('ลบข้อมูลเรียบร้อยแล้ว');
        loadTrashTypes(); // โหลดข้อมูลใหม่ทันที
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  const handleEdit = (type: TrashType) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedType(null);
    setIsModalOpen(true);
  };

  const filteredTypes = trashTypes.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      
      {/* 1. Header & Actions */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin/dashboard')} className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <BadgeDollarSign className="text-emerald-500 w-6 h-6" /> จัดการราคารับซื้อขยะ
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ปรับเปลี่ยนราคากลางตามประกาศล่าสุด</p>
            </div>
          </div>

          <button 
            onClick={handleAdd} 
            className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-[1.5rem] font-black text-sm flex items-center gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> เพิ่มประเภทขยะใหม่
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        
        {/* 2. Search Bar Design */}
        <div className="relative max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อขยะ หรือ หมวดหมู่..."
            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 3. Trash Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <p className="font-black text-slate-300 uppercase tracking-widest text-xs">กำลังดึงข้อมูลราคากลาง...</p>
            </div>
          ) : filteredTypes.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <p className="font-bold text-slate-400 italic text-lg">ไม่พบข้อมูลประเภทขยะที่ค้นหา</p>
            </div>
          ) : (
            filteredTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 group hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-5 rounded-3xl transition-colors ${type.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Tag className="w-8 h-8" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(type)}
                      className="p-3 bg-slate-50 hover:bg-blue-50 rounded-2xl text-slate-300 hover:text-blue-500 transition-all shadow-sm"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(type.id!, type.name)} // 🟢 ปุ่มลบใช้งานได้แล้ว
                      className="p-3 bg-slate-50 hover:bg-rose-50 rounded-2xl text-slate-300 hover:text-rose-500 transition-all shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{type.category}</p>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{type.name}</h3>
                </div>

                <div className="flex items-end justify-between bg-slate-50/50 p-8 rounded-[2rem] border border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ราคารับซื้อ</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-emerald-600 tracking-tighter">฿{type.pricePerUnit.toLocaleString()}</span>
                      <span className="text-sm font-bold text-slate-400">/ {type.unit}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${type.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-500'}`}>
                    {type.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                    {type.isActive ? 'Active' : 'Disabled'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Information Note */}
        <div className="bg-blue-600 p-8 rounded-[3rem] text-white flex gap-6 items-center shadow-2xl shadow-blue-200 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
             <Info className="w-32 h-32" />
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0">
            <Info className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold leading-relaxed relative z-10">
            <span className="block font-black uppercase tracking-[0.2em] mb-2 text-blue-200 text-xs">ระเบียบการแก้ไขราคา:</span>
            การเปลี่ยนแปลงราคาจะมีผลเฉพาะรายการฝากใหม่เท่านั้น ข้อมูลในอดีตจะถูกคงไว้เพื่อความโปร่งใสของบัญชีสมาชิกตามมาตรฐานธนาคารขยะดิจิทัล
          </p>
        </div>
      </div>

      <TrashTypeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadTrashTypes}
        editData={selectedType}
      />
    </div>
  );
}