
import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Filter,
  Search,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { getRecentSessions } from '../services/patientService';
import NavHeader from '../../../shared/components/NavHeader';
import SessionReport from '../components/SessionReport';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        // Fetch more sessions for the history page
        const data = await getRecentSessions(user.uid, 50);
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const filteredSessions = sessions.filter(session =>
    session.exerciseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      <NavHeader userType="patient" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Session <span className="text-blue-600">History</span>
            </h1>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
              Your complete recovery timeline
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm focus:border-blue-500 focus:outline-none w-full md:w-64 transition-all shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-20 border-t-blue-600 mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Accessing Archives...</p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredSessions.map((session) => (
              <div key={session.id} className="transform hover:scale-[1.02] transition-all duration-300">
                <SessionReport sessionData={session} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <Activity className="w-20 h-20 text-slate-100 mb-6" />
            <h2 className="text-2xl font-black text-slate-400">No sessions found</h2>
            <p className="text-slate-400 font-bold mt-2">Try adjusting your search or start a new workout.</p>
            <button
              onClick={() => navigate('/workout')}
              className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
            >
              Start Workout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
