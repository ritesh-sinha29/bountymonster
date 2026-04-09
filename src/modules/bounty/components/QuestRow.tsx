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
import { useUploadThing, UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X, Link as LinkIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { deleteUploadThingFile } from "@/app/api/uploadthing/action";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";



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
  isCompleted?: boolean;
  isCreator?: boolean;
  allSubmissions?: any[];
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
  isCompleted,
  isCreator,
  allSubmissions,
}: QuestRowProps) {
  const mySubmissions = useQuery(api.participants.getMySubmissions, { bountyId });
  const submitQuest = useMutation(api.participants.submitQuest);
  const approveSubmission = useMutation(api.participants.approveSubmission);
  const rejectSubmission = useMutation(api.participants.rejectSubmission);

  const mySubmission = mySubmissions?.find((s: any) => s.taskIndex === idx);
  
  // Filter submissions for this specific task
  const taskSubmissions = allSubmissions?.filter((s) => s.taskIndex === idx) || [];
  const pendingSubmissions = taskSubmissions.filter(s => s.status === "pending");
  const decidedSubmissions = taskSubmissions.filter(s => s.status !== "pending");

  const [showUpload, setShowUpload] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<"image" | "link">("image");
  const [proofUrls, setProofUrls] = useState<string[]>([]);
  const [driveLink, setDriveLink] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [showDecided, setShowDecided] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const { startUpload } = useUploadThing("submissionProof");


  const MAX_FILES = 2;
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleDeleteFile = async (url: string) => {
    const fileKey = url.split("/").pop();
    setProofUrls((prev) => prev.filter((u) => u !== url));
    
    if (fileKey) {
      try {
        await deleteUploadThingFile(fileKey);
        toast.success("Image removed");
      } catch (error) {
        console.error("Deletion error:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (submissionMode === "image" && proofUrls.length === 0) {
      toast.error("Please upload at least one proof image");
      return;
    }
    if (submissionMode === "link" && !driveLink.trim()) {
      toast.error("Please provide a Google Drive link");
      return;
    }

    setSubmitting(true);
    try {
      const finalUrls = submissionMode === "image" ? proofUrls : [driveLink];

      await submitQuest({
        bountyId,
        taskIndex: idx,
        proofUrls: finalUrls,
        note: note || undefined,
      });

      toast.success(`Quest ${idx + 1} submitted! Pending review.`);
      setShowUpload(false);
      setProofUrls([]);
      setDriveLink("");
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
    !isCompleted &&
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
          <div className="mt-4 space-y-4 p-4 rounded-xl border border-white/10 bg-black/30">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-primary" />
                Quest Proof
              </p>
              
              <div className="flex items-center bg-white/[0.03] p-0.5 rounded-lg border border-white/5">
                <button
                  onClick={() => setSubmissionMode("image")}
                  className={cn(
                    "px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-300",
                    submissionMode === "image" ? "bg-primary text-primary-foreground shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]" : "text-white/30 hover:text-white/50"
                  )}
                >
                  Upload
                </button>
                <button
                  onClick={() => setSubmissionMode("link")}
                  className={cn(
                    "px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-300",
                    submissionMode === "link" ? "bg-primary text-primary-foreground shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]" : "text-white/30 hover:text-white/50"
                  )}
                >
                  Link
                </button>
              </div>
            </div>

            {submissionMode === "image" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <AnimatePresence>
                    {proofUrls.map((url, i) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        onClick={() => setLightboxImage(url)}
                        className="relative aspect-video rounded-xl overflow-hidden border border-white/5 group shadow-2xl cursor-pointer"
                      >
                        <Image src={url} alt="Proof" fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(url)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md text-white/80 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95 border border-white/10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isUploadingFiles && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-video rounded-xl overflow-hidden border border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-2"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0,transparent_70%)] animate-pulse" />
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      <span className="text-[10px] font-bold text-primary animate-pulse tracking-widest uppercase">Uploading...</span>
                    </motion.div>
                  )}
                </div>

                {proofUrls.length < 2 && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      if (files.length > 0) {
                        setIsUploadingFiles(true);
                        try {
                          const res = await startUpload(files.slice(0, 2 - proofUrls.length));
                          if (res) {
                            setProofUrls(prev => [...prev, ...res.map(f => f.url)].slice(0, 2));
                            toast.success("Proof uploaded!");
                          }
                        } finally {
                          setIsUploadingFiles(false);
                        }
                      }
                    }}
                    className="group relative cursor-pointer border-2 border-dashed border-white/5 hover:border-primary/30 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 min-h-[160px] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          setIsUploadingFiles(true);
                          try {
                            const res = await startUpload(files.slice(0, 2 - proofUrls.length));
                            if (res) {
                              setProofUrls(prev => [...prev, ...res.map(f => f.url)].slice(0, 2));
                              toast.success("Proof uploaded!");
                            }
                          } finally {
                            setIsUploadingFiles(false);
                          }
                        }
                      }}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="flex flex-col items-center gap-3">
                       <h3 className="text-sm font-bold text-white/90">
                        Choose file(s) or drag and drop
                      </h3>
                      <div className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-bold uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-lg shadow-primary/10">
                        Select Files
                      </div>
                      <p className="text-[11px] font-medium text-white/40">
                        Images up to 4MB, max 2
                      </p>
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] text-white/20 text-center uppercase tracking-[0.2em] font-black">
                  PNG · JPG · GIF — MAX 2 FILES — UP TO 5MB EACH
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="Paste Google Drive link here..."
                    className="h-11 bg-white/5 border-white/10 pl-10 focus:border-primary/40 focus:ring-0 transition-all"
                  />
                </div>
                <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold flex items-center gap-1.5 px-1">
                  <FileText className="w-3 h-3" /> Make sure link is shared as 'Anyone with the link can view'
                </p>
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
                disabled={submitting || (submissionMode === "image" ? proofUrls.length === 0 : !driveLink.trim())}
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
                  setProofUrls([]);
                  setDriveLink("");
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

      {isCreator && taskSubmissions.length > 0 && (
        <div className="mt-6 border-t border-white/5 pt-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h5 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              Submissions Review ({pendingSubmissions.length} Pending)
            </h5>
          </div>

          <div className="space-y-3">
             {/* Pending First */}
             {pendingSubmissions.map((sub) => (
               <div key={sub._id} className="p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-3">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                        {sub.submitterAvatar ? (
                          <img src={sub.submitterAvatar} alt={sub.submitterName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-primary">{sub.submitterName[0]}</span>
                        )}
                     </div>
                     <span className="text-xs font-bold text-white/80">{sub.submitterName}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Button
                       onClick={() => {
                         toast.promise(approveSubmission({ submissionId: sub._id }), {
                           loading: "Approving...",
                           success: "Submission approved!",
                           error: (err) => err.message
                         });
                       }}
                       size="sm"
                       className="h-7 px-3 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md"
                     >
                       Accept
                     </Button>
                     <Button
                       onClick={() => {
                        toast.promise(rejectSubmission({ submissionId: sub._id }), {
                          loading: "Rejecting...",
                          success: "Submission rejected",
                          error: (err) => err.message
                        });
                      }}
                       variant="ghost"
                       size="sm"
                       className="h-7 px-3 text-red-400 hover:text-red-500 hover:bg-red-500/10 text-[10px] font-bold uppercase tracking-widest rounded-md"
                     >
                       Reject
                     </Button>
                   </div>
                 </div>

                 {sub.note && (
                   <p className="text-xs text-white/60 italic leading-relaxed px-1">
                     "{sub.note}"
                   </p>
                 )}

                 <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {sub.proofUrls.map((url: string, i: number) => {
                      const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes("utfs.io/f/");
                      if (isImage) {
                        return (
                          <button 
                            key={i} 
                            onClick={() => setLightboxImage(url)}
                            className="shrink-0 group relative w-20 h-16 rounded-md border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center cursor-pointer"
                          >
                            <img src={url} alt="Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ExternalLink className="w-3 h-3 text-white" />
                            </div>
                          </button>
                        );
                      }
                      return (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="shrink-0 group relative w-20 h-16 rounded-md border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <ExternalLink className="w-4 h-4 text-blue-400" />
                            <span className="text-[8px] font-bold uppercase text-blue-400/70">View Link</span>
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="w-3 h-3 text-white" />
                          </div>
                        </a>
                      );
                    })}
                 </div>
               </div>
             ))}

             {/* Decided Items */}
             {decidedSubmissions.length > 0 && (
               <div className="pt-2">
                 <button 
                  onClick={() => setShowDecided(!showDecided)}
                  className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] hover:text-white/40 transition-colors flex items-center gap-1.5 ml-1"
                 >
                   {showDecided ? "Hide History" : `Show History (${decidedSubmissions.length})`}
                 </button>
                 
                 {showDecided && (
                   <div className="mt-3 space-y-2 opacity-60 grayscale-[0.5]">
                      {decidedSubmissions.map((sub) => (
                        <div key={sub._id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-white/50">{sub.submitterName}</span>
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                sub.status === "approved" ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                              )}>
                                {sub.status}
                              </span>
                           </div>
                           <a href={sub.proofUrls[0]} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white">
                              <ExternalLink className="w-3 h-3" />
                           </a>
                        </div>
                      ))}
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      )}
      {/* Image Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none overflow-hidden sm:rounded-2xl">
          <DialogTitle className="sr-only">Submission Proof Preview</DialogTitle>
          {lightboxImage && (
            <div className="relative w-full aspect-auto flex items-center justify-center p-2">
              <img 
                src={lightboxImage} 
                alt="Enlarged Proof" 
                className="max-h-[85vh] w-auto rounded-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
