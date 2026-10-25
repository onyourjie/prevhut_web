export type AssignmentStatus =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ON_SITE'
  | 'COMPLETED'
  | 'REJECTED'

export type PriorityLevel = 'P1' | 'P2' | 'P3'

export interface Assignment {
  id: string
  adminId: string
  volunteerId: string
  postId?: string | null
  clusterCode?: string | null
  priorityLevel: PriorityLevel
  status: AssignmentStatus
  notes?: string | null
  rejectionReason?: string | null
  verificationPhoto?: string | null
  verificationGpsLat?: number | null
  verificationGpsLon?: number | null
  createdAt: string
  completedAt?: string | null
  admin?: {
    id: string
    name: string
    phone: string
  }
  post?: {
    id: string
    content: string
    address: string
    imageUrl?: string | null
    latitude: number
    longitude: number
  }
}
