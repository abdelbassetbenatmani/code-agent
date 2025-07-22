"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Code,
  BarChart,
  Settings,
  FileCode,
  Shapes,
  PenTool,
  Gauge,
  Users,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { createTeam } from "@/app/lib/actions/teams";
import { useSession } from "next-auth/react";
import useTeamStore from "@/lib/store/teams";

// Define the form schema
const teamFormSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name cannot exceed 50 characters"),
  icon: z.enum(
    [
      "code",
      "chart",
      "settings",
      "file",
      "shapes",
      "pen",
      "gauge",
      "users",
      "sparkles",
    ],
    {
      required_error: "Please select a team icon",
    }
  ),
  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

// Icon mapping for the radio group
const teamIcons = [
  { value: "code", icon: <Code className="h-5 w-5" /> },
  { value: "chart", icon: <BarChart className="h-5 w-5" /> },
  { value: "settings", icon: <Settings className="h-5 w-5" /> },
  { value: "file", icon: <FileCode className="h-5 w-5" /> },
  { value: "shapes", icon: <Shapes className="h-5 w-5" /> },
  { value: "pen", icon: <PenTool className="h-5 w-5" /> },
  { value: "gauge", icon: <Gauge className="h-5 w-5" /> },
  { value: "users", icon: <Users className="h-5 w-5" /> },
  { value: "sparkles", icon: <Sparkles className="h-5 w-5" /> },
];

const CreateTeam = ({
  setIsDialogOpen,
}: {
  setIsDialogOpen: (open: boolean) => void;
}) => {
  const session = useSession();

  const { addTeam } = useTeamStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      icon: "code",
      description: "",
    },
  });

  async function onSubmit(data: TeamFormValues) {
    setIsSubmitting(true);

    try {
      // Replace with your actual API call to create team
      const response = await createTeam({
        name: data.name,
        icon: data.icon,
        userId: session?.data?.user?.id as string,
        description: data.description,
      });
      // Add the new team to the store
      addTeam({
        id: response.id,
        name: response.name,
        icon: response.icon,
        description: response.description,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        ownerId: response.ownerId,
      });

      // Reset the form
      form.reset();

      setIsDialogOpen(false);

      // Close the dialog (if needed)
      // You might want to use a callback prop to close the dialog
    } catch (error) {
      console.error("Failed to create team:", error);
      toast.error("Failed to create team. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter team name"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormDescription>
                  This is your team&apos;s display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter team description"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormDescription>
                  A brief description of your team&apos;s purpose.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Team Icon</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    {teamIcons.map((item) => (
                      <FormItem
                        key={item.value}
                        className="flex flex-col items-center space-y-2"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={item.value}
                            id={item.value}
                            className="sr-only"
                          />
                        </FormControl>
                        <label
                          htmlFor={item.value}
                          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border-2 ${
                            field.value === item.value
                              ? "border-primary bg-primary/10"
                              : "border-muted bg-transparent hover:border-muted-foreground/20 hover:bg-muted"
                          }`}
                        >
                          {item.icon}
                        </label>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTeam;
