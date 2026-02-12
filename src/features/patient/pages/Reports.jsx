import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Loader2 } from 'lucide-react';
import NavHeader from '../../../shared/components/NavHeader';
import { useAuth } from '../../auth/context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import SessionReport from '../components/SessionReport';

export default function Reports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'sessions'),
          where('patientId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const sessionData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure date is formatted for display if it's a timestamp
          date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleDateString() : doc.data().date
        }));
        setSessions(sessionData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <NavHeader userType="patient" />
      <main className="max-w-[1700px] mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate('/patient-dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Session Reports</h1>
          </div>
          <p className="text-slate-500 font-bold ml-1">Comprehensive breakdown of your rehabilitation progress</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-400 font-bold">Loading your reports...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 shadow-xl border border-slate-50 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">No Reports Found</h2>
            <p className="text-slate-400 font-bold mb-6">You haven't completed any sessions yet.</p>
            <button
              onClick={() => navigate('/workout')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Start First Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {sessions.map(session => (
              <SessionReport key={session.id} sessionData={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
