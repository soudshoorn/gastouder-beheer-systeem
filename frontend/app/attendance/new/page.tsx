"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { type Attendance, type Child, attendanceApi, childrenApi } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewAttendancePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [loadingChildren, setLoadingChildren] = useState(true)

  // Initiële lege waarden voor een nieuwe aanwezigheidsregistratie
  const [formData, setFormData] = useState<Attendance>({
    checkInTime: new Date().toISOString().slice(0, 16),
    checkOutTime: "",
    child: { id: 0 },
  })

  // Haal alle kinderen op voor de dropdown
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await childrenApi.getAll()
        setChildren(data)
      } catch (error) {
        console.error("Fout bij ophalen kinderen:", error)
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de kinderen.",
          variant: "destructive",
        })
      } finally {
        setLoadingChildren(false)
      }
    }

    fetchChildren()
  }, [toast])

  // Bijwerken van formuliervelden
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Bijwerken van het geselecteerde kind
  const handleChildChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      child: { id: Number.parseInt(value) },
    }))
  }

  // Valideer het formulier
  const validateForm = () => {
    const errors = []

    if (!formData.checkInTime) errors.push("Check-in tijd is verplicht")
    if ((formData.child as { id: number }).id === 0) errors.push("Kind is verplicht")

    // Als check-out tijd is ingevuld, controleer of deze na check-in tijd is
    if (formData.checkOutTime && formData.checkInTime && formData.checkOutTime < formData.checkInTime) {
      errors.push("Check-out tijd moet na check-in tijd zijn")
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
      // Zorg ervoor dat alle velden correct zijn geformatteerd
      const attendanceData = {
        ...formData,
        // Zorg ervoor dat lege strings voor optionele velden null zijn
        checkOutTime: formData.checkOutTime || null,
      }

      await attendanceApi.create(attendanceData)
      toast({
        title: "Aanwezigheid geregistreerd",
        description: "De aanwezigheid is succesvol geregistreerd.",
      })
      router.push("/attendance")
    } catch (error) {
      console.error("Fout bij registreren aanwezigheid:", error)

      // Meer gedetailleerde foutmelding
      if (error.response) {
        console.error("Server response:", error.response.data)
        toast({
          title: "Fout bij registreren",
          description: `Server fout: ${error.response.status} - ${error.response.data?.message || "Onbekende fout"}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Fout bij registreren",
          description: "Er is een fout opgetreden bij het registreren van de aanwezigheid.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/attendance" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nieuwe aanwezigheid registreren</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aanwezigheidsgegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="child">
                  Kind <span className="text-red-500">*</span>
                </Label>
                {loadingChildren ? (
                  <div className="text-sm text-muted-foreground">Kinderen laden...</div>
                ) : (
                  <Select onValueChange={handleChildChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een kind" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child) => (
                        <SelectItem key={child.id} value={child.id?.toString() || ""}>
                          {child.naam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkInTime">
                  Check-in tijd <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkInTime"
                  name="checkInTime"
                  type="datetime-local"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out tijd</Label>
                <Input
                  id="checkOutTime"
                  name="checkOutTime"
                  type="datetime-local"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">Laat leeg als het kind nog aanwezig is</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/attendance">
                <Button variant="outline" type="button">
                  Annuleren
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Bezig met registreren..." : "Aanwezigheid registreren"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
