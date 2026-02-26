// src/lib/trash-service.ts
import { db } from './firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, 
  updateDoc, serverTimestamp, query, orderBy, 
  where, runTransaction, addDoc, limit , deleteDoc,
  increment, writeBatch// 🟢 เพิ่ม increment สำหรับระบบนับคนเข้าชม
} from 'firebase/firestore';
import { TrashType, TrashMember, TrashTransaction } from '@/types/trashBank';
// --- 1. จัดการสมาชิก (Member Management) ---

export const findMember = async (nationalId: string) => {
  const docRef = doc(db, 'members', nationalId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { ...docSnap.data() } as TrashMember : null;
};
export const bulkRegisterMembers = async (members: any[]) => {
  const batch = writeBatch(db);
  
  members.forEach((m) => {
    // ใช้เลขบัตรประชาชนเป็น ID ของ Document เลย
    const memberRef = doc(db, 'members', m.nationalId);
    batch.set(memberRef, {
      ...m,
      totalBalance: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  return await batch.commit();
};
export const registerMember = async (member: Omit<TrashMember, 'totalBalance' | 'createdAt' | 'updatedAt'>) => {
  const memberRef = doc(db, 'members', member.nationalId);
  return await setDoc(memberRef, {
    ...member,
    totalBalance: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getMembers = async () => {
  const q = query(collection(db, 'members'), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as TrashMember));
};

export const deleteMember = async (id: string) => {
  const memberRef = doc(db, 'members', id);
  return await deleteDoc(memberRef);
};

// --- 2. จัดการประเภทขยะ (Trash Type Management) ---

export const getTrashTypes = async () => {
  const q = query(collection(db, 'trash_types'), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TrashType));
};

export const addTrashType = async (data: TrashType) => {
  if (isNaN(data.pricePerUnit)) throw new Error("กรุณาระบุราคาเป็นตัวเลขที่ถูกต้อง");
  const { id, ...cleanData } = data;
  return await addDoc(collection(db, 'trash_types'), cleanData);
};

export const updateTrashType = async (id: string, data: Partial<TrashType>) => {
  const docRef = doc(db, 'trash_types', id);
  return await updateDoc(docRef, data);
};

export const deleteTrashType = async (id: string) => {
  const docRef = doc(db, 'trash_types', id);
  return await deleteDoc(docRef);
};

// --- 3. ระบบบันทึกการฝากขยะ (Transaction & Timeline) ---

export const saveDeposit = async (data: Omit<TrashTransaction, 'timestamp'>) => {
  const memberRef = doc(db, 'members', data.memberId);
  try {
    return await runTransaction(db, async (transaction) => {
      const memberDoc = await transaction.get(memberRef);
      if (!memberDoc.exists()) throw "ไม่พบสมาชิกในระบบ!";

      const oldBalance = memberDoc.data().totalBalance || 0;
      const newBalance = oldBalance + data.totalAmount;

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
    });
  } catch (error) {
    console.error("❌ Transaction Failed:", error);
    throw error;
  }
};

export const getMemberTransactions = async (nationalId: string) => {
  const q = query(collection(db, 'transactions'), where('memberId', '==', nationalId), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllTransactions = async (limitCount: number = 50) => {
  const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- 4. สรุปสถิติและวิเคราะห์ (Stats & Analytics) ---

// 🟢 แก้ไขสถิติสมาชิกให้ถูกต้อง: นับคนจริงๆ [cite: 2026-02-26]
export const getGlobalStats = async () => {
  const [transSnap, membersSnap] = await Promise.all([
    getDocs(collection(db, 'transactions')),
    getDocs(collection(db, 'members'))
  ]);

  let totalMoney = 0;
  let totalWeight = 0;
  transSnap.docs.forEach(doc => {
    const data = doc.data();
    totalMoney += data.totalAmount || 0;
    data.items?.forEach((item: any) => totalWeight += Number(item.amount) || 0);
  });

  return { 
    totalMoney, 
    totalWeight, 
    totalTransactions: transSnap.size, 
    totalMembers: membersSnap.size // 👈 อ้างอิงจำนวนคนจริงๆ
  };
};

// 🟢 ใหม่: ระบบนับจำนวนผู้เข้าชมสไตล์ CCTV
export const handleVisitorAnalytics = async () => {
  const todayStr = new Date().toLocaleDateString('en-CA');
  const hasVisited = sessionStorage.getItem('trash_bank_v_2026');
  const dailyRef = doc(db, 'site_analytics', todayStr);
  const globalRef = doc(db, 'site_analytics', 'global_stats');

  if (!hasVisited) {
    try {
      await Promise.all([
        setDoc(dailyRef, { visits: increment(1), date: todayStr }, { merge: true }),
        setDoc(globalRef, { totalVisits: increment(1) }, { merge: true })
      ]);
      sessionStorage.setItem('trash_bank_v_2026', 'true');
    } catch (e) { console.error("Analytics Error:", e); }
  }

  const [todaySnap, globalSnap] = await Promise.all([getDoc(dailyRef), getDoc(globalRef)]);
  return {
    today: todaySnap.exists() ? todaySnap.data().visits || 0 : 0,
    total: globalSnap.exists() ? globalSnap.data().totalVisits || 0 : 0
  };
};

// --- 5. จัดการประชาสัมพันธ์ (PR Management) ---

export interface Announcement {
  id?: string;
  title: string;
  date: string;
  location: string;
  details: string;
  createdAt: any;
}

export const getAnnouncements = async () => {
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addAnnouncement = async (data: any) => {
  return await addDoc(collection(db, 'announcements'), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const updateAnnouncement = async (id: string, data: any) => {
  const docRef = doc(db, 'announcements', id);
  return await updateDoc(docRef, data);
};

export const deleteAnnouncement = async (id: string) => {
  const docRef = doc(db, 'announcements', id);
  return await deleteDoc(docRef);
};