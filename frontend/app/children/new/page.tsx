"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { type Child, childrenApi } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewChildPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Initiële lege waarden voor een nieuw kind
  const [formData, setFormData] = useState<Child>({
    naam: "",
    geboortedatum: "",
    allergieen: "",
    voorkeurEten: "",
    startDatum: "",
    eindDatum: "",
    urenPerWeek: 0,
    contactPersoon: "",
  });

  // Bijwerken van formuliervelden
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "urenPerWeek" ? Number(value) : value,
    }));
  };

  // Valideer het formulier
  const validateForm = () => {
    const errors = [];

    if (!formData.naam.trim()) errors.push("Naam is verplicht");
    if (!formData.geboortedatum) errors.push("Geboortedatum is verplicht");
    if (!formData.contactPersoon.trim())
      errors.push("Contactpersoon is verplicht");

    return errors;
  };

  // Verstuur het formulier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validatiefout",
        description: errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Zorg ervoor dat alle velden correct zijn geformatteerd
      const childData = {
        ...formData,
        // Zorg ervoor dat numerieke velden als getallen worden verzonden
        urenPerWeek: Number(formData.urenPerWeek),
        // Zorg ervoor dat lege strings voor optionele velden null zijn
        allergieen: formData.allergieen.trim() || null,
        voorkeurEten: formData.voorkeurEten.trim() || null,
        eindDatum: formData.eindDatum || null,
        startDatum: formData.startDatum || null,
      };

      console.log("Versturen naar server:", childData);
      await childrenApi.create(childData);
      toast({
        title: "Kind aangemaakt",
        description: `${formData.naam} is succesvol toegevoegd.`,
      });
      router.push("/children");
    } catch (error) {
      console.error("Fout bij aanmaken kind:", error);

      // Meer gedetailleerde foutmelding
      if (error.response) {
        console.error("Server response:", error.response.data);
        toast({
          title: "Fout bij aanmaken",
          description: `Server fout: ${error.response.status} - ${
            error.response.data?.message || "Onbekende fout"
          }`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fout bij aanmaken",
          description:
            "Er is een fout opgetreden bij het aanmaken van het kind.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/children" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nieuw kind toevoegen</h1>
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
                <Label htmlFor="allergieen">Allergieën</Label>
                <Textarea
                  id="allergieen"
                  name="allergieen"
                  value={formData.allergieen}
                  onChange={handleChange}
                  placeholder="Bijv. pinda's, lactose, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voorkeurEten">Voorkeur eten</Label>
                <Textarea
                  id="voorkeurEten"
                  name="voorkeurEten"
                  value={formData.voorkeurEten}
                  onChange={handleChange}
                  placeholder="Bijv. pasta, rijst, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDatum">Startdatum</Label>
                <Input
                  id="startDatum"
                  name="startDatum"
                  type="date"
                  value={formData.startDatum}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eindDatum">Einddatum</Label>
                <Input
                  id="eindDatum"
                  name="eindDatum"
                  type="date"
                  value={formData.eindDatum}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urenPerWeek">Uren per week</Label>
                <Input
                  id="urenPerWeek"
                  name="urenPerWeek"
                  type="number"
                  min="0"
                  value={formData.urenPerWeek}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersoon">
                  Contactpersoon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactPersoon"
                  name="contactPersoon"
                  value={formData.contactPersoon}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/children">
                <Button variant="outline" type="button">
                  Annuleren
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Bezig met opslaan..." : "Kind toevoegen"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
