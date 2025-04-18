"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, QrCode, LogIn, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/components/theme-provider"

export default function JoinGame() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const { theme } = useTheme()
  const [gameCode, setGameCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [scanError, setScanError] = useState("")

  useEffect(() => {
    // Get player name from localStorage if available
    const storedName = localStorage.getItem("playerName")
    if (storedName) {
      setPlayerName(storedName)
    }
  }, [])

  const handleScanQR = () => {
    setIsScanning(true)
    setScanError("")

    // In a real app, we would open the camera to scan a QR code
    // For now, we'll just simulate it
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% chance of success

      if (success) {
        setIsScanning(false)
        setGameCode("123456") // Simulated code from QR
      } else {
        setIsScanning(false)
        setScanError("Impossible de scanner le QR code. Veuillez réessayer ou saisir le code manuellement.")
      }
    }, 2000)
  }

  const handleJoinGame = () => {
    if (gameCode.length !== 6 || playerName.trim() === "") return

    setIsJoining(true)
    // In a real app, we would connect to the game here
    // For now, we'll just simulate it
    setTimeout(() => {
      localStorage.setItem("playerName", playerName)
      localStorage.setItem("gameCode", gameCode)
      router.push("/waiting-room")
    }, 1500)
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-amber-50 text-amber-900"
      }`}
      style={{ maxWidth: isMobile ? "100%" : "430px", margin: "0 auto" }}
    >
      {/* App header */}
      <header className={`p-4 flex justify-between items-center ${theme === "dark" ? "bg-gray-800" : "bg-amber-100"}`}>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className={theme === "dark" ? "text-gray-200" : "text-amber-800"}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Rejoindre une partie</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        <Card
          className={`w-full max-w-md ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}`}
        >
          <CardHeader>
            <CardTitle>Rejoindre une partie</CardTitle>
            <CardDescription>Entrez le code de la partie ou scannez le QR code pour rejoindre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="player-name">Votre nom</Label>
              <Input
                id="player-name"
                placeholder="Entrez votre nom"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className={theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-200"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="game-code">Code de la partie</Label>
              <div className="flex space-x-2">
                <Input
                  id="game-code"
                  placeholder="123456"
                  value={gameCode}
                  onChange={(e) => {
                    // Only allow numbers and limit to 6 characters
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                    setGameCode(value)
                  }}
                  className={`text-center text-xl tracking-wider font-mono ${
                    theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-200"
                  }`}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleScanQR}
                  disabled={isScanning}
                  className={theme === "dark" ? "border-gray-600" : "border-amber-300"}
                >
                  {isScanning ? (
                    <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <QrCode className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {isScanning && (
              <div className={`p-4 rounded-md text-center ${theme === "dark" ? "bg-gray-700" : "bg-amber-100"}`}>
                <div className="flex flex-col items-center space-y-3">
                  <Camera className="h-8 w-8 animate-pulse" />
                  <div>Scan du QR code en cours...</div>
                </div>
              </div>
            )}

            {scanError && <div className="p-3 bg-red-900/20 text-red-100 rounded-lg text-sm">{scanError}</div>}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleJoinGame}
              disabled={gameCode.length !== 6 || playerName.trim() === "" || isJoining}
              className={`w-full ${
                theme === "dark"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-amber-800 hover:bg-amber-900 text-white"
              }`}
            >
              {isJoining ? (
                <span className="flex items-center">
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />
                  Connexion...
                </span>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Rejoindre la partie
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
