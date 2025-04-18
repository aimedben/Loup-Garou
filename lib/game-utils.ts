export function generateGameCode(): string {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export interface Player {
  id: number
  name: string
  role: string
  alive: boolean
  specialStatus?: string // For special statuses like "amoureux", "empoisonné", etc.
}

export interface NightActions {
  werewolfTarget: string | null
  witchSave: boolean
  witchKill: string | null
  seerTarget: string | null
  hunterTarget: string | null
  cupidTargets: string[] | null
  whiteWerewolfTarget: string | null
  trapperTarget: string | null
  doctorTarget: string | null
  ravenTarget: string | null
  foxTarget: string | null
}

export function assignRoles(players: string[], selectedRoles: string[]): Player[] {
  // Shuffle the roles
  const shuffledRoles = [...selectedRoles].sort(() => Math.random() - 0.5)

  // Assign roles to players
  return players.map((name, index) => ({
    id: index,
    name,
    role: shuffledRoles[index % shuffledRoles.length],
    alive: true,
  }))
}

export function checkWinCondition(players: Player[]): string | null {
  const aliveWerewolves = players.filter((p) => 
    (p.role === "Loup-Garou" || p.role === "Loup Blanc") && p.alive
  ).length
  
  const aliveVillagers = players.filter((p) => 
    p.role !== "Loup-Garou" && p.role !== "Loup Blanc" && p.alive
  ).length
  
  const aliveFool = players.some(p => p.role === "Fou" && !p.alive && p.specialStatus === "voted-by-village")

  if (aliveFool) {
    return "fou"
  }

  if (aliveWerewolves === 0) {
    return "village"
  }

  if (aliveWerewolves >= aliveVillagers) {
    return "loups"
  }

  // Check for lovers win condition
  const lovers = players.filter(p => p.specialStatus === "amoureux")
  if (lovers.length === 2 && lovers.every(p => p.alive) && 
      players.filter(p => p.alive).length === 2) {
    return "amoureux"
  }

  return null //
}