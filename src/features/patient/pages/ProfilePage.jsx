
import { useState, useRef } from 'react';
import {
  User,
  Mail,
  Calendar,
  Camera,
  Save,
  ChevronLeft,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { updateUserProfile } from '../../auth/services/authService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../../lib/firebase/config';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import NavHeader from '../../../shared/components/NavHeader';
import { useEffect } from 'react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(userData?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) return;

    // Fetch progress photos
    const photosRef = collection(db, 'progress_photos');
    const q = query(
      photosRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProgressPhotos(photos);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUserProfile(user.uid, { name });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage({ type: '', text: '' });

    try {
      const storageRef = ref(storage, `progress_photos/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'progress_photos'), {
        userId: user.uid,
        url: downloadURL,
        createdAt: serverTimestamp(),
        note: 'Progress photo'
      });

      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
    } catch (err) {
      console.error('Photo upload error:', err);
      setMessage({ type: 'error', text: 'Failed to upload photo.' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      <NavHeader userType="patient" />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center mb-4 relative overflow-hidden group">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900 text-center">{userData?.name}</h2>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Patient</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Account Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-bold text-slate-700">
                      {userData?.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile & Progress Photos */}
          <div className="md:col-span-2 space-y-8">
            {/* Edit Profile */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
              <h3 className="text-xl font-black text-slate-900 mb-6">Edit Profile</h3>

              {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Progress Photos */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Progress Photos</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual recovery tracking</p>
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploadingPhoto}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
                >
                  <Camera className="w-4 h-4" />
                  {uploadingPhoto ? 'Uploading...' : 'Add Photo'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {progressPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {progressPhotos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                      <img src={photo.url} alt="Progress" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                        <Clock className="w-5 h-5 text-white mb-2" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center">
                          {photo.createdAt?.toDate ? photo.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <ImageIcon className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-sm font-bold text-slate-400">No photos uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
