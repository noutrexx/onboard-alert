import { Layers, Map, MapPinned, Mountain, Satellite } from 'lucide-react'
import { mapModes } from '../data/mapModes'

const modeIcons = {
  dark: Layers,
  light: Map,
  standard: MapPinned,
  topo: Mountain,
  satellite: Satellite,
}

function MapModeControl({ activeModeId, onModeChange }) {
  return (
    <section className="absolute bottom-24 right-4 z-[520] w-[min(calc(100vw-2rem),360px)] border border-white/10 bg-slate-950/78 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:right-16">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">
          <Layers size={14} />
          Harita modu
        </p>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Live map
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1 max-sm:grid-cols-3">
        {mapModes.map((mode) => {
          const Icon = modeIcons[mode.id] ?? Layers
          const isActive = activeModeId === mode.id

          return (
            <button
              aria-pressed={isActive}
              className={`group min-h-[66px] border px-2 py-2 text-left transition duration-200 ${
                isActive
                  ? 'border-cyan-300/70 bg-cyan-300/14 text-white shadow-[inset_0_0_0_1px_rgba(103,232,249,0.22)]'
                  : 'border-white/10 bg-white/[0.045] text-slate-300 hover:border-white/25 hover:bg-white/[0.08]'
              }`}
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              title={mode.description}
              type="button"
            >
              <Icon className={isActive ? 'text-cyan-200' : 'text-slate-400'} size={16} />
              <span className="mt-2 block text-xs font-black tracking-[0.08em]">
                {mode.label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default MapModeControl
