"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Moon,
  Eye,
  FlaskRoundIcon as Flask,
  Heart,
  Target,
  User,
  Brain,
  Stethoscope,
  Bird,
  RabbitIcon as Fox,
  Baby,
  Footprints,
  Sparkles,
  RefreshCw,
} from "lucide-react"

interface AdvancedRoleSelectorProps {
  theme: "light" | "dark"
  onRoleChange: (roles: string[]) => void
  playerCount: number
}

// Define role categories
const ROLE_CATEGORIES = {
  WEREWOLF: "Loups-Garous",
  SPECIAL: "Rôles Spéciaux",
  VILLAGER: "Villageois",
}

// Define all available roles with their properties
const AVAILABLE_ROLES = [
  {
    id: "loup-garou",
    name: "Loup-Garou",
    category: ROLE_CATEGORIES.WEREWOLF,
    description: "Dévore un villageois chaque nuit",
    icon: Moon,
    iconColor: "text-red-500",
    isDefault: true,
    minCount: 1,
  },
  {
    id: "loup-blanc",
    name: "Loup Blanc",
    category: ROLE_CATEGORIES.WEREWOLF,
    description: "Loup-Garou qui peut éliminer un autre loup",
    icon: Moon,
    iconColor: "text-blue-300",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "voyante",
    name: "Voyante",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Découvre l'identité d'un joueur chaque nuit",
    icon: Eye,
    iconColor: "text-purple-500",
    isDefault: true,
    minCount: 0,
  },
  {
    id: "sorciere",
    name: "Sorcière",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Possède deux potions : une pour sauver, une pour tuer",
    icon: Flask,
    iconColor: "text-green-500",
    isDefault: true,
    minCount: 0,
  },
  {
    id: "chasseur",
    name: "Chasseur",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Peut éliminer un joueur en mourant",
    icon: Target,
    iconColor: "text-orange-500",
    isDefault: true,
    minCount: 0,
  },
  {
    id: "cupidon",
    name: "Cupidon",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Désigne deux amoureux qui partageront le même destin",
    icon: Heart,
    iconColor: "text-pink-500",
    isDefault: true,
    minCount: 0,
  },
  {
    id: "fou",
    name: "Fou",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Gagne s'il se fait éliminer par le village",
    icon: Brain,
    iconColor: "text-yellow-500",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "corbeau",
    name: "Corbeau",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Désigne un joueur suspect chaque nuit",
    icon: Bird,
    iconColor: "text-gray-500",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "renard",
    name: "Renard",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Peut détecter la présence de loups-garous",
    icon: Fox,
    iconColor: "text-orange-400",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "bebe",
    name: "Bébé",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Doit imiter son modèle pour survivre",
    icon: Baby,
    iconColor: "text-blue-400",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "trappeur",
    name: "Trappeur",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Peut poser un piège qui bloque une action",
    icon: Footprints,
    iconColor: "text-amber-600",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "docteur",
    name: "Docteur",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Peut protéger un joueur chaque nuit",
    icon: Stethoscope,
    iconColor: "text-cyan-500",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "homme-sage",
    name: "Homme Sage",
    category: ROLE_CATEGORIES.SPECIAL,
    description: "Connaît tous les rôles en jeu",
    icon: Sparkles,
    iconColor: "text-amber-400",
    isDefault: false,
    minCount: 0,
  },
  {
    id: "villageois",
    name: "Villageois",
    category: ROLE_CATEGORIES.VILLAGER,
    description: "Doit démasquer les loups-garous",
    icon: User,
    iconColor: "text-blue-500",
    isDefault: true,
    minCount: 0,
  },
]

export function AdvancedRoleSelector({ theme, onRoleChange, playerCount }: AdvancedRoleSelectorProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [roleCount, setRoleCount] = useState<Record<string, number>>({})
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Reference to track previous roles for comparison
  const prevRolesRef = useRef("")

  // Initialize role counts on first render and when player count changes
  useEffect(() => {
    const initialRoleCounts: Record<string, number> = {}

    // Set default roles
    AVAILABLE_ROLES.forEach((role) => {
      if (role.id === "loup-garou") {
        // Calculate werewolf count based on player count
        initialRoleCounts[role.id] = Math.max(1, Math.floor(playerCount / 4))
      } else if (role.isDefault) {
        initialRoleCounts[role.id] = 1
      } else {
        initialRoleCounts[role.id] = 0
      }
    })

    // Calculate remaining villagers
    const specialRolesCount = Object.entries(initialRoleCounts)
      .filter(([roleId]) => roleId !== "villageois")
      .reduce((sum, [_, count]) => sum + count, 0)

    initialRoleCounts["villageois"] = Math.max(0, playerCount - specialRolesCount)

    setRoleCount(initialRoleCounts)

    // Set selected roles based on counts > 0
    const initialSelectedRoles = AVAILABLE_ROLES.filter((role) => initialRoleCounts[role.id] > 0).map((role) => role.id)

    setSelectedRoles(initialSelectedRoles)
  }, [playerCount])

  // Update parent component when roles change
  useEffect(() => {
    // Generate array of roles based on counts
    const roles: string[] = []
    Object.entries(roleCount).forEach(([roleId, count]) => {
      for (let i = 0; i < count; i++) {
        const role = AVAILABLE_ROLES.find((r) => r.id === roleId)
        if (role) {
          roles.push(role.name)
        }
      }
    })

    // Use JSON.stringify for comparison to avoid unnecessary updates
    const rolesString = JSON.stringify(roles)
    if (prevRolesRef.current !== rolesString) {
      prevRolesRef.current = rolesString
      onRoleChange(roles)
    }
  }, [roleCount, onRoleChange])

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      // Add role to selected roles
      setSelectedRoles((prev) => [...prev, roleId])

      // Update role count
      setRoleCount((prev) => {
        const newCounts = { ...prev }

        if (roleId === "loup-garou") {
          // For werewolves, add calculated count
          newCounts[roleId] = Math.max(1, Math.floor(playerCount / 4))
        } else {
          // For other roles, add 1
          newCounts[roleId] = 1
        }

        // Adjust villager count
        const specialRolesCount = Object.entries(newCounts)
          .filter(([id]) => id !== "villageois")
          .reduce((sum, [_, count]) => sum + count, 0)

        newCounts["villageois"] = Math.max(0, playerCount - specialRolesCount)

        return newCounts
      })
    } else {
      // Remove role from selected roles
      setSelectedRoles((prev) => prev.filter((id) => id !== roleId))

      // Update role count
      setRoleCount((prev) => {
        const newCounts = { ...prev }
        const currentCount = newCounts[roleId] || 0

        // Add removed role count to villagers
        newCounts[roleId] = 0
        newCounts["villageois"] = (newCounts["villageois"] || 0) + currentCount

        return newCounts
      })
    }
  }

  const handleRoleCountChange = (roleId: string, increment: boolean) => {
    if (roleId === "villageois") return // Don't manually change villager count

    const totalRoles = Object.values(roleCount).reduce((sum, count) => sum + count, 0)

    if (increment) {
      if (totalRoles >= playerCount) return

      setRoleCount((prev) => {
        const newCounts = { ...prev }
        newCounts[roleId] = (newCounts[roleId] || 0) + 1
        newCounts["villageois"] = Math.max(0, (newCounts["villageois"] || 0) - 1)
        return newCounts
      })
    } else {
      if (!roleCount[roleId] || roleCount[roleId] <= 0) return

      // Check minimum count for required roles
      const role = AVAILABLE_ROLES.find((r) => r.id === roleId)
      if (role && role.minCount > 0 && roleCount[roleId] <= role.minCount) return

      setRoleCount((prev) => {
        const newCounts = { ...prev }
        newCounts[roleId] = Math.max(0, (newCounts[roleId] || 0) - 1)
        newCounts["villageois"] = (newCounts["villageois"] || 0) + 1
        return newCounts
      })
    }
  }

  const generateBalancedRoles = () => {
    // Calculate balanced role distribution
    const balancedRoleCounts: Record<string, number> = {}

    // Calculate werewolf count based on player count
    const werewolfCount = Math.max(1, Math.floor(playerCount / 4))
    balancedRoleCounts["loup-garou"] = werewolfCount

    // Add one of each default special role
    AVAILABLE_ROLES.forEach((role) => {
      if (role.isDefault && role.id !== "loup-garou" && role.id !== "villageois") {
        balancedRoleCounts[role.id] = 1
      } else if (!role.isDefault) {
        balancedRoleCounts[role.id] = 0
      }
    })

    // Calculate remaining villagers
    const specialRolesCount = Object.values(balancedRoleCounts).reduce((sum, count) => sum + count, 0)
    balancedRoleCounts["villageois"] = Math.max(0, playerCount - specialRolesCount)

    // Update state
    setRoleCount(balancedRoleCounts)

    // Update selected roles
    const newSelectedRoles = AVAILABLE_ROLES.filter((role) => balancedRoleCounts[role.id] > 0).map((role) => role.id)

    setSelectedRoles(newSelectedRoles)
  }

  const getTotalRoleCount = () => {
    return Object.values(roleCount).reduce((sum, count) => sum + count, 0)
  }

  const getFilteredRoles = () => {
    if (activeCategory === "all") {
      return AVAILABLE_ROLES
    }
    return AVAILABLE_ROLES.filter((role) => role.category === activeCategory)
  }

  return (
    <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-amber-200"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Rôles</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateBalancedRoles}
            className={theme === "dark" ? "border-gray-600" : "border-amber-300"}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Équilibrer
          </Button>
        </div>
        <CardDescription>Sélectionnez les rôles à utiliser dans la partie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-opacity-20 mb-4 border border-dashed">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Répartition des rôles</span>
              <Badge className={theme === "dark" ? "bg-amber-600" : "bg-amber-800"}>
                {getTotalRoleCount()}/{playerCount}
              </Badge>
            </div>
            <div className="text-sm opacity-70">
              Les rôles seront attribués aléatoirement aux joueurs au début de la partie.
            </div>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value={ROLE_CATEGORIES.WEREWOLF}>Loups</TabsTrigger>
              <TabsTrigger value={ROLE_CATEGORIES.SPECIAL}>Spéciaux</TabsTrigger>
              <TabsTrigger value={ROLE_CATEGORIES.VILLAGER}>Villageois</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {getFilteredRoles().map((role) => {
              const RoleIcon = role.icon
              return (
                <div key={role.id} className={`p-3 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-amber-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={(checked) => handleRoleToggle(role.id, checked === true)}
                        className={theme === "dark" ? "border-gray-500" : "border-amber-300"}
                        disabled={role.id === "loup-garou" || role.id === "villageois"} // Required roles
                      />
                      <Label htmlFor={`role-${role.id}`} className="ml-2 flex items-center">
                        <RoleIcon className={`h-5 w-5 ${role.iconColor}`} />
                        <span className="ml-2">{role.name}</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      {role.id !== "villageois" && (
                        <button
                          onClick={() => handleRoleCountChange(role.id, false)}
                          disabled={!roleCount[role.id] || roleCount[role.id] <= (role.id === "loup-garou" ? 1 : 0)}
                          className={`w-6 h-6 flex items-center justify-center rounded-full ${
                            theme === "dark"
                              ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                              : "bg-amber-200 text-amber-800 hover:bg-amber-300"
                          } ${!roleCount[role.id] || roleCount[role.id] <= (role.id === "loup-garou" ? 1 : 0) ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          -
                        </button>
                      )}

                      <span className="w-6 text-center">{roleCount[role.id] || 0}</span>

                      {role.id !== "villageois" && (
                        <button
                          onClick={() => handleRoleCountChange(role.id, true)}
                          disabled={getTotalRoleCount() >= playerCount}
                          className={`w-6 h-6 flex items-center justify-center rounded-full ${
                            theme === "dark"
                              ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                              : "bg-amber-200 text-amber-800 hover:bg-amber-300"
                          } ${getTotalRoleCount() >= playerCount ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm opacity-70 ml-7">{role.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
