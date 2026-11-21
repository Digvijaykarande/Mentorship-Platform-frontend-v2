"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Save, Check } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SaveToast from "@/components/common/SaveToast";
import { Button } from "@/components/ui/button";

import AccountDetailsCard from "@/components/pages/dashboard/settings/AccountDetailsCard";
import SecurityCard from "@/components/pages/dashboard/settings/SecurityCard";
import AppearanceCard from "@/components/pages/dashboard/settings/AppearanceCard";
import NotificationsCard, { NOTIFS } from "@/components/pages/dashboard/settings/NotificationsCard";
import DataPrivacyCard from "@/components/pages/dashboard/settings/DataPrivacyCard";
import DangerZoneCard from "@/components/pages/dashboard/settings/DangerZoneCard";

const formFromUser = (user) => ({
  name: user.name || "",
  email: user.email || "",
  accountId: user.code || "",
  accountType: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "",
  currentPass: "",
  newPass: "",
  confirmPass: "",
  twoFactor: Boolean(user.settings?.twoFactor),
  language: user.settings?.language || "English",
  compactSidebar: Boolean(user.settings?.compactSidebar),
  notifications: {
    ...Object.fromEntries(NOTIFS.map(([key]) => [key, true])),
    ...(user.settings?.notifications || {}),
  },
});

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const [form, setForm] = useState(() => formFromUser(user));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, title: "", description: "", variant: "success" });

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const updateNotif = (key) =>
    setForm((p) => ({ ...p, notifications: { ...p.notifications, [key]: !p.notifications[key] } }));

  const showFeedback = (title, description, variant = "success") => {
    setToast({ show: true, title, description, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  const handleSave = async () => {
    if (saving) return;
    if (form.email.trim().toLowerCase() !== user.email) {
      showFeedback("Email can't be changed here", "Ask an administrator to update your sign-in email.", "error");
      return;
    }
    if (form.newPass || form.confirmPass) {
      if (!form.currentPass) {
        showFeedback("Password Error", "Please enter your current password to set a new password.", "error");
        return;
      }
      if (form.newPass.length < 8) {
        showFeedback("Password Error", "New password must be at least 8 characters long.", "error");
        return;
      }
      if (form.newPass !== form.confirmPass) {
        showFeedback("Password Error", "New password and confirmation password do not match.", "error");
        return;
      }
    }

    setSaving(true);
    try {
      let updated = user;
      if (form.newPass) {
        await authApi.changePassword({ currentPassword: form.currentPass, newPassword: form.newPass });
      }
      const name = form.name.trim();
      if (name && name !== user.name) {
        const [firstName, ...rest] = name.split(/\s+/);
        updated = await authApi.updateProfile({ firstName, lastName: rest.join(" ") });
      }
      updated = await authApi.updateSettings({
        language: form.language,
        compactSidebar: form.compactSidebar,
        twoFactor: form.twoFactor,
        notifications: form.notifications,
      });
      setUser(updated);
      setForm({ ...formFromUser(updated) });
      setSaved(true);
      showFeedback("Settings saved", "Your account and preferences have been saved successfully.");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      showFeedback("Could not save", error?.message || "Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const { currentPass, newPass, confirmPass, ...account } = form;
    const blob = new Blob([JSON.stringify({ account, theme }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "settings.json";
    link.click();
    URL.revokeObjectURL(url);
    showFeedback("Data exported", "Your preferences and profile data were downloaded.");
  };

  const handleDeleteAccount = async () => {
    try {
      await authApi.deleteAccount();
    } catch (error) {
      showFeedback("Could not delete account", error?.message || "Please try again.", "error");
      return;
    }
    await logout();
    router.replace("/auth/login");
  };

  return (
    <div className="stagger relative mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
      <SaveToast
        show={toast.show}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <PageHeader title="Settings" subtitle="Manage your profile, security, appearance, and system preferences">
 <Button type="button" size="sm" onClick={handleSave} className="gap-1.5">
          {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
          {saved ? "Saved" : "Save Changes"}
        </Button>
      </PageHeader>

      <AccountDetailsCard form={form} update={update} />

      <div className="grid gap-5 lg:grid-cols-2">
        <SecurityCard form={form} update={update} />
        <AppearanceCard theme={theme} setTheme={setTheme} mounted={mounted} form={form} update={update} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <NotificationsCard notifications={form.notifications} onToggle={updateNotif} />
        <DataPrivacyCard onExport={handleExport} />
      </div>

      <DangerZoneCard onConfirmDelete={handleDeleteAccount} />
    </div>
  );
}
