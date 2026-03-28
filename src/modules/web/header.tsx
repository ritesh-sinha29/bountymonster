"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Crosshair,
  LogIn,
  LucideLogOut,
  LucideMoveRight,
  Menu,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-userStore";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoading } = useStoreUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#" },
    { name: "About us", href: "#" },
    { name: "Contact us", href: "#" },
  ];

  return (
    <header className="relative w-full z-50">
      <div className="h-[76px] w-full" />

      <div
        className={cn(
          "transition-all duration-500 ease-in-out flex justify-center",
          isScrolled
            ? "fixed top-4 inset-x-0 px-4"
            : "absolute top-0 inset-x-0 px-0",  
        )}
      >
        <nav
          className={cn(
            "transition-all duration-500 ease-in-out flex items-center justify-between",
            isScrolled
              ? "w-full max-w-[95%] md:max-w-[80%] px-8 py-2 bg-white/10 backdrop-blur-xl border border-white/10 shadow rounded-full"
              : "w-full px-8 py-4 bg-transparent border-transparent",
          )}
        >
          <div className="flex items-center gap-20">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/logo.svg" alt="logo" width={30} height={30} />
              <h2 className="font-pop text-xl font-semibold text-white">
                Bounty Monster
              </h2>
            </div>

            {/* Links (Desktop) */}
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-5">
              <Authenticated>
                <SignOutButton>
                  <Button
                    size="sm"
                    className="cursor-pointer text-white hover:text-white text-xs font-inter"
                    variant={"outline"}
                  >
                    Log out <LucideLogOut />
                  </Button>
                </SignOutButton>
                <Button className="text-white font-inter rounded-full font-medium text-base bg-violet-500 hover:bg-violet-600 cursor-pointer hover:opacity-90 transition-all shadow-lg shadow-violet-500/20">
                  Go to home <ChevronRight className="w-4 h-4 inline ml-1" />
                </Button>
              </Authenticated>
              <Unauthenticated>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    variant={"outline"}
                    className="font-inter rounded-full text-sm p-4! border-white/10 hover:bg-white/5 text-white hover:text-white cursor-pointer transition-all"
                  >
                    Login <LogIn className="w-4 h-4 inline ml-1" />
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="text-white font-inter rounded-full font-medium text-base bg-violet-500 cursor-pointer hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                    Start hunting <Crosshair className="w-4 h-4 inline ml-1" />
                  </Button>
                </SignUpButton>
              </Unauthenticated>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white hover:bg-white/10"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-neutral-950 border-white/10 text-white"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center gap-2 text-white">
                      <Image
                        src="/logo.svg"
                        alt="logo"
                        width={24}
                        height={24}
                      />
                      Bounty Monster
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-10">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="text-lg font-medium text-muted-foreground hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                    <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                      <Button
                        variant={"outline"}
                        className="w-full justify-between rounded-xl h-12 text-white border-white/10"
                      >
                        Login <LogIn className="w-4 h-4" />
                      </Button>
                      <Button className="w-full justify-between rounded-xl h-12 text-white bg-primary">
                        Start hunting <Crosshair className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>

      {/* LOADERS */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full">
          <BarLoader width={"100%"} color="#6c47ff" />
        </div>
      )}
    </header>
  );
};

export default Header;
