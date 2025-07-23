// File: src/app/dashboard/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/utils/auth';
import nigeriaData from '@/data/nigeria-states-lgas.json';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle, FaUpload, FaSave, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Define an interface for the form state for better type safety
interface ProfileFormState {
  firstName: string;
  surname: string;
  address: string;
  state: string;
  lga: string;
  idType: string;
  idNumber: string;
  dob: string;
  gender: string;
  profileImage: File | string | null;
  idImage: File | string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<ProfileFormState>({
    firstName: '',
    surname: '',
    address: '',
    state: '',
    lga: '',
    idType: '',
    idNumber: '',
    dob: '',
    gender: '',
    profileImage: null,
    idImage: null,
  });
  const [selectedStateLgas, setSelectedStateLgas] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0); // Add this line

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const nameParts = currentUser.name ? currentUser.name.split(' ') : ['', ''];
      setForm(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        surname: nameParts[1] || '',
        address: currentUser.address || '',
        state: currentUser.state || '',
        lga: currentUser.lga || '',
        idType: currentUser.idType || '',
        idNumber: currentUser.idNumber || '',
        dob: currentUser.dob || '',
        gender: currentUser.gender || '',
        profileImage: currentUser.profileImage || null,
        idImage: currentUser.idImage || null,
      }));

      if (currentUser.state && nigeriaData[currentUser.state as keyof typeof nigeriaData]) {
        setSelectedStateLgas(nigeriaData[currentUser.state as keyof typeof nigeriaData]);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'state') {
      setForm(prev => ({ ...prev, lga: '' }));
      setSelectedStateLgas(nigeriaData[value as keyof typeof nigeriaData] || []);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving profile:', form);

      const updatedUser = {
        ...user,
        name: `${form.firstName} ${form.surname}`,
        address: form.address,
        state: form.state,
        lga: form.lga,
        idType: form.idType,
        idNumber: form.idNumber,
        dob: form.dob,
        gender: form.gender,
        // Placeholder for uploaded image URL. In a real app, you'd handle actual uploads here.
        profileImage: typeof form.profileImage === 'string' ? form.profileImage : '/path/to/uploaded/profile.jpg',
        idImage: typeof form.idImage === 'string' ? form.idImage : '/path/to/uploaded/id.jpg',
        id_uploaded: !!(form.idType && form.idNumber && form.idImage) // Assuming id_uploaded means these fields are present
      };

      setUser(updatedUser);
      // In a real application, you would save this updatedUser to local storage or your backend
      localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Update local storage
      setSaveStatus('success');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const getImageUrl = (fileOrUrl: File | string | null): string => {
    if (fileOrUrl instanceof File) {
      return URL.createObjectURL(fileOrUrl);
    }
    return fileOrUrl || '/default-profile.png';
  };

  return (
    <DashboardLayout totalUnreadMessages={totalUnreadMessages}> {/* Pass the prop here */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-10 sm:p-8 my-8 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-6 text-[#775522] border-b pb-4 border-gray-200">
          Update Profile Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4 py-4 border-b border-gray-100">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#E8CEB0] shadow-md">
              <Image
                src={getImageUrl(form.profileImage)}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <label className="inline-flex items-center gap-2 bg-[#775522] text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-[#5E441B] transition-colors duration-300 shadow-md">
              <FaUpload /> Upload Profile Picture
              <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
            <p className="text-sm text-gray-500">Max size: 5MB. Formats: JPG, PNG, WebP</p>
          </div>

          {/* Personal Information */}
          <section className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaUserCircle className="text-[#775522]" /> Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name <span className="text-[#5E441B]">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Surname <span className="text-[#5E441B]">*</span></label>
                <input
                  type="text"
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address <span className="text-[#5E441B]">*</span></label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200"
                placeholder="Street, Area, City..."
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">State <span className="text-[#5E441B]">*</span></label>
                <select name="state" value={form.state} onChange={handleChange} className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200" required>
                  <option value="">Select a state</option>
                  {Object.keys(nigeriaData).map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LGA <span className="text-[#5E441B]">*</span></label>
                <select name="lga" value={form.lga} onChange={handleChange} className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200" disabled={!form.state} required>
                  <option value="">Select LGA</option>
                  {selectedStateLgas.map(lga => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender <span className="text-[#5E441B]">*</span></label>
                <select name="gender" value={form.gender} onChange={handleChange} className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200" required>
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-[#5E441B]">*</span></label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200" required />
              </div>
            </div>

            {user && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email / Phone</label>
                <input
                  type="text"
                  value={user.email || user.phone || 'N/A'}
                  readOnly
                  className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            )}
          </section>

          {/* Verification ID Information */}
          <section className="space-y-5 pt-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaLock className="text-[#775522]" /> Verification Details
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification ID Type <span className="text-[#5E441B]">*</span></label>
              <select name="idType" value={form.idType} onChange={handleChange} className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200" required>
                <option value="">Select ID</option>
                <option value="NIN">NIN</option>
                <option value="Driver’s License">Driver’s License</option>
                <option value="National ID Card">National ID Card</option>
                <option value="Voter’s Card">Voter’s Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number <span className="text-[#5E441B]">*</span></label>
              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                className="input-field focus:ring-2 focus:ring-[#E8CEB0] focus:border-[#775522] transition-all duration-200"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Upload Verification ID Image <span className="text-[#5E441B]">*</span></label>
              <label className="inline-flex items-center gap-2 w-fit bg-[#775522] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#5E441B] transition-colors duration-300 shadow-md">
                <FaUpload /> Choose File
                <input
                  type="file"
                  name="idImage"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
              </label>
              {form.idImage && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {typeof form.idImage === 'string' ? form.idImage.split('/').pop() : form.idImage.name}
                </p>
              )}
              <p className="text-sm text-gray-500">Accepted formats: JPG, PNG. Max size: 5MB.</p>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="bg-[#775522] text-white px-8 py-3 rounded-lg hover:bg-[#5E441B] transition-colors duration-300 shadow-lg flex items-center gap-2 font-semibold"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>

          {/* Save Status Notification (Toast-like) */}
          {saveStatus && (
            <div
              className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-xl text-white flex items-center gap-3 transition-all duration-300 transform z-50
                ${saveStatus === 'success' ? 'bg-[#E8CEB0] text-[#5E441B]' : 'bg-[#5E441B] text-white'}
                ${saveStatus ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
            >
              {saveStatus === 'success' ? <FaCheckCircle className="text-[#5E441B] text-xl" /> : <FaExclamationCircle className="text-[#FFD580] text-xl" />} {/* Accent color for error icon */}
              {saveStatus === 'success' ? 'Profile updated successfully!' : 'Failed to update profile. Please try again.'}
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}