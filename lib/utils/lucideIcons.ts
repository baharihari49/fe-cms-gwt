// lib/utils/lucideIcons.ts
import type { LucideIcon } from 'lucide-react'

/**
 * Ambil semua nama icon dari lucide-react.
 * Require() dipanggil di runtime agar bundler tidak tree-shake.
 */
export function getAllIcons(): string[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const icons = require('lucide-react') as Record<string, any>
  return Object.keys(icons)
    .filter(name => typeof icons[name] === 'function' && /^[A-Z]/.test(name))
}

/**
 * Ambil component icon berdasarkan nama, atau null jika tidak ada.
 */
export function getLucideIcon(iconName: string): LucideIcon | null {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const icons = require('lucide-react') as Record<string, any>
  const Icon = icons[iconName]
  return typeof Icon === 'function' ? (Icon as LucideIcon) : null
}

/**
 * Cari ikon berdasarkan substring (case-insensitive)
 */
export function searchLucideIcons(query: string, limit = 50): string[] {
  const term = query.trim().toLowerCase()
  return getAllIcons()
    .filter(name => name.toLowerCase().includes(term))
    .slice(0, limit)
}
