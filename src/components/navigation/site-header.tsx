"use client";

import Link from "next/link";

export default function SiteHeader() {
    return (
        <header
            className="
                fixed top-0 left-0 w-full z-50
                flex gap-6 items-center
                px-6 py-4
                bg-[#1cecfe]/30
                text-white
                backdrop-blur-sm
            "
        >
            <Link href="/">Home</Link>
            <Link href="/info">Info</Link>
        </header>
    );
}
