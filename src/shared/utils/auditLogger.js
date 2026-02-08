
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

/**
 * Log an action to Firestore for audit purposes
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Description of the action (e.g., 'LOGIN', 'EXPORT_DATA')
 * @param {Object} details - Additional details about the action
 */
export const logAction = async (userId, action, details = {}) => {
  try {
    const logsRef = collection(db, 'audit_logs');
    await addDoc(logsRef, {
      userId,
      action,
      details,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      platform: navigator.platform
    });
    console.log(`[AuditLogger] Action logged: ${action}`);
  } catch (error) {
    console.error('[AuditLogger] Failed to log action:', error);
  }
};

export default logAction;
