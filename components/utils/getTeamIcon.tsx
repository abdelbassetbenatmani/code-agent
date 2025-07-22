// First, import all the icons you need at the top of your file
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Users,
  Search,
  Code,
  BarChart,
  Settings,
  FileCode,
  Shapes,
  PenTool,
  Gauge,
  Sparkles,
} from "lucide-react";

// Add this helper function inside your component
export const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    users: <Users className="h-4 w-4" />,
    code: <Code className="h-4 w-4" />,
    chart: <BarChart className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    file: <FileCode className="h-4 w-4" />,
    shapes: <Shapes className="h-4 w-4" />,
    pen: <PenTool className="h-4 w-4" />,
    gauge: <Gauge className="h-4 w-4" />,
    sparkles: <Sparkles className="h-4 w-4" />,
    // Add more icons as needed
    check: <Check className="h-4 w-4" />,
    chevronsUpDown: (
      <ChevronsUpDown
        className="h-4
  w-4"
      />
    ),
    plusCircle: <PlusCircle className="h-4 w-4" />,
    search: <Search className="h-4 w-4" />,
    // Default icon if not found
    Users: <Users className="h-4 w-4" />,
  };

  return iconMap[iconName] || <Users className="h-4 w-4" />; // Default to Users icon
};
