import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TeamAboutCardProps {
  description: string | null | undefined;
  className?: string;
}

export const TeamAboutCard = ({ description, className = "" }: TeamAboutCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">
              Description
            </h3>
            <p className="text-base">
              {description || "No description provided."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};