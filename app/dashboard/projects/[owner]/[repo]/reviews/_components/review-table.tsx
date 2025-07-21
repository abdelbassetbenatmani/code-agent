"use client";
import { ReviewType } from "@/prisma/types";
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
import {
  Search,
  FileCode,
  Calendar,
  ChevronRight,
  User,
} from "lucide-react";
import { format } from "date-fns";
import IssueCard from "@/components/utils/IssueCard";

const ReviewsTable = ({ reviews }: { reviews: ReviewType[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReviews, setFilteredReviews] = useState<ReviewType[]>(reviews);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);

  // Filter reviews when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredReviews(reviews);
      return;
    }

    const filtered = reviews.filter(
      (review) =>
        review.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReviews(filtered);
  }, [searchQuery, reviews]);

  // Get badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (score >= 60)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

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
          <h2 className="text-2xl font-bold tracking-tight">Code Reviews</h2>
          <p className="text-muted-foreground">
            View and manage code reviews for this repository
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

      {/* Reviews Table */}
      <div className="rounded-md border">
        <Table>
         
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">File</TableHead>
              <TableHead className="hidden md:table-cell">Path</TableHead>
              <TableHead className="w-[100px] text-center">Score</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No reviews found matching your search
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                      {review.file}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatPath(review.path)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getScoreBadgeColor(review.score)}>
                      {review.score}/100
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReview(review)}
                        >
                          Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </SheetTrigger>
                      {review === selectedReview && (
                        <SheetContent className="sm:max-w-lg overflow-y-auto px-5">
                          <SheetHeader className="pb-4 border-b">
                            <SheetTitle className="flex items-center gap-2">
                              <FileCode className="h-5 w-5" />
                              {review.file}
                            </SheetTitle>
                            <SheetDescription className="flex flex-wrap gap-2 items-center">
                              <Badge variant="outline">{review.path}</Badge>
                              <Badge
                                className={getScoreBadgeColor(review.score)}
                              >
                                Score: {review.score}/100
                              </Badge>
                            </SheetDescription>
                          </SheetHeader>

                          <div className="py-6 space-y-6">
                            {/* Summary Section */}
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                SUMMARY
                              </h3>
                              <p className="text-sm">{review.summary}</p>
                            </div>

                            {/* Issues Section */}
                            {review.issues && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                  ISSUES FOUND
                                </h3>
                                <div className="space-y-3">
                                  {JSON.parse(review.issues).map(
                                    (issue: any, i: number) => (
                                      <IssueCard
                                        key={i}
                                        issue={issue}
                                        index={i}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Code Preview (abbreviated) */}
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                CODE PREVIEW
                              </h3>
                              <div className="bg-muted rounded-md p-3 overflow-x-auto">
                                <pre className="text-xs">
                                  <code>
                                    {review.code.length > 300
                                      ? `${review.code.slice(0, 300)}...`
                                      : review.code}
                                  </code>
                                </pre>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="pt-4 border-t">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Created:{" "}
                                {format(new Date(review.createdAt), "PPpp")}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                <User className="h-4 w-4" />
                                User ID: {review.userId.substring(0, 8)}...
                              </div>
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

export default ReviewsTable;
