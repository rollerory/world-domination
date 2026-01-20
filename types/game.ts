export interface Territory {
    id: string
    ownerId: string | null
    level: number
}

export interface Player {
    id: string
    name: string
    color: string
    points: number
}
