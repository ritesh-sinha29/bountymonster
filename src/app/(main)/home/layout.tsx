"use client";
import { useEffect } from "react";
import { preloadImages, APP_IMAGES_TO_PRELOAD } from "@/hooks/use-image-preloader";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useStoreUser } from "@/hooks/use-userStore";
import { AppSidebar } from "@/modules/home/components/appSidebar";
import { RightSidebar } from "@/modules/home/components/rightSidebar";
import { RightSidebarProvider } from "@/modules/home/components/rightSidebarProvider";
import { RightSidebarTrigger } from "@/modules/home/components/rightSidebarTrigger";
import { RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading: isStoreLoading } = useStoreUser();

  useEffect(() => {
    preloadImages([...APP_IMAGES_TO_PRELOAD]);
  }, []);

  return (
    <>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>

      <Authenticated>
        <SidebarProvider 
          defaultOpen={true}
          style={{ "--sidebar-width-icon": "64px" } as React.CSSProperties}
        >
          <RightSidebarProvider defaultOpen={false}>
            <AppSidebar />

            <SidebarInset className="bg-[#05070B] m-0 rounded-none shadow-none flex flex-col h-screen overflow-hidden">
              <header className="flex-none z-50 flex justify-between h-[64px] items-center border-b px-3 border-white/10 bg-[#05070B] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="h-9 w-9 cursor-pointer hover:bg-white/5 transition-colors" />
                  <Separator
                    orientation="vertical"
                    className="mx-1 h-8 bg-white/20"
                  />
                  {/* <DashboardBreadcrumbs /> */}
                </div>

                <div className="flex items-center gap-4">
                  <RightSidebarTrigger />
                  <UserButton />
                </div>
              </header>

              <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
            </SidebarInset>

            <RightSidebar />
          </RightSidebarProvider>
        </SidebarProvider>
      </Authenticated>
    </>
  );
}
