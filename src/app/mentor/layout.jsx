import MentorSidebar from "@/components/pages/mentor/MentorSidebar";
import MentorNavbar from "@/components/pages/mentor/MentorNavbar";
import AuthGuard from "@/lib/auth/AuthGuard";
import { WorkspaceProvider } from "@/lib/workspace/WorkspaceProvider";
import { MentorProvider } from "@/components/pages/mentor/MentorProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MentorLayout({ children }) {
  return (
    <AuthGuard roles={["mentor"]}>
      <WorkspaceProvider>
      <MentorProvider>
      <SidebarProvider>
        <MentorSidebar />
        <SidebarInset>
          <MentorNavbar />
          <main className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f6f8fc] dark:bg-background">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_78%_0%,rgba(45,91,255,0.10),transparent_52%)]" />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      </MentorProvider>
      </WorkspaceProvider>
    </AuthGuard>
  );
}
