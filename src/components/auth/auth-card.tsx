import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Socials from "@/components/auth/socials"
import { BackButton } from "@/components/auth/back-button"

interface AuthCardProps {
  children: React.ReactNode,
  backButtonHref: string,
  cardTitle: string,
  backButtonLabel: string,
  showSocials?: boolean
}

export const AuthCard = (props: React.PropsWithChildren<AuthCardProps>) => {
  
  
  return <Card>
    <CardHeader>
      <CardTitle>{props.cardTitle}</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      {props.children}
    </CardContent>
    {props.showSocials && <CardFooter>
      <Socials />
    </CardFooter>}
    <CardFooter>
      <BackButton href={props.backButtonHref} label={props.backButtonLabel}></BackButton>
    </CardFooter>
  </Card>
}