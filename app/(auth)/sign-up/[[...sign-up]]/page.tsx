import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { DEMO_MODE } from "@/lib/dev/demo-mode";

export default function SignUpPage() {
  if (DEMO_MODE) redirect("/");
  return <SignUp />;
}
