import AuthGuard from "@/lib/auth/AuthGuard";
import AdminSidebar from "@/components/pages/admin/AdminSidebar";
import AdminNavbar from "@/components/pages/admin/AdminNavbar";
import { AdminProvider } from "@/components/pages/admin/AdminProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/** Platform owner area: accounts, storage and payments. Only the admin role can open it. */
export default function AdminLayout({ children }) {
  return (
    <AuthGuard roles={["admin"]}>
      <AdminProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminNavbar />
            <main className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f6f8fc] dark:bg-background">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_78%_0%,rgba(124,58,237,0.10),transparent_52%)]" />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AdminProvider>
    </AuthGuard>
  );
}
