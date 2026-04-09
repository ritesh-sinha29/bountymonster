import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Trophy, X, Calendar as CalendarIcon } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { deleteUploadThingFile } from "@/app/api/uploadthing/action";

export const BountyBasicDetails = ({ form, rewardPerHunter }: { form: any; rewardPerHunter: number }) => {
  return (
    <>
      <Card className="bg-white/2 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Main Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bounty Title</FormLabel>
                <FormControl>
                  <Input placeholder="Bounty Name (Required)" {...field} className="h-10 bg-black/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Explain exactly what needs to be delivered... (Required)" 
                    className="min-h-[130px] bg-black/20 resize-none"
                    maxLength={700}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
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
              control={form.control}
              name="requirementLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Level</FormLabel>
                  <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number.parseInt(e.target.value))}
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="h-10 bg-black/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        placeholder="0"
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Submission Deadline <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-11 bg-white/5 border-white/10 text-left font-medium text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 group",
                          !field.value && "text-white/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a deadline</span>
                          )}
                        </div>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black/90 border-white/10 backdrop-blur-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="bg-transparent"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-[10px] text-white/30 italic">
                  Once this date passes, no new hunters can join the bounty.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/2 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-tight">Reward Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="reward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    <span>Total Bounty Pool <span className="text-red-500">*</span></span>
                    <span className="text-xs text-orange-500 font-bold whitespace-nowrap uppercase tracking-tighter">
                      {field.value === 0 ? "FREE" : `${rewardPerHunter} credits / hunter`}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number.parseFloat(e.target.value))}
                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="h-12 bg-black/20 pl-11 pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-bold" 
                        placeholder="e.g. 500" 
                        step="any"
                      />
                      {(!field.value && field.value !== 0) && (
                        <button 
                          type="button" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            field.onChange(0); 
                          }} 
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-[10px] px-3 py-1.5 rounded-md transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-widest"
                        >
                          FREE
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxHunters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Hunters</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number.parseInt(e.target.value))}
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="h-12 bg-black/20 pl-11 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        placeholder="e.g. 10" 
                        min={5}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="xpReward"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Total XP</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        readOnly
                        className="h-12 bg-black/20 pl-11 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-not-allowed opacity-70" 
                        placeholder="Calculated automatically" 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-[10px] text-white/30 italic">
                    Calculated automatically based on Bounty difficulty (task count).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center text-white/90">
                  <span>Cover Image</span>
                  {field.value && (
                    <button 
                       type="button" 
                       onClick={async () => {
                         const fileUrl = field.value;
                         const fileKey = fileUrl.split("/").pop();
                         
                         field.onChange(""); // Clear UI immediately
                         
                         if (fileKey) {
                           try {
                             const result = await deleteUploadThingFile(fileKey);
                             if (result.success) {
                               toast.success("Image removed from storage");
                             } else {
                               console.error("Failed to delete from storage:", result.error);
                             }
                           } catch (error) {
                             console.error("Deletion error:", error);
                           }
                         }
                       }}
                       className="text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase font-bold tracking-widest flex items-center gap-1 bg-red-400/5 px-2 py-1 rounded"
                    >
                      <X className="w-3 h-3"/> Remove
                    </button>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    {field.value ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group shadow-2xl">
                        <Image 
                          src={field.value} 
                          alt="Cover preview" 
                          fill 
                          unoptimized
                          priority
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">Active Cover Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-white/10 rounded-2xl bg-white/2 hover:bg-white/4 transition-all overflow-hidden">
                        <UploadDropzone
                          endpoint="bountyImage"
                          onClientUploadComplete={(res) => {
                            if (res?.[0]) {
                              field.onChange(res[0].url);
                              toast.success("Image uploaded successfully!");
                            }
                          }}
                          onUploadError={(error: Error) => {
                             toast.error(`Upload failed: ${error.message}`);
                          }}
                          className="ut-label:text-primary ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:text-black ut-button:font-bold border-none h-[220px]"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
};
