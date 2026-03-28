import Onboarding from "@/modules/auth/Onboarding";
import React from "react";

const OnboardingPage = () => {
  return (
    <div className="dark bg-black flex flex-col items-center justify-center min-h-screen p-4 md:p-8 relative text-foreground">
      <Onboarding />
    </div>
  );
};

export default OnboardingPage;
