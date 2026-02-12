
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';

/**
 * Generate a consistent chatId between two users
 */
export const getChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join('_');
};

/**
 * Send a message
 */
export const sendMessage = async (senderId, receiverId, text) => {
  try {
    const chatId = getChatId(senderId, receiverId);
    await addDoc(collection(db, 'messages'), {
      chatId,
      senderId,
      receiverId,
      text,
      timestamp: serverTimestamp(),
      read: false,
      participants: [senderId, receiverId]
    });
  } catch (error) {
    console.error('[MessageService] Error sending message:', error);
    throw error;
  }
};

/**
 * Subscribe to messages between two users
 */
export const subscribeToMessages = (uid1, uid2, callback) => {
  const chatId = getChatId(uid1, uid2);
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  }, (error) => {
    console.error('[MessageService] Subscribe to messages error:', error);
    callback([]); // Return empty array on error
  });
};
