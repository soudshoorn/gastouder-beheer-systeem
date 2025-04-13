"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { type Parent, parentsApi } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CardLoader } from "@/components/ui/loading-spinner"

export default function EditParentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Gebruik React.use om params te unwrappen
  const { id: parentId } = use(params)

  // Initiële lege waarden voor een ouder
  const [formData, setFormData] = useState<Parent>({
    naam: "",
    geboortedatum: "",
    telefoonnummer: "",
    email: "",
  })

  // Haal oudergegevens op bij het laden van de pagina
  useEffect(() => {
    const fetchParent = async () => {
      try {
        const data = await parentsApi.getById(Number(parentId))
        setFormData(data)
      } catch (error) {
        console.error("Fout bij ophalen ouder:", error)
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de oudergegevens.",
          variant: "destructive",
        })
        router.push("/parents")
      } finally {
        setLoading(false)
      }
    }

    fetchParent()
  }, [parentId, router, toast])

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

    setSaving(true)

    try {
      await parentsApi.update(Number(parentId), formData)
      toast({
        title: "Ouder bijgewerkt",
        description: `${formData.naam} is succesvol bijgewerkt.`,
      })
      router.push("/parents")
    } catch (error) {
      console.error("Fout bij bijwerken ouder:", error)

      // Meer gedetailleerde foutmelding
      if (error.response) {
        console.error("Server response:", error.response.data)
        toast({
          title: "Fout bij bijwerken",
          description: `Server fout: ${error.response.status} - ${error.response.data?.message || "Onbekende fout"}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Fout bij bijwerken",
          description: "Er is een fout opgetreden bij het bijwerken van de ouder.",
          variant: "destructive",
        })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/parents" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Ouder bewerken</h1>
        </div>
        <CardLoader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/parents" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Ouder bewerken</h1>
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
              <Button type="submit" disabled={saving}>
                {saving ? "Bezig met opslaan..." : "Wijzigingen opslaan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
