"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const session = useSession()
  return (
  <>
    <div>
      <div>
        {JSON.stringify(session)}
      </div>
    </div>
    </>
  );
}
