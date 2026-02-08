import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';

export const sendMessage = async (senderId, receiverId, text) => {
  try {
    await addDoc(collection(db, 'messages'), {
      senderId,
      receiverId,
      text,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToMessages = (userId, otherId, callback) => {
  const q = query(
    collection(db, 'messages'),
    where('senderId', 'in', [userId, otherId]),
    where('receiverId', 'in', [userId, otherId]),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};
