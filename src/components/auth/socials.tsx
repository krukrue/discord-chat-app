'use client'

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export default function Socials () {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button className="flex gap-4 w-full"
        variant={"outline"}
       onClick={() => signIn("google", {
        redirect: false,
        callbackUrl: "/"
      })}>
        Sign in with Google
        <FcGoogle className="w-5 h-5"/>
      </Button>
      <Button className="flex gap-4 w-full" onClick={() => signIn("github", {
        redirect: false,
        callbackUrl: "/"
      })}
        variant={"outline"}
      >
        Sign in with GitHub
        <FaGithub className="w-5 h-5"/>
      </Button>
    </div>
  );
}