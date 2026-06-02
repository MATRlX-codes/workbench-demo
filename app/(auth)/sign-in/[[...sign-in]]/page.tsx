import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { DEMO_MODE } from "@/lib/dev/demo-mode";

export default function SignInPage() {
  if (DEMO_MODE) redirect("/");
  return <SignIn />;
}
