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
import { type Child, childrenApi } from "@/lib/api";
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

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Haal alle kinderen op bij het laden van de pagina
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await childrenApi.getAll();
        setChildren(data);
      } catch (error) {
        console.error("Fout bij ophalen kinderen:", error);
        toast({
          title: "Fout bij ophalen",
          description:
            "Er is een fout opgetreden bij het ophalen van de kinderen.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [toast]);

  // Verwijder een kind
  const handleDelete = async (id: number) => {
    try {
      await childrenApi.delete(id);
      setChildren(children.filter((child) => child.id !== id));
      toast({
        title: "Kind verwijderd",
        description: "Het kind is succesvol verwijderd.",
      });
    } catch (error) {
      console.error("Fout bij verwijderen kind:", error);
      toast({
        title: "Fout bij verwijderen",
        description:
          "Er is een fout opgetreden bij het verwijderen van het kind.",
        variant: "destructive",
      });
    }
  };

  // Filter kinderen op basis van zoekopdracht
  const filteredChildren = children.filter((child) =>
    child.naam.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold">Kinderen</h1>
        <Link href="/children/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuw kind
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
        <div className="flex justify-center">Laden...</div>
      ) : filteredChildren.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Geen kinderen gevonden</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Geboortedatum</TableHead>
                <TableHead>Allergieën</TableHead>
                <TableHead>Voorkeur eten</TableHead>
                <TableHead>Contactpersoon</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChildren.map((child) => (
                <TableRow key={child.id}>
                  <TableCell className="font-medium">{child.naam}</TableCell>
                  <TableCell>{formatDate(child.geboortedatum)}</TableCell>
                  <TableCell>{child.allergieen || "-"}</TableCell>
                  <TableCell>{child.voorkeurEten || "-"}</TableCell>
                  <TableCell>{child.contactPersoon}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/children/${child.id}`)}
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
                              Kind verwijderen
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je {child.naam} wilt
                              verwijderen? Deze actie kan niet ongedaan worden
                              gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => child.id && handleDelete(child.id)}
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
