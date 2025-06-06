"use client";

import type React from "react";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  type Child,
  type Parent,
  childrenApi,
  parentsApi,
  validateChild,
} from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CardLoader } from "@/components/ui/loading-spinner";

export default function EditChildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loadingParents, setLoadingParents] = useState(true);

  // Gebruik React.use om params te unwrappen
  const { id: childId } = use(params);

  // Initiële lege waarden voor een kind
  const [formData, setFormData] = useState<Child>({
    naam: "",
    geboortedatum: "",
    allergies: "",
    dietaryPreferences: "",
    notes: "",
    active: true,
    parent: { id: 0 },
  });

  // Haal alle ouders op voor de dropdown
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const data = await parentsApi.getAll();
        setParents(data);
      } catch (error) {
        console.error("Fout bij ophalen ouders:", error);
        toast({
          title: "Fout bij ophalen",
          description:
            "Er is een fout opgetreden bij het ophalen van de ouders.",
          variant: "destructive",
        });
      } finally {
        setLoadingParents(false);
      }
    };

    fetchParents();
  }, [toast]);

  // Haal kindgegevens op bij het laden van de pagina
  useEffect(() => {
    const fetchChild = async () => {
      try {
        console.log("Fetching child with ID:", childId);
        const data = await childrenApi.getById(Number(childId));
        console.log("Opgehaalde kindgegevens:", data);

        // Controleer of data geldig is
        if (!data || !data.naam) {
          throw new Error(
            "Ongeldig of leeg kind object ontvangen van de server"
          );
        }

        setFormData(data);
      } catch (error) {
        console.error("Fout bij ophalen kind:", error);
        toast({
          title: "Fout bij ophalen",
          description:
            "Er is een fout opgetreden bij het ophalen van de kindgegevens. " +
            (error.message || "Onbekende fout"),
          variant: "destructive",
        });

        // Wacht even voordat we navigeren om de toast te kunnen zien
        setTimeout(() => {
          router.push("/children");
        }, 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchChild();
  }, [childId, router, toast]);

  // Bijwerken van formuliervelden
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  // Bijwerken van de geselecteerde ouder
  const handleParentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parent: { id: Number.parseInt(value) },
    }));
  };

  // Bijwerken van de active status
  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  // Verstuur het formulier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateChild(formData);
    if (errors.length > 0) {
      toast({
        title: "Validatiefout",
        description: errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    console.log("Versturen van data naar server:", formData);

    try {
      const updatedChild = await childrenApi.update(Number(childId), formData);
      console.log("Response van server:", updatedChild);

      toast({
        title: "Kind bijgewerkt",
        description: `${formData.naam} is succesvol bijgewerkt.`,
      });

      // Forceer een refresh van de pagina en navigeer dan terug
      router.refresh();
      setTimeout(() => {
        router.push("/children");
      }, 500);
    } catch (error) {
      console.error("Fout bij bijwerken kind:", error);

      toast({
        title: "Fout bij bijwerken",
        description:
          error.message ||
          "Er is een fout opgetreden bij het bijwerken van het kind.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/children" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Kind bewerken</h1>
        </div>
        <CardLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/children" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Kind bewerken</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kindgegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="naam">
                  Naam <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="naam"
                  name="naam"
                  value={formData.naam}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="geboortedatum">
                  Geboortedatum <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="geboortedatum"
                  name="geboortedatum"
                  type="date"
                  value={formData.geboortedatum}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">
                  Ouder <span className="text-red-500">*</span>
                </Label>
                {loadingParents ? (
                  <div className="text-sm text-muted-foreground">
                    Ouders laden...
                  </div>
                ) : (
                  <Select
                    onValueChange={handleParentChange}
                    defaultValue={
                      typeof formData.parent === "object" &&
                      "id" in formData.parent
                        ? formData.parent.id?.toString()
                        : ""
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een ouder" />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((parent) => (
                        <SelectItem
                          key={parent.id}
                          value={parent.id?.toString() || ""}
                        >
                          {parent.naam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergieën</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies || ""}
                  onChange={handleChange}
                  placeholder="Bijv. pinda's, lactose, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryPreferences">Dieetvoorkeuren</Label>
                <Textarea
                  id="dietaryPreferences"
                  name="dietaryPreferences"
                  value={formData.dietaryPreferences || ""}
                  onChange={handleChange}
                  placeholder="Bijv. vegetarisch, halal, etc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notities</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Bijzonderheden of andere informatie"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleActiveChange}
                />
                <Label htmlFor="active">Actief</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/children">
                <Button variant="outline" type="button">
                  Annuleren
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? "Bezig met opslaan..." : "Wijzigingen opslaan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
