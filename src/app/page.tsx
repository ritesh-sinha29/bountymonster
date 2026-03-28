"use client";
import { useConvexAuth } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();

  useEffect(() => {
    if (isAuthLoading) {
      toast.loading("Checking session...", {
        id: "checking-session",
      });
      return;
    }

    if (isAuthenticated) {
      toast.dismiss("checking-session");
      toast.success("Session restored successfully!");
      router.push("/auth/callback");
    } else {
      toast.dismiss("checking-session");
      router.push("/web");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  return (
    <div className="bg-black min-h-screen w-full flex items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <Image src="/logo.svg" alt="Logo" width={45} height={45} />
          <h1 className="tracking-tight font-pop text-2xl font-semibold">
            Bounty Monster
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg italic bg-linear-to-br from-white via-white to-primary text-transparent bg-clip-text tracking-wide"
        >
          Where Hunting Turns Into Glory.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Home;
