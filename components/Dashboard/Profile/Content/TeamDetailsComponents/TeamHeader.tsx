import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/components/utils/getTeamIcon";
import { formatDate } from "@/lib/formatDate";
import { ArrowLeft, UserPlus, Pencil, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface TeamHeaderProps {
  team: {
    id: string;
    name: string;
    icon: string;
    createdAt: string | Date;
  };
  onBack: () => void;
  onInvite: () => void;
  onUpdateTeamName?: (teamId: string, newName: string) => Promise<void>;
}

export const TeamHeader = ({ 
  team, 
  onBack, 
  onInvite, 
  onUpdateTeamName 
}: TeamHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState(team.name);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text in the input
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleEditClick = () => {
    if (team.name === "Personal") return;
    setIsEditing(true);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };
  
  const handleNameSubmit = async () => {
    // Don't save if name is empty or unchanged
    if (!teamName.trim() || teamName === team.name) {
      setTeamName(team.name); // Reset to original if empty
      setIsEditing(false);
      return;
    }
    
    try {
      setIsSaving(true);
      
      if (onUpdateTeamName) {
        await onUpdateTeamName(team.id, teamName.trim());
        toast.success("Team name updated successfully");
      } else {
        // Fallback if no update function is provided
        console.warn("onUpdateTeamName function not provided to TeamHeader");
      }
    } catch (error) {
      console.error("Error updating team name:", error);
      toast.error("Failed to update team name");
      setTeamName(team.name); // Reset on error
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };
  
  // Handle blur event (save on blur)
  const handleBlur = () => {
    handleNameSubmit();
  };
  
  // Handle key press (save on Enter, cancel on Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    } else if (e.key === "Escape") {
      setTeamName(team.name); // Reset to original
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-accent/50">
            {getIconComponent(team.icon)}
          </div>
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={teamName}
                  onChange={handleNameChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="h-9 text-xl font-bold px-2 py-1 focus-visible:ring-1"
                  disabled={isSaving}
                />
                {isSaving && <CheckCircle className="h-4 w-4 animate-pulse text-muted-foreground" />}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{teamName}</h2>
                {team.name !== "Personal" && (
                  <button 
                    onClick={handleEditClick}
                    className=""
                    aria-label="Edit team name"
                  >
                    <Pencil className="h-4 w-4 " />
                  </button>
                )}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Created {formatDate(team.createdAt)}
            </p>
          </div>
        </div>
      </div>
      {team.name !== "Personal" && (
        <Button onClick={onInvite} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      )}
    </div>
  );
};