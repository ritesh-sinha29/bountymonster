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
  Check,
  Crosshair,
  LayersPlus,
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
import { Typewriter, Cursor } from "react-simple-typewriter";
import { useMutation } from "convex/react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import {
  preloadImages,
  APP_IMAGES_TO_PRELOAD,
} from "@/hooks/use-image-preloader";

const Onboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"solo" | "company" | null>(null);
  const [flippedSolo, setFlippedSolo] = useState(false);
  const [flippedCompany, setFlippedCompany] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
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
      await updateStep1({
        mainMoto: selectedMode === "solo" ? "hunt" : "create",
      });
      setMode(selectedMode);
      setStep(2);
    } catch (error) {
      toast.error("Failed to update main moto");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (!formData.username || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await updateStep2({
        name: formData.username,
        phoneNumber: formData.phone,
        socialLinks: formData.socials
          .map((s) => ({ platform: s.platform, url: s.link }))
          .filter((s) => s.url),
      });

      preloadImages([...APP_IMAGES_TO_PRELOAD]);
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
      const character =
        Characters.find((c) => c.id === selectedCharacterId) || Characters[0];
      await completeOnboarding({
        characterName: character.name,
        theme: character.theme,
        characterAvatar: character.image,
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
      {/* ── STEP INDICATOR ── */}
      <div className="relative z-10 flex items-center justify-center gap-2 mb-16 bg-black">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            {/* Node */}
            <div className="relative flex items-center justify-center size-9">
              <div
                className={`
            size-9 rounded-full flex items-center justify-center
            text-[11px] font-semibold tracking-widest transition-all duration-300
            ${
              s < step
                ? "bg-primary text-white"
                : s === step
                  ? "border bg-primary/10 border-primary text-white"
                  : "border bg-neutral-900 border-neutral-600 text-white"
            }
          `}
              >
                <AnimatePresence mode="wait">
                  {s < step ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Check className="size-3.5 stroke-[3]" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="num"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      {s}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Connector */}
            {s < 3 && (
              <div className="w-12 h-px bg-neutral-600 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-primary origin-left"
                  initial={false}
                  animate={{ scaleX: s < step ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative z-10 px-5 py-2">
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
              <div className="flex-1">
                <div className="flex flex-col space-y-2 mb-10">
                  <h1 className="text-left text-2xl font-medium min-h-[1.5em] flex items-center">
                    <Typewriter
                      key={step}
                      words={["Welcome to Bounty Monster"]}
                      loop={1}
                      typeSpeed={100}
                      deleteSpeed={0}
                    />
                    <Cursor cursorStyle="_" />
                  </h1>

                  <h3 className="text-left text-neutral-400 text-lg font-medium">
                    How do you want to use this platform? Select one
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-inter">
                  {/* HUNTER */}
                  <div className="perspective-1000 h-[240px] min-w-[280px]">
                    <div
                      onClick={() => handleStep1("solo")}
                      className={`relative w-full cursor-pointer h-full transition-all duration-700 transform-style-3d ${flippedSolo ? "rotate-y-180" : ""}`}
                    >
                      <div
                        className={`absolute inset-0 backface-hidden group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${mode === "solo" ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-background hover:border-primary/50"}`}
                      >
                        <div className="flex flex-col items-center w-full">
                          <div
                            className={`p-4 rounded-full mb-4 transition-colors ${mode === "solo" ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"}`}
                          >
                            {loading && mode === "solo" ? (
                              <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                              <Crosshair className="w-8 h-8" />
                            )}
                          </div>
                          <span className="font-semibold text-lg">
                            Hunt Bounties
                          </span>
                          <p className="text-sm italic text-center text-muted-foreground mt-2">
                            Earn rewards & XP
                          </p>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedSolo(true);
                          }}
                          className="mt-4 text-white text-xs"
                        >
                          Know more
                        </Button>
                      </div>
                      <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary bg-card/80 backdrop-blur-lg shadow-lg">
                        <div className="flex flex-col items-center justify-center space-y-4 p-2">
                          <p className="text-sm text-center text-white leading-relaxed">
                            For hunters who want to participate in challenges,
                            complete tasks, and earn high-value rewards.
                          </p>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedSolo(false);
                            }}
                            className="rounded-full px-6"
                          >
                            Okay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CRETOR */}
                  <div className="perspective-1000 h-[240px] min-w-[280px]">
                    <div
                      onClick={() => handleStep1("company")}
                      className={`relative cursor-pointer w-full h-full transition-all duration-700 transform-style-3d ${flippedCompany ? "rotate-y-180" : ""}`}
                    >
                      <div
                        className={`absolute inset-0 backface-hidden group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${mode === "company" ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-background hover:border-primary/50"}`}
                      >
                        <div className="flex flex-col items-center  w-full">
                          <div
                            className={`p-4 rounded-full mb-4 transition-colors ${mode === "company" ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"}`}
                          >
                            {loading && mode === "company" ? (
                              <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                              <LayersPlus className="w-8 h-8" />
                            )}
                          </div>
                          <span className="font-semibold text-lg">
                            Create Bounties
                          </span>
                          <p className="text-sm italic text-center text-muted-foreground mt-2">
                            Hire hunters & grow
                          </p>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedCompany(true);
                          }}
                          className="mt-4 text-white text-xs"
                        >
                          Know more
                        </Button>
                      </div>
                      <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary bg-card/80 backdrop-blur-lg shadow-lg">
                        <div className="flex flex-col items-center justify-center space-y-4 p-2">
                          <p className="text-sm text-center text-white leading-relaxed">
                            Join as a brand or organization to launch official
                            bounties, grow your community
                          </p>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedCompany(false);
                            }}
                            className="rounded-full px-6"
                          >
                            Okay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 2: BASIC DETAILS --- */}
            {step === 2 && (
              <div className="space-y-6 flex-1 min-w-[620px] font-inter p-3">
                 <div className="flex flex-col space-y-2 mb-10">
                  <h1 className="text-left text-2xl font-medium min-h-[1.5em] flex items-center">
                    <Typewriter
                      key={step}
                      words={["Now lets understand you better !"]}
                      loop={1}
                      typeSpeed={100}
                      deleteSpeed={0}
                    />
                    <Cursor cursorStyle="_" />
                  </h1>

                  <h3 className="text-left text-neutral-400 text-lg font-medium">
                    Help us get to know you better
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="your name"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="bg-background/50 border-muted-foreground/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm capitalize tracking-widest flex items-center gap-2">
                    {mode === "solo"
                      ? "Connect Socials"
                      : "Company Social handles"}{" "}
                    <Link2 className="w-3 h-3" />
                    {mode === "solo" && (
                      <span className="text-xs text-muted-foreground italic">
                        Optional
                      </span>
                    )}
                  </Label>
                  {formData.socials.map((social, index) => (
                    <div key={index} className="flex gap-2">
                      <Select
                        value={social.platform}
                        onValueChange={(v) =>
                          handleSocialChange(index, "platform", v)
                        }
                      >
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
                        onChange={(e) =>
                          handleSocialChange(index, "link", e.target.value)
                        }
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
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8 w-full px-6"
                  >
                    <div className="space-y-2">
                      <h1 className="text-2xl font-semibold italic uppercase tracking-tighter text-white">
                        Select Your Character{" "}
                        <ChessKing className="inline ml-2 -mt-1 size-8 text-white" />
                      </h1>
                    </div>

                    <div className="relative px-6">
                      <Carousel
                        opts={{ align: "center" }}
                        className="w-full max-w-6xl mx-auto"
                      >
                        <CarouselContent className="-ml-6">
                          {Characters.map((char) => (
                            <CarouselItem
                              key={char.id}
                              className="pl-6 md:basis-1/2 lg:basis-1/4"
                            >
                              <CharacterCard
                                character={char}
                                selected={selectedCharacterId === char.id}
                                onSelect={() => {
                                  setSelectedCharacterId(char.id);
                                  applyCharacterTheme(
                                    char.theme as CharacterTheme,
                                  );
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
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-12 h-12 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold italic tracking-tigh uppercase">
                      Finalize Organization
                    </h1>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Your organization profile is ready. Click below to enter
                      the ecosystem.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-8 flex items-center justify-between border-t border-muted/30 mt-auto">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              ) : (
                <div />
              )}

              {step > 1 && (
                <Button
                  onClick={step === 2 ? handleStep2 : handleComplete}
                  disabled={loading}
                  className="rounded-full text-xs px-8 py-1! min-w-[120px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-semibold"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {step === totalSteps ? "Complete Onboarding" : "Next Step"}{" "}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/80 font-medium uppercase tracking-[0.2em]">
        <span>© 2026 Bounty Monster</span>
      </div>
    </div>
  );
};

export default Onboarding;
