"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Baby, Calendar, Receipt, ArrowRight } from "lucide-react"
import { childrenApi, parentsApi, attendanceApi, invoiceApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { PageLoader } from "@/components/ui/loading-spinner"

export default function Home() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalParents: 0,
    presentToday: 0,
    unpaidInvoices: 0,
    unpaidAmount: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Haal alle data parallel op
        const [children, parents, attendances, invoices] = await Promise.all([
          childrenApi.getAll(),
          parentsApi.getAll(),
          attendanceApi.getAll(),
          invoiceApi.getAll(),
        ])

        // Bereken statistieken
        const today = new Date().toISOString().split("T")[0]
        const presentToday = attendances.filter(
          (attendance) =>
            attendance.checkInTime.startsWith(today) &&
            (!attendance.checkOutTime || attendance.checkOutTime.startsWith(today)),
        ).length

        const unpaidInvoices = invoices.filter((invoice) => !invoice.paid)
        const unpaidAmount = unpaidInvoices.reduce((total, invoice) => total + Number.parseFloat(invoice.amount), 0)

        setStats({
          totalChildren: children.length,
          totalParents: parents.length,
          presentToday,
          unpaidInvoices: unpaidInvoices.length,
          unpaidAmount,
        })
      } catch (error) {
        console.error("Fout bij ophalen dashboard data:", error)
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de dashboard gegevens.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  // Formateer bedrag voor weergave
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Totaal kinderen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChildren}</div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Totaal ouders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalParents}</div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aanwezigheid vandaag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.presentToday}</div>
                {stats.totalChildren > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((stats.presentToday / stats.totalChildren) * 100)}% van totaal
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Openstaande facturen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatAmount(stats.unpaidAmount)}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.unpaidInvoices} facturen</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Kinderen</CardTitle>
                <Baby className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Beheer alle kinderinformatie, inclusief allergieën, voorkeuren en contactpersonen.
                </CardDescription>
                <Link href="/children">
                  <Button className="w-full">
                    Kinderen beheren
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Ouders</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Beheer alle oudergegevens, inclusief contactinformatie en adresgegevens.
                </CardDescription>
                <Link href="/parents">
                  <Button className="w-full">
                    Ouders beheren
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Aanwezigheid</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Registreer aanwezigheid van kinderen, inclusief check-in en check-out tijden.
                </CardDescription>
                <Link href="/attendance">
                  <Button className="w-full">
                    Aanwezigheid beheren
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Facturen</CardTitle>
                <Receipt className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Beheer facturen voor ouders, inclusief betalingsstatus en openstaande bedragen.
                </CardDescription>
                <Link href="/invoices">
                  <Button className="w-full">
                    Facturen beheren
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
