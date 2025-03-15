'use client'

import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { AuthCard } from "./auth-card"
import { zodResolver } from './../../../node_modules/@hookform/resolvers/zod/src/zod';
import { LoginSchema } from "../../../types/login-schema";
import * as z from "zod"

export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  function onSubmit (values: z.infer<typeof LoginSchema>) {
    console.log(values)
  }

  return (
    <AuthCard cardTitle="Welcome back" backButtonHref="auth/login" backButtonLabel="Create new account" showSocials>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}> 
        </form>
        
      </Form>
    </AuthCard>
  )
}