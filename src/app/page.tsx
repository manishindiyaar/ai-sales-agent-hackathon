import Link from "next/link";
import { Waitlist } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Welcome to AI Sales Agent</h1>
      <p>Join our waitlist to get early access</p>
      <Link href="/sign-in">Login</Link>
      <Waitlist />
    </div>
  );
}
