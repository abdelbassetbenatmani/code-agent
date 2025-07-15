import { Code2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = ({ href = "/" }: { href?: string }) => {


  return (
    <Link href={href} className="flex items-center space-x-3">
      <div className="relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-lg">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-foreground">Codiny</span>
        <span className="-mt-1 text-xs text-muted-foreground">
          Reviews and Refactoring
        </span>
      </div>
    </Link>
  );
};

export default Logo;
