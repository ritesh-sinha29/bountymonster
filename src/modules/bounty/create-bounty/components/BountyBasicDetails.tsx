import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Trophy } from "lucide-react";

/**
 * Renders the primary details form for creating a new bounty.
 * Captures title, description, category, required level, cover image, and reward configurations.
 */
export const BountyBasicDetails = ({ form, rewardPerHunter, currencySymbol }: { form: any; rewardPerHunter: number; currencySymbol: string }) => {
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
                        placeholder="1"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-black/20">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="CNY">CNY (¥)</SelectItem>
                      <SelectItem value="CHF">CHF (₣)</SelectItem>
                      <SelectItem value="SGD">SGD (S$)</SelectItem>
                      <SelectItem value="NZD">NZD (NZ$)</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="ETH">ETH (Ξ)</SelectItem>
                      <SelectItem value="BTC">BTC (₿)</SelectItem>
                      <SelectItem value="SOL">SOL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    <span>Total Prize Pool <span className="text-red-500">*</span></span>
                    <span className="text-xs text-orange-500 font-bold whitespace-nowrap">
                      {field.value === 0 ? "FREE" : `${currencySymbol}${rewardPerHunter} / hunter`}
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
                        className="h-12 bg-black/20 pl-11 pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
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
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs px-4 py-1.5 rounded-md transition-all shadow-md active:scale-95 cursor-pointer"
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
                <FormItem>
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
                <FormLabel>Cover Image Preview URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Valid Image URL (Required)" {...field} className="h-12 bg-black/20" />
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
    </>
  );
};
