"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, Clock, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"

export default function WaitingRoom() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const { theme } = useTheme()
  const [gameCode, setGameCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])
  const [isGameStarting, setIsGameStarting] = useState(false)

  useEffect(() => {
    // Get game code and player name from localStorage
    const storedCode = localStorage.getItem("gameCode")
    const storedName = localStorage.getItem("playerName")

    if (!storedCode || !storedName) {
      router.push("/")
      return
    }

    setGameCode(storedCode)
    setPlayerName(storedName)

    // Simulate other players joining
    const simulatedPlayers = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace"]
    let currentPlayers = [storedName]

    const interval = setInterval(() => {
      if (currentPlayers.length < simulatedPlayers.length + 1) {
        const newPlayer = simulatedPlayers[currentPlayers.length - 1]
        currentPlayers = [...currentPlayers, newPlayer]
        setConnectedPlayers([...currentPlayers])
      } else {
        clearInterval(interval)

        // Simulate game starting after all players have joined
        setTimeout(() => {
          setIsGameStarting(true)
          setTimeout(() => {
            router.push("/player-game")
          }, 2000)
        }, 3000)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [router])

  const handleLeaveGame = () => {
    // Clear game data and go back to home
    localStorage.removeItem("gameCode")
    router.push("/")
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
            onClick={handleLeaveGame}
            className={theme === "dark" ? "text-gray-200" : "text-amber-800"}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Salle d'attente</h1>
        </div>
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded-full text-sm ${theme === "dark" ? "bg-gray-700" : "bg-amber-200"}`}>
            Code: {gameCode}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Joueurs connectés ({connectedPlayers.length})
            </CardTitle>
            <CardDescription>En attente du démarrage de la partie par l'animateur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isGameStarting ? (
                <div className="p-6 text-center">
                  <Moon
                    className={`h-12 w-12 mx-auto mb-4 animate-pulse ${
                      theme === "dark" ? "text-amber-400" : "text-amber-700"
                    }`}
                  />
                  <h3 className="text-xl font-bold mb-2">La partie commence !</h3>
                  <p className="opacity-70">Préparez-vous à découvrir votre rôle...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center p-4 mb-4">
                    <Clock
                      className={`h-6 w-6 mr-2 animate-pulse ${theme === "dark" ? "text-amber-400" : "text-amber-700"}`}
                    />
                    <span>En attente d'autres joueurs...</span>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {connectedPlayers.map((player, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-md ${
                          player === playerName
                            ? theme === "dark"
                              ? "bg-amber-800/30"
                              : "bg-amber-100"
                            : theme === "dark"
                              ? "bg-gray-700"
                              : "bg-amber-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 opacity-70" />
                          <span>
                            {player} {player === playerName && "(Vous)"}
                          </span>
                        </div>
                        {index === 0 && (
                          <Badge className={theme === "dark" ? "bg-amber-600" : "bg-amber-800"}>Animateur</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {!isGameStarting && (
          <div className="mt-6">
            <Button
              onClick={handleLeaveGame}
              variant="outline"
              className={`w-full ${
                theme === "dark" ? "border-gray-700 text-gray-300" : "border-amber-300 text-amber-800"
              }`}
            >
              Quitter la salle d'attente
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
