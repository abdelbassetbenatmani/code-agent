"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { GitHubFile } from "@/app/lib/actions/github";

type Props = {
  tree: GitHubFile[];
  onFileClick: (file: GitHubFile) => void;
};

const FileTree = ({ tree, onFileClick }: Props) => {
  return (
    <div>
      {tree.map((item) => (
        <FileNode key={item.path} item={item} onFileClick={onFileClick} />
      ))}
    </div>
  );
};

const FileNode = ({ item, onFileClick }: { item: GitHubFile; onFileClick: (file: GitHubFile) => void }) => {
  const [open, setOpen] = useState(false);
  const isFolder = item.type === "dir";

  return (
    <div className="ml-2">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => (isFolder ? setOpen(!open) : onFileClick(item))}
      >
        {isFolder ? (
          open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <File size={14} />
        )}
        {isFolder && <Folder size={14} className="ml-1 text-yellow-500" />}
        <span className="ml-2">{item.name}</span>
      </div>
      {isFolder && open && item.children && (
        <div className="ml-4">
          {item.children.map((child:any) => (
            <FileNode key={child.path} item={child} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTree;
