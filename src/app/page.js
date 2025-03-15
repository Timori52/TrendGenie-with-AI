"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateVideoContent } from "./services/api"
import { ThemeToggle } from "./components/theme-toggle"
import { YouTubeLoader } from "./components/youtube-loader"
import { CopyButton } from "./components/copy-button"
import { HashtagBadges } from "./components/hashtag-badges"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"

// Define niche options
const nicheOptions = [
  { value: "default", label: "General (Default)" },
  { value: "sports", label: "Sports" },
  { value: "news", label: "News & Current Events" },
  { value: "music", label: "Music" },
  { value: "gaming", label: "Gaming" },
  { value: "fashion", label: "Fashion & Beauty" },
  { value: "tech", label: "Technology" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food & Cooking" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business & Finance" },
  { value: "entertainment", label: "Entertainment" },
  { value: "diy", label: "DIY & Crafts" },
  { value: "science", label: "Science" },
]

export default function Home() {
  const [videoTopic, setVideoTopic] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("default")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [error, setError] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  // Use useEffect to set mounted state after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleGenerate = async () => {
    if (!videoTopic.trim()) {
      setError("Please enter a video topic")
      return
    }

    setIsGenerating(true)
    setGeneratedContent(null)
    setError(null)
    
    try {
      // Pass both topic and niche to the API
      const result = await generateVideoContent(videoTopic, selectedNiche)
      setGeneratedContent(result.content)
    } catch (err) {
      console.error("Error generating content:", err)
      setError("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Only render the client-side content after mounting
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading application...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Video Content Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create engaging content with AI magic ✨
            </p>
          </motion.div>
          <ThemeToggle />
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Topic Input */}
                <div>
                  <label htmlFor="videoTopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {`What's your video about?`}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="videoTopic"
                      value={videoTopic}
                      onChange={(e) => setVideoTopic(e.target.value)}
                      placeholder="Enter a topic for your video"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && videoTopic.trim() && !isGenerating) {
                          handleGenerate()
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Niche Selection */}
                <div>
                  <label htmlFor="videoNiche" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select your content niche
                  </label>
                  <Select
                    id="videoNiche"
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    options={nicheOptions}
                    
                    className="w-full"
                  />
                </div>
                
                {/* Generate Button */}
                <div className="pt-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !videoTopic.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg my-6"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Animation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="my-6"
            >
              <YouTubeLoader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Content */}
        <AnimatePresence>
          {generatedContent && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                    Your Creative Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <motion.div 
                    className="bg-muted p-4 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        Title
                      </h3>
                      <CopyButton text={generatedContent.title} label="title" />
                    </div>
                    <p className="text-xl font-medium text-foreground">
                      {generatedContent.title}
                    </p>
                  </motion.div>

                  {/* Description */}
                  <motion.div 
                    className="bg-muted p-4 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Description
                      </h3>
                      <CopyButton text={generatedContent.description} label="description" />
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">
                      {generatedContent.description}
                    </p>
                  </motion.div>

                  {/* Hashtags */}
                  <motion.div
                    className="bg-muted p-4 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {generatedContent.hashtags && Array.isArray(generatedContent.hashtags) && generatedContent.hashtags.length > 0 ? (
                      <HashtagBadges hashtags={generatedContent.hashtags} />
                    ) : (
                      <p className="text-foreground">No hashtags available</p>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <motion.div 
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>Generated by Gemini AI • Made with ❤️ by {`<Sumit-Timori/>`}</p>
        </motion.div>
      </div>
    </div>
  );
}
