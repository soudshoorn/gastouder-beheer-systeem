import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Baby } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welkom bij het Qiddo Register gastouderbeheer systeem. Beheer eenvoudig
        kinderen en ouders.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Kinderen</CardTitle>
            <Baby className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Beheer alle kinderinformatie, inclusief allergieen, voorkeuren en
              contactpersonen.
            </CardDescription>
            <Link href="/children">
              <Button>Kinderen beheren</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Ouders</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Beheer alle oudergegevens, inclusief contactinformatie.
            </CardDescription>
            <Link href="/parents">
              <Button>Ouders beheren</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
