"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, User, Skull } from "lucide-react"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Player {
  name: string
  role: string
}

interface NightActions {
  cupidChoice: string[]
  voyanteSees: string
  werewolfVictim: string
  witchSave: boolean
  witchKill: string
}

export default function DayPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [deadPlayers, setDeadPlayers] = useState<string[]>([])
  const [nightActions, setNightActions] = useState<NightActions>({
    cupidChoice: [],
    voyanteSees: "",
    werewolfVictim: "",
    witchSave: false,
    witchKill: "",
  })
  const [dayVote, setDayVote] = useState<string>("")
  const [nightCount, setNightCount] = useState(1)
  const [newDeaths, setNewDeaths] = useState<string[]>([])
  const [showResults, setShowResults] = useState(true)

  useEffect(() => {
    // Get players from localStorage
    const storedPlayers = localStorage.getItem("players")
    if (!storedPlayers) {
      router.push("/")
      return
    }

    const loadedPlayers = JSON.parse(storedPlayers)
    setPlayers(loadedPlayers)

    // Get night count from localStorage
    const storedNightCount = localStorage.getItem("nightCount")
    if (storedNightCount) {
      setNightCount(Number.parseInt(storedNightCount))
    }

    // Get dead players from localStorage
    const storedDeadPlayers = localStorage.getItem("deadPlayers")
    if (storedDeadPlayers) {
      setDeadPlayers(JSON.parse(storedDeadPlayers))
    }

    // Get night actions from localStorage
    const storedNightActions = localStorage.getItem("nightActions")
    if (storedNightActions) {
      setNightActions(JSON.parse(storedNightActions))
    }

    // Calculate new deaths
    calculateNewDeaths()
  }, [router])

  const calculateNewDeaths = () => {
    const storedDeadPlayers = localStorage.getItem("deadPlayers")
    const storedNightActions = localStorage.getItem("nightActions")

    if (!storedDeadPlayers || !storedNightActions) return

    const deadPlayersList = JSON.parse(storedDeadPlayers)
    const actions = JSON.parse(storedNightActions)

    const newDeathsList: string[] = []

    // Check werewolf victim
    if (actions.werewolfVictim && !actions.witchSave) {
      newDeathsList.push(actions.werewolfVictim)
    }

    // Check witch kill
    if (actions.witchKill) {
      newDeathsList.push(actions.witchKill)
    }

    setNewDeaths(newDeathsList)
  }

  const getAlivePlayers = () => {
    return players.filter((player) => !deadPlayers.includes(player.name))
  }

  const startVoting = () => {
    setShowResults(false)
  }

  const handleVote = (playerName: string) => {
    setDayVote(playerName)
  }

  const executeVote = () => {
    if (!dayVote) return

    // Add voted player to dead players
    const newDeadPlayers = [...deadPlayers, dayVote]
    setDeadPlayers(newDeadPlayers)

    // Save to localStorage
    localStorage.setItem("deadPlayers", JSON.stringify(newDeadPlayers))

    // Check win conditions
    const aliveWerewolves = players.filter((p) => p.role === "Loup-Garou" && !newDeadPlayers.includes(p.name)).length

    const aliveVillagers = players.filter((p) => p.role !== "Loup-Garou" && !newDeadPlayers.includes(p.name)).length

    if (aliveWerewolves === 0) {
      localStorage.setItem("winner", "village")
      router.push("/end")
      return
    }

    if (aliveWerewolves >= aliveVillagers) {
      localStorage.setItem("winner", "loups")
      router.push("/end")
      return
    }

    // Go to night phase
    router.push("/night")
  }

  if (players.length === 0) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-2 border-amber-800/20 bg-sky-50">
        <CardHeader className="text-center bg-sky-100 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-amber-900 flex items-center justify-center">
            <Sun className="mr-2 h-6 w-6 text-amber-500" /> Jour {nightCount}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 text-center">
          {showResults ? (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-amber-900">Résultats de la nuit</h3>

              {newDeaths.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-amber-900">
                    Cette nuit, {newDeaths.length > 1 ? "plusieurs personnes ont été tuées" : "une personne a été tuée"}{" "}
                    :
                  </p>
                  {newDeaths.map((victim) => (
                    <div key={victim} className="p-3 bg-red-100 rounded-lg flex items-center justify-center">
                      <Skull className="mr-2 h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-900">{victim}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-900">Miracle ! Personne n'est mort cette nuit.</p>
              )}

              <div className="p-4 bg-amber-100 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">Joueurs encore en vie :</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getAlivePlayers().map((player) => (
                    <div key={player.name} className="p-2 bg-white rounded-lg">
                      <User className="inline-block mr-1 h-4 w-4 text-amber-700" />
                      <span className="text-amber-900">{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={startVoting} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
                Commencer le vote du village
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-amber-900">Vote du village</h3>
              <p className="text-amber-900">
                Le village doit maintenant voter pour éliminer un joueur suspecté d'être un Loup-Garou.
              </p>

              <RadioGroup value={dayVote} onValueChange={handleVote} className="space-y-2 text-left">
                {getAlivePlayers().map((player) => (
                  <div key={player.name} className="flex items-center space-x-2 p-2 bg-white rounded-lg">
                    <RadioGroupItem value={player.name} id={`vote-${player.name}`} className="border-amber-800" />
                    <Label htmlFor={`vote-${player.name}`} className="text-amber-900 w-full">
                      {player.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                onClick={executeVote}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white"
                disabled={!dayVote}
              >
                Exécuter le vote
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
