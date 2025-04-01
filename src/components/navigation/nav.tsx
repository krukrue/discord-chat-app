"use client"
import { UserButton } from './user-button';
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../auth/auth-context";

export default function Nav () {
  const session = useAuth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between">
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          {!session.user?.id ? (
            <li>
              <Button>
                <Link className="flex gap-x-2 items-center" href="/auth/login">
                  <LogIn size={16} />
                  <div>Login</div>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session?.expires ?? ""} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
