"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const Appearance = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme controls after mount
  useEffect(() => {
    setMounted(true);
  }, []);

 

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Appearance</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the appearance of the app. Automatically switch between day and night themes.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-2">
            <h3 className="font-medium text-base">Theme</h3>
            <p className="text-sm text-muted-foreground">Select the theme for the dashboard.</p>
            
            <div className="grid grid-cols-2 gap-4 pt-2 max-w-md">
              {/* Light Theme Option */}
              <div 
                className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all
                  ${theme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                onClick={() => setTheme('light')}
              >
                <div className="w-full h-28 bg-card border rounded-md p-3 flex flex-col gap-2">
                  <div className="h-2 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-2 w-full rounded bg-gray-200"></div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                    <div className="h-2 w-20 rounded bg-gray-200"></div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                    <div className="h-2 w-16 rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </div>
              </div>
              
              {/* Dark Theme Option */}
              <div 
                className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all
                  ${theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                onClick={() => setTheme('dark')}
              >
                <div className="w-full h-28 bg-slate-900 border border-slate-800 rounded-md p-3 flex flex-col gap-2">
                  <div className="h-2 w-3/4 rounded bg-slate-700"></div>
                  <div className="h-2 w-full rounded bg-slate-700"></div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-4 w-4 rounded-full bg-slate-700"></div>
                    <div className="h-2 w-20 rounded bg-slate-700"></div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-4 w-4 rounded-full bg-slate-700"></div>
                    <div className="h-2 w-16 rounded bg-slate-700"></div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
       
      </Card>
    </div>
  );
};

export default Appearance;