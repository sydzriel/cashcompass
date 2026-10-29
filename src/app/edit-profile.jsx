import React from 'react';
import { useRouter } from 'expo-router';
import EditProfileModal from '../components/EditProfileModal';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { userProfile, setUserProfile } = useApp();
  const { language, setLanguage } = useLanguage();

  const handleSave = (updated) => {
    setUserProfile({
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      dailyBudget: updated.dailyBudget,
    });
    setLanguage(updated.language);
    router.back();
  };

  return (
    <EditProfileModal
      visible={true}
      onClose={() => router.back()}
      currentProfile={userProfile}
      currentLanguage={language}
      onSave={handleSave}
    />
  );
}
