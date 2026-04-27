'use client'
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import Input1 from "./Input1";
import Avataaar from "./Avataaar";


export default function Modal1({ user, onProfileUpdate }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("opaque");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    manifestation: user?.manifestation || "",
    profilePhoto: null,
  });
  
  const [initialValues, setInitialValues] = useState({
    username: user?.username || "",
    manifestation: user?.manifestation || "",
  });

  const hasChanges = () => {
    return formData.username !== initialValues.username ||
           formData.manifestation !== initialValues.manifestation ||
           formData.profilePhoto !== null;
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
        const data = new FormData();
        data.append("userId", user._id);
        data.append("username", formData.username);
        data.append("manifestation", formData.manifestation);
        if (formData.profilePhoto) {
            data.append("profilePhoto", formData.profilePhoto);
        }

        const response = await fetch("/api/user/update-profile", {
            method: "POST",
            body: data,
            headers: {
              'Cache-Control': 'no-cache'
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to update profile");
        }

        // Update local state immediately
        if (onProfileUpdate) {
            onProfileUpdate(result);
        }

        // Close the modal
        onClose();

        // Force revalidation of all data
        router.refresh();

        // Invalidate and refetch the current page
        const currentPath = window.location.pathname;
        router.push(currentPath);
        
    } catch (error) {
        console.error("Error updating profile:", error);
        alert(error.message || "Failed to update profile. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handlePhotoChange = (file) => {
    setFormData(prev => ({
      ...prev,
      profilePhoto: file
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const backdrops = ["blur"];

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    const resetData = {
      username: user?.username || "",
      manifestation: user?.manifestation || "",
      profilePhoto: null,
    };
    setFormData(resetData);
    setInitialValues({
      username: resetData.username,
      manifestation: resetData.manifestation,
    });
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap m-auto gap-3">
        {backdrops.map((b) => (
          <Button
            key={b}
            variant="light"
            size="sm"
            color="primary"
            onPress={() => handleOpen(b)}
            className="capitalize"
          >
            Edit Profile
          </Button>
        ))}
      </div>
      <Modal 
        backdrop={backdrop} 
        isOpen={isOpen} 
        onClose={onClose}
        classNames={{
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center">
                  <Avataaar
                    currentPhoto={user?.profilePhoto}
                    onPhotoChange={handlePhotoChange}
                  />
                </div>
                <Input1
                  value={formData.username}
                  onChange={(value) => handleInputChange("username", value)}
                  manifestation={formData.manifestation}
                  onManifestationChange={(value) => 
                    handleInputChange("manifestation", value)
                  }
                />
              </ModalBody>
              <div className="p-3">
              </div>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  disabled={isLoading}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  disabled={isLoading || !hasChanges()}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}