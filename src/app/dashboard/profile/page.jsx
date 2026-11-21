"use client";

import { useRef, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import ProfileHeader from "@/components/pages/dashboard/profile/ProfileHeader";
import ProfileTabs from "@/components/pages/dashboard/profile/ProfileTabs";
import ProfileOverview from "@/components/pages/dashboard/profile/ProfileOverview";
import ProfileDetails from "@/components/pages/dashboard/profile/PersonalDetailsCard";
import ProfileSettings from "@/components/pages/dashboard/profile/ProfileSettings";
import StoragePanel from "@/components/common/storage/StoragePanel";
import ProfileShare from "@/components/pages/dashboard/profile/ProfileShare";
import AvatarCropDialog from "@/components/pages/dashboard/profile/AvatarCropDialog";
import { useProfileForm } from "@/components/pages/dashboard/profile/useProfileForm";
import { authApi, uploadFile } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getProfileCompletion } from "@/lib/profileCompletion";
import PageHeader from "@/components/common/PageHeader";
import SaveToast from "@/components/common/SaveToast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const MAX_AVATAR_SIZE = 10 * 1024 * 1024; // 10 MB

export default function ProfilePage({ initialTab = "overview" }) {
  const { user, setUser } = useAuth();
  const avatarInputRef = useRef(null);
  const [pendingAvatarSrc, setPendingAvatarSrc] = useState(null);
  const [toast, setToast] = useState(null); // { title, description, variant }
  const [activeTab, setActiveTab] = useState(initialTab);
  const avatarUrl = user.avatar?.url || null;

  const showToast = (next) => {
    setToast(next);
    window.setTimeout(() => setToast(null), 3000);
  };

  const profile = useProfileForm(
    user,
    (updated) => {
      setUser(updated);
      showToast({ title: "Profile updated", description: "Your profile changes were saved successfully." });
    },
    (error) =>
      showToast({ title: "Could not save profile", description: error?.message || "Please try again.", variant: "error" }),
  );

  // File pick -> open the editor. The photo is only applied once the user confirms.
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_AVATAR_SIZE) return;
    setPendingAvatarSrc((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const closeAvatarEditor = () =>
    setPendingAvatarSrc((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });

  const handleAvatarApply = async (blob) => {
    closeAvatarEditor();
    try {
      const file = new File([blob], "avatar.jpg", { type: blob.type || "image/jpeg" });
      const uploaded = await uploadFile(file);
      const updated = await authApi.updateProfile({ avatar: { url: uploaded.imageUrl ?? uploaded.url, publicId: uploaded.publicId } });
      setUser(updated);
      showToast({ title: "Photo updated", description: "Your profile photo was saved." });
    } catch (error) {
      showToast({ title: "Could not update photo", description: error?.message || "Please try again.", variant: "error" });
    }
  };

  const completion = getProfileCompletion({
    formData: profile.formData,
    skills: profile.skills,
    hasAvatar: Boolean(avatarUrl),
  });

  return (
    <div className="stagger relative mx-auto w-full max-w-6xl space-y-5 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <SaveToast
        show={Boolean(toast)}
        title={toast?.title || ""}
        description={toast?.description || ""}
        variant={toast?.variant || "success"}
        onClose={() => setToast(null)}
      />
      <PageHeader
        title="Profile Management"
        subtitle="Manage your personal profile and public presence"
      >
        {profile.isEditing ? (
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={profile.handleCancel}
              className="flex-1 gap-1.5 sm:flex-none"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={profile.handleSave}
              className="flex-1 gap-1.5 sm:flex-none"
            >
              <Check className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => profile.setIsEditing(true)}
            className="w-full gap-1.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 sm:w-auto"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        )}
      </PageHeader>
      <ProfileHeader
        formData={profile.formData}
        avatarUrl={avatarUrl}
        avatarInputRef={avatarInputRef}
        handleAvatarUpload={handleAvatarUpload}
        completion={completion}
      />
      <AvatarCropDialog
        open={Boolean(pendingAvatarSrc)}
        src={pendingAvatarSrc}
        onCancel={closeAvatarEditor}
        onApply={handleAvatarApply}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-5">
        <ProfileTabs />
        <TabsContent value="overview">
          <ProfileOverview {...profile} />
        </TabsContent>
        <TabsContent value="details" className="space-y-5">
          <ProfileDetails formData={profile.formData} />
          <ProfileShare formData={profile.formData} />
        </TabsContent>
        <TabsContent value="storage">
          <StoragePanel />
        </TabsContent>
        <TabsContent value="settings">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
