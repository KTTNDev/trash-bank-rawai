'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Recycle, 
  Users, 
  Wallet, 
  BarChart3, 
  ArrowRight, 
  Leaf, 
  ShieldCheck 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      
      {/* 1. Hero Section - ส่วนต้อนรับ */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Leaf className="w-4 h-4" /> Rawai Smart City Project
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
            ธนาคารขยะดิจิทัล <br/>
            <span className="text-emerald-600 italic">ตำบลราไวย์</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed mb-10">
            เปลี่ยนขยะให้เป็นสวัสดิการ ร่วมสร้างชุมชนสีเขียวด้วยเทคโนโลยีที่ทันสมัย 
            โปร่งใส และตรวจสอบได้จริงผ่านระบบดิจิทัล
          </p>
        </div>
      </section>

      {/* 2. Entrance Cards - ทางเข้าหลักแยกตาม Role */}
      <section className="max-w-6xl mx-auto px-6 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* สำหรับชาวบ้าน */}
          <Link href="/member/login" className="group">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-50 hover:border-emerald-500 transition-all hover:-translate-y-2 h-full">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">ประชาชน</h3>
              <p className="text-slate-500 font-medium mb-8">ตรวจสอบยอดเงินสะสม และดูประวัติการฝากขยะผ่านสมุดบัญชีดิจิทัล</p>
              <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-xs tracking-widest">
                เข้าสู่ระบบสมาชิก <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* สำหรับเจ้าหน้าที่จุดรับฝาก */}
          <Link href="/staff/record" className="group">
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl hover:-translate-y-2 transition-all h-full">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform">
                <Recycle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">จุดรับฝากขยะ</h3>
              <p className="text-slate-400 font-medium mb-8">บันทึกรายการฝากขยะ คำนวณเงิน และลงทะเบียนสมาชิกใหม่ที่หน้างาน</p>
              <div className="flex items-center gap-2 text-blue-400 font-black uppercase text-xs tracking-widest">
                เปิดระบบรับฝาก <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* สำหรับผู้บริหาร/แอดมิน */}
          <div className="space-y-6">
            <Link href="/admin/dashboard" className="block group">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800">สรุปภาพรวม</h4>
                  <p className="text-xs text-slate-400 font-medium">Dashboard สำหรับผู้บริหาร</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/trash-types" className="block group">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800">ตั้งค่าราคากลาง</h4>
                  <p className="text-xs text-slate-400 font-medium">จัดการประเภทและราคาขยะ</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/members" className="block group">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800">จัดการสมาชิก</h4>
                  <p className="text-xs text-slate-400 font-medium">ทะเบียนสมาชิกทั้งหมด</p>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* 3. Footer */}
      <footer className="py-20 text-center">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
          © 2026 Rawai Municipality IT Team
        </p>
      </footer>
    </div>
  );
}