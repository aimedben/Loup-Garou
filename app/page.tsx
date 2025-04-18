"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun, Volume2, VolumeX, Settings, Users, QrCode, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMobile } from "@/hooks/use-mobile"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useTheme } from "@/components/theme-provider"
import { MusicPlayer } from "@/components/MusicPlayer"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const { theme, setTheme } = useTheme()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Simulate sound effect
  const playSound = (soundName: string) => {
    if (soundEnabled) {
      console.log(`Playing sound: ${soundName}`)
      // In a real app, we would play the sound here
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    localStorage.setItem("soundEnabled", (!soundEnabled).toString())
  }

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled)
    localStorage.setItem("musicEnabled", (!musicEnabled).toString())
  }

  useEffect(() => {
    // Get sound and music settings from localStorage
    const storedSound = localStorage.getItem("soundEnabled")
    const storedMusic = localStorage.getItem("musicEnabled")

    if (storedSound !== null) {
      setSoundEnabled(storedSound === "true")
    }

    if (storedMusic !== null) {
      setMusicEnabled(storedMusic === "true")
    }

    // Start background music if enabled
    if (musicEnabled) {
      console.log("Starting background music")
      // In a real app, we would start the music here
    }

    return () => {
      // Stop music when component unmounts
      console.log("Stopping background music")
      // In a real app, we would stop the music here
    }
  }, [musicEnabled])

  const handleCreateGame = () => {
    playSound("click")
    router.push("/create-game")
  }

  const handleJoinGame = () => {
    playSound("click")
    router.push("/join-game")
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-amber-50 text-amber-900"
      }`}
      style={{ maxWidth: isMobile ? "100%" : "430px", margin: "0 auto" }}
    >
      {/* App header */}
      <header className={`p-4 flex justify-between items-center ${theme === "dark" ? "bg-blue-960" : "bg-amber-100"}`}>
        <div className="flex items-center">
          <Moon className={`h-6 w-6 mr-2 ${theme === "dark" ? "text-amber-400" : "text-amber-700"}`} />
          <h1 className="text-xl font-bold">Loup-Garou Pro</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className={theme === "dark" ? "text-gray-200" : "text-amber-800"}>
                <Info className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className={theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-amber-900"}>
              <DrawerHeader>
                <DrawerTitle>À propos de Loup-Garou Pro</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <p>
                  Loup-Garou Pro est une application qui vous permet de jouer au célèbre jeu de société Loup-Garou avec
                  vos amis, en temps réel et sans connexion internet.
                </p>
                <p>
                  Cette application propose plus de 15 rôles différents, un système de suggestion automatique de rôles
                  équilibrés, et une interface intuitive pour l'animateur et les joueurs.
                </p>
                <p className="text-sm opacity-50">Version 2.0.0</p>
              </div>
            </DrawerContent>
          </Drawer>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className={theme === "dark" ? "text-gray-200" : "text-amber-800"}
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className={`p-4 ${theme === "dark" ? "bg-blue-1000 text-gray-200" : "bg-amber-100 text-amber-800"}`}>
          <h2 className="text-lg font-semibold mb-4">Paramètres</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 mr-2 text-amber-400" />
                ) : (
                  <Sun className="h-5 w-5 mr-2 text-amber-600" />
                )}
                <Label htmlFor="theme-toggle">Thème {theme === "dark" ? "Sombre" : "Clair"}</Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {soundEnabled ? <Volume2 className="h-5 w-5 mr-2" /> : <VolumeX className="h-5 w-5 mr-2" />}
                <Label htmlFor="sound-toggle">Effets sonores</Label>
              </div>
              <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={toggleSound} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {musicEnabled ? <Volume2 className="h-5 w-5 mr-2" /> : <VolumeX className="h-5 w-5 mr-2" />}
                <Label htmlFor="music-toggle">Musique d'ambiance</Label>
              </div>
              <Switch id="music-toggle" checked={musicEnabled} onCheckedChange={toggleMusic} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="relative flex-1 flex flex-col justify-between items-center p-6 overflow-hidden">
  {/* Image de fond en plein écran */}
  <Image
    src="/wolf.jpg"
    alt="Loup-Garou Pro"
    fill
    className="object-cover z-0"
    priority
  />

  {/* Overlay sombre pour lisibilité */}
  <div className="relative z-20 flex justify-center mt-10 px-4">
  <div className="bg-black/40 rounded-3xl p-6 w-full max-w-sm text-center shadow-xl backdrop-blur-md">
    <h2 className="text-3xl font-bold text-white">Loup-Garou Pro</h2>
    <p className="text-white/80 text-sm mt-2">
      Jouez au célèbre jeu de société avec vos amis, en temps réel et sans connexion internet !
    </p>
    {musicEnabled && <div className="mt-4"><MusicPlayer /></div>}
  </div>
</div>


  {/* Bas de l'écran : boutons + version */}
  <div className="relative z-40 w-full max-w-xs space-y-8 mb-8 text-center">
    <Button
      onClick={handleCreateGame}
      className={`w-full h-14 text-lg ${
        theme === "dark"
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-green-800 hover:bg-green-900 text-white"
      }`}
    >
      <Users className="mr-2 h-5 w-5" />
      Créer une partie
    </Button>
    <Button
      onClick={handleJoinGame}
      className={`w-full h-14 text-lg ${
        theme === "dark"
          ? "bg-blue-700 hover:bg-blue-600 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      <QrCode className="mr-2 h-5 w-5" />
      Rejoindre une partie
    </Button>

    <p className="text-xs opacity-70 text-white mt-4">Version 2.0.0</p>
  </div>
</main>


    </div>
  )
}
