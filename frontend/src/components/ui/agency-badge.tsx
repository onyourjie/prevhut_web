import React from 'react'
import { cn } from '@/lib/utils'

export type AgencyType = 'police' | 'fire' | 'bpbd' | 'medical'

export interface AgencyBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  agency: AgencyType
  name: string
  phoneNumber?: string
  onCall?: () => void
}

const agencyConfig: Record<AgencyType, { badgeBg: string; label: string; icon: string }> = {
  police: { badgeBg: 'bg-agency-police text-white', label: 'Polisi', icon: '👮' },
  fire: { badgeBg: 'bg-error-600 text-white', label: 'Damkar', icon: '🚒' },
  bpbd: { badgeBg: 'bg-warning-600 text-white', label: 'BPBD', icon: '🛡️' },
  medical: { badgeBg: 'bg-accent-900 text-white', label: 'Medis', icon: '🚑' },
}

export function AgencyBadge({
  agency,
  name,
  phoneNumber,
  onCall,
  className,
  ...props
}: AgencyBadgeProps) {
  const config = agencyConfig[agency]

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-neutral-200 bg-white gap-3',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-lg shrink-0',
            config.badgeBg,
          )}
          aria-hidden="true"
        >
          {config.icon}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-neutral-700">{config.label}</span>
          <span className="text-sm font-bold text-neutral-1000">{name}</span>
          {phoneNumber && <span className="text-xs text-neutral-600">{phoneNumber}</span>}
        </div>
      </div>

      {phoneNumber && (
        <a
          href={`tel:${phoneNumber}`}
          onClick={onCall}
          className="min-h-[44px] min-w-[44px] px-3.5 py-2 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-error-50 text-error-700 hover:bg-error-100 font-bold text-xs focus-ring transition-colors"
          aria-label={`Panggil ${name}`}
        >
          Panggil
        </a>
      )}
    </div>
  )
}
