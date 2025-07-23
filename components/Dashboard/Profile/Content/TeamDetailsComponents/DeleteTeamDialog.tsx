import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  teamName: string;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
}

export const DeleteTeamDialog = ({
  isOpen,
  onOpenChange,
  teamName,
  isDeleting,
  onDelete,
}: DeleteTeamDialogProps) => {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmMatch = confirmText === teamName;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Team</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            team and remove all members.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="font-medium">
            Please type <span className="font-bold">{teamName}</span> to
            confirm:
          </p>
          <Input 
            className="mt-2" 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting || !isConfirmMatch}
          >
            {isDeleting ? "Deleting..." : "Delete Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};