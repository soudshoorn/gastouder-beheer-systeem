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
import { type Invoice, invoiceApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableLoader } from "@/components/ui/loading-spinner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Haal alle facturen op bij het laden van de pagina
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceApi.getAll();
        // Sorteer facturen op factuurdatum in aflopende volgorde (nieuwste eerst)
        setInvoices(
          data.sort(
            (a, b) =>
              new Date(b.invoiceDate).getTime() -
              new Date(a.invoiceDate).getTime()
          )
        );
      } catch (error) {
        console.error("Fout bij ophalen facturen:", error);
        toast({
          title: "Fout bij ophalen",
          description:
            "Er is een fout opgetreden bij het ophalen van de facturen.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [toast]);

  // Verwijder een factuur
  const handleDelete = async (id: number) => {
    try {
      await invoiceApi.delete(id);
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
      toast({
        title: "Factuur verwijderd",
        description: "De factuur is succesvol verwijderd.",
      });
    } catch (error) {
      console.error("Fout bij verwijderen factuur:", error);
      toast({
        title: "Fout bij verwijderen",
        description:
          "Er is een fout opgetreden bij het verwijderen van de factuur.",
        variant: "destructive",
      });
    }
  };

  // Markeer een factuur als betaald
  const handleMarkAsPaid = async (id: number) => {
    try {
      const invoice = invoices.find((inv) => inv.id === id);
      if (invoice) {
        const updatedInvoice = { ...invoice, paid: true };
        await invoiceApi.update(id, updatedInvoice);

        // Update de lokale staat
        setInvoices(
          invoices.map((inv) => (inv.id === id ? { ...inv, paid: true } : inv))
        );

        toast({
          title: "Factuur bijgewerkt",
          description: "De factuur is gemarkeerd als betaald.",
        });
      }
    } catch (error) {
      console.error("Fout bij bijwerken factuur:", error);
      toast({
        title: "Fout bij bijwerken",
        description:
          "Er is een fout opgetreden bij het bijwerken van de factuur.",
        variant: "destructive",
      });
    }
  };

  // Download factuur als PDF
  const handleDownloadInvoice = async (id: number) => {
    try {
      console.log("Starting download for invoice:", id);
      await invoiceApi.downloadPdf(id);
      toast({
        title: "Factuur gedownload",
        description: "De factuur is succesvol gedownload als PDF.",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Fout bij downloaden",
        description:
          "Er is een fout opgetreden bij het downloaden van de factuur. Probeer het later opnieuw.",
        variant: "destructive",
      });
    }
  };

  // Filter facturen op basis van zoekopdracht en status
  const filteredInvoices = invoices.filter((invoice) => {
    const parentName =
      typeof invoice.parent === "object" && "naam" in invoice.parent
        ? invoice.parent.naam
        : "";

    const matchesSearch = parentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filterStatus ||
      (filterStatus === "paid" && invoice.paid) ||
      (filterStatus === "unpaid" && !invoice.paid);

    return matchesSearch && matchesStatus;
  });

  // Formateer datum voor weergave
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: nl });
    } catch (error) {
      return dateString;
    }
  };

  // Formateer bedrag voor weergave
  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(Number.parseFloat(amount));
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Facturen</h1>
        <Link href="/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe factuur
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

        <div className="w-full md:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle facturen</SelectItem>
              <SelectItem value="paid">Betaald</SelectItem>
              <SelectItem value="unpaid">Niet betaald</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <TableLoader />
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-md border shadow-sm">
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">Geen facturen gevonden</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <Table>
            <TableHeader className="table-header">
              <TableRow>
                <TableHead>Factuurnr.</TableHead>
                <TableHead>Ouder</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Bedrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="table-row-hover">
                  <TableCell className="font-medium">#{invoice.id}</TableCell>
                  <TableCell>
                    {typeof invoice.parent === "object" &&
                    "naam" in invoice.parent
                      ? invoice.parent.naam
                      : `Ouder #${(invoice.parent as { id: number }).id}`}
                  </TableCell>
                  <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                  <TableCell>{formatAmount(invoice.amount)}</TableCell>
                  <TableCell>
                    {invoice.paid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" /> Betaald
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      >
                        <XCircle className="mr-1 h-3 w-3" /> Niet betaald
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-primary"
                        onClick={() =>
                          invoice.id && handleDownloadInvoice(invoice.id)
                        }
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download PDF</span>
                      </Button>

                      {!invoice.paid && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-green-500"
                          onClick={() =>
                            invoice.id && handleMarkAsPaid(invoice.id)
                          }
                          title="Markeer als betaald"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Markeer als betaald</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                        title="Bewerken"
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
                            title="Verwijderen"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Verwijderen</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Factuur verwijderen
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je deze factuur wilt
                              verwijderen? Deze actie kan niet ongedaan worden
                              gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                invoice.id && handleDelete(invoice.id)
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
