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
  ExternalLink,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const NAV_MAIN = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Search", href: "/home/search", icon: Search },
  { label: "Bounty", href: "/home/bounty", icon: Swords },
  { label: "Characters", href: "/home/characters", icon: UserPlus },
  { label: "Leaderboard", href: "/home/leaderboard", icon: Trophy },
];

const NAV_FOOTER = [
  { label: "Profile", href: "/home/profile", icon: UserCircle },
   { label: "Favorites", href: "/home/favorites", icon: Star },
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

  const characterObj = Characters.find(
    (c) => c.name === characterData?.characterName,
  );
  const characterImage = characterObj?.image || Characters[0].image;
  const characterName = characterData?.characterName || "Anonymous";
  const currentXp = characterData?.xp ?? 0;
  const {
    level: currentLevel,
    xpIntoLevel,
    xpForNextLevel,
    percent: xpPercent,
  } = getXpProgress(currentXp);

  if (!mounted) return null;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-[#05070B]"
    >
      <SidebarHeader className="h-[64px] min-h-[64px] flex items-center justify-center border-b border-white/10 shrink-0 px-2 group-data-[collapsible=icon]:px-0">
        <Link
          href="/home"
          className="flex items-center justify-center gap-2.5 px-2"
        >
          <Image
            src="/logo.svg"
            alt="BountyMonster Logo"
            width={35}
            height={35}
            className="shrink-0 group-data-[collapsible=icon]:scale-90 transition-transform"
          />
          <span className="text-sidebar-foreground font-pop font-semibold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
            Bounty Monster
          </span>
        </Link>
      </SidebarHeader>

      {/* ── CHARACTER CARD ── */}
      <div className="mx-3 my-2 group-data-[collapsible=icon]:hidden">
        <div className="relative overflow-hidden p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
          <div className="flex items-start gap-3 mb-4">
            <div className="relative shrink-0">
              <Avatar className="w-14 h-14">
                <AvatarImage src={user?.userAvatar} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 flex items-start justify-between  min-w-0">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold text-white truncate max-w-[120px]">
                  {user?.name}
                </p>
                <span className="shrink-0 text-[10px] font-mono font-bold text-white px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                  LVL {currentLevel}
                </span>
              </div>

              <Button
                size={"icon-xs"}
                variant={"outline"}
                className="rounded hover:text-white hover:bg-primary cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom section: XP Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-tight">
              <span className="text-white/70">Experience</span>
              <span className="text-white/60">
                {xpIntoLevel} / {xpForNextLevel}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 border border-white/5 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-primary/60 to-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--color-primary),0.3)]"
                style={{ width: `${xpPercent}%` }}
              />
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
                  className={`relative flex items-center rounded-md py-1 text-sm font-medium! transition-all duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto overflow-visible ${
                    active
                      ? "text-white bg-primary/20!"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Link
                    href={href}
                    prefetch={true}
                    className="w-full flex items-center h-full"
                  >
                    {active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md group-data-[collapsible=icon]:hidden" />
                    )}

                    <div className="relative flex items-center justify-center p-1.5 rounded-lg shrink-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:mx-auto bg-transparent">
                      <Icon
                        className={`size-[18px] shrink-0 transition-colors ${
                          active
                            ? "text-white drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"
                            : "text-sidebar-foreground/80"
                        }`}
                      />
                    </div>

                    <span
                      className={`ml-2 z-10 group-data-[collapsible=icon]:hidden ${active ? "text-white/90 font-bold tracking-wide" : ""}`}
                    >
                      {label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className="my-1 flex items-center gap-2 overflow-hidden">
          <Separator className="bg-neutral-800 max-w-20" />
          <span className="text-neutral-400 text-sm font-medium whitespace-nowrap">
            Quick Links
          </span>
          <Separator className="bg-neutral-800 max-w-20" />
        </div>

        <SidebarMenu className="">
          {NAV_FOOTER.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  tooltip={label}
                  isActive={active}
                  className={`relative flex items-center rounded-xl p-1 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto overflow-visible ${
                    active
                      ? "text-white !bg-transparent"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Link
                    href={href}
                    prefetch={true}
                    className="w-full flex items-center h-full"
                  >
                    {active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl group-data-[collapsible=icon]:hidden" />
                    )}

                    <div className="relative flex items-center justify-center p-1.5 rounded-lg shrink-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:mx-auto bg-transparent">
                      <Icon
                        className={`size-[18px] shrink-0 transition-colors ${
                          active
                            ? "text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"
                            : "text-sidebar-foreground/80"
                        }`}
                      />
                    </div>

                    <span
                      className={`ml-3 z-10 group-data-[collapsible=icon]:hidden ${active ? "text-white/90 font-bold tracking-wide" : ""}`}
                    >
                      {label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <Link href="/home/bounty/create-bounty" prefetch={true} className="mt-auto">
          <Button
            variant="outline"
            className="w-full justify-between items-center px-3 h-9 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto"
          >
            <span className="group-data-[collapsible=icon]:hidden">
              Create Bounty
            </span>

            <Crosshair className="size-4 shrink-0 opacity-70 group-data-[collapsible=icon]:mx-auto" />
          </Button>
        </Link>
      </SidebarContent>

      {/* ── FOOTER NAV ── */}
      <SidebarFooter className="px-2 py-3 border-t border-white/20 gap-0.5">
        <div className="mt-2 group-data-[collapsible=icon]:hidden">
          <Link
            href="/subscription"
            className="
              relative flex flex-col w-full rounded-lg p-3.5 overflow-hidden
              bg-linear-to-br from-white/10 to-primary/10 
            "
          >
            <div className="relative flex items-center justify-between mb-3 z-10">
              <div className="flex items-center justify-center size-8 rounded-lg bg-white/10 text-primary">
                <Zap className="size-4 fill-current" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/20 text-primary rounded px-2 py-0.5 flex items-center gap-1">
                {user?.planType?.toUpperCase() || "FREE"}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-foreground">
                {user?.planType === "free" || !user?.planType
                  ? "Upgrade to Pro"
                  : "Member Status"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {user?.planType === "free" || !user?.planType
                  ? "Upgrade to pro now"
                  : "Current: " + user?.planType}
              </p>
            </div>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
