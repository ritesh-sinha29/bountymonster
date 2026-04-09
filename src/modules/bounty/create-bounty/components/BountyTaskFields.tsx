import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export const BountyTaskFields = ({ form, fields, append, remove, currentTaskXP }: { form: any; fields: any[]; append: any; remove: any; currentTaskXP: number }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold uppercase tracking-tighter italic">
          Bounty <span className="text-primary">Tasks</span>
        </h2>
        <button 
          type="button" 
          onClick={() => append({ name: "", description: "", url: "", xp: 150 })}
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
                  control={form.control}
                  name={`tasks.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={`Task Name (Required)`} 
                          {...field} 
                          className="bg-black/40 border-none font-bold placeholder:font-normal" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tasks.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="What needs to be done in this task? (Required)" 
                          rows={2} 
                          {...field} 
                          className="bg-black/40 border-none resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tasks.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Task Resource URL (Optional)" 
                          {...field} 
                          className="bg-black/40 border-none font-bold placeholder:font-normal" 
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
  );
};
