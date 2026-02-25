// src/app/admin/layout.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. ตรวจดูว่ามีบัตรผ่านในเครื่องไหม
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');

    // 2. ถ้าไม่มีบัตร และไม่ได้อยู่ที่หน้า Login -> ให้เด้งกลับไปหน้า Login ทันที
    if (!isLoggedIn && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      // ถ้ามีบัตร หรืออยู่ที่หน้า Login อยู่แล้ว ให้ผ่านได้
      setAuthorized(true);
    }
  }, [pathname, router]);

  // แสดงหน้าจอรอตรวจสอบสิทธิ์ เพื่อความโปร่งใส
  if (!authorized && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-slate-400 animate-pulse">
        🔒 SECURITY CHECKING...
      </div>
    );
  }

  return <>{children}</>;
}