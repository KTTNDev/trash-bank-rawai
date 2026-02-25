export interface TrashType {
  id?: string;
  name: string;          // เช่น "พลาสติกใส", "ทีวีเก่า"
  category: string;      // เช่น "ขยะรีไซเคิล", "ขยะอิเล็กทรอนิกส์"
  pricePerUnit: number;  // ราคาต่อหน่วย (บาท)
  unit: string;          // หน่วย เช่น "กก.", "เครื่อง"
  isActive: boolean;     // เปิด/ปิดการรับฝาก
}

export interface TrashMember {
  nationalId: string;    // เลขบัตรประชาชน (ใช้เป็น Doc ID)
  name: string;
  phone: string;
  totalBalance: number;  // ยอดเงินสะสม
  updatedAt: any;
  createdAt: any;
}
export interface TransactionItem {
  typeId: string;
  name: string;
  price: number;
  amount: number;
  unit: string;    // 👈 เพิ่มบรรทัดนี้ครับ
  subTotal: number;
}

export interface TrashTransaction {
  id?: string;
  memberId: string;
  items: TransactionItem[];
  totalAmount: number;
  balanceBefore: number; // 👈 เพิ่มไว้เก็บประวัติยอดเงินก่อนฝาก
  balanceAfter: number;  // 👈 เพิ่มไว้เก็บประวัติยอดเงินหลังฝาก
  staffId: string;
  timestamp: any;
}