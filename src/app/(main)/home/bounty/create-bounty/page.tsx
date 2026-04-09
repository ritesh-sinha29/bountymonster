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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Crosshair,
  LucideCrosshair,
} from "lucide-react";
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
  return taskCount * 150;
};


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
      maxHunters: undefined,
      reward: undefined,
      type: "",
      coverImage: "",
      xpReward: undefined,
      requirementLevel: 1,
      tasks: [{ name: "", description: "", url: "", xp: 150 }],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  const watchAll = form.watch();
  const xpReward = form.watch("xpReward");
  const tasks = form.watch("tasks");
  const maxHunters = form.watch("maxHunters");
  const reward = form.watch("reward");
  const type = form.watch("type");

  useEffect(() => {
    const totalXP = calculateTotalXP(tasks.length);
    if (totalXP !== xpReward) {
      form.setValue("xpReward", totalXP, { shouldValidate: true });
    }
  }, [tasks.length, form, xpReward]);

  const rewardPerHunter = Math.floor((reward || 0) / (maxHunters > 0 ? maxHunters : 1));

  const onFormError = (errors: any) => {
    // Priority 1: Thumbnail check
    if (errors.coverImage) {
      toast.error("A high-impact thumbnail is mandatory before launch.", {
        description: "Please upload an image to continue."
      });
      return;
    }
    
    // Priority 2: Tasks check
    if (errors.tasks) {
      toast.error("Every mission needs at least one objective.", {
        description: "Add a task and define what hunters need to do."
      });
      return;
    }

    // Priority 3: Reward / Hunters
    if (errors.reward || errors.maxHunters) {
        toast.warning("Check your reward strategy.", {
            description: "Ensure the pool and hunter count are set correctly."
        });
        return;
    }

    // General fallback for title/description
    toast.warning("Some intel is missing.", {
        description: "Please double check the bounty details form."
    });
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const finalXPPerTask = Math.floor(values.xpReward / values.tasks.length);
      const finalTasks = values.tasks.map(t => ({ 
        ...t, 
        url: t.url && t.url.trim() !== "" ? t.url : undefined,
        xp: finalXPPerTask 
      }));

      await createBounty({
        name: values.name,
        description: values.description,
        reward: values.reward,
        maxHunters: values.maxHunters,
        rewardPerHunter: Math.floor(values.reward / values.maxHunters),
        type: values.type,
        coverImage: values.coverImage,
        xpReward: values.xpReward,
        requirementLevel: values.requirementLevel,
        tasks: finalTasks,
        deadline: values.deadline.getTime(),
      });

      toast.success("Bounty launched successfully!", {
        description: "Your mission is now live for all hunters."
      });
      router.push("/home/bounty");
    } catch (error) {
      toast.error("Forge failed: Failed to transmit bounty data.", {
        description: "Please check your terminal connection and try again."
      });
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
              <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-6">
                <BountyBasicDetails form={form} rewardPerHunter={rewardPerHunter} />
                <BountyTaskFields form={form} fields={fields} append={append} remove={remove} currentTaskXP={currentTaskXP} />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-10 text-lg font-bold text-white tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all cursor-pointer"
                >
                  {isSubmitting ? "FORGING BOUNTY..." : "LAUNCH BOUNTY"} <LucideCrosshair className="w-4 h-4" />
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-5 relative">
            <BountyPreview watchAll={watchAll} tasksCount={tasks.length} reward={reward} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBountyPage;