
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
export const sendMessage = async (chatId, senderId, text, senderName) => {
  try {
    // Extract receiverId from chatId if possible
    const ids = chatId.split('_');
    const receiverId = ids.find(id => id !== senderId) || ids[0];

    await addDoc(collection(db, 'messages'), {
      chatId,
      senderId,
      receiverId,
      senderName,
      text,
      timestamp: serverTimestamp(),
      participants: [senderId, receiverId]
    });
  } catch (error) {
    console.error('[ChatService] Error sending message:', error);
    throw error;
  }
};

/**
 * Subscribe to messages in a chat
 */
export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};
