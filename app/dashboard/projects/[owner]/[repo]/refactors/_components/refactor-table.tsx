"use client";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FileCode,
  Calendar,
  ChevronRight,
  RefreshCcw,
  User,
} from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { RefactoringType } from "@/prisma/types";
import { getLanguage } from "../../_components/getLanguage";
import ChangeBox from "@/components/utils/ChangeBox";
import { formatDate } from "@/lib/formatDate";

const RefactorTable = ({ refactors }: { refactors: RefactoringType[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRefactors, setFilteredRefactors] =
    useState<RefactoringType[]>(refactors);
  const [selectedRefactor, setSelectedRefactor] =
    useState<RefactoringType | null>(null);

  // Filter refactors when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRefactors(refactors);
      return;
    }

    const filtered = refactors.filter(
      (refactor) =>
        refactor.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refactor.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRefactors(filtered);
  }, [searchQuery, refactors]);

  // Format file path for display
  const formatPath = (path: string) => {
    const parts = path.split("/");
    if (parts.length <= 2) return path;
    return `.../${parts.slice(-2).join("/")}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Code Refactorings
          </h2>
          <p className="text-muted-foreground">
            View and compare code refactorings for this repository
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by file name..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Refactorings Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">File</TableHead>
              <TableHead className="hidden md:table-cell">Path</TableHead>
              <TableHead className="hidden md:table-cell">Summary</TableHead>
              <TableHead className="hidden md:table-cell">Refactorer</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRefactors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No refactorings found matching your search
                </TableCell>
              </TableRow>
            ) : (
              filteredRefactors.map((refactor) => (
                <TableRow key={refactor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                      {refactor.file}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatPath(refactor.path)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {refactor.summary}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {refactor.refactorer}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatDate(refactor.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border-indigo-500/20"
                          onClick={() => setSelectedRefactor(refactor)}
                        >
                          Compare
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </SheetTrigger>
                      {refactor === selectedRefactor && (
                        <SheetContent className="w-[90vw] max-w-[800px] sm:max-w-none overflow-y-auto px-5">
                          <SheetHeader className="pb-4 border-b">
                            <SheetTitle className="flex items-center gap-2">
                              <RefreshCcw className="h-5 w-5 text-purple-500" />
                              Code Refactoring: {refactor.file}
                            </SheetTitle>
                            <SheetDescription className="flex flex-wrap gap-2 items-center">
                              <Badge variant="outline">{refactor.path}</Badge>
                              <Badge variant="secondary">
                                {formatDate(refactor.createdAt)}
                              </Badge>
                            </SheetDescription>
                            <div className="mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {refactor.refactorer}
                              </span>
                              <span className="flex items-center gap-1 mt-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(refactor.createdAt)}
                              </span>
                              <span className="flex items-center gap-1 mt-1">
                                <User className="h-4 w-4" />
                                {refactor.userId.substring(0, 8)}...
                              </span>
                            </div>
                          </SheetHeader>

                          <div className="py-6 space-y-6">
                            {/* Summary Section */}
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                SUMMARY
                              </h3>
                              <p className="text-sm">{refactor.summary}</p>
                            </div>

                            {/* Changes Section */}
                            {refactor.changes && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                  CHANGES
                                </h3>
                                <div className="space-y-2">
                                  {JSON.parse(refactor.changes).map(
                                    (change: any, i: number) => (
                                      <ChangeBox
                                        key={i}
                                        change={change}
                                        index={i}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Code Comparison */}
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                CODE COMPARISON
                              </h3>

                              <Tabs defaultValue="split" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="split">
                                    Split View
                                  </TabsTrigger>
                                  <TabsTrigger value="original">
                                    Original
                                  </TabsTrigger>
                                  <TabsTrigger value="refactored">
                                    Refactored
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="split" className="mt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-md border overflow-hidden">
                                      <div className="bg-muted/70 px-4 py-2 text-xs font-medium">
                                        Original Code
                                      </div>
                                      <div className="max-h-[500px] overflow-auto">
                                        <SyntaxHighlighter
                                          language={getLanguage(refactor.file)}
                                          style={coldarkDark}
                                          showLineNumbers={true}
                                          customStyle={{
                                            margin: 0,
                                            borderRadius: 0,
                                          }}
                                        >
                                          {refactor.code}
                                        </SyntaxHighlighter>
                                      </div>
                                    </div>

                                    <div className="rounded-md border overflow-hidden">
                                      <div className="bg-purple-500/10 dark:bg-purple-500/20 px-4 py-2 text-xs font-medium">
                                        Refactored Code
                                      </div>
                                      <div className="max-h-[500px] overflow-auto">
                                        <SyntaxHighlighter
                                          language={getLanguage(refactor.file)}
                                          style={coldarkDark}
                                          showLineNumbers={true}
                                          customStyle={{
                                            margin: 0,
                                            borderRadius: 0,
                                          }}
                                        >
                                          {refactor.refactoringCode}
                                        </SyntaxHighlighter>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="original" className="mt-4">
                                  <div className="rounded-md border overflow-hidden">
                                    <div className="bg-muted/70 px-4 py-2 text-xs font-medium">
                                      Original Code
                                    </div>
                                    <div className="max-h-[600px] overflow-auto">
                                      <SyntaxHighlighter
                                        language={getLanguage(refactor.file)}
                                        style={coldarkDark}
                                        showLineNumbers={true}
                                        customStyle={{
                                          margin: 0,
                                          borderRadius: 0,
                                        }}
                                      >
                                        {refactor.code}
                                      </SyntaxHighlighter>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent
                                  value="refactored"
                                  className="mt-4"
                                >
                                  <div className="rounded-md border overflow-hidden">
                                    <div className="bg-purple-500/10 dark:bg-purple-500/20 px-4 py-2 text-xs font-medium">
                                      Refactored Code
                                    </div>
                                    <div className="max-h-[600px] overflow-auto">
                                      <SyntaxHighlighter
                                        language={getLanguage(refactor.file)}
                                        style={coldarkDark}
                                        showLineNumbers={true}
                                        customStyle={{
                                          margin: 0,
                                          borderRadius: 0,
                                        }}
                                      >
                                        {refactor.refactoringCode}
                                      </SyntaxHighlighter>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          </div>

                          <SheetFooter>
                            <SheetClose asChild>
                              <Button>Close</Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      )}
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RefactorTable;
