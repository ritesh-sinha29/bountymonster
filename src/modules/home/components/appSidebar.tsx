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
import { Characters } from "@/lib/Character";
import { getXpProgress } from "@/lib/xpConfig";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import {
  Home,
  Swords,
  Search,
  UserPlus,
  Trophy,
  UserCircle,
  Zap,
  Crosshair,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NAV_MAIN = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Search", href: "/home/search", icon: Search },
  { label: "Bounty", href: "/home/bounty", icon: Swords },
  { label: "Characters", href: "/home/characters", icon: UserPlus },
  { label: "Leaderboard", href: "/home/leaderboard", icon: Trophy },
];

const NAV_FOOTER = [
  { label: "Profile", href: "/home/profile", icon: UserCircle },
];

const ALL_ROUTES = [
  "/home",
  "/home/bounty",
  "/home/leaderboard",
  "/home/search",
  "/home/characters",
  "/home/profile",
  "/home/bounty/create-bounty",
];

/**
 * Primary application sidebar for navigation and user context.
 * Prefetches primary routes for instant transitions and displays synchronized
 * realtime character and user progress details.
 */
export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    ALL_ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  const user: Doc<"users"> | undefined | null = useQuery(
    api.users.getCurrentUser,
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === "/home" ? pathname === href : pathname.startsWith(href);

  const characterData = useQuery(api.characters.getCurrentCharacter);

  const characterObj = Characters.find((c) => c.name === characterData?.characterName);
  const characterImage = characterObj?.image || Characters[0].image;
  const characterName = characterData?.characterName || "Anonymous";
  const currentXp = characterData?.xp ?? 0;
  const { level: currentLevel, xpIntoLevel, xpForNextLevel, percent: xpPercent } = getXpProgress(currentXp);

  // Avoid hydration mismatch on visual client elements
  if (!mounted) return null;

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
      <div className="px-3 py-4 group-data-[collapsible=icon]:hidden">
        <div className="relative group rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-black/20 border border-white/10 p-3.5 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.15)] cursor-default">
          
          {/* Ambient Glow Effects */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent pointer-events-none opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />

          {/* Character Image */}
          <div className="relative shrink-0 w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out" />
            <Image
              src={characterImage}
              alt={characterName}
              width={100}
              height={100}
              className="object-contain w-[125%] h-[125%] drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1 relative"
            />
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0 z-10 py-1 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--color-primary),0.1)] transition-colors">
                Lv. {currentLevel}
              </span>
            </div>
            
            <p className="text-white font-semibold text-[13px] truncate leading-tight mt-1 mb-2 tracking-tight drop-shadow-md">
              {user?.name || characterName}
            </p>

            {/* Premium XP bar */}
            <div className="mt-auto">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest drop-shadow-sm">
                  XP
                </span>
                <span className="text-[9px] text-white/50 font-bold tracking-wide drop-shadow-sm">
                  <span className="text-white/90">{xpIntoLevel.toLocaleString()}</span>{" "}
                  <span className="text-white/30">/</span> {xpForNextLevel.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-black border border-white/10 overflow-hidden shadow-inner relative">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(var(--color-primary),0.8)]"
                  style={{ width: `${xpPercent}%` }}
                >
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-white/40 mix-blend-overlay" />
                </div>
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
                  className={`relative flex items-center rounded-xl p-1.5 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto overflow-visible ${
                    active
                      ? "text-white !bg-transparent"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Link href={href} prefetch={true} className="w-full flex items-center h-full">
                    {active && (
                      <>
                        <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-1.5 h-[50%] bg-primary rounded-r-full shadow-[0_0_15px_rgba(var(--color-primary),0.8)] group-data-[collapsible=icon]:hidden" />
                      </>
                    )}
                    
                    <div className="relative flex items-center justify-center p-1.5 rounded-lg shrink-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:mx-auto bg-transparent">
                      <Icon
                        className={`size-[18px] shrink-0 transition-colors ${
                          active ? "text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" : "text-sidebar-foreground/50"
                        }`}
                      />
                    </div>
                    
                    <span className={`ml-3 z-10 group-data-[collapsible=icon]:hidden ${active ? "text-white/90 font-bold tracking-wide" : ""}`}>{label}</span>
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
                  className={`relative flex items-center rounded-xl p-1.5 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto overflow-visible ${
                    active
                      ? "text-white !bg-transparent"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Link href={href} prefetch={true} className="w-full flex items-center h-full">
                    {active && (
                      <>
                        <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-1.5 h-[50%] bg-primary rounded-r-full shadow-[0_0_15px_rgba(var(--color-primary),0.8)] group-data-[collapsible=icon]:hidden" />
                      </>
                    )}
                    
                    <div className="relative flex items-center justify-center p-1.5 rounded-lg shrink-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:mx-auto bg-transparent">
                      <Icon
                        className={`size-[18px] shrink-0 transition-colors ${
                          active ? "text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" : "text-sidebar-foreground/50"
                        }`}
                      />
                    </div>
                    
                    <span className={`ml-3 z-10 group-data-[collapsible=icon]:hidden ${active ? "text-white/90 font-bold tracking-wide" : ""}`}>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className="flex flex-col gap-2 mt-2 px-1 group-data-[collapsible=icon]:px-0">
          <Link href="/home/bounty/create-bounty" prefetch={true}>
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
