import styles from './ThemePicker.module.css'

export interface XOTheme {
  id: string
  label: string
  xColor: string
  oColor: string
}

export const THEMES: XOTheme[] = [
  { id: 'default',  label: 'Forest',   xColor: '#4ade80', oColor: '#f472b6' },
  { id: 'fire',     label: 'Fire',     xColor: '#fb923c', oColor: '#facc15' },
  { id: 'ocean',    label: 'Ocean',    xColor: '#38bdf8', oColor: '#818cf8' },
  { id: 'candy',    label: 'Candy',    xColor: '#f9a8d4', oColor: '#a78bfa' },
  { id: 'toxic',    label: 'Toxic',    xColor: '#a3e635', oColor: '#f43f5e' },
  { id: 'gold',     label: 'Gold',     xColor: '#fbbf24', oColor: '#e879f9' },
  { id: 'ice',      label: 'Ice',      xColor: '#67e8f9', oColor: '#f0abfc' },
  { id: 'classic',  label: 'Classic',  xColor: '#ffffff', oColor: '#94a3b8' },
]

interface ThemePickerProps {
  activeId: string
  onChange: (theme: XOTheme) => void
}

export default function ThemePicker({ activeId, onChange }: ThemePickerProps) {
  return (
    <div className={styles.picker} role="group" aria-label="X and O color theme">
      <span className={styles.label}>Theme</span>
      <div className={styles.swatches}>
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={[styles.swatch, activeId === t.id ? styles.active : ''].join(' ')}
            onClick={() => onChange(t)}
            aria-label={t.label}
            title={t.label}
            style={{ '--sx': t.xColor, '--so': t.oColor } as React.CSSProperties}
          >
            <span className={styles.half} style={{ color: t.xColor }}>X</span>
            <span className={styles.half} style={{ color: t.oColor }}>O</span>
          </button>
        ))}
      </div>
    </div>
  )
}
