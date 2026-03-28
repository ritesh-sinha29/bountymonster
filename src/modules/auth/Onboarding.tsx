"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Link2,
  ChessKnight,
  LucideUserPen,
  Unlink,
  ChessKing,
  Loader2,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Characters } from "@/lib/Character";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CharacterCard } from "./CharacterCard";
import { applyCharacterTheme, CharacterTheme } from "@/lib/themes";
import { useMutation } from "convex/react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";

const Onboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"solo" | "company" | null>(null);
  const [flippedSolo, setFlippedSolo] = useState(false);
  const [flippedCompany, setFlippedCompany] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    occupation: "",
    socials: [
      { platform: "github", link: "" },
      { platform: "linkedin", link: "" },
    ],
  });

  const updateStep1 = useMutation(api.users.updateOnboardingStep1);
  const updateStep2 = useMutation(api.users.updateOnboardingStep2);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleStep1 = async (selectedMode: "solo" | "company") => {
    setLoading(true);
    try {
      await updateStep1({ userType: selectedMode === "solo" ? "user" : "organisation" });
      setMode(selectedMode);
      setStep(2);
    } catch (error) {
      toast.error("Failed to update user type");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (!formData.username || !formData.phone || !formData.occupation) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await updateStep2({
        name: formData.username,
        phoneNumber: formData.phone,
        occupation: formData.occupation,
        socialLinks: formData.socials.map(s => ({ platform: s.platform, url: s.link })).filter(s => s.url),
      });
      setStep(3);
    } catch (error) {
      toast.error("Failed to update profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (mode === "solo" && !selectedCharacterId) {
      toast.error("Please select a character to continue");
      return;
    }

    setLoading(true);
    try {
      const character = Characters.find(c => c.id === selectedCharacterId) || Characters[0];
      await completeOnboarding({
        characterName: character.name,
        theme: character.theme,
      });
      toast.success("Welcome to Bounty Monster! Onboarding complete.");
      router.push("/home");
    } catch (error) {
      toast.error("Failed to complete onboarding");
      setLoading(false);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (
    index: number,
    field: "platform" | "link",
    value: string,
  ) => {
    const newSocials = [...formData.socials];
    newSocials[index][field] = value;
    setFormData((prev) => ({ ...prev, socials: newSocials }));
  };

  return (
    <div className="">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-full max-w-[640px] h-[400px] bg-primary/10 blur-[200px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-full max-w-[640px] h-[400px] bg-primary/30 blur-[200px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 -left-40 w-full max-w-[640px] h-[400px] bg-primary/25 blur-[200px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-screen bg-[linear-gradient(to_right,#80808012_1px,transparent_0.5px),linear-gradient(to_bottom,#80808012_1px,transparent_0.5px)] bg-size-[36px_36px]" />

      <Card className={`w-full relative overflow-visible border-none bg-transparent shadow-none transition-all duration-500 ${step === 3 ? "max-w-[1200px]" : "min-w-[500px] max-w-[840px]"}`}>
        <div className={`absolute inset-0 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-all duration-500 pointer-events-none z-0 ${step === 3 ? "bg-white/10 dark:bg-black/30" : "bg-white/50 dark:bg-black/60 mask-[linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]"}`} />

        <div className="relative z-10 p-1 px-5 pt-4">
          {/* Step Loader */}
          {step !== 3 && (
            <div className="space-y-2 mb-8 px-5">
              <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest">
                <span>
                  Step {step} of {totalSteps}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress
                value={progress}
                className="h-1.5 transition-all duration-500"
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="min-h-[400px] flex flex-col"
            >
              {/* --- STEP 1: MODE SELECTION --- */}
              {step === 1 && (
                <div className="space-y-6 flex-1">
                  <div className="space-y-2 text-center mb-8">
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                      Choose your Mode{" "}
                      <ChessKnight className="inline ml-2 size-8 -mt-1" />
                    </h1>
                    <p className="text-muted-foreground">
                      Choose how you want to use{" "}
                      <span className="font-bold text-white font-pop">
                        Bounty Monster
                      </span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-inter">
                    <div className="perspective-1000 h-[240px] min-w-[280px]">
                      <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flippedSolo ? "rotate-y-180" : ""}`}>
                        <div className={`absolute inset-0 backface-hidden group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${mode === "solo" ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-background hover:border-primary/50"}`}>
                          <div onClick={() => handleStep1("solo")} className="flex flex-col items-center cursor-pointer w-full">
                            <div className={`p-4 rounded-full mb-4 transition-colors ${mode === "solo" ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"}`}>
                              {loading && mode === "solo" ? <Loader2 className="w-8 h-8 animate-spin" /> : <User className="w-8 h-8" />}
                            </div>
                            <span className="font-semibold text-lg">Solo Mode</span>
                            <p className="text-xs italic text-center text-muted-foreground mt-2">Hunt & Create</p>
                          </div>
                          <Button variant="default" size="sm" onClick={(e) => { e.stopPropagation(); setFlippedSolo(true); }} className="mt-4 text-white text-xs">Know more</Button>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary bg-card/80 backdrop-blur-lg shadow-lg">
                          <div className="flex flex-col items-center justify-center space-y-4 p-2">
                            <p className="text-sm text-center text-white leading-relaxed">For freelancers, creators, etc who want to participate, earn rewards, or create challenges.</p>
                            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setFlippedSolo(false); }} className="rounded-full px-6">Okay</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="perspective-1000 h-[240px] min-w-[280px]">
                      <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flippedCompany ? "rotate-y-180" : ""}`}>
                        <div className={`absolute inset-0 backface-hidden group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${mode === "company" ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-background hover:border-primary/50"}`}>
                          <div onClick={() => handleStep1("company")} className="flex flex-col items-center cursor-pointer w-full">
                            <div className={`p-4 rounded-full mb-4 transition-colors ${mode === "company" ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"}`}>
                              {loading && mode === "company" ? <Loader2 className="w-8 h-8 animate-spin" /> : <Building2 className="w-8 h-8" />}
                            </div>
                            <span className="font-semibold text-lg">Organization</span>
                            <p className="text-xs italic text-center text-muted-foreground mt-2">Create & Grow</p>
                          </div>
                          <Button variant="default" size="sm" onClick={(e) => { e.stopPropagation(); setFlippedCompany(true); }} className="mt-4 text-white text-xs">Know more</Button>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary bg-card/80 backdrop-blur-lg shadow-lg">
                          <div className="flex flex-col items-center justify-center space-y-4 p-2">
                            <p className="text-sm text-center text-white leading-relaxed">Join as a brand or organization to launch official bounties, grow your community</p>
                            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setFlippedCompany(false); }} className="rounded-full px-6">Okay</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STEP 2: BASIC DETAILS --- */}
              {step === 2 && (
                <div className="space-y-6 flex-1 min-w-[600px] font-inter p-3">
                  <div className="space-y-2 text-center mb-4">
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                      Personalize your profile{" "}
                      <LucideUserPen className="inline ml-2 -mt-1 size-6" />
                    </h1>
                    <div className="text-muted-foreground font-pop">
                      {mode === "solo" ? (
                        <h2> Help us get to know you better</h2>
                      ) : (
                        <h2> We would love to know more about you <Unlink className="inline ml-1 -mt-1 size-5" /></h2>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="your name"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="bg-background/50 border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 0000-0000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-background/50 border-muted-foreground/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Occupation</Label>
                    <Select value={formData.occupation} onValueChange={(v) => handleInputChange("occupation", v)}>
                      <SelectTrigger className="bg-background/50 border-muted-foreground/20">
                        <SelectValue placeholder="Choose your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">UI/UX Designer</SelectItem>
                        <SelectItem value="manager">Product Manager</SelectItem>
                        <SelectItem value="creator">Content Creator</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm capitalize tracking-widest flex items-center gap-2">
                      {mode === "solo" ? "Connect Socials" : "Company Social handles"} <Link2 className="w-3 h-3" />
                      {mode === "solo" && <span className="text-xs text-muted-foreground italic">Optional</span>}
                    </Label>
                    {formData.socials.map((social, index) => (
                      <div key={index} className="flex gap-2">
                        <Select value={social.platform} onValueChange={(v) => handleSocialChange(index, "platform", v)}>
                          <SelectTrigger className="w-[140px] bg-background/50 border-muted-foreground/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="github">GitHub</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="reddit">Reddit</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Link or username"
                          value={social.link}
                          onChange={(e) => handleSocialChange(index, "link", e.target.value)}
                          className="flex-1 bg-background/50 border-muted-foreground/20"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- STEP 3: FINAL STEP --- */}
              {step === 3 && (
                <div className="space-y-6 flex-1 flex flex-col items-center justify-center text-center font-inter min-w-3xl pb-10">
                  {mode === "solo" ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 w-full px-6">
                      <div className="space-y-2">
                        <h1 className='text-2xl font-black italic uppercase tracking-tighter text-white'>
                          Select Your Character <ChessKing className="inline ml-2 -mt-1 size-8 text-white" />
                        </h1>
                      </div>

                      <div className="relative px-6">
                        <Carousel opts={{ align: "center" }} className="w-full max-w-6xl mx-auto">
                          <CarouselContent className="-ml-6">
                            {Characters.map((char) => (
                              <CarouselItem key={char.id} className="pl-6 md:basis-1/2 lg:basis-1/4">
                                <CharacterCard
                                  character={char}
                                  selected={selectedCharacterId === char.id}
                                  onSelect={() => {
                                    setSelectedCharacterId(char.id);
                                    applyCharacterTheme(char.theme as CharacterTheme);
                                  }}
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="-left-10 bg-white/5 border-white/10 text-white hover:bg-white/10" />
                          <CarouselNext className="-right-10 bg-white/5 border-white/10 text-white hover:bg-white/10" />
                        </Carousel>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-12 h-12 text-blue-500" />
                      </div>
                      <h1 className="text-3xl font-bold italic tracking-tigh uppercase">Finalize Organization</h1>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Your organization profile is ready. Click below to enter the ecosystem.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-8 flex items-center justify-between border-t border-muted/30 mt-auto">
                {step > 1 ? (
                  <Button variant="outline" onClick={prevStep} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                ) : <div />}

                {step > 1 && (
                  <Button
                    onClick={step === 2 ? handleStep2 : handleComplete}
                    disabled={loading}
                    className="rounded-full text-xs px-8 py-1! min-w-[120px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-semibold"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {step === totalSteps ? "Complete Onboarding" : "Next Step"} <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/80 font-medium uppercase tracking-[0.2em]">
        <span>© 2026 Bounty Monster</span>
      </div>
    </div>
  );
};

export default Onboarding;

