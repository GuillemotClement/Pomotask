import { authClient } from "../libs/auth-client";
import Hero from "./Hero";
import TaskPage from "./Task/TaskPage";

const { data: session } = await authClient.getSession();

export default function HomePage() {
  return (
    <div className="container mx-auto">
      {session?.user ? <TaskPage /> : <Hero />}
    </div>
  );
}
