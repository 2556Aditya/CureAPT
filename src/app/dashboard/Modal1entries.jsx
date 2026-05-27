// Modal1entries.jsx
'use client'
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@nextui-org/react";
import { WobbleCard } from "./WobbleCard";
import { Button } from "@nextui-org/react";
import { DeleteDocumentIcon } from "./DeleteDocumentIcon";

export default function Modal1entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState(null);

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

  const handleDelete = async (entryId) => {
    if (!window.confirm('Delete this journal entry?')) {
      return;
    }

    setDeletingId(entryId);
    setActionError(null);

    try {
      const response = await fetch('/api/journal', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ entryId })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete entry');
      }

      setEntries(prevEntries => prevEntries.filter(entry => entry._id !== entryId));
    } catch (error) {
      console.error('Error deleting entry:', error);
      setActionError(error.message);
    } finally {
      setDeletingId(null);
    }
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
      {actionError && (
        <div className="text-center text-danger mb-4">
          {actionError}
        </div>
      )}
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
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-white/60">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <Button
                      isIconOnly
                      size="md"
                      color="white"
                      variant="flat"
                      aria-label="Delete journal entry"
                      onClick={() => handleDelete(entry._id)}
                      isLoading={deletingId === entry._id}
                    >
                      <DeleteDocumentIcon />
                    </Button>
                  </div>
                </div>
              </WobbleCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}