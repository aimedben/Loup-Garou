"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Eye, FlaskRoundIcon as Flask, Heart, Target, User, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { assignRoles } from "@/lib/game-utils"

// Define the Player type
type Player = {
  name: string
  role: string
}

export default function RolesPage() {
  const router = useRouter()
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1)
  const [showRole, setShowRole] = useState(false)
  const [allRevealed, setAllRevealed] = useState(false)

  useEffect(() => {
    // Get player names from localStorage
    const storedNames = localStorage.getItem("playerNames")
    if (!storedNames) {
      router.push("/")
      return
    }

    const names = JSON.parse(storedNames)
    setPlayerNames(names)

    // Assign roles to players
    const playersWithRoles = assignRoles(names)
    setPlayers(playersWithRoles)

    // Store players with roles in localStorage
    localStorage.setItem("players", JSON.stringify(playersWithRoles))
  }, [router])

  const startReveal = () => {
    setCurrentPlayerIndex(0)
  }

  const handleShowRole = () => {
    setShowRole(true)
  }

  const nextPlayer = () => {
    setShowRole(false)

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex((prev) => prev + 1)
    } else {
      setAllRevealed(true)
    }
  }

  const startGame = () => {
    router.push("/night")
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Loup-Garou":
        return <Moon className="h-12 w-12 text-red-600" />
      case "Voyante":
        return <Eye className="h-12 w-12 text-purple-600" />
      case "Sorcière":
        return <Flask className="h-12 w-12 text-green-600" />
      case "Cupidon":
        return <Heart className="h-12 w-12 text-pink-600" />
      case "Chasseur":
        return <Target className="h-12 w-12 text-orange-600" />
      case "Villageois":
        return <User className="h-12 w-12 text-blue-600" />
      default:
        return <User className="h-12 w-12 text-gray-600" />
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "Loup-Garou":
        return "Chaque nuit, vous vous réveillez avec les autres loups pour dévorer un villageois."
      case "Voyante":
        return "Chaque nuit, vous pouvez découvrir l'identité d'un joueur de votre choix."
      case "Sorcière":
        return "Vous possédez deux potions : une pour sauver, une pour tuer."
      case "Cupidon":
        return "La première nuit, vous désignez deux amoureux qui partageront le même destin."
      case "Chasseur":
        return "Si vous mourez, vous pouvez immédiatement éliminer un autre joueur."
      case "Villageois":
        return "Vous devez démasquer et éliminer les loups-garous lors des votes du village."
      default:
        return ""
    }
  }

  if (playerNames.length === 0) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  if (currentPlayerIndex === -1) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card className="border-2 border-amber-800/20">
          <CardHeader className="text-center bg-amber-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-amber-900">Attribution des rôles</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 text-center">
            <p className="mb-6 text-amber-900">
              Les rôles ont été attribués aléatoirement. Chaque joueur va découvrir son rôle à tour de rôle.
            </p>
            <p className="mb-6 text-amber-900 font-semibold">
              Passez l'appareil à chaque joueur et assurez-vous que personne d'autre ne voit l'écran.
            </p>
          </CardContent>

          <CardFooter>
            <Button onClick={startReveal} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
              Commencer la révélation des rôles
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (allRevealed) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card className="border-2 border-amber-800/20">
          <CardHeader className="text-center bg-amber-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-amber-900">Tous les rôles sont révélés</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 text-center">
            <p className="mb-6 text-amber-900">
              Tous les joueurs connaissent maintenant leur rôle. La partie peut commencer !
            </p>
          </CardContent>

          <CardFooter>
            <Button onClick={startGame} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
              Commencer la première nuit
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentPlayer = players[currentPlayerIndex]

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-2 border-amber-800/20">
        <CardHeader className="text-center bg-amber-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-amber-900">{playerNames[currentPlayerIndex]}</CardTitle>
        </CardHeader>

        <CardContent className="pt-6 text-center">
          {!showRole ? (
            <>
              <p className="mb-6 text-amber-900">Appuyez sur le bouton ci-dessous pour découvrir votre rôle.</p>
              <p className="mb-6 text-amber-900 font-semibold">Assurez-vous que personne d'autre ne voit l'écran.</p>
              <Button onClick={handleShowRole} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
                Révéler mon rôle
              </Button>
            </>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">{getRoleIcon(currentPlayer.role)}</div>
              <h3 className="text-xl font-bold text-amber-900">{currentPlayer.role}</h3>
              <p className="text-amber-900">{getRoleDescription(currentPlayer.role)}</p>
              <Button onClick={nextPlayer} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
                J'ai mémorisé mon rôle <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
