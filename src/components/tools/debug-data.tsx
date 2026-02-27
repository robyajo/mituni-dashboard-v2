"use client";

import React, { useState } from "react";
import { Copy, Check, Bug, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function DebugData({
  data,
  title,
}: {
  data: any;
  title?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed right-0 top-30 z-9999 -translate-y-1/2 flex items-center">
      {/* Toggle Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 w-10 rounded-l-md rounded-r-none border-y border-l shadow-lg bg-yellow-400 hover:bg-yellow-500 text-black transition-transform duration-300 z-10",
          isOpen ? "-translate-x-100" : "translate-x-0"
        )}
        title={title || "Debug Response"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bug className="h-5 w-5" />}
      </Button>

      {/* Side Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-screen w-100 border-l bg-white dark:bg-zinc-950 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b p-4 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-yellow-600" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {title || "Debug Response"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 px-2 text-xs gap-1.5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#1e1e1e]">
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "11px",
              lineHeight: "1.5",
              backgroundColor: "transparent",
            }}
            wrapLongLines={true}
          >
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
