"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Trophy, 
  Coins, 
  Layers, 
  Image as ImageIcon,
  ArrowLeft,
  Crosshair,
  LucideCrosshair
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const taskSchema = z.object({
  name: z.string().min(3, "Task name must be at least 3 characters"),
  description: z.string().min(5, "Task description must be at least 5 characters"),
  xp: z.number(),
});

const formSchema = z.object({
  name: z.string().min(3, "Bounty name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  reward: z.number().min(0, "Reward must be a positive number"),
  type: z.string().min(1, "Please select a bounty type"),
  coverImage: z.string().url("Must be a valid URL").or(z.literal("")),
  xpReward: z.number().min(10, "XP Reward must be at least 10"),
  requirementLevel: z.number().min(1, "Minimum level requirement is 1"),
  tasks: z.array(taskSchema).min(1, "At least one task is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateBountyPage = () => {
  const router = useRouter();
  // @ts-ignore
  const createBounty = useMutation(api.bounties.createBounty);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      reward: 0,
      type: "tech",
      coverImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000",
      xpReward: 1000,
      requirementLevel: 1,
      tasks: [{ name: "", description: "", xp: 1000 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  const watchAll = form.watch();
  const xpReward = form.watch("xpReward");
  const tasks = form.watch("tasks");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const finalXPPerTask = Math.floor(values.xpReward / values.tasks.length);
      const finalTasks = values.tasks.map(t => ({ ...t, xp: finalXPPerTask }));

      await createBounty({
        name: values.name,
        description: values.description,
        reward: values.reward,
        type: values.type,
        coverImage: values.coverImage,
        xpReward: values.xpReward,
        requirementLevel: values.requirementLevel,
        tasks: finalTasks,
      });

      toast.success("Bounty launched successfully!");
      router.push("/home/bounty");
    } catch (error) {
      toast.error("Failed to create bounty.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTaskXP = Math.floor(xpReward / (tasks.length || 1));

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <Link 
          href="/home/bounty" 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Bounties</span>
        </Link>
        
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Create <span className="text-primary">Bounty</span> <Crosshair className="h-5 w-5 inline ml-2"/>
          </h1>
          <p className="text-muted-foreground text-lg">Define the challenge, set the rewards, and let the hunters begin.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="bg-white/2 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold tracking-tight">Main Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control as any}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bounty Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Hackindia Community Post" {...field} className="h-10 bg-black/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Explain exactly what needs to be delivered..." 
                              className="min-h-[130px] bg-black/20 resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control as any}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-black/20">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tech">Technology</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="social">Social</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as any}
                        name="requirementLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Req. Level</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                className="h-10 bg-black/20" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/2 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold uppercase tracking-tight">Reward Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control as any}
                        name="reward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Reward</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                  className="h-12 bg-black/20 pl-11" 
                                  placeholder="0" 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="xpReward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total XP</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                  className="h-12 bg-black/20 pl-11" 
                                  placeholder="1000" 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control as any}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image Preview URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} className="h-12 bg-black/20" />
                          </FormControl>
                          <FormDescription className="text-xs">
                             Paste any image URL to see how it looks.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold uppercase tracking-tighter italic">
                      Mission <span className="text-primary">Tasks</span>
                    </h2>
                    <button 
                      type="button" 
                      onClick={() => append({ name: "", description: "", xp: 1000 })}
                      className="border border-primary/20 hover:bg-primary/10 text-primary px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-5 border border-white/10 rounded-2xl bg-white/1 relative group"
                        >
                          <div className="grid gap-4">
                            <FormField
                              control={form.control as any}
                              name={`tasks.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input 
                                      placeholder={`Task #${index + 1} Name`} 
                                      {...field} 
                                      className="bg-black/40 border-none font-bold placeholder:font-normal" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control as any}
                              name={`tasks.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="What needs to be done in this task?" 
                                      rows={2} 
                                      {...field} 
                                      className="bg-black/40 border-none resize-none"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-none font-bold">
                                +{currentTaskXP} XP
                              </Badge>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 cursor-pointer"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Task
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-10 text-lg font-bold text-white tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all cursor-pointer"
                >
                  {isSubmitting ? "FORGING BOUNTY..." : "LAUNCH MISSION"} <LucideCrosshair className="w-4 h-4" />
                </Button>
              </form>
            </Form>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-10 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-sm font-black uppercase text-white">
                   Spectral Preview
                 </h2>
                 <div className="flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   <div className="w-2 h-2 rounded-full bg-yellow-500" />
                   <div className="w-2 h-2 rounded-full bg-green-500" />
                 </div>
              </div>

              <div className="rounded-[2.5rem] border-8 border-white/10 bg-black overflow-hidden shadow-2xl">
                <div className="relative h-64 w-full bg-white/5">
                  {watchAll.coverImage ? (
                    <motion.img 
                      key={watchAll.coverImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      src={watchAll.coverImage} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-3">
                      <ImageIcon className="w-12 h-12" />
                      <span className="text-xs font-bold uppercase tracking-widest">Awaiting Visuals</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-primary text-black font-black uppercase italic text-[10px] px-3">
                      {watchAll.type || "MISSION"}
                    </Badge>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                     <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2 wrap-break-word line-clamp-2">
                       {watchAll.name || "UNNAMED BOUNTY"}
                     </h3>
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <Coins className="w-3.5 h-3.5" />
                          <span className="text-xs font-black">{watchAll.reward > 0 ? `${watchAll.reward}C` : "FREE"}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="flex items-center gap-1.5 text-blue-400">
                          <Trophy className="w-3.5 h-3.5" />
                          <span className="text-xs font-black">{watchAll.xpReward} XP</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="p-8 space-y-8 bg-black">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Briefing</h4>
                    <p className="text-sm text-white/70 leading-relaxed font-medium line-clamp-4 italic">
                      {watchAll.description || "The mission description will illuminate here once provided. Every saga needs a beginning..."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-2xl bg-white/3 border border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-white/30 uppercase block">Min Level</span>
                        <span className="text-xl font-black text-white">{watchAll.requirementLevel}</span>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/3 border border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-white/30 uppercase block">Tasks Count</span>
                        <span className="text-xl font-black text-white">{tasks.length}</span>
                     </div>
                  </div>

                  <div className="pt-4">
                    <div className="w-full h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                       <span className="text-lg text-muted-foreground  animate-pulse">
                         Ready for Launch
                       </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-linear-to-br from-primary/20 to-transparent border border-primary/10">
                 <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 h-fit">
                       <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                       <p className="font-black text-primary uppercase italic text-sm">Monster Protocol</p>
                       <p className="text-xs text-muted-foreground leading-relaxed">
                         Bounties are automatically distributed across the network. High-reward missions attract elite hunters more frequently.
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBountyPage;