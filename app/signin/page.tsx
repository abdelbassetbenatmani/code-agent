"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Loader2, ArrowRight, CodeXml } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { login } from "../lib/actions/auth";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await login();
    } catch (error) {
      console.error("Sign in failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>

      {/* Logo */}
      <Link
        href="/"
        className="absolute left-8 top-8 flex items-center space-x-3"
      >
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-lg">
            <CodeXml className="h-5 w-5 text-white" />
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="mx-auto rounded-xl border border-border/40 bg-background/80 p-8 shadow-xl backdrop-blur-sm"
          style={{
            backgroundImage:
              "radial-gradient(164.75% 100% at 50% 0%, rgba(192, 15, 102, 0.05) 0%, rgba(192, 11, 109, 0.025) 48.73%)",
          }}
        >
          <div className="mx-auto mb-6 flex justify-center">
            <div className="inline-flex items-center rounded-full border border-border bg-background/80 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                AI-Powered
              </span>
              <span className="text-muted-foreground">Sign in to continue</span>
              <ArrowRight className="ml-1 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-balance bg-gradient-to-tl from-primary/30 via-foreground/85 to-foreground/80 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              Welcome to Codiny
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access AI code assistance, refactoring tools, and more
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className={cn(
                "relative w-full overflow-hidden transition-all duration-300",
                loading
                  ? "cursor-not-allowed opacity-80"
                  : "hover:shadow-primary/20"
              )}
              variant="outline"
              size="lg"
              type="button"
              onClick={() => !loading && handleSignIn()}
              disabled={loading}
            >
              <div className="flex w-full items-center justify-center space-x-2">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                <span>
                  {loading ? "Connecting..." : "Continue with GitHub"}
                </span>
              </div>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary/5 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </Button>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  More options coming soon
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs">
            <p className="text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="#" className="hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="hover:text-primary">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute -right-4 -top-4 h-8 w-8 rounded-lg border border-border/40 bg-background/80 p-1.5 shadow-lg backdrop-blur-md">
            <div className="h-full w-full rounded-md bg-primary/20"></div>
          </div>
          <div className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full border border-border/40 bg-background/80 shadow-lg backdrop-blur-md"></div>
        </div>
      </motion.div>
    </div>
  );
}
