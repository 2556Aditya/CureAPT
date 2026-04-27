// Modal1.jsx
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Textarea1 from "./Textarea1";

export default function Modal1({ onSave }) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState('opaque');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backdrops = ["blur"];

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    setError(''); // Clear any previous errors
    onOpen();
  }

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setError(''); // Clear any errors when user types
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Successfully saved:', data);
        if (typeof onSave === 'function') {
          onSave();
        }
        setContent('');
        onClose();
      } else {
        console.error('Server error:', data);
        setError(data.error || 'Failed to save journal entry');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap m-auto gap-3">
        {backdrops.map((b) => (
          <Button
            key={b}
            variant="flat" 
            size="sm"
            color="primary" 
            onClick={() => handleOpen(b)}
            className="capitalize"
          >
           Journal
          </Button>
        ))}  
      </div>
      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Journal</ModalHeader>
            <ModalBody>
              <Textarea1 
                value={content}
                onChange={handleContentChange}
              />
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onClick={handleSave}
                isLoading={isLoading}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}