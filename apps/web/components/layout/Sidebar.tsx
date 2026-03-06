"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  ScanLine,
  Refrigerator,
  ChefHat,
  CalendarRange,
  BarChart3,
  ShoppingCart,
  User,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scan", label: "Scan", icon: ScanLine },
  { href: "/pantry", label: "Pantry", icon: Refrigerator },
  { href: "/recipes", label: "Recipes", icon: ChefHat },
  { href: "/meal-plan", label: "Meal Plan", icon: CalendarRange },
  { href: "/nutrition", label: "Nutrition", icon: BarChart3 },
  { href: "/grocery", label: "Grocery", icon: ShoppingCart },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 border-b border-white/40 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20">
          P
        </div>
        <span className="text-lg font-semibold tracking-tight">PantryAI</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-500/10 text-brand-700"
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/40 p-4 text-xs text-gray-400">
        PantryAI v1.0
      </div>
    </aside>
  );
}
