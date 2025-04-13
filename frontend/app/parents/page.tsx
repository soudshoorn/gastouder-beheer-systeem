"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Parent, parentsApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { TableLoader } from "@/components/ui/loading-spinner";

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Haal alle ouders op bij het laden van de pagina
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const data = await parentsApi.getAll();
        // Sorteer ouders op ID in aflopende volgorde (nieuwste eerst)
        setParents(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
      } catch (error) {
        console.error("Fout bij ophalen ouders:", error);
        toast({
          title: "Fout bij ophalen",
          description:
            "Er is een fout opgetreden bij het ophalen van de ouders.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, [toast]);

  // Verwijder een ouder
  const handleDelete = async (id: number) => {
    try {
      await parentsApi.delete(id);
      setParents(parents.filter((parent) => parent.id !== id));
      toast({
        title: "Ouder verwijderd",
        description: "De ouder is succesvol verwijderd.",
      });
    } catch (error) {
      console.error("Fout bij verwijderen ouder:", error);
      toast({
        title: "Fout bij verwijderen",
        description:
          "Er is een fout opgetreden bij het verwijderen van de ouder.",
        variant: "destructive",
      });
    }
  };

  // Filter ouders op basis van zoekopdracht
  const filteredParents = parents.filter((parent) =>
    parent.naam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formateer datum voor weergave
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: nl });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ouders</h1>
        <Link href="/parents/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe ouder
          </Button>
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoeken op naam..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <TableLoader />
      ) : filteredParents.length === 0 ? (
        <div className="rounded-md border shadow-sm">
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">Geen ouders gevonden</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Geboortedatum</TableHead>
                <TableHead>Telefoonnummer</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell className="font-medium">{parent.naam}</TableCell>
                  <TableCell>{formatDate(parent.geboortedatum)}</TableCell>
                  <TableCell>{parent.telefoonnummer}</TableCell>
                  <TableCell>{parent.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/parents/${parent.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Bewerken</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Verwijderen</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Ouder verwijderen
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je {parent.naam} wilt
                              verwijderen? Deze actie kan niet ongedaan worden
                              gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                parent.id && handleDelete(parent.id)
                              }
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Verwijderen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
