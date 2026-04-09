"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crosshair, LucideCrosshair, Pencil } from "lucide-react";
import Link from "next/link";
import { BountyBasicDetails } from "@/modules/bounty/create-bounty/components/BountyBasicDetails";
import { BountyTaskFields } from "@/modules/bounty/create-bounty/components/BountyTaskFields";
import { BountyPreview } from "@/modules/bounty/create-bounty/components/BountyPreview";

const taskSchema = z.object({
  name: z.string().min(3, "Task name must be at least 3 characters"),
  description: z.string().min(5, "Task description must be at least 5 characters"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  xp: z.number(),
});

const formSchema = z.object({
  name: z.string().min(3, "Bounty name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(700, "Description maximum 700 letters"),
  maxHunters: z.number().min(5, "At least 5 hunters required"),
  reward: z.number().min(0, "Must be positive"),
  type: z.string().min(1, "Please select a bounty type"),
  coverImage: z.string().url("Must be a valid cover image URL"),
  xpReward: z.number(),
  requirementLevel: z.number().min(1, "Minimum level requirement is 1"),
  tasks: z.array(taskSchema).min(1, "At least one task is required"),
  deadline: z.date(),
});

type FormValues = z.infer<typeof formSchema>;
const calculateTotalXP = (taskCount: number) => {
  if (taskCount <= 0) return 0;
  if (taskCount === 1) return 250;
  if (taskCount === 2) return 600;
  if (taskCount === 3) return 800;
  if (taskCount === 4) return 1000;
  if (taskCount === 5) return 1200;
  
  const extraTasks = taskCount - 5;
  return 1200 + extraTasks * 150;
};

const EditBountyPage = () => {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as Id<"bounties">;
  
  const existingBounty = useQuery(api.bounties.getBounty, { id: bountyId });
  const currentUser = useQuery(api.users.getCurrentUser);
  
  // @ts-ignore
  const updateBounty = useMutation(api.bounties.updateBounty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      maxHunters: undefined,
      reward: undefined,
      type: "",
      coverImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000",
      xpReward: undefined,
      requirementLevel: 1,
      tasks: [{ name: "", description: "", url: "", xp: 0 }],
      deadline: undefined as any,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  // Load existing data when fetched
  useEffect(() => {
    if (existingBounty && currentUser && !dataLoaded) {
      if (existingBounty.creatorId !== currentUser._id) {
        toast.error("Unauthorized");
        router.push("/home/bounty");
        return;
      }
      
      form.reset({
        name: existingBounty.name,
        description: existingBounty.description,
        maxHunters: existingBounty.maxHunters || 10,
        reward: existingBounty.reward,
        // currency removed
        type: existingBounty.type,
        coverImage: existingBounty.coverImage,
        xpReward: existingBounty.xpReward,
        requirementLevel: existingBounty.requirementLevel,
        tasks: existingBounty.tasks || [{ name: "", description: "", url: "", xp: 0 }],
        deadline: new Date(existingBounty.deadline),
      });
      setDataLoaded(true);
    }
  }, [existingBounty, currentUser, form, router, dataLoaded]);

  const watchAll = form.watch();
  const xpReward = form.watch("xpReward");
  const tasks = form.watch("tasks");
  const maxHunters = form.watch("maxHunters");
  const reward = form.watch("reward");

  useEffect(() => {
    const totalXP = calculateTotalXP(tasks?.length || 0);
    if (totalXP !== xpReward) {
      form.setValue("xpReward", totalXP, { shouldValidate: true });
    }
  }, [tasks?.length, form, xpReward]);

  const rewardPerHunter = Math.floor((reward || 0) / (maxHunters > 0 ? maxHunters : 1));

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const finalXPPerTask = Math.floor(values.xpReward / values.tasks.length);
      const finalTasks = values.tasks.map(t => ({ 
        ...t, 
        url: t.url && t.url.trim() !== "" ? t.url : undefined,
        xp: finalXPPerTask 
      }));

      await updateBounty({
        id: bountyId,
        name: values.name,
        description: values.description,
        reward: values.reward,
        maxHunters: values.maxHunters,
        rewardPerHunter: Math.floor(values.reward / values.maxHunters),
        // currency removed
        type: values.type,
        coverImage: values.coverImage,
        xpReward: values.xpReward,
        requirementLevel: values.requirementLevel,
        tasks: finalTasks,
        deadline: values.deadline.getTime(),
      });

      toast.success("Bounty updated successfully!");
      router.push(`/home/bounty/${bountyId}`);
    } catch (error) {
      toast.error("Failed to update bounty.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTaskXP = Math.floor((xpReward || 0) / (tasks?.length || 1));

  if (existingBounty === undefined || currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <Link 
          href={`/home/bounty/${bountyId}`} 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Bounty</span>
        </Link>
        
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Edit <span className="text-primary">Bounty</span> <Pencil className="h-5 w-5 inline ml-2"/>
          </h1>
          <p className="text-muted-foreground text-lg">Update the Bounty parameters and objectives.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <BountyBasicDetails form={form} rewardPerHunter={rewardPerHunter} />
                <BountyTaskFields form={form} fields={fields} append={append} remove={remove} currentTaskXP={currentTaskXP} />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-10 text-lg font-bold text-white tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all cursor-pointer"
                >
                  {isSubmitting ? "UPDATING BOUNTY..." : "SAVE CHANGES"} <LucideCrosshair className="w-4 h-4" />
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-5 relative">
            <BountyPreview watchAll={watchAll} tasksCount={tasks?.length || 0} reward={reward || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBountyPage;
