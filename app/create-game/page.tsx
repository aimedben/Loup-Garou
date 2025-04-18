"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Copy, QrCode, Play, User, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { generateGameCode } from "@/lib/game-utils"
import { AdvancedRoleSelector } from "@/components/advanced-role-selector"
import { useTheme } from "@/components/theme-provider"
import { Slider } from "@/components/ui/slider"

export default function CreateGame() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const { theme } = useTheme()
  const [gameCode, setGameCode] = useState("")
  const [players, setPlayers] = useState<{ id: number; name: string; device: boolean }[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [activeTab, setActiveTab] = useState("players")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [playerCount, setPlayerCount] = useState(8)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  useEffect(() => {
    // Generate a random game code
    setGameCode(generateGameCode())
  }, [])

  const handleAddPlayer = () => {
    if (newPlayerName.trim() === "") return
    if (players.length >= 30) return

    setPlayers([
      ...players,
      {
        id: Date.now(),
        name: newPlayerName,
        device: false,
      },
    ])
    setNewPlayerName("")
  }

  const handleRemovePlayer = (id: number) => {
    setPlayers(players.filter((player) => player.id !== id))
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode)
    // In a real app, we would show a toast notification here
  }

  const handleGenerateQR = () => {
    setIsGeneratingQR(true)
    // Simulate QR code generation
    setTimeout(() => {
      setIsGeneratingQR(false)
    }, 1000)
  }

  const handleStartGame = () => {
    if (players.length < 5) {
      alert("Il faut au moins 5 joueurs pour commencer une partie.")
      return
    }

    // In a real app, we would start the game here
    // For now, we'll just navigate to the game master screen
    localStorage.setItem("gameCode", gameCode)
    localStorage.setItem("players", JSON.stringify(players))
    localStorage.setItem("selectedRoles", JSON.stringify(selectedRoles))
    router.push("/game-master")
  }

  const handleRoleChange = useCallback((roles: string[]) => {
    setSelectedRoles(roles)
  }, [])

  const handlePlayerCountChange = (value: number[]) => {
    setPlayerCount(value[0])
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
          <h1 className="text-xl font-bold ml-2">Créer une partie</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
          <CardHeader>
            <CardTitle>Code de partie</CardTitle>
            <CardDescription>Partagez ce code avec vos amis pour qu'ils rejoignent la partie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-md bg-opacity-20 mb-4 border border-dashed">
              <span className="text-2xl font-mono tracking-wider">{gameCode}</span>
              <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className={theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-300 border-amber-500 text-gray-800"}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleGenerateQR}
                className={theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-amber-300 border-amber-500 text-gray-800"}
              >
                {isGeneratingQR ? (
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4" />
                )}
              </Button>

              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
            <CardHeader>
              <CardTitle>Nombre de joueurs</CardTitle>
              <CardDescription>Définissez le nombre de joueurs pour cette partie (5-30)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">5</span>
                  <span className="font-medium">30</span>
                </div>
                <Slider
                  defaultValue={[playerCount]}
                  min={5}
                  max={30}
                  step={1}
                  onValueChange={handlePlayerCountChange}
                  className={theme === "dark" ? "" : ""}
                />
                <div className="flex items-center justify-center">
                  <Badge className={theme === "dark" ? "bg-amber-600" : "bg-amber-800"}>{playerCount} joueurs</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className={`grid w-full grid-cols-2 ${theme === "dark" ? "bg-gray-800" : "bg-amber-100"}`}>
            <TabsTrigger value="players">
              <Users className="h-4 w-4 mr-2" />
              Joueurs ({players.length})
            </TabsTrigger>
            <TabsTrigger value="roles">Rôles</TabsTrigger>
          </TabsList>
          <TabsContent value="players" className="mt-4">
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
              <CardHeader>
                <CardTitle>Joueurs</CardTitle>
                <CardDescription>
                  Ajoutez des joueurs manuellement ou attendez qu'ils rejoignent avec le code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Nom du joueur"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      className={theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-200"}
                    />
                    <Button
                      onClick={handleAddPlayer}
                      disabled={newPlayerName.trim() === "" || players.length >= 30}
                      className={
                        theme === "dark"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-amber-800 hover:bg-amber-900 text-white"
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {players.length === 0 ? (
                      <div className={`p-4 text-center rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-amber-50"}`}>
                        <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-70">Aucun joueur pour le moment</p>
                        <p className="text-xs opacity-50 mt-1">
                          Ajoutez des joueurs manuellement ou attendez qu'ils rejoignent
                        </p>
                      </div>
                    ) : (
                      players.map((player) => (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-3 rounded-md ${
                            theme === "dark" ? "bg-gray-700" : "bg-amber-50"
                          }`}
                        >
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 opacity-70" />
                            <span>{player.name}</span>
                            {player.device && (
                              <Badge
                                className={`ml-2 ${
                                  theme === "dark" ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
                                }`}
                              >
                                Connecté
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePlayer(player.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="roles" className="mt-4">
            <AdvancedRoleSelector theme={theme} onRoleChange={handleRoleChange} playerCount={playerCount} />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            onClick={handleStartGame}
            disabled={players.length < 5}
            className={`w-full h-12 ${
              theme === "dark"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-amber-800 hover:bg-amber-900 text-white"
            }`}
          >
            <Play className="mr-2 h-5 w-5" />
            Commencer la partie ({players.length}/{playerCount})
          </Button>
          {players.length < 5 && (
            <p className="text-xs text-center mt-2 opacity-70">Il faut au moins 5 joueurs pour commencer</p>
          )}
        </div>
      </main>
    </div>
  )
}
