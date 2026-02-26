'use client';

import React, { useEffect, useState } from 'react';
import { 
  Megaphone, Plus, Search, Edit2, Trash2, 
  ArrowLeft, Calendar, MapPin, Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAnnouncements, deleteAnnouncement } from '@/lib/trash-service';
import AnnouncementModal from '@/components/admin/AnnouncementModal'; // เดี๋ยวเราจะสร้างไฟล์นี้ครับ

export default function PRManagementPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getAnnouncements();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันการลบตารางงานนี้?')) {
      await deleteAnnouncement(id);
      loadData();
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/admin/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ArrowLeft /></button>
            <h1 className="text-xl font-black flex items-center gap-2">
              <Megaphone className="text-amber-500 w-6 h-6" /> จัดการข่าวสารและตารางงาน
            </h1>
          </div>
          <button 
            onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
            className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> เพิ่มประกาศ
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-slate-300" /></div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 font-bold text-slate-400 italic">ยังไม่มีข้อมูลตารางงาน</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-blue-50 text-slate-300 hover:text-blue-500 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{item.title}</h3>
                <div className="space-y-2 mb-6 text-sm font-bold">
                   <div className="flex items-center gap-2 text-emerald-600"><Calendar className="w-3 h-3" /> {item.date}</div>
                   <div className="flex items-center gap-2 text-slate-400"><MapPin className="w-3 h-3" /> {item.location}</div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadData}
        editData={selectedItem}
      />
    </div>
  );
}