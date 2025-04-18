"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Eye, FlaskRoundIcon as Flask, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Define the Player type
interface Player {
  name: string
  role: string
}

// Define the NightActions type
interface NightActions {
  cupidChoice: string[]
  voyanteSees: string
  werewolfVictim: string
  witchSave: boolean
  witchKill: string
}

export default function NightPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPhase, setCurrentPhase] = useState<string>("intro")
  const [nightActions, setNightActions] = useState<NightActions>({
    cupidChoice: [],
    voyanteSees: "",
    werewolfVictim: "",
    witchSave: false,
    witchKill: "",
  })
  const [deadPlayers, setDeadPlayers] = useState<string[]>([])
  const [nightCount, setNightCount] = useState(1)

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
  }, [router])

  const getAlivePlayers = () => {
    return players.filter((player) => !deadPlayers.includes(player.name))
  }

  const hasRole = (role: string) => {
    return players.some((player) => player.role === role && !deadPlayers.includes(player.name))
  }

  const nextPhase = () => {
    switch (currentPhase) {
      case "intro":
        if (nightCount === 1 && hasRole("Cupidon")) {
          setCurrentPhase("cupidon")
        } else if (hasRole("Voyante")) {
          setCurrentPhase("voyante")
        } else if (hasRole("Loup-Garou")) {
          setCurrentPhase("loupGarou")
        } else if (hasRole("Sorcière")) {
          setCurrentPhase("sorciere")
        } else {
          finishNight()
        }
        break
      case "cupidon":
        if (hasRole("Voyante")) {
          setCurrentPhase("voyante")
        } else if (hasRole("Loup-Garou")) {
          setCurrentPhase("loupGarou")
        } else if (hasRole("Sorcière")) {
          setCurrentPhase("sorciere")
        } else {
          finishNight()
        }
        break
      case "voyante":
        if (hasRole("Loup-Garou")) {
          setCurrentPhase("loupGarou")
        } else if (hasRole("Sorcière")) {
          setCurrentPhase("sorciere")
        } else {
          finishNight()
        }
        break
      case "loupGarou":
        if (hasRole("Sorcière")) {
          setCurrentPhase("sorciere")
        } else {
          finishNight()
        }
        break
      case "sorciere":
        finishNight()
        break
      default:
        finishNight()
    }
  }

  const finishNight = () => {
    // Process night actions
    const newDeadPlayers = [...deadPlayers]

    // Process werewolf victim
    if (nightActions.werewolfVictim && !nightActions.witchSave) {
      newDeadPlayers.push(nightActions.werewolfVictim)
    }

    // Process witch kill
    if (nightActions.witchKill) {
      newDeadPlayers.push(nightActions.witchKill)
    }

    // Save to localStorage
    localStorage.setItem("deadPlayers", JSON.stringify(newDeadPlayers))
    localStorage.setItem("nightCount", JSON.stringify(nightCount + 1))
    localStorage.setItem("nightActions", JSON.stringify(nightActions))

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

    // Go to day phase
    router.push("/day")
  }

  const handleCupidChoice = (playerName: string) => {
    if (nightActions.cupidChoice.includes(playerName)) {
      setNightActions({
        ...nightActions,
        cupidChoice: nightActions.cupidChoice.filter((name) => name !== playerName),
      })
    } else if (nightActions.cupidChoice.length < 2) {
      setNightActions({
        ...nightActions,
        cupidChoice: [...nightActions.cupidChoice, playerName],
      })
    }
  }

  const handleVoyanteChoice = (playerName: string) => {
    setNightActions({
      ...nightActions,
      voyanteSees: playerName,
    })
  }

  const handleWerewolfChoice = (playerName: string) => {
    setNightActions({
      ...nightActions,
      werewolfVictim: playerName,
    })
  }

  const handleWitchSave = (checked: boolean) => {
    setNightActions({
      ...nightActions,
      witchSave: checked,
    })
  }

  const handleWitchKill = (playerName: string) => {
    setNightActions({
      ...nightActions,
      witchKill: playerName,
    })
  }

  const getPlayerRole = (playerName: string) => {
    const player = players.find((p) => p.name === playerName)
    return player ? player.role : ""
  }

  if (players.length === 0) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-2 border-amber-800/20 bg-gray-900">
        <CardHeader className="text-center bg-gray-800 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-amber-400 flex items-center justify-center">
            <Moon className="mr-2 h-6 w-6" /> Nuit {nightCount}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 text-center text-amber-100">
          {currentPhase === "intro" && (
            <div className="space-y-6">
              <p>Le village s'endort et la nuit tombe. Certains personnages vont se réveiller à tour de rôle.</p>
              <Button onClick={nextPhase} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
                Commencer la nuit
              </Button>
            </div>
          )}

          {currentPhase === "cupidon" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center justify-center">
                <Heart className="mr-2 h-6 w-6 text-pink-500" /> Cupidon se réveille
              </h3>
              <p>Choisissez deux joueurs qui tomberont amoureux. Ils partageront le même destin.</p>
              <div className="space-y-2 text-left">
                {getAlivePlayers().map((player) => (
                  <div key={player.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cupidon-${player.name}`}
                      checked={nightActions.cupidChoice.includes(player.name)}
                      onCheckedChange={() => handleCupidChoice(player.name)}
                      disabled={nightActions.cupidChoice.length >= 2 && !nightActions.cupidChoice.includes(player.name)}
                      className="border-amber-400"
                    />
                    <Label htmlFor={`cupidon-${player.name}`} className="text-amber-100">
                      {player.name}
                    </Label>
                  </div>
                ))}
              </div>
              <Button
                onClick={nextPhase}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white"
                disabled={nightActions.cupidChoice.length !== 2}
              >
                Cupidon se rendort
              </Button>
            </div>
          )}

          {currentPhase === "voyante" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center justify-center">
                <Eye className="mr-2 h-6 w-6 text-purple-500" /> La Voyante se réveille
              </h3>
              <p>Choisissez un joueur dont vous voulez connaître l'identité.</p>
              <RadioGroup
                value={nightActions.voyanteSees}
                onValueChange={handleVoyanteChoice}
                className="space-y-2 text-left"
              >
                {getAlivePlayers().map((player) => (
                  <div key={player.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={player.name} id={`voyante-${player.name}`} className="border-amber-400" />
                    <Label htmlFor={`voyante-${player.name}`} className="text-amber-100">
                      {player.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {nightActions.voyanteSees && (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-amber-100">{nightActions.voyanteSees} est :</p>
                  <p className="text-xl font-bold text-amber-400 mt-2">{getPlayerRole(nightActions.voyanteSees)}</p>
                </div>
              )}

              <Button
                onClick={nextPhase}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white"
                disabled={!nightActions.voyanteSees}
              >
                La Voyante se rendort
              </Button>
            </div>
          )}

          {currentPhase === "loupGarou" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center justify-center">
                <Moon className="mr-2 h-6 w-6 text-red-500" /> Les Loups-Garous se réveillent
              </h3>
              <p>Choisissez une victime à dévorer cette nuit.</p>
              <RadioGroup
                value={nightActions.werewolfVictim}
                onValueChange={handleWerewolfChoice}
                className="space-y-2 text-left"
              >
                {getAlivePlayers()
                  .filter((player) => player.role !== "Loup-Garou")
                  .map((player) => (
                    <div key={player.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={player.name} id={`loup-${player.name}`} className="border-amber-400" />
                      <Label htmlFor={`loup-${player.name}`} className="text-amber-100">
                        {player.name}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>

              <Button
                onClick={nextPhase}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white"
                disabled={!nightActions.werewolfVictim}
              >
                Les Loups-Garous se rendorment
              </Button>
            </div>
          )}

          {currentPhase === "sorciere" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center justify-center">
                <Flask className="mr-2 h-6 w-6 text-green-500" /> La Sorcière se réveille
              </h3>

              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-amber-100">Cette nuit, les Loups-Garous ont dévoré :</p>
                <p className="text-xl font-bold text-amber-400 mt-2">{nightActions.werewolfVictim}</p>
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="witch-save"
                    checked={nightActions.witchSave}
                    onCheckedChange={(checked) => handleWitchSave(checked === true)}
                    className="border-amber-400"
                  />
                  <Label htmlFor="witch-save" className="text-amber-100">
                    Utiliser la potion de guérison pour sauver {nightActions.werewolfVictim}
                  </Label>
                </div>
              </div>

              <p className="text-amber-100">Voulez-vous utiliser votre potion d'empoisonnement ?</p>

              <RadioGroup
                value={nightActions.witchKill}
                onValueChange={handleWitchKill}
                className="space-y-2 text-left"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="witch-no-kill" className="border-amber-400" />
                  <Label htmlFor="witch-no-kill" className="text-amber-100">
                    Ne pas utiliser la potion
                  </Label>
                </div>

                {getAlivePlayers()
                  .filter((player) => player.name !== nightActions.werewolfVictim || !nightActions.witchSave)
                  .map((player) => (
                    <div key={player.name} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={player.name}
                        id={`witch-kill-${player.name}`}
                        className="border-amber-400"
                      />
                      <Label htmlFor={`witch-kill-${player.name}`} className="text-amber-100">
                        {player.name}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>

              <Button onClick={nextPhase} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
                La Sorcière se rendort
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
