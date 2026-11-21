import ProfilePage from "../profile/page";

/** Sidebar shortcut: the profile page opened on its Storage tab. */
export default function StoragePage() {
  return <ProfilePage initialTab="storage" />;
}
