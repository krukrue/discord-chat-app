import { auth } from "@/server/auth";
import { UserButton } from './user-button';
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Nav () {
  const session = await auth();

  return <header className="py-8 ">
    <nav>
      <ul className="flex justify-between ">
        <li>
          <Link href={"/"}>Home</Link>
        </li>

      </ul>
    </nav>
  </header>
}