'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Phone, CreditCard, ArrowLeft, 
  Loader2, Users, ChevronRight, Wallet, ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMembers } from '@/lib/trash-service'; 
import { TrashMember } from '@/types/trashBank';
import MemberModal from '@/components/trash-bank/MemberModal';

export default function MemberManagement() {
  const router = useRouter();
  const [members, setMembers] = useState<TrashMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🟢 1. เพิ่ม State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // แสดงหน้าละ 6 คน (ลงตัวกับ Grid 2 และ 3 คอลัมน์)

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // 🟢 2. กรองข้อมูล และ Reset หน้าเมื่อมีการค้นหา
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.nationalId.includes(searchTerm)
  );

  useEffect(() => {
    setCurrentPage(1); // กลับไปหน้า 1 ทุกครั้งที่พิมพ์ค้นหา
  }, [searchTerm]);

  // 🟢 3. คำนวณการแบ่งหน้า
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      
      {/* Header & Nav */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => router.push('/admin/dashboard')} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-all font-bold text-sm">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">แดชบอร์ด</span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
            <h1 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
              <Users className="text-emerald-500 w-5 h-5" /> ทะเบียนสมาชิก
            </h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 hover:bg-emerald-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs flex items-center gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95">
            <UserPlus className="w-4 h-4 md:w-5 md:h-5" /> ลงทะเบียนใหม่
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* Stats & Search Bar */}
        <div className="grid grid-cols-2 gap-3 md:gap-6">
           <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">สมาชิกทั้งหมด</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900">{filteredMembers.length} <span className="text-xs text-slate-400">ราย</span></p>
           </div>
           <div className="bg-emerald-500 p-5 md:p-6 rounded-[2rem] shadow-lg shadow-emerald-100 text-white">
              <p className="text-[8px] md:text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">ยอดเงินรวมในหน้านี้</p>
              <p className="text-2xl md:text-3xl font-black">฿{currentItems.reduce((acc, m) => acc + (m.totalBalance || 0), 0).toLocaleString()}</p>
           </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
          <input 
            type="text" placeholder="ค้นหาชื่อ หรือ เลขบัตรประชาชน..." 
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-sm md:text-base"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Member Grid (Bento Style) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">กำลังดึงฐานข้อมูลชาวบ้าน...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 min-h-[400px]">
              {currentItems.map((member) => (
                <div key={member.nationalId} className="bg-white p-5 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 text-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center font-black text-xl md:text-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                      {member.name[0]}
                    </div>
                    <div className="min-w-0 w-full">
                      <h3 className="font-black text-slate-800 text-sm md:text-xl leading-tight truncate">{member.name}</h3>
                      <p className="text-[9px] md:text-[10px] font-mono font-bold text-slate-400 mt-1 tracking-wider">{member.nationalId}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
                      <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">ยอดเงินคงเหลือ</span>
                      <p className="text-lg md:text-2xl font-black text-emerald-600">฿{member.totalBalance?.toLocaleString()}</p>
                    </div>
                    <button onClick={() => router.push(`/member/${member.nationalId}`)} className="w-full py-3 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all flex items-center justify-center gap-2">
                      ดูประวัติ <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🟢 4. Pagination Controls: ส่วนปุ่มเปลี่ยนหน้า */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-10">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm font-black text-sm text-slate-400">
                  <span className="text-emerald-600">{currentPage}</span>
                  <span className="mx-1">/</span>
                  <span>{totalPages}</span>
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
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