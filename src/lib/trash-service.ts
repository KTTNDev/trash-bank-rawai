// src/lib/trash-service.ts
import { db } from './firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, 
  updateDoc, serverTimestamp, query, orderBy, 
  where, runTransaction, addDoc, limit 
} from 'firebase/firestore';
import { TrashType, TrashMember, TrashTransaction } from '@/types/trashBank';

// --- 1. จัดการสมาชิก (Member Management) ---

// ค้นหาสมาชิกด้วยเลขบัตรประชาชน
export const findMember = async (nationalId: string) => {
  const docRef = doc(db, 'members', nationalId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { ...docSnap.data() } as TrashMember : null;
};

// ลงทะเบียนสมาชิกใหม่
export const registerMember = async (member: Omit<TrashMember, 'totalBalance' | 'createdAt' | 'updatedAt'>) => {
  const memberRef = doc(db, 'members', member.nationalId);
  return await setDoc(memberRef, {
    ...member,
    totalBalance: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

// --- 2. จัดการประเภทขยะ (Trash Type Management) ---

// ดึงรายการขยะและราคา
export const getTrashTypes = async () => {
  const q = query(collection(db, 'trash_types'), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TrashType));
};

// เพิ่มประเภทขยะใหม่
export const addTrashType = async (data: TrashType) => {
  // สร้าง copy ข้อมูลและลบ id ออก (ถ้ามี) เพราะ Firestore จะสร้าง ID ให้เองอัตโนมัติ
  const { id, ...cleanData } = data; 
  return await addDoc(collection(db, 'trash_types'), cleanData);
};
// อัปเดตข้อมูลขยะ
export const updateTrashType = async (id: string, data: Partial<TrashType>) => {
  const docRef = doc(db, 'trash_types', id);
  return await updateDoc(docRef, data);
};

// --- 3. ระบบบันทึกการฝากขยะ (Transaction & Timeline) ---

// บันทึกการฝากขยะ (หัวใจของระบบ: อัปเดตเงิน + บันทึก Timeline)
// src/lib/trash-service.ts

export const saveDeposit = async (data: Omit<TrashTransaction, 'timestamp'>) => {
  console.log("1. เริ่มบันทึกฝากขยะ...", data); // 👈 เช็คว่าข้อมูลมาถึงไหม
  const memberRef = doc(db, 'members', data.memberId);
  
  try {
    return await runTransaction(db, async (transaction) => {
      console.log("2. เข้าสู่ Transaction...");
      const memberDoc = await transaction.get(memberRef);
      
      if (!memberDoc.exists()) {
        console.error("❌ ไม่พบสมาชิก ID:", data.memberId);
        throw "ไม่พบสมาชิกในระบบ!";
      }

      const oldBalance = memberDoc.data().totalBalance || 0;
      const newBalance = oldBalance + data.totalAmount;
      console.log("3. คำนวณเงิน:", oldBalance, "->", newBalance);

      transaction.update(memberRef, { 
        totalBalance: newBalance,
        updatedAt: serverTimestamp() 
      });

      const transRef = doc(collection(db, 'transactions'));
      transaction.set(transRef, { 
        ...data, 
        balanceBefore: oldBalance,
        balanceAfter: newBalance,
        timestamp: serverTimestamp() 
      });
      console.log("4. บันทึกข้อมูลเรียบร้อย!");
    });
  } catch (error) {
    console.error("❌ Transaction Failed:", error); // 👈 จะเห็น Error จริงๆ ที่นี่
    throw error;
  }
};
// --- 4. การดึงข้อมูลสรุป (Stats & History) ---

// ดึงประวัติรายบุคคล
export const getMemberTransactions = async (nationalId: string) => {
  const q = query(
    collection(db, 'transactions'), 
    where('memberId', '==', nationalId), 
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ดึงประวัติรวมทั้งตำบล (Timeline กลาง)
export const getAllTransactions = async (limitCount: number = 50) => {
  const q = query(
    collection(db, 'transactions'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// สรุปสถิติสำหรับ Dashboard ผู้บริหาร
export const getGlobalStats = async () => {
  const snap = await getDocs(collection(db, 'transactions'));
  const transactions = snap.docs.map(doc => doc.data());

  let totalMoney = 0;
  let totalWeight = 0;
  const categoryMap: Record<string, number> = {};

  transactions.forEach((t: any) => {
    totalMoney += t.totalAmount || 0;
    t.items?.forEach((item: any) => {
      totalWeight += Number(item.amount) || 0;
      categoryMap[item.name] = (categoryMap[item.name] || 0) + (Number(item.amount) || 0);
    });
  });

  const chartData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  return { totalMoney, totalWeight, totalTransactions: transactions.length, chartData };
};