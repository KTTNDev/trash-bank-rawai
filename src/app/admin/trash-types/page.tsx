'use client';

import React, { useEffect, useState } from 'react';
import { 
  BadgeDollarSign, Plus, Search, Edit2, Trash2, 
  ArrowLeft, Tag, Info, Power, PowerOff
} from 'lucide-react';
import TrashTypeModal from '../../../components/trash-bank/TrashTypeModal';

import { useRouter } from 'next/navigation';
import { getTrashTypes, deleteTrashType } from '@/lib/trash-service';
import { TrashType } from '@/types/trashBank';

export default function TrashPriceManagementPage() {
  const router = useRouter();
  const [trashTypes, setTrashTypes] = useState<TrashType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTrashTypes = async () => {
    setLoading(true);
    const data = await getTrashTypes();
    setTrashTypes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTrashTypes();
  }, []);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedType, setSelectedType] = useState<TrashType | null>(null);

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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      
      {/* 1. Header & Quick Action */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BadgeDollarSign className="text-emerald-500 w-6 h-6" /> จัดการราคารับซื้อขยะ
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ปรับเปลี่ยนราคากลางตามประกาศล่าสุด</p>
            </div>
          </div>

  <button onClick={handleAdd} className="...">
  <Plus className="w-5 h-5" /> เพิ่มประเภทขยะใหม่
</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* 2. Search & Categories Filter */}
        <div className="relative max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อขยะ หรือ หมวดหมู่..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 font-bold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 3. Trash Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center font-black text-slate-300 animate-pulse">กำลังดึงข้อมูลราคาขยะ...</div>
          ) : filteredTypes.length === 0 ? (
            <div className="col-span-full py-20 text-center font-bold text-slate-400 italic">ไม่พบข้อมูลประเภทขยะ</div>
          ) : (
            filteredTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 group hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${type.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-blue-500 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{type.category}</p>
                  <h3 className="text-xl font-black text-slate-800">{type.name}</h3>
                </div>

                <div className="flex items-end justify-between bg-slate-50 p-6 rounded-3xl">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">ราคารับซื้อปัจจุบัน</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-emerald-600">฿{type.pricePerUnit}</span>
                      <span className="text-xs font-bold text-slate-400">/ {type.unit}</span>
                    </div>
                  </div>
                  <button onClick={() => handleEdit(type)} className="...">
  <Edit2 className="w-4 h-4" />
</button>
                  {/* Status Toggle Badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${type.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {type.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                    {type.isActive ? 'Active' : 'Disabled'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Pro Tip Note */}
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4 items-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
            <Info className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-blue-700 leading-relaxed">
            <span className="block font-black uppercase tracking-widest mb-1 text-[10px]">คำแนะนำจากระบบ:</span>
            การเปลี่ยนแปลงราคาจะมีผลทันทีต่อรายการฝากใหม่หลังจากนี้ แต่จะไม่ส่งผลกระทบต่อรายการที่บันทึกไปแล้วในอดีตเพื่อรักษาความถูกต้องของบัญชีสมาชิก
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