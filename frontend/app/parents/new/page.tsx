"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { type Parent, parentsApi } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewParentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Initiële lege waarden voor een nieuwe ouder
  const [formData, setFormData] = useState<Parent>({
    naam: "",
    geboortedatum: "",
    telefoonnummer: "",
    email: "",
  })

  // Bijwerken van formuliervelden
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Valideer het formulier
  const validateForm = () => {
    const errors = []

    if (!formData.naam.trim()) errors.push("Naam is verplicht")
    if (!formData.geboortedatum) errors.push("Geboortedatum is verplicht")
    if (!formData.telefoonnummer.trim()) errors.push("Telefoonnummer is verplicht")

    // Eenvoudige e-mail validatie
    if (!formData.email.trim()) {
      errors.push("E-mail is verplicht")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("E-mail is niet geldig")
    }

    return errors
  }

  // Verstuur het formulier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm()
    if (errors.length > 0) {
      toast({
        title: "Validatiefout",
        description: errors.join(". "),
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await parentsApi.create(formData)
      toast({
        title: "Ouder aangemaakt",
        description: `${formData.naam} is succesvol toegevoegd.`,
      })
      router.push("/parents")
    } catch (error) {
      console.error("Fout bij aanmaken ouder:", error)
      toast({
        title: "Fout bij aanmaken",
        description: "Er is een fout opgetreden bij het aanmaken van de ouder.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/parents" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nieuwe ouder toevoegen</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oudergegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="naam">
                  Naam <span className="text-red-500">*</span>
                </Label>
                <Input id="naam" name="naam" value={formData.naam} onChange={handleChange} required />
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
                <Label htmlFor="telefoonnummer">
                  Telefoonnummer <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telefoonnummer"
                  name="telefoonnummer"
                  value={formData.telefoonnummer}
                  onChange={handleChange}
                  placeholder="06-12345678"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  E-mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="naam@voorbeeld.nl"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/parents">
                <Button variant="outline" type="button">
                  Annuleren
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Bezig met opslaan..." : "Ouder toevoegen"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
