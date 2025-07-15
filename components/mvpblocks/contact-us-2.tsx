"use client";
import React from "react";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { MapPin } from "lucide-react";
import { Github } from "lucide-react";
import { Twitter } from "lucide-react";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { Send } from "lucide-react";
import Link from "next/link";

export default function ContactUs2() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    message: "",
    errors: {} as Record<string, string>,
    submitting: false,
    submitted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ ...state, submitting: true })

    setState({
      ...state,
      submitting: false,
      submitted: true,
    });
  };

  return (
    <div className="flex items-center justify-center ">
      <section id="contact" className="w-full max-w-screen-md px-2">
        <h2 className="mb-5 mt-4 bg-gradient-to-br from-primary to-rose-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-6xl">
          Let&apos;s Get in Touch
        </h2>
        <p className="mb-6 text-center text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you as soon as
          possible.
        </p>
        <div
          className="mx-auto mb-6 grid w-full items-start gap-12 rounded-lg border border-border/40 bg-background/50 px-4 pb-6 pt-10 shadow backdrop-blur-sm md:grid-cols-2 lg:px-12"
          style={{
            backgroundImage:
              "radial-gradient(164.75% 100% at 50% 0, rgba(192, 15, 102, 0.1) 0, rgba(192, 11, 109, 0.05) 48.73%)",
          }}
        >
          <form className="space-y-8 text-foreground" onSubmit={handleSubmit}>
            <div className="space-y-4 text-lg">
              <label htmlFor="name" />
              Name
              <input
                id="name"
                type="text"
                required
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-inner outline-none hover:border-primary/30 hover:outline-none hover:transition-all focus:border-primary focus:outline-none"
                placeholder="Enter your name"
                name="name"
              />
            </div>

            <div className="space-y-4 text-lg">
              <label htmlFor="email" /> Email
              <input
                id="email"
                placeholder="Enter your email"
                type="email"
                className="hover:transition-al flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-inner outline-none file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-primary/30 hover:outline-none focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                name="email"
                required
              />
              {state.errors && state.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.email}
                </p>
              )}
            </div>
            <div className="space-y-4 text-lg">
              <label htmlFor="message" className="text-lg" />
              Message
              <textarea
                className="mb-5 flex min-h-[100px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-inner outline-none ring-offset-background placeholder:text-muted-foreground hover:border-primary/30 hover:outline-none hover:transition-all focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                id="message"
                placeholder="Enter your message"
                name="message"
              />
              {state.errors && state.errors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.message}
                </p>
              )}
            </div>
            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-primary to-rose-400 py-2 text-center font-medium text-white shadow transition-all duration-300 ease-in-out hover:shadow-primary/30"
              type="submit"
              disabled={state.submitting}
            >
              {state.submitting ? "Sending..." : "Send"}
              <Send className="mx-2 inline h-4" />
            </button>
          </form>
          <div>
            <h3 className="mb-10 text-2xl font-semibold text-foreground">
              Connect with Us
            </h3>
            <div className="mb-12 flex gap-8">
              <Link
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary shadow-inner hover:shadow-md hover:shadow-primary/30 hover:transition hover:duration-300 hover:ease-in-out"
                href="#"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <div className="text-md text-foreground/80">
                <p>Email to us at </p>
                <p>subha9.5roy350@gmail.com</p>
              </div>
            </div>

            <div className="mb-12 flex gap-8">
              <Link
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary shadow-inner hover:shadow-md hover:shadow-primary/30 hover:transition hover:duration-300 hover:ease-in-out"
                href="#"
              >
                <Phone className="h-5 w-5" />
              </Link>
              <div className="text-md text-foreground/80">
                <p>Call us at </p>
                <p>XXXXX XXXXX</p>
              </div>
            </div>

            <div className="mb-12 flex gap-8">
              <Link
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border px-2 text-primary shadow-inner hover:shadow-md hover:shadow-primary/30 hover:transition hover:duration-300 hover:ease-in-out"
                href="#"
              >
                <MapPin className="h-5 w-5" />
              </Link>
              <div className="text-md text-foreground/80">
                <p>Location at </p>
                <p>Techno Main Salt Lake, Sector-V, Kolkata-700091</p>
              </div>
            </div>

            <div className="flex space-x-12 py-7">
              <Link
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 text-primary hover:shadow-md hover:shadow-primary/30 hover:transition hover:duration-300 hover:ease-in-out"
                href="#"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 text-primary hover:shadow-md hover:shadow-primary/30 hover:transition hover:duration-300 hover:ease-in-out"
                href="#"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 text-primary hover:shadow-md hover:shadow-primary/30 hover:transition hover:duration-300 hover:ease-in-out"
                href="#"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 text-primary hover:shadow-md hover:shadow-primary/30 hover:transition hover:duration-300 hover:ease-in-out"
                href="#"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
