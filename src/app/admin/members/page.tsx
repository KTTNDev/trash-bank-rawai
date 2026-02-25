'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Phone, CreditCard, Edit3 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { TrashMember } from '@/types/trashBank';
import MemberModal from '@/components/trash-bank/MemberModal';

export default function MemberManagement() {
  const [members, setMembers] = useState<TrashMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'members'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => doc.data() as TrashMember);
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // กรองรายชื่อสมาชิกตามช่องค้นหา (ค้นจากชื่อหรือเลขบัตรประชาชน)
  const filteredMembers = members.filter(m => 
    m.name.includes(searchTerm) || m.nationalId.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">👥 สมาชิกธนาคารขยะ</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">ทะเบียนชาวบ้านผู้ร่วมโครงการราไวย์สีเขียว</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <UserPlus className="w-5 h-5" /> ลงทะเบียนสมาชิกใหม่
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="ค้นหาด้วยชื่อ หรือ เลขบัตรประชาชน 13 หลัก..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Member Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold italic">กำลังเปิดสมุดทะเบียนสมาชิก...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.nationalId} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                    {member.name[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 leading-tight">{member.name}</h3>
                    <div className="flex items-center gap-1 text-slate-400">
                      <CreditCard className="w-3 h-3" />
                      <span className="text-[10px] font-mono tracking-tighter">{member.nationalId}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เงินสะสมคงเหลือ</span>
                    <span className="text-xl font-black text-emerald-600">{member.totalBalance.toLocaleString()} ฿</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3 h-3" />
                    <span className="text-xs font-bold">{member.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadMembers}
      />
    </div>
  );
}