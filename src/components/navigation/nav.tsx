"use client";
import { UserButton } from "./user-button";
import { Button } from "../ui/button";
import { LogIn, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../auth/auth-context";
import { useTheme } from "../theme/theme-context"; // ⬅️ добавлено

export default function Nav() {
  const session = useAuth();
  const { theme, toggleTheme } = useTheme(); // ⬅️ добавлено

  return (
      <header className="py-8">
        <nav>
          <ul className="flex justify-between items-center">
            <li>
              <Link href={"/"}>Home</Link>
            </li>

            <li className="flex items-center gap-4">
              {/* Переключатель темы */}
              <button
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                  title="Toggle theme"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Авторизация */}
              {!session.user?.id ? (
                  <Button>
                    <Link className="flex gap-x-2 items-center" href="/auth/login">
                      <LogIn size={16} />
                      <div>Login</div>
                    </Link>
                  </Button>
              ) : (
                  <UserButton expires={session?.expires ?? ""} user={session?.user} />
              )}
            </li>
          </ul>
        </nav>
      </header>
  );
}
