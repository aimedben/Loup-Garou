"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun, User, MessageCircle, Skull, Heart, Eye, FlaskRoundIcon as Flask, Music, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/components/theme-provider"
import { MusicPlayer } from "@/components/MusicPlayer"
import Image from "next/image"

export default function PlayerGame() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const { theme } = useTheme()
  const [playerName, setPlayerName] = useState("")
  const [playerRole, setPlayerRole] = useState("")
  const [gamePhase, setGamePhase] = useState<"role-reveal" | "night" | "day" | "vote">("role-reveal")
  const [isRoleRevealed, setIsRoleRevealed] = useState(false)
  const [isYourTurn, setIsYourTurn] = useState(false)
  const [nightAction, setNightAction] = useState<string | null>(null)
  const [voteTarget, setVoteTarget] = useState<string | null>(null)
  const [players, setPlayers] = useState<string[]>([])
  const [deadPlayers, setDeadPlayers] = useState<string[]>([])
  const [dayCount, setDayCount] = useState(1)
  const [showMusicControls, setShowMusicControls] = useState(false)

  useEffect(() => {
    // Get player name from localStorage
    const storedName = localStorage.getItem("playerName")
    if (!storedName) {
      router.push("/")
      return
    }
    setPlayerName(storedName)

    // Simulate role assignment
    const roles = ["Loup-Garou", "Voyante", "Sorcière", "Cupidon", "Villageois"]
    const randomRole = roles[Math.floor(Math.random() * roles.length)]
    setPlayerRole(randomRole)

    // Simulate other players
    setPlayers(["Alice", "Bob", "Charlie", "David", storedName])

    // Simulate game progression
    const gameProgressionTimer = setTimeout(() => {
      if (randomRole === "Loup-Garou" || randomRole === "Voyante" || randomRole === "Sorcière") {
        setGamePhase("night")
        setIsYourTurn(true)
      } else {
        setGamePhase("night")

        // For non-special roles, night phase is passive
        setTimeout(() => {
          setGamePhase("day")
          // Simulate a random death
          const victim = ["Alice", "Bob"][Math.floor(Math.random() * 2)]
          setDeadPlayers([victim])
        }, 5000)
      }
    }, 5000)

    return () => clearTimeout(gameProgressionTimer)
  }, [router])

  const handleRevealRole = () => {
    setIsRoleRevealed(true)
  }

  const handleNightAction = (target: string) => {
    setNightAction(target)

    // Simulate action completion
    setTimeout(() => {
      setIsYourTurn(false)

      // Simulate transition to day phase
      setTimeout(() => {
        setGamePhase("day")
        // Simulate a random death
        const victim = ["Alice", "Bob"][Math.floor(Math.random() * 2)]
        setDeadPlayers([victim])
      }, 3000)
    }, 2000)
  }

  const handleVote = (target: string) => {
    setVoteTarget(target)
  }

  const submitVote = () => {
    setGamePhase("night")
    setDayCount(dayCount + 1)

    // Simulate next night phase
    setTimeout(() => {
      if (playerRole === "Loup-Garou" || playerRole === "Voyante" || playerRole === "Sorcière") {
        setIsYourTurn(true)
      } else {
        // For non-special roles, night phase is passive
        setTimeout(() => {
          setGamePhase("day")
          // Add another random death
          const newVictim = players.filter((p) => !deadPlayers.includes(p) && p !== playerName)[0]
          setDeadPlayers([...deadPlayers, newVictim])
        }, 5000)
      }
    }, 3000)
  }

  const getRoleIcon = () => {
    switch (playerRole) {
      case "Loup-Garou":
        return <Moon className="h-16 w-16 text-red-500" />
      case "Voyante":
        return <Eye className="h-16 w-16 text-purple-500" />
      case "Sorcière":
        return <Flask className="h-16 w-16 text-green-500" />
      case "Cupidon":
        return <Heart className="h-16 w-16 text-pink-500" />
      default:
        return <User className="h-16 w-16 text-blue-500" />
    }
  }

  const getRoleDescription = () => {
    switch (playerRole) {
      case "Loup-Garou":
        return "Chaque nuit, vous vous réveillez avec les autres loups pour dévorer un villageois."
      case "Voyante":
        return "Chaque nuit, vous pouvez découvrir l'identité d'un joueur de votre choix."
      case "Sorcière":
        return "Vous possédez deux potions : une pour sauver, une pour tuer."
      case "Cupidon":
        return "La première nuit, vous désignez deux amoureux qui partageront le même destin."
      default:
        return "Vous devez démasquer et éliminer les loups-garous lors des votes du village."
    }
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
          {gamePhase === "night" ? (
            <Moon className="h-6 w-6 mr-2 text-amber-400" />
          ) : (
            <Sun className="h-6 w-6 mr-2 text-amber-500" />
          )}
          <h1 className="text-xl font-bold">
            {gamePhase === "role-reveal"
              ? "Votre Rôle"
              : gamePhase === "night"
                ? "Nuit"
                : gamePhase === "vote"
                  ? "Vote du Village"
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
            {playerName}
          </div>
        </div>
      </header>

      {/* Music controls */}
      {showMusicControls && <MusicPlayer />}

      {/* Main content */}
      <main className="flex-1 p-4">
        {gamePhase === "role-reveal" && (
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
            <CardHeader className="text-center">
              <CardTitle>Découvrez votre rôle</CardTitle>
              <CardDescription>Assurez-vous que personne ne peut voir votre écran</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              {!isRoleRevealed ? (
                <>
                  <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Musique mystérieuse"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                      <div className="text-white text-center">
                        <Music className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Musique de révélation</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleRevealRole}
                    className={`w-full py-8 ${
                      theme === "dark"
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-amber-800 hover:bg-amber-900 text-white"
                    }`}
                  >
                    Révéler mon rôle
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="flex justify-center">{getRoleIcon()}</div>
                  <h2 className="text-2xl font-bold">{playerRole}</h2>
                  <p className="text-sm opacity-80">{getRoleDescription()}</p>
                  <Button
                    onClick={() => setIsRoleRevealed(false)}
                    className={`w-full ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-amber-200 hover:bg-amber-300 text-amber-900"
                    }`}
                  >
                    Cacher mon rôle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {gamePhase === "night" && (
          <Card className={`bg-gray-900 border-gray-800 text-amber-100`}>
            <CardHeader className="text-center">
              <CardTitle className="text-amber-400">La nuit tombe sur le village</CardTitle>
              {isYourTurn ? (
                <CardDescription className="text-amber-300">C'est à votre tour d'agir</CardDescription>
              ) : (
                <CardDescription className="text-amber-300">
                  Attendez pendant que les autres joueurs agissent...
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=160&width=320"
                  alt="Musique nocturne"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                  <div className="text-white text-center">
                    <Moon className="h-8 w-8 mx-auto mb-2 text-amber-400" />
                    <p className="text-sm">Musique de nuit</p>
                  </div>
                </div>
              </div>

              {isYourTurn ? (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-2">{getRoleIcon()}</div>
                    <h3 className="text-xl font-bold text-amber-400">{playerRole}</h3>
                  </div>

                  {playerRole === "Loup-Garou" && (
                    <div className="space-y-4">
                      <p className="text-amber-200">Choisissez une victime à dévorer cette nuit :</p>
                      <RadioGroup value={nightAction || ""} className="space-y-2">
                        {players
                          .filter((p) => p !== playerName && !deadPlayers.includes(p))
                          .map((player) => (
                            <div key={player} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={player}
                                id={`victim-${player}`}
                                onClick={() => handleNightAction(player)}
                                className="border-amber-500 text-amber-500"
                              />
                              <Label htmlFor={`victim-${player}`} className="text-amber-100">
                                {player}
                              </Label>
                            </div>
                          ))}
                      </RadioGroup>
                    </div>
                  )}

                  {playerRole === "Voyante" && (
                    <div className="space-y-4">
                      <p className="text-amber-200">Choisissez un joueur dont vous voulez connaître l'identité :</p>
                      <RadioGroup value={nightAction || ""} className="space-y-2">
                        {players
                          .filter((p) => p !== playerName && !deadPlayers.includes(p))
                          .map((player) => (
                            <div key={player} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={player}
                                id={`see-${player}`}
                                onClick={() => handleNightAction(player)}
                                className="border-amber-500 text-amber-500"
                              />
                              <Label htmlFor={`see-${player}`} className="text-amber-100">
                                {player}
                              </Label>
                            </div>
                          ))}
                      </RadioGroup>

                      {nightAction && (
                        <div className="p-4 bg-gray-800 rounded-lg text-center">
                          <p className="text-amber-200 mb-2">{nightAction} est :</p>
                          <p className="text-xl font-bold text-amber-400">
                            {nightAction === "Alice" ? "Loup-Garou" : "Villageois"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {playerRole === "Sorcière" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-amber-200 mb-2">Cette nuit, les Loups-Garous ont dévoré :</p>
                        <p className="text-xl font-bold text-amber-400 text-center">Alice</p>
                      </div>

                      <p className="text-amber-200">Que souhaitez-vous faire ?</p>
                      <RadioGroup value={nightAction || ""} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="save"
                            id="save-victim"
                            onClick={() => handleNightAction("save")}
                            className="border-amber-500 text-amber-500"
                          />
                          <Label htmlFor="save-victim" className="text-amber-100">
                            Utiliser la potion de guérison
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="kill"
                            id="kill-player"
                            onClick={() => handleNightAction("kill")}
                            className="border-amber-500 text-amber-500"
                          />
                          <Label htmlFor="kill-player" className="text-amber-100">
                            Utiliser la potion d'empoisonnement
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="none"
                            id="no-action"
                            onClick={() => handleNightAction("none")}
                            className="border-amber-500 text-amber-500"
                          />
                          <Label htmlFor="no-action" className="text-amber-100">
                            Ne rien faire
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <Moon className="h-16 w-16 text-amber-400 animate-pulse" />
                  <p className="text-amber-200 text-center">
                    Les villageois dorment paisiblement pendant que certains joueurs agissent dans l'ombre...
                  </p>
                </div>
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
                    alt="Musique de jour"
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
                    <p className="text-amber-900">
                      Cette nuit,{" "}
                      {deadPlayers.length > 1 ? "plusieurs personnes ont été tuées" : "une personne a été tuée"} :
                    </p>
                    {deadPlayers.map((victim) => (
                      <div key={victim} className="p-3 bg-red-100 rounded-lg flex items-center justify-center">
                        <Skull className="mr-2 h-5 w-5 text-red-500" />
                        <span className="font-semibold text-red-900">{victim}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-900">Miracle ! Personne n'est mort cette nuit.</p>
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
                <p className="mb-4">
                  C'est le moment de discuter avec les autres joueurs pour déterminer qui pourrait être un Loup-Garou.
                </p>
                <Button
                  onClick={() => setGamePhase("vote")}
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
              <CardDescription>Votez pour éliminer un joueur suspecté d'être un Loup-Garou</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40 mb-6 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=160&width=320"
                  alt="Musique de vote"
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

              <RadioGroup value={voteTarget || ""} className="space-y-2">
                {players
                  .filter((p) => p !== playerName && !deadPlayers.includes(p))
                  .map((player) => (
                    <div
                      key={player}
                      className={`flex items-center space-x-2 p-3 rounded-md ${
                        theme === "dark" ? "bg-gray-700" : "bg-amber-50"
                      }`}
                    >
                      <RadioGroupItem
                        value={player}
                        id={`vote-${player}`}
                        onClick={() => handleVote(player)}
                        className={theme === "dark" ? "border-amber-500" : "border-amber-800"}
                      />
                      <Label htmlFor={`vote-${player}`} className="w-full">
                        {player}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button
                onClick={submitVote}
                disabled={!voteTarget}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-amber-800 hover:bg-amber-900 text-white"
                }`}
              >
                Confirmer mon vote
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
