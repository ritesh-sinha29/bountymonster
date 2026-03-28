"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import {
  Home,
  Swords,
  Search,
  Users,
  UserPlus,
  Trophy,
  Heart,
  UserCircle,
  Settings,
  Zap,
  Crosshair,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const NAV_MAIN = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Search", href: "/home/search", icon: Search },
  { label: "Bounty", href: "/home/bounty", icon: Swords },
  { label: "Characters", href: "/home/characters", icon: UserPlus },
  { label: "Leaderboard", href: "/home/leaderboard", icon: Trophy },
];

const NAV_FOOTER = [
  { label: "Favourites", href: "/home/favourites", icon: Heart },
  { label: "Profile", href: "/home/profile", icon: UserCircle },
];

const FAKE_CHARACTER = {
  name: "Shadow Viper",
  xp: 4200,
  xpMax: 5000,
  level: 12,
  image: "/dragon.png",
};

export const AppSidebar = () => {
  const pathname = usePathname();

  const user: Doc<"users"> | undefined | null = useQuery(
    api.users.getCurrentUser,
  );

  const [themeFeedback, setThemeFeedback] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === "/home" ? pathname === href : pathname.startsWith(href);

  const xpPercent = Math.round(
    (FAKE_CHARACTER.xp / FAKE_CHARACTER.xpMax) * 100,
  );

  const handleThemeClick = () => {
    setThemeFeedback(true);
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => setThemeFeedback(false), 300);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-[#05070B]"
    >
      {/* ── HEADER: Logo + Brand ── */}
      <SidebarHeader className="h-[64px] min-h-[64px] flex items-center justify-center border-b border-white/10 shrink-0 px-2 group-data-[collapsible=icon]:px-0">
        <Link
          href="/home"
          className="flex items-center justify-center gap-2.5 px-2"
        >
          <Image
            src="/logo.svg"
            alt="BountyMonster Logo"
            width={28}
            height={28}
            className="shrink-0 group-data-[collapsible=icon]:scale-90 transition-transform"
          />
          <span className="text-sidebar-foreground font-semibold text-[18px] tracking-tight group-data-[collapsible=icon]:hidden">
            Bounty Monster
          </span>
        </Link>
      </SidebarHeader>

      {/* ── CHARACTER CARD ── */}
      <div className="px-3 py-3 group-data-[collapsible=icon]:hidden">
        <div className="relative rounded-xl overflow-hidden bg-white/10 border border-white/10 p-3 flex items-end gap-4">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />

          <div className="relative shrink-0 w-18 h-18 flex items-end justify-center">
            <Image
              src={FAKE_CHARACTER.image}
              alt={FAKE_CHARACTER.name}
              width={100}
              height={100}
              className="object-contain scale-[1.15] translate-y-1 drop-shadow-lg"
            />
          </div>

          <div className="flex-1 min-w-0 pb-0.5 z-10">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-base font-semibold font-pop text-primary">
                Lv.{FAKE_CHARACTER.level}
              </span>
            </div>
            <p className="text-sidebar-foreground font-semibold text-sm truncate leading-tight">
              {FAKE_CHARACTER.name}
            </p>

            {/* XP bar */}
            <div className="mt-1.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-sidebar-foreground/50 font-medium">
                  XP
                </span>
                <span className="text-[10px] text-sidebar-foreground/50 font-medium">
                  {FAKE_CHARACTER.xp.toLocaleString()} /{" "}
                  {FAKE_CHARACTER.xpMax.toLocaleString()}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-sidebar-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <SidebarContent className="px-2 py-3 overflow-y-auto scrollbar-hide font-inter">
        <SidebarMenu className="gap-0.5">
          {NAV_MAIN.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  tooltip={label}
                  isActive={active}
                  className={`flex items-center gap-4 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto ${
                    active
                      ? "text-primary bg-primary/10 shadow-[inset_0_0_0_1px_rgba(var(--color-primary),0.2)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Link href={href}>
                    <Icon
                      className={`size-5 shrink-0 transition-colors ${
                        active ? "text-white" : "text-sidebar-foreground/50"
                      }`}
                    />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ── FOOTER NAV ── */}
      <SidebarFooter className="px-2 py-3 border-t border-white/20 gap-0.5">
        <SidebarMenu className="gap-0.5">
          {NAV_FOOTER.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  tooltip={label}
                  isActive={active}
                  className={`flex items-center gap-4 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto ${
                    active
                      ? "text-primary bg-primary/10 shadow-[inset_0_0_0_1px_rgba(var(--color-primary),0.2)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Link href={href}>
                    <Icon
                      className={`size-5 shrink-0 transition-colors ${
                        active ? "text-primary" : "text-sidebar-foreground/50"
                      }`}
                    />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className="flex flex-col gap-2 mt-2 px-1 group-data-[collapsible=icon]:px-0">
          <Link href="/home/bounty/create-bounty">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2 bg-primary/20 text-white border border-primary/30 hover:bg-primary/30 cursor-pointer font-bold text-xs h-10 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto overflow-hidden transition-all"
            >
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap ml-1">
                CREATE BOUNTY
              </span>{" "}
              <Crosshair className="size-4 shrink-0 group-data-[collapsible=icon]:mx-auto ml-auto mr-1" />
            </Button>
          </Link>
        </div>

        <div className="mt-2 group-data-[collapsible=icon]:hidden">
          <Link
            href="/home/upgrade"
            className="
              relative flex flex-col w-full rounded-lg p-3.5 overflow-hidden
              bg-white/5 border border-white/10 
            "
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center justify-between mb-3 z-10">
              <div className="flex items-center justify-center size-8 rounded-lg bg-white/10 text-primary">
                <Zap className="size-4 fill-current" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/20 text-primary rounded px-2 py-0.5 flex items-center gap-1">
                PRO
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-foreground">
                Upgrade to Pro
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Unlock all features
              </p>
            </div>
          </Link>
        </div>

       
      </SidebarFooter>
    </Sidebar>
  );
};
