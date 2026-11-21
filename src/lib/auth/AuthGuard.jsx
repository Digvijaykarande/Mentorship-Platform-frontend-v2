"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { homeFor, useAuth } from "./AuthProvider";

/**
 * Wraps a section of the app. Signed-out visitors go to the login page (and come back after
 * signing in); signed-in users whose role does not belong here go to their own home.
 */
export default function AuthGuard({ roles, children }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = status === "authenticated" && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (status === "anonymous") router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    else if (status === "authenticated" && !allowed) router.replace(homeFor(user));
  }, [status, allowed, user, pathname, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" role="status" aria-label="Loading">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    );
  }
  return children;
}
