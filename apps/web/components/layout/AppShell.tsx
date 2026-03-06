"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const isLoginPage = pathname === "/login";
  const isPublicPage = pathname.startsWith("/challenge/");

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage && !isPublicPage) {
      router.push("/login");
    }
  }, [user, isLoading, isLoginPage, isPublicPage, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (isLoginPage || isPublicPage) {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen">
      <div className="fluid-bg-subtle" aria-hidden="true" />
      <Sidebar />
      <main className="relative z-10 ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
