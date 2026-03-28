"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { BountyTag, BountyStatus } from "../types";
import {
  Plus,
  X,
  Sparkles,
  DollarSign,
  Calendar,
  Tag,
  ListChecks,
  FileText,
  ChevronRight,
} from "lucide-react";

const AVAILABLE_TAGS: BountyTag[] = [
  "bug",
  "feature",
  "design",
  "security",
  "documentation",
  "performance",
  "devops",
  "frontend",
  "backend",
  "mobile",
  "ai",
  "blockchain",
];

const TAG_COLORS: Record<BountyTag, string> = {
  bug: "bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25",
  feature: "bg-blue-500/15 text-blue-400 border-blue-500/20 hover:bg-blue-500/25",
  design: "bg-pink-500/15 text-pink-400 border-pink-500/20 hover:bg-pink-500/25",
  security: "bg-orange-500/15 text-orange-400 border-orange-500/20 hover:bg-orange-500/25",
  documentation: "bg-slate-500/15 text-slate-400 border-slate-500/20 hover:bg-slate-500/25",
  performance: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/25",
  devops: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/25",
  frontend: "bg-violet-500/15 text-violet-400 border-violet-500/20 hover:bg-violet-500/25",
  backend: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25",
  mobile: "bg-teal-500/15 text-teal-400 border-teal-500/20 hover:bg-teal-500/25",
  ai: "bg-purple-500/15 text-purple-400 border-purple-500/20 hover:bg-purple-500/25",
  blockchain: "bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25",
};

interface CreateBountyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export const CreateBountyDialog = ({
  open,
  onOpenChange,
  onCreated,
}: CreateBountyDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedTags, setSelectedTags] = useState<BountyTag[]>([]);
  const [tasks, setTasks] = useState<string[]>([""]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "expert">("medium");
  const [status, setStatus] = useState<BountyStatus>("active");

  const toggleTag = (tag: BountyTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addTask = () => setTasks((prev) => [...prev, ""]);
  const removeTask = (index: number) =>
    setTasks((prev) => prev.filter((_, i) => i !== index));
  const updateTask = (index: number, value: string) =>
    setTasks((prev) => prev.map((t, i) => (i === index ? value : t)));

  const createBounty = useMutation(api.bounties.createBounty);

  const handleSubmit = async () => {
    try {
      await createBounty({
        name: title,
        description: description,
        reward: Number(reward) || 0,
        type: selectedTags.join(", ") || "General",
        coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop", // default cover image
        xpReward: difficulty === "expert" ? 500 : difficulty === "hard" ? 300 : difficulty === "medium" ? 200 : 100,
        requirementLevel: difficulty === "expert" ? 10 : difficulty === "hard" ? 5 : difficulty === "medium" ? 3 : 1,
        tasks: tasks.filter(t => t.trim() !== "").map(t => ({
          name: t,
          description: "",
          xp: 50
        }))
      });

      onCreated();
      onOpenChange(false);
      // Reset form
      setTitle("");
      setDescription("");
      setReward("");
      setDeadline("");
      setSelectedTags([]);
      setTasks([""]);
      setDifficulty("medium");
      setStatus("active");
    } catch (error) {
      console.error("Failed to create bounty:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-xl border-white/[0.08] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            Create New Bounty
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/60">
            Set up a new bounty for hunters to discover and work on.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/70 flex items-center gap-1.5">
              <FileText className="size-3" />
              Bounty Title
            </label>
            <Input
              placeholder="e.g. Fix authentication bypass vulnerability"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 h-10"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/70">Description</label>
            <Textarea
              placeholder="Describe the bounty in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 min-h-[80px] resize-none"
            />
          </div>

          {/* Reward + Deadline + Status Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground/70 flex items-center gap-1.5">
                <DollarSign className="size-3" />
                Reward (USD)
              </label>
              <Input
                type="number"
                placeholder="1000"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground/70 flex items-center gap-1.5">
                <Calendar className="size-3" />
                Deadline
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground/70">Status</label>
              <div className="flex gap-1.5">
                {(["active", "scheduled"] as BountyStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 text-[11px] font-medium py-2 rounded-lg border transition-all capitalize ${
                      status === s
                        ? "bg-primary/15 border-primary/30 text-primary"
                        : "bg-white/[0.02] border-white/[0.06] text-muted-foreground/50 hover:border-white/[0.12]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/70">Difficulty</label>
            <div className="flex gap-2">
              {(["easy", "medium", "hard", "expert"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 text-xs font-medium py-2 rounded-lg border transition-all capitalize ${
                    difficulty === d
                      ? d === "easy"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : d === "medium"
                          ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
                          : d === "hard"
                            ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                            : "bg-red-500/15 border-red-500/30 text-red-400"
                      : "bg-white/[0.02] border-white/[0.06] text-muted-foreground/50 hover:border-white/[0.12]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/70 flex items-center gap-1.5">
              <Tag className="size-3" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all capitalize ${
                    selectedTags.includes(tag)
                      ? TAG_COLORS[tag]
                      : "bg-white/[0.02] border-white/[0.06] text-muted-foreground/40 hover:border-white/[0.12]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/70 flex items-center gap-1.5">
              <ListChecks className="size-3" />
              Tasks
            </label>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-4 rounded-full border border-white/[0.1] flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-muted-foreground/40">{i + 1}</span>
                  </div>
                  <Input
                    placeholder={`Task ${i + 1}`}
                    value={task}
                    onChange={(e) => updateTask(i, e.target.value)}
                    className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 h-9 text-sm"
                  />
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(i)}
                      className="size-7 rounded-lg flex items-center justify-center text-muted-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTask}
                className="text-xs text-primary/60 hover:text-primary flex items-center gap-1 transition-colors pl-6"
              >
                <Plus className="size-3" />
                Add task
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
          >
            <Sparkles className="size-3.5" />
            Create Bounty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
