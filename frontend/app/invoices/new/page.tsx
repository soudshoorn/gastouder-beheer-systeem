"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { type Invoice, type Parent, type Child, invoiceApi, parentsApi, childrenApi } from "@/lib/api"
import { ArrowLeft, Calculator } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Constanten voor berekening
const HOURLY_RATE = 8.5
const WEEKS_PER_MONTH = 4

export default function NewInvoicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [parents, setParents] = useState<Parent[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [loadingParents, setLoadingParents] = useState(true)
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [selectedParentChildren, setSelectedParentChildren] = useState<Child[]>([])

  // Initiële lege waarden voor een nieuwe factuur
  const [formData, setFormData] = useState<Invoice & { hoursPerWeek: number }>({
    amount: "",
    paid: false,
    invoiceDate: new Date().toISOString().slice(0, 10),
    parent: { id: 0 },
    hoursPerWeek: 0,
  })

  // Haal alle ouders en kinderen op voor de dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parentsData, childrenData] = await Promise.all([parentsApi.getAll(), childrenApi.getAll()])
        setParents(parentsData)
        setChildren(childrenData)
      } catch (error) {
        console.error("Fout bij ophalen data:", error)
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de gegevens.",
          variant: "destructive",
        })
      } finally {
        setLoadingParents(false)
        setLoadingChildren(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter kinderen op basis van geselecteerde ouder
  useEffect(() => {
    if ((formData.parent as { id: number }).id !== 0 && children.length > 0) {
      const parentId = (formData.parent as { id: number }).id
      const filteredChildren = children.filter(
        (child) =>
          (typeof child.parent === "object" && "id" in child.parent && child.parent.id === parentId) ||
          (typeof child.parent === "object" && child.parent === parentId),
      )
      setSelectedParentChildren(filteredChildren)
    } else {
      setSelectedParentChildren([])
    }
  }, [formData.parent, children])

  // Bereken standaardbedrag wanneer urenPerWeek verandert
  useEffect(() => {
    if (formData.hoursPerWeek > 0) {
      const standardAmount = formData.hoursPerWeek * WEEKS_PER_MONTH * HOURLY_RATE
      setFormData((prev) => ({
        ...prev,
        amount: standardAmount.toFixed(2),
      }))
    }
  }, [formData.hoursPerWeek])

  // Bijwerken van formuliervelden
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // Bijwerken van numerieke velden
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === "" ? 0 : Number.parseFloat(value)
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }))
  }

  // Bijwerken van de geselecteerde ouder
  const handleParentChange = (value: string) => {
    const parentId = Number.parseInt(value)
    setFormData((prev) => ({
      ...prev,
      parent: { id: parentId },
      // Reset uren per week wanneer ouder verandert
      hoursPerWeek: 0,
      amount: "",
    }))

    // Haal de kinderen van deze ouder op en bereken het totaal aantal uren
    const fetchChildrenHours = async () => {
      try {
        const children = await childrenApi.getByParent(parentId)
        if (children && children.length > 0) {
          // Tel de uren per week van alle kinderen bij elkaar op
          const totalHours = children.reduce((total, child) => total + (child.hoursPerWeek || 0), 0)
          if (totalHours > 0) {
            setFormData((prev) => ({
              ...prev,
              hoursPerWeek: totalHours,
              // Bedrag wordt automatisch berekend door de useEffect die hoursPerWeek monitort
            }))
          }
        }
      } catch (error) {
        console.error("Fout bij ophalen kinderen van ouder:", error)
      }
    }

    fetchChildrenHours()
  }

  // Bijwerken van de betaalstatus
  const handlePaidChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      paid: checked,
    }))
  }

  // Valideer het formulier
  const validateForm = () => {
    const errors = []

    if (!formData.amount) errors.push("Bedrag is verplicht")
    if (isNaN(Number.parseFloat(formData.amount))) errors.push("Bedrag moet een geldig getal zijn")
    if (Number.parseFloat(formData.amount) <= 0) errors.push("Bedrag moet groter zijn dan 0")
    if (!formData.invoiceDate) errors.push("Factuurdatum is verplicht")
    if ((formData.parent as { id: number }).id === 0) errors.push("Ouder is verplicht")

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
      // Zorg ervoor dat het bedrag als string wordt verzonden
      const invoiceData = {
        ...formData,
        amount: formData.amount.toString(),
      }

      await invoiceApi.create(invoiceData)
      toast({
        title: "Factuur aangemaakt",
        description: "De factuur is succesvol aangemaakt.",
      })
      router.push("/invoices")
    } catch (error) {
      console.error("Fout bij aanmaken factuur:", error)

      // Meer gedetailleerde foutmelding
      if (error.response) {
        console.error("Server response:", error.response.data)
        toast({
          title: "Fout bij aanmaken",
          description: `Server fout: ${error.response.status} - ${error.response.data?.message || "Onbekende fout"}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Fout bij aanmaken",
          description: "Er is een fout opgetreden bij het aanmaken van de factuur.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Formateer bedrag voor weergave
  const formatAmount = (amount: string | number) => {
    if (amount === "" || amount === 0) return ""
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(amount))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/invoices" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nieuwe factuur aanmaken</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Factuurgegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="parent">
                  Ouder <span className="text-red-500">*</span>
                </Label>
                {loadingParents ? (
                  <div className="text-sm text-muted-foreground">Ouders laden...</div>
                ) : (
                  <Select onValueChange={handleParentChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een ouder" />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id?.toString() || ""}>
                          {parent.naam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hoursPerWeek">Aantal uren per week</Label>
                <Input
                  id="hoursPerWeek"
                  name="hoursPerWeek"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.hoursPerWeek || ""}
                  onChange={handleNumberChange}
                  placeholder="0"
                  className="w-full"
                  disabled={(formData.parent as { id: number }).id === 0}
                />
                {formData.hoursPerWeek > 0 && (
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Calculator className="h-3 w-3 mr-1" />
                    Standaard berekend: {formData.hoursPerWeek} uur/week × {WEEKS_PER_MONTH} weken × €
                    {HOURLY_RATE.toFixed(2)}/uur
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Bedrag <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">€</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    className="pl-7"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formData.amount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatAmount(formData.amount)} (kan handmatig worden aangepast)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate">
                  Factuurdatum <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invoiceDate"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox id="paid" checked={formData.paid} onCheckedChange={handlePaidChange} />
                <Label htmlFor="paid" className="cursor-pointer">
                  Factuur is betaald
                </Label>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <p className="text-sm text-muted-foreground">
                  {selectedParentChildren.length > 0
                    ? `Deze ouder heeft ${selectedParentChildren.length} ${
                        selectedParentChildren.length === 1 ? "kind" : "kinderen"
                      } ingeschreven.`
                    : "Selecteer eerst een ouder om kinderen te zien."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/invoices">
                <Button variant="outline" type="button">
                  Annuleren
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Bezig met aanmaken..." : "Factuur aanmaken"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
