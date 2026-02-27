"use client";
import React, { useState, useEffect, useId } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";
import { Bug, ChevronRight, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { debugStore } from "./debug-store";
import { useTheme } from "next-themes";

interface DebugToolsProps {
  data: any;
  title?: string;
  filePath?: string;
}

export function DebugTools({
  data,
  title = "Debug Data",
  filePath = __filename,
}: DebugToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [stackIndex, setStackIndex] = useState(0);
  const id = useId();
  const { theme } = useTheme();

  useEffect(() => {
    debugStore.register(id);
    // Initial index
    setStackIndex(debugStore.getIndex(id));

    // Subscribe to changes
    const unsubscribe = debugStore.subscribe(() => {
      setStackIndex(debugStore.getIndex(id));
    });

    return () => {
      debugStore.unregister(id);
      unsubscribe();
    };
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calculate vertical offset based on stackIndex
  // Base position is 50%, each index adds 45px spacing
  const positionStyle = {
    top: `calc(50% + ${stackIndex * 45}px)`,
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed right-0 z-50 -translate-y-1/2 rounded-l-md border-r-0 shadow-md bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-white dark:border-yellow-700"
        style={positionStyle}
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed right-4 z-9999 flex -translate-y-1/2 flex-col overflow-hidden rounded-lg border bg-background shadow-xl transition-all duration-300 dark:border-border",
        isMinimized ? "h-12 w-64" : "h-[80vh] w-[50vw]",
      )}
      style={positionStyle}
    >
      <div className="flex items-center justify-between border-b bg-muted/50 p-2 px-3 dark:bg-muted/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Bug className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              {title}
            </span>
          </div>
          {filePath && (
            <span className="mt-0.5 font-mono text-[10px] text-muted-foreground opacity-70">
              {filePath}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-foreground hover:bg-muted"
            onClick={handleCopy}
            title="Copy Data"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-foreground hover:bg-muted"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isMinimized ? "rotate-90" : "-rotate-90",
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-auto bg-white p-0 dark:bg-[#1e1e1e]">
          <SyntaxHighlighter
            language="json"
            style={theme === "dark" ? vscDarkPlus : prism}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "12px",
              lineHeight: "1.5",
              background: "transparent",
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
