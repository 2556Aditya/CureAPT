'use client'
import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { CureaptLogo } from "./CureaptLogo";
import Modal1 from "./Modal1";
import Modal3 from "./Modal3";
import Logout from "./Logout";

export default function Navbarss({ onJournalSaved }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user/get-profile', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUser();
  }, []);

  const handleProfileUpdate = async (updatedUser) => {
    setUser(updatedUser);
    // Refetch user data to ensure consistency
    await fetchUser();
    // Trigger a revalidation of the entire page
    router.refresh();
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  

  return (
    <Navbar maxWidth="2xl" className="bg-color-black">
      <NavbarBrand>
        <CureaptLogo />
        <p className="font-bold text-2xl text-white">CureAPT</p>
      </NavbarBrand>
      <div className="flex flex-wrap gap-2 justify-end">
        <Modal1
          user={user}
          onProfileUpdate={handleProfileUpdate}
          onSave={onJournalSaved}
          onClick={() => setIsModalOpen(true)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <Modal3 
          user={user} 
          onProfileUpdate={handleProfileUpdate}
        />
        <Logout />
      </div>
    </Navbar>
  );
}
