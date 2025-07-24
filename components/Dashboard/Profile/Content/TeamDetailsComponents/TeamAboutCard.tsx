import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface TeamAboutCardProps {
  teamId: string;
  description: string | null | undefined;
  className?: string;
  onUpdateDescription?: (
    teamId: string,
    newDescription: string
  ) => Promise<void>;
}

export const TeamAboutCard = ({
  teamId,
  description,
  className = "",
  onUpdateDescription,
}: TeamAboutCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description || "");
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local state when description prop changes
  useEffect(() => {
    setDescriptionText(description || "");
  }, [description]);

  // Focus the textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionText(e.target.value);
  };

  const handleCancel = () => {
    setDescriptionText(description || "");
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    // Check if the description has actually changed
    if (descriptionText === description) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);

      if (onUpdateDescription) {
        await onUpdateDescription(teamId, descriptionText);
        toast.success("Team description updated successfully");
      } else {
        console.warn(
          "onUpdateDescription function not provided to TeamAboutCard"
        );
      }
    } catch (error) {
      console.error("Error updating team description:", error);
      toast.error("Failed to update team description");
      // Reset to original on error
      setDescriptionText(description || "");
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm text-muted-foreground">
                Description
              </h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleEditClick}
                >
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  <span className="sr-only">Edit description</span>
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  value={descriptionText}
                  onChange={handleDescriptionChange}
                  placeholder="Add a team description..."
                  className="min-h-[100px] resize-y"
                  disabled={isSaving}
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 animate-pulse" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-base">
                {descriptionText || "No description provided."}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
