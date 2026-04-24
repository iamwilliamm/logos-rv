"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Check, Loader2, BookOpen, Book } from "lucide-react"
import { cn } from "@/lib/utils"

interface Verse {
  reference: string
  text: string
  version: string
}

interface VersePickerProps {
  onVerseSelect?: (verse: Verse) => void
}

const BIBLE_BOOKS = [
  "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome",
  "Josué", "Juges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Rois", "2 Rois", "1 Chroniques", "2 Chroniques",
  "Esdras", "Néhémie", "Esther", "Job", "Psaumes",
  "Proverbes", "Ecclésiaste", "Cantique des Cantiques",
  "Ésaïe", "Jérémie", "Lamentations", "Ézéchiel", "Daniel",
  "Osée", "Joël", "Amos", "Abdias", "Jonas", "Michée",
  "Nahum", "Habacuc", "Sophonie", "Aggée", "Zacharie", "Malachie",
  "Matthieu", "Marc", "Luc", "Jean", "Actes",
  "Romains", "1 Corinthiens", "2 Corinthiens", "Galates", "Éphésiens",
  "Philippiens", "Colossiens", "1 Thessaloniciens", "2 Thessaloniciens",
  "1 Timothée", "2 Timothée", "Tite", "Philémon", "Hébreux",
  "Jacques", "1 Pierre", "2 Pierre", "1 Jean", "2 Jean",
  "3 Jean", "Jude", "Apocalypse"
]

const BIBLE_VERSIONS = ["Louis Segond", "Darby", "Martin"]

type TabMode = "search" | "manual"

export function VersePicker({ onVerseSelect }: VersePickerProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabMode>("search")
  const [selectedVersion, setSelectedVersion] = useState("Louis Segond")

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Verse[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [selectedBook, setSelectedBook] = useState("")
  const [chapter, setChapter] = useState("")
  const [verseNum, setVerseNum] = useState("")
  const [isLoadingVerse, setIsLoadingVerse] = useState(false)
  const [fetchedVerse, setFetchedVerse] = useState<Verse | null>(null)
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    if (searchQuery === "") setSearchResults([])
  }, [searchQuery])

  useEffect(() => {
    if (open) resetAllFields()
  }, [open])

  useEffect(() => {
    if (activeTab === "search") {
      setSelectedBook(""); setChapter(""); setVerseNum(""); setFetchedVerse(null); setFetchError("")
    } else {
      setSearchQuery(""); setSearchResults([])
    }
  }, [activeTab])

  const resetAllFields = () => {
    setSearchQuery(""); setSearchResults([]); setSelectedBook(""); setChapter(""); setVerseNum(""); setFetchedVerse(null); setFetchError("")
  }

  const searchVerse = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setSearchResults([])
    try {
      // Simulation call to real API in actual app
      await new Promise(resolve => setTimeout(resolve, 800))
      const mockResults: Verse[] = [
        { reference: "Jean 3:16", text: "Car Dieu a tant aimé le monde...", version: selectedVersion },
        { reference: "Psaumes 23:1", text: "L'Éternel est mon berger...", version: selectedVersion },
        { reference: "Philippiens 4:13", text: "Je puis tout par celui qui me fortifie.", version: selectedVersion },
      ]
      setSearchResults(mockResults)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  const fetchVerseFromBible = async () => {
    if (!selectedBook || !chapter || !verseNum) {
      setFetchError("Veuillez remplir tous les champs"); return
    }
    setIsLoadingVerse(true); setFetchError(""); setFetchedVerse(null)
    try {
      const response = await fetch("/api/bible/verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: selectedBook, chapter, verse: verseNum, version: selectedVersion })
      })
      if (!response.ok) { setFetchError("Verset non trouvé"); return }
      const verse = await response.json()
      setFetchedVerse(verse)
    } catch (error) {
      setFetchError("Erreur de connexion")
    } finally {
      setIsLoadingVerse(false)
    }
  }

  const handleManualVerseSubmit = () => {
    if (fetchedVerse) { onVerseSelect?.(fetchedVerse); setOpen(false); resetAllFields() }
  }

  const handleInsertVerse = (verseData: Verse) => {
    onVerseSelect?.(verseData); setOpen(false); resetAllFields()
  }

  const handleClose = () => { resetAllFields(); setOpen(false) }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => newOpen ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2 bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm ml-2 px-4 rounded-full font-bold uppercase tracking-wider text-[10px]">
          <Book className="h-3.5 w-3.5" />
          Verset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white border-slate-100 p-0 overflow-hidden rounded-3xl shadow-2xl">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            Sélecteur de Versets
          </DialogTitle>
        </div>

        <div className="p-6 space-y-6">
          {/* Version selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Version de la Bible</label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/50">
              {BIBLE_VERSIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVersion(v)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                    selectedVersion === v ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Tab switching */}
          <div className="flex gap-4 border-b border-slate-100">
            {["search", "manual"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabMode)}
                className={cn(
                  "pb-3 text-xs font-black uppercase tracking-[0.15em] transition-all relative",
                  activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab === "search" ? "Par mot-clé" : "Par référence"}
                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === "search" ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="relative group">
                  <Input
                    placeholder="Amour, foi, courage..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchVerse()}
                    className="h-12 pl-12 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-900 rounded-2xl font-bold placeholder-slate-300 shadow-inner"
                  />
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <Button
                    onClick={searchVerse}
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-1 top-1 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 font-black text-[10px] uppercase tracking-widest"
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Trouver"}
                  </Button>
                </div>

                <ScrollArea className="h-[250px] rounded-2xl border border-slate-100 bg-slate-50/50 p-2">
                  <div className="space-y-2">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => handleInsertVerse(res)}
                        className="w-full text-left p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-xs text-blue-600 uppercase tracking-widest">{res.reference}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">{res.version}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic line-clamp-2">« {res.text} »</p>
                      </button>
                    ))}
                    {!isSearching && searchQuery && searchResults.length === 0 && (
                      <div className="py-12 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">Aucun verset trouvé</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Livre</label>
                    <select
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 shadow-sm font-bold"
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                    >
                      <option value="">Livre...</option>
                      {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">Chapitre</label>
                    <Input type="number" placeholder="Ch." value={chapter} onChange={(e) => setChapter(e.target.value)} className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 font-black text-center text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-right">Verset</label>
                    <Input type="number" placeholder="V." value={verseNum} onChange={(e) => setVerseNum(e.target.value)} className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 font-black text-center text-lg" />
                  </div>
                </div>

                <Button
                  onClick={fetchVerseFromBible}
                  disabled={!selectedBook || !chapter || !verseNum || isLoadingVerse}
                  className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-95"
                >
                  {isLoadingVerse ? <Loader2 className="h-5 w-5 animate-spin" /> : "Récupérer l'Écriture"}
                </Button>

                {fetchedVerse && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl border border-blue-100 bg-blue-50/50 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-black text-blue-600 tracking-tighter text-xl">{fetchedVerse.reference}</span>
                      <span className="px-3 py-1 bg-white border border-blue-100 text-[10px] font-black text-blue-400 uppercase tracking-widest rounded-full">{fetchedVerse.version}</span>
                    </div>
                    <p className="text-[16px] text-slate-700 italic leading-relaxed font-semibold">« {fetchedVerse.text} »</p>
                    <Button
                      onClick={handleManualVerseSubmit}
                      className="mt-6 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200"
                    >
                      <Check className="h-4 w-4 mr-2" /> Insérer maintenant
                    </Button>
                  </motion.div>
                )}
                {fetchError && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest text-center">{fetchError}</div>}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
