"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skull } from "lucide-react"
import { useRouter } from "next/navigation"

interface Player {
  name: string
  role: string
}

export default function EndPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [deadPlayers, setDeadPlayers] = useState<string[]>([])
  const [winner, setWinner] = useState<string>("")

  useEffect(() => {
    // Get players from localStorage
    const storedPlayers = localStorage.getItem("players")
    if (!storedPlayers) {
      router.push("/")
      return
    }

    const loadedPlayers = JSON.parse(storedPlayers)
    setPlayers(loadedPlayers)

    // Get dead players from localStorage
    const storedDeadPlayers = localStorage.getItem("deadPlayers")
    if (storedDeadPlayers) {
      setDeadPlayers(JSON.parse(storedDeadPlayers))
    }

    // Get winner from localStorage
    const storedWinner = localStorage.getItem("winner")
    if (storedWinner) {
      setWinner(storedWinner)
    }
  }, [router])

  const resetGame = () => {
    // Clear localStorage
    localStorage.removeItem("players")
    localStorage.removeItem("deadPlayers")
    localStorage.removeItem("nightCount")
    localStorage.removeItem("nightActions")
    localStorage.removeItem("winner")

    // Go to home page
    router.push("/")
  }

  if (players.length === 0) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-2 border-amber-800/20">
        <CardHeader className="text-center bg-amber-50 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-amber-900">Fin de la partie</CardTitle>
        </CardHeader>

        <CardContent className="pt-6 text-center space-y-6">
          <div className={`p-6 rounded-lg ${winner === "village" ? "bg-blue-100" : "bg-red-100"}`}>
            <h2 className="text-2xl font-bold mb-4">
              {winner === "village" ? (
                <span className="text-blue-800">Victoire du Village !</span>
              ) : (
                <span className="text-red-800">Victoire des Loups-Garous !</span>
              )}
            </h2>
            <p className={winner === "village" ? "text-blue-700" : "text-red-700"}>
              {winner === "village"
                ? "Tous les Loups-Garous ont été éliminés. Le village peut dormir en paix."
                : "Les Loups-Garous ont dévoré suffisamment de villageois pour prendre le contrôle du village."}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-900">Rôles des joueurs</h3>
            <div className="grid gap-2">
              {players.map((player) => (
                <div
                  key={player.name}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    deadPlayers.includes(player.name) ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    {deadPlayers.includes(player.name) && <Skull className="mr-2 h-5 w-5 text-gray-500" />}
                    <span
                      className={`font-medium ${deadPlayers.includes(player.name) ? "text-gray-500" : "text-amber-900"}`}
                    >
                      {player.name}
                    </span>
                  </div>
                  <span
                    className={`${
                      player.role === "Loup-Garou"
                        ? "text-red-600"
                        : player.role === "Villageois"
                          ? "text-blue-600"
                          : "text-purple-600"
                    }`}
                  >
                    {player.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={resetGame} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
            Nouvelle partie
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
