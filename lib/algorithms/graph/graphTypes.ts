export type GraphNode = { id: string; x: number; y: number; label: string }
export type GraphEdge = { id: string; from: string; to: string; weight?: number; directed: boolean }