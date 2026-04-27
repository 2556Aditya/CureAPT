'use client'
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

const Logout = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button 
      color="danger" 
      variant="light"
      onClick={handleLogout}
      size="md"
    >
      Logout
    </Button>
  );
};

export default Logout;