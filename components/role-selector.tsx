"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Moon, Eye, FlaskRoundIcon as Flask, Heart, Target, User } from "lucide-react"

interface RoleSelectorProps {
  theme: "light" | "dark"
  onRoleChange: (roles: string[]) => void
  playerCount: number
}

export function RoleSelector({ theme, onRoleChange, playerCount }: RoleSelectorProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "Loup-Garou",
    "Voyante",
    "Sorcière",
    "Cupidon",
    "Chasseur",
    "Villageois",
  ])

  const [roleCount, setRoleCount] = useState<Record<string, number>>({
    "Loup-Garou": Math.max(1, Math.floor(playerCount / 4)),
    Voyante: 1,
    Sorcière: 1,
    Cupidon: 1,
    Chasseur: 1,
    Villageois: Math.max(0, playerCount - 5),
  })

  useEffect(() => {
    // Update villager count when player count changes
    const specialRolesCount = Object.entries(roleCount)
      .filter(([role]) => role !== "Villageois")
      .reduce((sum, [_, count]) => sum + count, 0)

    setRoleCount((prev) => ({
      ...prev,
      Villageois: Math.max(0, playerCount - specialRolesCount),
    }))
  }, [playerCount])

  // Créons une référence en dehors du useEffect
  const prevRolesRef = useRef("")

  useEffect(() => {
    // Notify parent component when roles change
    const roles: string[] = []
    Object.entries(roleCount).forEach(([role, count]) => {
      for (let i = 0; i < count; i++) {
        roles.push(role)
      }
    })

    // Utiliser JSON.stringify pour comparer les tableaux et éviter les mises à jour inutiles
    const rolesString = JSON.stringify(roles)

    // Ne mettre à jour que si les rôles ont réellement changé
    if (prevRolesRef.current !== rolesString) {
      prevRolesRef.current = rolesString
      onRoleChange(roles)
    }
  }, [roleCount, onRoleChange])

  const handleRoleToggle = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role])
      setRoleCount((prev) => ({
        ...prev,
        [role]: role === "Loup-Garou" ? Math.max(1, Math.floor(playerCount / 4)) : 1,
        Villageois: Math.max(
          0,
          prev["Villageois"] - (role === "Loup-Garou" ? Math.max(1, Math.floor(playerCount / 4)) : 1),
        ),
      }))
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
      setRoleCount((prev) => ({
        ...prev,
        [role]: 0,
        Villageois: prev["Villageois"] + prev[role],
      }))
    }
  }

  const handleRoleCountChange = (role: string, increment: boolean) => {
    if (role === "Villageois") return // Don't manually change villager count

    const totalRoles = Object.values(roleCount).reduce((sum, count) => sum + count, 0)

    if (increment) {
      if (totalRoles >= playerCount) return

      setRoleCount((prev) => ({
        ...prev,
        [role]: prev[role] + 1,
        Villageois: Math.max(0, prev["Villageois"] - 1),
      }))
    } else {
      if (roleCount[role] <= 0) return
      if (role === "Loup-Garou" && roleCount[role] <= 1) return // At least one werewolf

      setRoleCount((prev) => ({
        ...prev,
        [role]: prev[role] - 1,
        Villageois: prev["Villageois"] + 1,
      }))
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Loup-Garou":
        return <Moon className="h-5 w-5 text-red-500" />
      case "Voyante":
        return <Eye className="h-5 w-5 text-purple-500" />
      case "Sorcière":
        return <Flask className="h-5 w-5 text-green-500" />
      case "Cupidon":
        return <Heart className="h-5 w-5 text-pink-500" />
      case "Chasseur":
        return <Target className="h-5 w-5 text-orange-500" />
      case "Villageois":
        return <User className="h-5 w-5 text-blue-500" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "Loup-Garou":
        return "Dévore un villageois chaque nuit"
      case "Voyante":
        return "Découvre l'identité d'un joueur chaque nuit"
      case "Sorcière":
        return "Possède deux potions : une pour sauver, une pour tuer"
      case "Cupidon":
        return "Désigne deux amoureux qui partageront le même destin"
      case "Chasseur":
        return "Peut éliminer un joueur en mourant"
      case "Villageois":
        return "Doit démasquer les loups-garous"
      default:
        return ""
    }
  }

  return (
    <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
      <CardHeader>
        <CardTitle>Rôles</CardTitle>
        <CardDescription>Sélectionnez les rôles à utiliser dans la partie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-opacity-20 mb-4 border border-dashed">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Répartition des rôles</span>
              <Badge>
                {Object.values(roleCount).reduce((sum, count) => sum + count, 0)}/{playerCount}
              </Badge>
            </div>
            <div className="text-sm opacity-70">
              Les rôles seront attribués aléatoirement aux joueurs au début de la partie.
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {["Loup-Garou", "Voyante", "Sorcière", "Cupidon", "Chasseur", "Villageois"].map((role) => (
              <div key={role} className={`p-3 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-amber-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Checkbox
                      id={`role-${role}`}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={(checked) => handleRoleToggle(role, checked === true)}
                      className={theme === "dark" ? "border-gray-500" : "border-amber-300"}
                      disabled={role === "Loup-Garou" || role === "Villageois"} // Required roles
                    />
                    <Label htmlFor={`role-${role}`} className="ml-2 flex items-center">
                      {getRoleIcon(role)}
                      <span className="ml-2">{role}</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    {role !== "Villageois" && (
                      <button
                        onClick={() => handleRoleCountChange(role, false)}
                        disabled={roleCount[role] <= (role === "Loup-Garou" ? 1 : 0)}
                        className={`w-6 h-6 flex items-center justify-center rounded-full ${
                          theme === "dark"
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                            : "bg-amber-200 text-amber-800 hover:bg-amber-300"
                        } ${roleCount[role] <= (role === "Loup-Garou" ? 1 : 0) ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        -
                      </button>
                    )}

                    <span className="w-6 text-center">{roleCount[role]}</span>

                    {role !== "Villageois" && (
                      <button
                        onClick={() => handleRoleCountChange(role, true)}
                        disabled={Object.values(roleCount).reduce((sum, count) => sum + count, 0) >= playerCount}
                        className={`w-6 h-6 flex items-center justify-center rounded-full ${
                          theme === "dark"
                            ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                            : "bg-amber-200 text-amber-800 hover:bg-amber-300"
                        } ${Object.values(roleCount).reduce((sum, count) => sum + count, 0) >= playerCount ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm opacity-70 ml-7">{getRoleDescription(role)}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
