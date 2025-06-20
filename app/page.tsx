"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Mic } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-white">
              InquireAI<sup className="text-xs font-medium text-gray-400 ml-1">Lite</sup>
            </h2>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="max-w-2xl w-full text-center">
            <h3 className="text-6xl font-light bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Hello, there
            </h3>
          </div>
        </div>

        {/* Input Section */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask InquiryAI"
                className="w-full h-20 bg-gray-900/50 border-gray-800 rounded-2xl pl-16 pr-36 !text-lg placeholder:text-lg text-white placeholder-gray-500 focus:ring-0 focus:outline-none focus:border-gray-800 focus:shadow-none focus:bg-gray-900/70 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              {/* Plus icon file input button */}
              <label htmlFor="file-upload" className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer">
                <input id="file-upload" type="file" accept="image/*" className="hidden" />
                <div className="text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-9 h-9 flex items-center justify-center transition-colors">
                  <Plus className="h-5 w-5" />
                </div>
              </label>

              {/* Deep Research button inside input */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-base text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl px-4 h-11"
              >
                <Search className="h-5 w-5 mr-2" />
                Deep Research
              </Button>

              {/* Mic button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-11 h-11"
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
