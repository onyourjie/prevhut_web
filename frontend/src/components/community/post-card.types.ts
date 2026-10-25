export interface PostAuthor {
  id: string
  name: string
  role: 'WARGA' | 'RELAWAN' | 'ADMIN'
  avatarUrl?: string | null
  kabupaten?: string | null
  kecamatan?: string | null
}

export interface PostItem {
  id: string
  category: 'DARURAT' | 'INFORMASI'
  content: string
  imageUrl?: string | null
  isLiveCamera?: boolean
  address: string
  province?: string
  kabupaten?: string
  kecamatan?: string
  latitude: number
  longitude: number
  status: string
  clusterCode?: string | null
  createdAt: string
  author: PostAuthor
  updates?: any[]
  _count?: {
    comments: number
    updates: number
  }
}
