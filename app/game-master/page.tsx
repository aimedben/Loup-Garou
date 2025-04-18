"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun, User, MessageCircle, Skull, ArrowLeft, Play, Users, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/components/theme-provider"
import { MusicPlayer } from "@/components/MusicPlayer"
import Image from "next/image"

export default function GameMaster() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const { theme, setTheme } = useTheme()
  const [gameCode, setGameCode] = useState("")
  const [players, setPlayers] = useState<{ name: string; role: string; alive: boolean }[]>([])
  const [gamePhase, setGamePhase] = useState<"setup" | "night" | "day" | "vote" | "end">("setup")
  const [currentNightRole, setCurrentNightRole] = useState<string | null>(null)
  const [dayCount, setDayCount] = useState(1)
  const [nightActions, setNightActions] = useState<Record<string, string>>({})
  const [deadPlayers, setDeadPlayers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("game")
  const [showMusicControls, setShowMusicControls] = useState(false)

  useEffect(() => {
    // Get theme from localStorage
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme) {
      setTheme(storedTheme as "light" | "dark")
    }

    // Get game code from localStorage
    const storedCode = localStorage.getItem("gameCode")
    if (!storedCode) {
      router.push("/")
      return
    }
    setGameCode(storedCode)

    // Get players from localStorage
    const storedPlayers = localStorage.getItem("players")
    if (storedPlayers) {
      const parsedPlayers = JSON.parse(storedPlayers)

      // Assign roles to players
      const roles = [
        "Loup-Garou",
        "Loup-Garou",
        "Voyante",
        "Sorcière",
        "Cupidon",
        "Villageois",
        "Villageois",
        "Villageois",
        "Villageois",
        "Villageois",
      ]

      const playersWithRoles = parsedPlayers.map((player: any, index: number) => ({
        name: player.name,
        role: roles[index % roles.length],
        alive: true,
      }))

      setPlayers(playersWithRoles)
    }
  }, [router, setTheme])

  const startGame = () => {
    setGamePhase("night")
    startNightPhase()
  }

  const startNightPhase = () => {
    // Order of night actions
    const nightRoles = ["Cupidon", "Voyante", "Loup-Garou", "Sorcière"]

    // Find first active role
    const firstActiveRole = nightRoles.find((role) => players.some((player) => player.role === role && player.alive))

    setCurrentNightRole(firstActiveRole || null)
  }

  const completeNightAction = (action: string) => {
    // Store the action
    setNightActions({
      ...nightActions,
      [currentNightRole as string]: action,
    })

    // Order of night actions
    const nightRoles = ["Cupidon", "Voyante", "Loup-Garou", "Sorcière"]

    // Find current role index
    const currentIndex = nightRoles.findIndex((role) => role === currentNightRole)

    // Find next active role
    let nextRole = null
    for (let i = currentIndex + 1; i < nightRoles.length; i++) {
      if (players.some((player) => player.role === nightRoles[i] && player.alive)) {
        nextRole = nightRoles[i]
        break
      }
    }

    if (nextRole) {
      setCurrentNightRole(nextRole)
    } else {
      // Night phase is complete
      processNightActions()
    }
  }

  const processNightActions = () => {
    // Process night actions and determine who dies
    const newDeadPlayers = [...deadPlayers]

    // Process werewolf kill
    if (nightActions["Loup-Garou"] && !nightActions["Sorcière"]?.includes("save")) {
      newDeadPlayers.push(nightActions["Loup-Garou"])
    }

    // Process witch kill
    if (nightActions["Sorcière"]?.includes("kill")) {
      const witchTarget = players
        .filter((p) => p.alive && !newDeadPlayers.includes(p.name))
        .find((p) => p.name !== "Bob")?.name

      if (witchTarget) {
        newDeadPlayers.push(witchTarget)
      }
    }

    // Update dead players
    setDeadPlayers(newDeadPlayers)

    // Update player status
    setPlayers(
      players.map((player) => ({
        ...player,
        alive: !newDeadPlayers.includes(player.name),
      })),
    )

    // Move to day phase
    setGamePhase("day")

    // Check win conditions
    checkWinConditions()
  }

  const startVotePhase = () => {
    setGamePhase("vote")
  }

  const completeVotePhase = (votedOut: string) => {
    // Add voted player to dead players
    const newDeadPlayers = [...deadPlayers, votedOut]
    setDeadPlayers(newDeadPlayers)

    // Update player status
    setPlayers(
      players.map((player) => ({
        ...player,
        alive: !newDeadPlayers.includes(player.name),
      })),
    )

    // Check win conditions
    if (checkWinConditions()) {
      return
    }

    // Start next night
    setDayCount(dayCount + 1)
    setGamePhase("night")
    setNightActions({})
    startNightPhase()
  }

  const checkWinConditions = () => {
    // Count alive werewolves and villagers
    const aliveWerewolves = players.filter((p) => p.role === "Loup-Garou" && p.alive).length
    const aliveVillagers = players.filter((p) => p.role !== "Loup-Garou" && p.alive).length

    if (aliveWerewolves === 0) {
      // Village wins
      setGamePhase("end")
      return true
    }

    if (aliveWerewolves >= aliveVillagers) {
      // Werewolves win
      setGamePhase("end")
      return true
    }

    return false
  }

  const endGame = () => {
    // Clear game data
    localStorage.removeItem("gameCode")
    localStorage.removeItem("players")
    localStorage.removeItem("selectedRoles")

    // Go back to home
    router.push("/")
  }

  const toggleMusicControls = () => {
    setShowMusicControls(!showMusicControls)
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-amber-50 text-amber-900"
      }`}
      style={{ maxWidth: isMobile ? "100%" : "430px", margin: "0 auto" }}
    >
      {/* App header */}
      <header
        className={`p-4 flex justify-between items-center ${
          gamePhase === "night" ? "bg-gray-800 text-amber-400" : theme === "dark" ? "bg-gray-800" : "bg-amber-100"
        }`}
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={endGame}
            className={theme === "dark" ? "text-gray-200" : "text-amber-800"}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">
            {gamePhase === "setup"
              ? "Console de jeu"
              : gamePhase === "night"
                ? "Nuit"
                : gamePhase === "vote"
                  ? "Vote du Village"
                  : gamePhase === "end"
                    ? "Fin de partie"
                    : `Jour ${dayCount}`}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMusicControls}
            className={theme === "dark" ? "text-gray-200" : "text-amber-800"}
          >
            <Music className="h-5 w-5" />
          </Button>
          <div className={`px-3 py-1 rounded-full text-sm ${theme === "dark" ? "bg-gray-700" : "bg-amber-200"}`}>
            Code: {gameCode}
          </div>
        </div>
      </header>

      {/* Music controls */}
      {showMusicControls && <MusicPlayer />}

      {/* Main content */}
      <main className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className={`grid w-full grid-cols-2 ${theme === "dark" ? "bg-gray-800" : "bg-amber-100"}`}>
            <TabsTrigger value="game">Jeu</TabsTrigger>
            <TabsTrigger value="players">Joueurs</TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            {gamePhase === "setup" && (
              <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
                <CardHeader>
                  <CardTitle>Prêt à commencer</CardTitle>
                  <CardDescription>{players.length} joueurs sont connectés et prêts à jouer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Ambiance musicale de nuit"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                      <div className="text-white text-center">
                        <Music className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Musique d'ambiance activée</p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-6">
                    Vous êtes l'animateur de cette partie. Vous pourrez voir toutes les actions et guider les joueurs.
                  </p>
                  <Button
                    onClick={startGame}
                    className={`w-full ${
                      theme === "dark"
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-amber-800 hover:bg-amber-900 text-white"
                    }`}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Commencer la partie
                  </Button>
                </CardContent>
              </Card>
            )}

            {gamePhase === "night" && (
              <Card className={`bg-gray-900 border-gray-800 text-amber-100`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-amber-400">Phase de nuit</CardTitle>
                  <CardDescription className="text-amber-300">
                    {currentNightRole
                      ? `Au tour de : ${currentNightRole}`
                      : "Toutes les actions de nuit sont terminées"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Ambiance musicale de nuit"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                      <div className="text-white text-center">
                        <Moon className="h-8 w-8 mx-auto mb-2 text-amber-400" />
                        <p className="text-sm">Musique nocturne</p>
                      </div>
                    </div>
                  </div>

                  {currentNightRole === "Cupidon" && (
                    <div className="space-y-4">
                      <p>Cupidon doit désigner deux amoureux qui partageront le même destin.</p>
                      <Button
                        onClick={() => completeNightAction("Alice,Bob")}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Terminer l'action de Cupidon
                      </Button>
                    </div>
                  )}

                  {currentNightRole === "Voyante" && (
                    <div className="space-y-4">
                      <p>La Voyante peut découvrir l'identité d'un joueur.</p>
                      <Button
                        onClick={() => completeNightAction("Charlie")}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Terminer l'action de la Voyante
                      </Button>
                    </div>
                  )}

                  {currentNightRole === "Loup-Garou" && (
                    <div className="space-y-4">
                      <p>Les Loups-Garous choisissent une victime à dévorer.</p>
                      <Button
                        onClick={() => completeNightAction("David")}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Terminer l'action des Loups-Garous
                      </Button>
                    </div>
                  )}

                  {currentNightRole === "Sorcière" && (
                    <div className="space-y-4">
                      <p>La Sorcière peut sauver la victime des loups ou tuer quelqu'un d'autre.</p>
                      <Button
                        onClick={() => completeNightAction("save")}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white mb-2"
                      >
                        Utiliser la potion de guérison
                      </Button>
                      <Button
                        onClick={() => completeNightAction("kill")}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white mb-2"
                      >
                        Utiliser la potion d'empoisonnement
                      </Button>
                      <Button
                        onClick={() => completeNightAction("none")}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                      >
                        Ne rien faire
                      </Button>
                    </div>
                  )}

                  {!currentNightRole && (
                    <Button onClick={processNightActions} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Passer à la phase de jour
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {gamePhase === "day" && (
              <div className="space-y-6">
                <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Skull className="h-5 w-5 mr-2 text-red-500" />
                      Résultats de la nuit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=160&width=320"
                        alt="Ambiance musicale de jour"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                        <div className="text-white text-center">
                          <Sun className="h-8 w-8 mx-auto mb-2 text-amber-400" />
                          <p className="text-sm">Musique de jour</p>
                        </div>
                      </div>
                    </div>

                    {deadPlayers.length > 0 ? (
                      <div className="space-y-4">
                        <p>
                          Cette nuit,{" "}
                          {deadPlayers.length > 1 ? "plusieurs personnes ont été tuées" : "une personne a été tuée"} :
                        </p>
                        {deadPlayers.map((victim) => (
                          <div key={victim} className="p-3 bg-red-900/20 text-red-100 rounded-lg flex items-center">
                            <Skull className="mr-2 h-5 w-5 text-red-400" />
                            <span>{victim}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Miracle ! Personne n'est mort cette nuit.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Discussion du village
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Les joueurs discutent pour déterminer qui pourrait être un Loup-Garou.</p>
                    <Button
                      onClick={startVotePhase}
                      className={`w-full ${
                        theme === "dark"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-amber-800 hover:bg-amber-900 text-white"
                      }`}
                    >
                      Passer au vote
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {gamePhase === "vote" && (
              <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
                <CardHeader>
                  <CardTitle>Vote du village</CardTitle>
                  <CardDescription>Les joueurs votent pour éliminer un suspect</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Ambiance musicale de vote"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                      <div className="text-white text-center">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Musique de tension</p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-6">En tant qu'animateur, vous pouvez voir les votes et annoncer le résultat.</p>

                  <div className="space-y-4">
                    <div className="p-3 bg-amber-900/20 rounded-lg">
                      <p className="font-semibold mb-2">Résultat du vote :</p>
                      <p>Charlie : 3 votes</p>
                      <p>Bob : 2 votes</p>
                    </div>

                    <Button
                      onClick={() => completeVotePhase("Charlie")}
                      className={`w-full ${
                        theme === "dark"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-amber-800 hover:bg-amber-900 text-white"
                      }`}
                    >
                      Éliminer Charlie
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {gamePhase === "end" && (
              <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
                <CardHeader>
                  <CardTitle
                    className={`text-center ${
                      players.some((p) => p.role === "Loup-Garou" && p.alive) ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {players.some((p) => p.role === "Loup-Garou" && p.alive)
                      ? "Les Loups-Garous ont gagné !"
                      : "Le Village a gagné !"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Musique de fin de partie"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                      <div className="text-white text-center">
                        <Music className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Musique de fin</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-center mb-4">
                      {players.some((p) => p.role === "Loup-Garou" && p.alive)
                        ? "Les Loups-Garous ont dévoré suffisamment de villageois pour prendre le contrôle du village."
                        : "Tous les Loups-Garous ont été éliminés. Le village peut dormir en paix."}
                    </p>

                    <Button
                      onClick={endGame}
                      className={`w-full ${
                        theme === "dark"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-amber-800 hover:bg-amber-900 text-white"
                      }`}
                    >
                      Terminer la partie
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="players">
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Joueurs et rôles
                </CardTitle>
                <CardDescription>En tant qu'animateur, vous pouvez voir tous les rôles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {players.map((player) => (
                    <div
                      key={player.name}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        !player.alive
                          ? theme === "dark"
                            ? "bg-gray-700/50"
                            : "bg-amber-50/50"
                          : theme === "dark"
                            ? "bg-gray-700"
                            : "bg-amber-50"
                      } ${!player.alive ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 opacity-70" />
                        <span>{player.name}</span>
                        {!player.alive && (
                          <Badge variant="outline" className="ml-2 border-red-500 text-red-500">
                            Mort
                          </Badge>
                        )}
                      </div>
                      <Badge
                        className={`${
                          player.role === "Loup-Garou"
                            ? "bg-red-500 text-white"
                            : player.role === "Voyante"
                              ? "bg-purple-500 text-white"
                              : player.role === "Sorcière"
                                ? "bg-green-500 text-white"
                                : player.role === "Cupidon"
                                  ? "bg-pink-500 text-white"
                                  : "bg-blue-500 text-white"
                        }`}
                      >
                        {player.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
