"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Target,
  ExternalLink,
  Zap,
  Upload,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Definition of the explicit interface required for generating a quest row.
 */
interface QuestRowProps {
  task: {
    name: string;
    description: string;
    url?: string;
    xp: number;
  };
  idx: number;
  bountyId: Id<"bounties">;
  isParticipating: boolean;
}

/**
 * Comprehensive row component detailing a specific quest within a bounty.
 * Handles display logic, submission states, dynamic interactions, and file upload validation.
 */
export function QuestRow({
  task,
  idx,
  bountyId,
  isParticipating,
}: QuestRowProps) {
  const submissions = useQuery(api.participants.getMySubmissions, { bountyId });
  const submitQuest = useMutation(api.participants.submitQuest);

  const mySubmission = submissions?.find((s: any) => s.taskIndex === idx);

  const [showUpload, setShowUpload] = useState(false);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 2;
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    e.target.value = "";

    const oversized = incoming.filter((f) => f.size >= MAX_SIZE_BYTES);
    if (oversized.length > 0) {
      toast.error(`Each file must be less than ${MAX_SIZE_MB}MB. Oversized files were skipped.`);
    }

    const valid = incoming.filter((f) => f.size < MAX_SIZE_BYTES);
    setProofFiles((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > MAX_FILES) {
        toast.error(`Max ${MAX_FILES} proof files allowed per quest.`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
  };

  const removeFile = (i: number) =>
    setProofFiles((prev) => prev.filter((_, fi) => fi !== i));

  const handleSubmit = async () => {
    if (proofFiles.length === 0) {
      toast.error("Please upload at least one proof image");
      return;
    }
    setSubmitting(true);
    try {
      const stubUrls = proofFiles.map((f) => `pending-upload::${f.name}`);

      await submitQuest({
        bountyId,
        taskIndex: idx,
        proofUrls: stubUrls,
        note: note || undefined,
      });

      toast.success(`Quest ${idx + 1} submitted! Pending review.`);
      setShowUpload(false);
      setProofFiles([]);
      setNote("");
    } catch (e: any) {
      toast.error(e.message ?? "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = () => {
    if (!mySubmission) return null;
    const map = {
      pending: {
        icon: <Clock className="w-3 h-3" />,
        label: "Pending Review",
        cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      },
      approved: {
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Approved",
        cls: "text-green-400 bg-green-500/10 border-green-500/20",
      },
      rejected: {
        icon: <XCircle className="w-3 h-3" />,
        label: "Rejected – Resubmit",
        cls: "text-red-400 bg-red-500/10 border-red-500/20",
      },
    } as const;
    const s = map[mySubmission.status as keyof typeof map];
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
          s.cls,
        )}
      >
        {s.icon}
        {s.label}
      </span>
    );
  };

  const canSubmit =
    isParticipating &&
    (!mySubmission || mySubmission.status === "rejected");

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="mt-0.5 shrink-0">
        <Target className="w-5 h-5 text-blue-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">
          Quest {idx + 1}
        </div>
        <h4 className="font-bold text-white">{task.name}</h4>
        {task.description && (
          <p className="text-sm text-white/50 mt-1 whitespace-pre-wrap break-words">
            {task.description}
          </p>
        )}
        {task.url && (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 hover:underline break-all"
          >
            <ExternalLink className="w-3 h-3" />
            {task.url}
          </a>
        )}

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <Zap className="w-3 h-3 text-yellow-500" />+{task.xp || 50} XP
          </div>
          {statusBadge()}
        </div>

        {isParticipating && showUpload && (
          <div className="mt-4 space-y-3 p-4 rounded-xl border border-white/10 bg-black/30">
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-primary" />
              Upload Proof
            </p>

            <div
              onClick={() => proofFiles.length < 2 && fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 transition-colors group",
                proofFiles.length < 2
                  ? "border-white/10 hover:border-primary/40 cursor-pointer"
                  : "border-white/5 opacity-40 cursor-not-allowed",
              )}
            >
              <ImagePlus className="w-6 h-6 text-white/20 group-hover:text-primary/50 transition-colors" />
              <p className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                {proofFiles.length === 0
                  ? "Click to select screenshots or images"
                  : proofFiles.length < 2
                  ? "Add 1 more file (optional)"
                  : "Max files reached"}
              </p>
              <p className="text-[10px] text-white/20">
                PNG, JPG, GIF · Max 2 files · Upload less then 5 MB 
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={proofFiles.length >= 2}
              onChange={handleFileChange}
              className="hidden"
            />

            {proofFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {proofFiles.map((f, fi) => (
                  <div
                    key={fi}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60"
                  >
                    <ImagePlus className="w-3 h-3 text-primary/50" />
                    <span className="max-w-[120px] truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(fi)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note about your submission…"
              rows={2}
              className="w-full resize-none rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-colors"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={submitting || proofFiles.length === 0}
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-bold gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Submit Quest
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowUpload(false);
                  setProofFiles([]);
                  setNote("");
                }}
                variant="ghost"
                size="sm"
                className="text-white/40 hover:text-white/70"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {canSubmit && !showUpload && (
        <div className="shrink-0 flex items-start pt-1">
          <Button
            onClick={() => setShowUpload(true)}
            size="sm"
            className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest gap-1.5 transition-all"
          >
            <Upload className="w-3 h-3" />
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
