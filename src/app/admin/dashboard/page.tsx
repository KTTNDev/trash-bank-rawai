'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Scale, Banknote, History, BarChart3, TrendingUp, Award } from 'lucide-react';
import { getGlobalStats } from '@/lib/trash-service';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGlobalStats().then(res => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">กำลังประมวลผลสถิติจากฐานข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">ศูนย์สรุปผลข้อมูล</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mt-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" /> Executive Command Center
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-sm font-black text-slate-700 uppercase">Live Data Connected</span>
          </div>
        </div>

        {/* 2. Big Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            icon={<Scale className="w-8 h-8" />} 
            label="ปริมาณขยะสะสม" 
            value={`${stats.totalWeight.toLocaleString()} กก.`} 
            color="bg-emerald-500" 
            sub="น้ำหนักรวมจากทุกประเภท"
          />
          <StatCard 
            icon={<Banknote className="w-8 h-8" />} 
            label="เงินหมุนเวียนรวม" 
            value={`${stats.totalMoney.toLocaleString()} ฿`} 
            color="bg-blue-500" 
            sub="จ่ายคืนสู่ประชาชนชาวราไวย์"
          />
          <StatCard 
            icon={<History className="w-8 h-8" />} 
            label="จำนวนธุรกรรม" 
            value={`${stats.totalTransactions} ครั้ง`} 
            color="bg-amber-500" 
            sub="การฝากขยะทั้งหมดในระบบ"
          />
        </div>

        {/* 3. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* กราฟวงกลม: สัดส่วนประเภทขยะ */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" /> สัดส่วนประเภทขยะที่จัดเก็บได้
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.chartData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* กราฟแท่ง: ปริมาณขยะแยกตามรายการ */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
              <Award className="text-blue-500" /> สรุปน้ำหนักแยกตามประเภท (กก.)
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component สำหรับการ์ดสถิติ
function StatCard({ icon, label, value, color, sub }: any) {
  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 group hover:-translate-y-1 transition-all">
      <div className={`${color} p-5 rounded-[2rem] text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h2 className="text-3xl font-black text-slate-900 leading-none mb-1">{value}</h2>
        <p className="text-xs text-slate-400 font-medium">{sub}</p>
      </div>
    </div>
  );
}