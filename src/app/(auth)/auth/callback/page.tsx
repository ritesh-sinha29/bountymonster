"use client";

import { useStoreUser } from "@/hooks/use-userStore";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { useEffect } from "react";
import LoaderText from "@/modules/web/loaderTest";

export default function CallbackPage() {
  const { isAuthenticated, isLoading: isStoreLoading } = useStoreUser();
  const { isLoaded, isSignedIn } = useAuth(); // Check Clerk auth state directly
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (!isLoaded) return;

    // if Not signedIn
    if (!isSignedIn) {
      router.push("/web");
      return;
    }
    // clerk SignedIn , Waiting for Convex to sync
    if (isStoreLoading) return;

    if (user === undefined) return;

    const handleRedirect = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      if (user && user.onBoarding) {
        router.push("/home");
      } else if (user) {
        router.push(`/platform/onboarding`);
      } else {
        console.log("Waiting for user creation...");
      }
    };

    handleRedirect();
  }, [isAuthenticated, isStoreLoading, user, router, isLoaded, isSignedIn]);

  return (
    <div className="flex h-screen w-full items-center justify-center relative bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin  rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <div className="text-white font-pop text-lg">
          <LoaderText />
        </div>
      </div>
    </div>
  );
}
