import type { Metadata } from "next";
import { LoginCard } from "@/components/auth/LoginCard";

export const metadata: Metadata = {
  title: "LuxeEstate - Login",
  description: "Unlock exclusive properties worldwide.",
};

export default function LoginPage() {
  return (
    <main className="font-display bg-clear-day dark:bg-[#0f231f] min-h-screen flex items-center justify-center p-4 antialiased text-nordic-dark dark:text-gray-100 relative overflow-hidden">
      {/* Decorative blobs matching code.html background styling */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-hint-green/30 rounded-full blur-3xl dark:bg-mosque/10"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-mosque/10 rounded-full blur-3xl"></div>
      </div>

      <LoginCard />
    </main>
  );
}
