import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DangerZoneCardProps {
  onDeleteClick: () => void;
}

export const DangerZoneCard = ({ onDeleteClick }: DangerZoneCardProps) => {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Actions that can&apos;t be undone.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertTitle>Delete Team</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Once you delete a team, there is no going back. This action
              permanently deletes the team and removes all members.
            </p>
            <Button
              variant="destructive"
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Team
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};