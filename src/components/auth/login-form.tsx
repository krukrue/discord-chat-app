'use client'

import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { AuthCard } from "./auth-card"
import { zodResolver } from '@hookform/resolvers/zod';
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