'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Type, AlignLeft } from 'lucide-react';
import { addAnnouncement, updateAnnouncement } from '@/lib/trash-service';

export default function AnnouncementModal({ isOpen, onClose, onSuccess, editData }: any) {
  const [form, setForm] = useState({ title: '', date: '', location: '', details: '' });

  useEffect(() => {
    if (editData) setForm(editData);
    else setForm({ title: '', date: '', location: '', details: '' });
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editData?.id) await updateAnnouncement(editData.id, form);
    else await addAnnouncement(form);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 bg-amber-500 text-white flex justify-between items-center">
          <h2 className="text-2xl font-black">{editData ? 'แก้ไขประกาศ' : 'เพิ่มประกาศใหม่'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หัวข้อประกาศ</label>
            <div className="relative"><Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input required className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" 
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="เช่น จุดรับฝากขยะหมู่ 1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">วัน/เวลา</label>
              <div className="relative"><Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input required className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" 
                  value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="28 ก.พ. 69" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สถานที่</label>
              <div className="relative"><MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input required className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" 
                  value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="หน้าวัดหนองพง" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รายละเอียดเพิ่มเติม</label>
            <div className="relative"><AlignLeft className="absolute left-5 top-5 w-5 h-5 text-slate-300" />
              <textarea rows={3} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" 
                value={form.details} onChange={e => setForm({...form, details: e.target.value})} placeholder="รายละเอียดเวลาทำการ..." />
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 mt-4">
            <Save className="w-5 h-5" /> บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}