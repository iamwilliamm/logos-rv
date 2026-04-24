"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ExportPdfButtonProps {
  sheetId: string
  title: string
  contentId: string // L'ID de l'élément HTML contenant la fiche à exporter
}

export function ExportPdfButton({ sheetId, title, contentId }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleExport = async () => {
    // Check if user is PREMIUM
    if ((session?.user as any)?.plan !== "PREMIUM" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/pricing?redirect=/sheets/" + sheetId)
      return
    }

    setIsExporting(true)
    try {
      const element = document.getElementById(contentId)
      if (!element) throw new Error("Élément introuvable")

      // Cache temporairement les éléments qu'on ne veut pas dans le PDF (boutons, etc.)
      const elementsToHide = element.querySelectorAll(".no-print")
      elementsToHide.forEach((el) => {
        ;(el as HTMLElement).style.display = "none"
      })

      // Options pour html2canvas pour améliorer la qualité
      const canvas = await html2canvas(element, {
        scale: 2, // Meilleure résolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      // Restaure les éléments cachés
      elementsToHide.forEach((el) => {
        ;(el as HTMLElement).style.display = ""
      })

      const imgData = canvas.toDataURL("image/png")

      // Calcule les dimensions pour A4
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      // Si la hauteur dépasse une page, on ajoute des pages
      let heightLeft = pdfHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight)
        heightLeft -= pdf.internal.pageSize.getHeight()
      }

      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`)
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error)
      alert("Une erreur est survenue lors de l'export PDF")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span>{isExporting ? "Export en cours..." : "Exporter PDF"}</span>
    </Button>
  )
}
