import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AnalysisResult } from '../services/ai';

export interface SavedAnalysis {
  id: string;
  userId: string;
  text: string;
  platform: string;
  finalScore: number;
  result: AnalysisResult;
  timestamp: Date;
}

// Save an analysis session
export const saveAnalysisToHistory = async (
  userId: string, 
  text: string, 
  platform: string, 
  finalScore: number, 
  result: AnalysisResult
) => {
  try {
    const docRef = await addDoc(collection(db, "analysis_history"), {
      userId,
      text,
      platform,
      finalScore,
      result,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving analysis: ", error);
    throw error;
  }
};

// Fetch user history
export const getUserHistory = async (userId: string): Promise<SavedAnalysis[]> => {
  try {
    const q = query(
      collection(db, "analysis_history"), 
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as SavedAnalysis[];
  } catch (error) {
    console.error("Error fetching history: ", error);
    throw error;
  }
};

// Delete a specific analysis
export const deleteAnalysis = async (docId: string) => {
  try {
    await deleteDoc(doc(db, "analysis_history", docId));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
