import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
    const session = await auth();

    return (
        <main className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome!
            </h1>
            <p className="text-base md:text-lg max-w-xl mb-8">
                This is our new platform where you will find a lot of interesting things.
                Register or log in to your account to get full access.
            </p>

            {}
            {!session && (
                <Button className="bg-[#ff3aff] text-white hover:bg-blue-700">
                    <Link href="/auth/login">
                        Log In / Sign Up
                    </Link>
                </Button>
            )}
        </main>
    );
}
