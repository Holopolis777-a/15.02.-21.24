import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  Firestore
} from 'firebase/firestore';
import { db } from './config';

// Generic get document by ID
export const getDocument = async <T = DocumentData>(
  collectionName: string, 
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
};

// Generic get all documents from collection
export const getCollection = async <T = DocumentData>(
  collectionName: string
): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
};

// Generic create document
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const docRef = doc(collection(db, collectionName));
  await setDoc(docRef, data);
  return docRef.id;
};

// Generic update document
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  await updateDoc(doc(db, collectionName, docId), data);
};

// Generic delete document
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docId));
};

// Generic query documents
export const queryDocuments = async <T = DocumentData>(
  collectionName: string,
  field: string,
  operator: any,
  value: any
): Promise<T[]> => {
  const q = query(collection(db, collectionName), where(field, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
};

export { db };