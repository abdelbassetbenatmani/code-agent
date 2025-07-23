"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  checkInvitationExpiration,
  declineInvitation,
  getInvitationByToken,
} from "@/app/lib/actions/invitation";

const InvitationPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  const [loading, setLoading] = useState(true);
  const [acceptingInvitation, setAcceptingInvitation] = useState(false);
  const [decliningInvitation, setDecliningInvitation] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const invitationId = params.invitationId as string;
  const teamId = searchParams.get("team");
  const email = searchParams.get("email");
  const teamName = searchParams.get("teamName");

  useEffect(() => {
    const checkExpiresAt = async () => {
      const response = await checkInvitationExpiration(invitationId);
      console.log("Invitation expiration check response:", response);

      if (response === true) {
        setError("Invitation not found or expired");
        return;
      } else {
        const invitation = await getInvitationByToken(invitationId);
        if (!invitation) {
          setError("Invitation not found");
          return;
        }
        console.log("Fetched invitation:", invitation);

        setInvitation(invitation);
      }
      setLoading(false);
    };
    checkExpiresAt();
  }, [invitationId]);

  const handleAcceptInvitation = async () => {
    if (status !== "authenticated") {
      // Store invitation info in localStorage to return here after auth
      localStorage.setItem(
        "pendingInvitation",
        JSON.stringify({
          invitationId,
          teamId,
          email,
          teamName,
        })
      );

      router.push("/signin");
      return;
    }

    setAcceptingInvitation(true);

    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationId,
          teamId,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("You've successfully joined the team!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to accept invitation");
      }
    } catch (err) {
      console.error("Error accepting invitation:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setAcceptingInvitation(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (confirm("Are you sure you want to decline this invitation?")) {
      setDecliningInvitation(true);

      try {
        await declineInvitation(invitationId);
        toast.success("Invitation declined");
        router.push("/");
      } catch (err) {
        console.error("Error declining invitation:", err);
        toast.error("An error occurred. Please try again.");
      } finally {
        setDecliningInvitation(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              Invitation Error
            </CardTitle>
            <CardDescription>
              We couldn&apos;t load this invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invalid Invitation</AlertTitle>
              <AlertDescription>
                {error}. This invitation may have expired or been revoked.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card
          className="mx-auto border border-border/40 bg-background/80 shadow-xl backdrop-blur-sm"
          style={{
            backgroundImage:
              "radial-gradient(164.75% 100% at 50% 0%, rgba(192, 15, 102, 0.05) 0%, rgba(192, 11, 109, 0.025) 48.73%)",
          }}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Team Invitation
            </CardTitle>
            <CardDescription>
              You&apos;ve been invited to join a team
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Team Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Name:</span>
                  <span className="font-medium">
                    {teamName || invitation?.teamName || "Unknown Team"}
                  </span>
                </div>
                {invitation?.role && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Role:</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {invitation.role || "Member"}
                    </span>
                  </div>
                )}
                {invitation?.invitedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invited By:</span>
                    <span>{invitation.invitedBy}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{email || invitation?.email || "Not specified"}</span>
                </div>
                {invitation?.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span>
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {status !== "authenticated" && (
              <Alert className="bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-600">
                  Authentication Required
                </AlertTitle>
                <AlertDescription className="text-amber-700">
                  You&apos;ll need to sign in before accepting this invitation.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleAcceptInvitation}
              disabled={acceptingInvitation || decliningInvitation}
            >
              {acceptingInvitation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {status === "authenticated"
                    ? "Accept Invitation"
                    : "Sign in & Accept"}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDeclineInvitation}
              disabled={acceptingInvitation || decliningInvitation}
            >
              {decliningInvitation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          If you didn&apos;t expect this invitation, you can safely ignore it.
        </p>
      </motion.div>
    </div>
  );
};

export default InvitationPage;
