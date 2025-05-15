import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

export default function Home() {
  redirect("/en/dashboard");
  return <h1>EcoWell</h1>;
}
