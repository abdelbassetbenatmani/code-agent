import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/components/utils/getTeamIcon";
import { formatDate } from "@/lib/formatDate";
import { ArrowLeft, UserPlus } from "lucide-react";

interface TeamHeaderProps {
  team: {
    name: string;
    icon: string;
    createdAt: string | Date;
  };
  onBack: () => void;
  onInvite: () => void;
}

export const TeamHeader = ({ team, onBack, onInvite }: TeamHeaderProps) => {
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
            <h2 className="text-2xl font-bold">{team.name}</h2>
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
