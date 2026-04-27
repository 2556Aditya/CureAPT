// Modal1entries.jsx
'use client'
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@nextui-org/react";
import { WobbleCard } from "./WobbleCard";
import { Button } from "@nextui-org/react";

export default function Modal1entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize fetchEntries to prevent recreation on each render
  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/journal', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setEntries(data);
      setRetryCount(0);
      
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError(error.message);
      
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000 * (retryCount + 1));
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  // Only fetch on mount and retry count change
  useEffect(() => {
    fetchEntries();
  }, [retryCount, fetchEntries]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchEntries();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" label="Loading entries..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h3 className="text-danger mb-4">Error: {error}</h3>
        <Button 
          color="primary" 
          size="sm" 
          onClick={handleRetry}
        >
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {entries.length === 0 ? (
        <h3 className="text-center text-gray-500">No entries yet. Start journaling!</h3>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WobbleCard
                containerClassName="h-[300px] bg-gradient-to-br from-violet-500 to-indigo-800"
                className="p-6 flex flex-col justify-between h-full"
              >
                <div className="prose prose-invert">
                  <div className="text-lg font-medium text-white/90 line-clamp-6">
                    {entry.content}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-white/60">
                    {new Date(entry.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </WobbleCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}