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
import { type Attendance, attendanceApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Trash2, Edit, Calendar } from "lucide-react";
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
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { TableLoader } from "@/components/ui/loading-spinner";

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Haal alle aanwezigheidsrecords op bij het laden van de pagina
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const data = await attendanceApi.getAll();
        // Sorteer aanwezigheid op check-in tijd in aflopende volgorde (nieuwste eerst)
        setAttendances(
          data.sort(
            (a, b) =>
              new Date(b.checkInTime).getTime() -
              new Date(a.checkInTime).getTime()
          )
        );
      } catch (error) {
        console.error("Fout bij ophalen aanwezigheid:", error);
        toast({
          title: "Fout bij ophalen",
          description:
            "Er is een fout opgetreden bij het ophalen van de aanwezigheidsgegevens.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [toast]);

  // Verwijder een aanwezigheidsrecord
  const handleDelete = async (id: number) => {
    try {
      await attendanceApi.delete(id);
      setAttendances(attendances.filter((attendance) => attendance.id !== id));
      toast({
        title: "Aanwezigheid verwijderd",
        description: "De aanwezigheidsregistratie is succesvol verwijderd.",
      });
    } catch (error) {
      console.error("Fout bij verwijderen aanwezigheid:", error);
      toast({
        title: "Fout bij verwijderen",
        description:
          "Er is een fout opgetreden bij het verwijderen van de aanwezigheidsregistratie.",
        variant: "destructive",
      });
    }
  };

  // Filter aanwezigheidsrecords op basis van zoekopdracht en datum
  const filteredAttendances = attendances.filter((attendance) => {
    const childName =
      typeof attendance.child === "object" && "naam" in attendance.child
        ? attendance.child.naam
        : "";

    const matchesSearch = childName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDate =
      !filterDate ||
      (attendance.checkInTime && attendance.checkInTime.startsWith(filterDate));

    return matchesSearch && matchesDate;
  });

  // Formateer datum en tijd voor weergave
  const formatDateTime = (dateTimeString: string) => {
    try {
      return format(parseISO(dateTimeString), "d MMMM yyyy HH:mm", {
        locale: nl,
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  // Bereken de duur tussen check-in en check-out
  const calculateDuration = (checkInTime: string, checkOutTime: string) => {
    try {
      const checkIn = parseISO(checkInTime);
      const checkOut = parseISO(checkOutTime);

      // Bereken het verschil in milliseconden
      const diffMs = checkOut.getTime() - checkIn.getTime();

      // Converteer naar uren en minuten
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}u ${minutes}m`;
    } catch (error) {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Aanwezigheid</h1>
        <Link href="/attendance/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe registratie
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
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

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {loading ? (
        <TableLoader />
      ) : filteredAttendances.length === 0 ? (
        <div className="rounded-md border shadow-sm">
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">
              Geen aanwezigheidsregistraties gevonden
            </p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <Table>
            <TableHeader className="table-header">
              <TableRow>
                <TableHead>Kind</TableHead>
                <TableHead>Check-in tijd</TableHead>
                <TableHead>Check-out tijd</TableHead>
                <TableHead>Duur</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.map((attendance) => (
                <TableRow key={attendance.id} className="table-row-hover">
                  <TableCell className="font-medium">
                    {typeof attendance.child === "object" &&
                    "naam" in attendance.child
                      ? attendance.child.naam
                      : `Kind #${(attendance.child as { id: number }).id}`}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(attendance.checkInTime)}
                  </TableCell>
                  <TableCell>
                    {attendance.checkOutTime
                      ? formatDateTime(attendance.checkOutTime)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {attendance.checkOutTime
                      ? calculateDuration(
                          attendance.checkInTime,
                          attendance.checkOutTime
                        )
                      : "Nog aanwezig"}
                  </TableCell>
                  <TableCell>
                    {!attendance.checkOutTime ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                      >
                        Aanwezig
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-800 hover:bg-gray-100"
                      >
                        Vertrokken
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/attendance/${attendance.id}`)
                        }
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
                              Aanwezigheid verwijderen
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je deze aanwezigheidsregistratie
                              wilt verwijderen? Deze actie kan niet ongedaan
                              worden gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                attendance.id && handleDelete(attendance.id)
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
