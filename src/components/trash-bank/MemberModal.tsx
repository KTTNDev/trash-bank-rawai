'use client';

import React, { useState } from 'react';
import { X, UserCheck, Smartphone, Hash } from 'lucide-react';
import { registerMember } from '@/lib/trash-service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MemberModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    nationalId: '',
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nationalId.length !== 13) {
      alert('เลขบัตรประชาชนต้องมี 13 หลักครับ');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerMember(formData);
      onSuccess();
      onClose();
      setFormData({ nationalId: '', name: '', phone: '' });
    } catch (error) {
      alert('เกิดข้อผิดพลาด: เลขบัตรนี้อาจจะลงทะเบียนไว้แล้ว');
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-blue-50/50">
          <h2 className="text-xl font-black text-slate-800 italic">ลงทะเบียนสมาชิกใหม่</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              <Hash className="w-3 h-3" /> เลขบัตรประชาชน (13 หลัก)
            </label>
            <input 
              required
              maxLength={13}
              type="text"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold tracking-widest"
              placeholder="0000000000000"
              value={formData.nationalId}
              onChange={(e) => setFormData({...formData, nationalId: e.target.value.replace(/[^0-9]/g, '')})}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              <UserCheck className="w-3 h-3" /> ชื่อ-นามสกุล
            </label>
            <input 
              required
              type="text"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
              placeholder="ระบุชื่อผู้ใช้งาน"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              <Smartphone className="w-3 h-3" /> เบอร์โทรศัพท์
            </label>
            <input 
              required
              type="tel"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
              placeholder="08X-XXX-XXXX"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'ลงทะเบียนยืนยัน'}
          </button>
        </form>
      </div>
    </div>
  );
}