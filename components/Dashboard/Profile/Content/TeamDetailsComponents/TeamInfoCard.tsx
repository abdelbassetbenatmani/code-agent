import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TeamInfoCardProps {
  teamId: string;
  owner: {
    id: string;
    name?: string | null;
  } | null | undefined;
  className?: string;
}

export const TeamInfoCard = ({ teamId, owner, className = "" }: TeamInfoCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">
            ID
          </h3>
          <p className="text-sm font-mono bg-muted p-1 rounded">{teamId}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">
            Owner
          </h3>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              {owner?.name?.charAt(0) || "O"}
            </div>
            <p>{owner?.name || "Unknown"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};