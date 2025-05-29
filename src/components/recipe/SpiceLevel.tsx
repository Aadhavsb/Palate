'use client'

import { Flame } from 'lucide-react'

interface SpiceLevelProps {
  value: number
  onChange: (level: number) => void
}

export default function SpiceLevel({ value, onChange }: SpiceLevelProps) {
  const getSpiceLabel = (level: number) => {
    if (level <= 2) return 'Mild'
    if (level <= 4) return 'Medium'
    if (level <= 6) return 'Spicy'
    if (level <= 8) return 'Very Spicy'
    return 'Extremely Hot'
  }

  const getSpiceColor = (level: number) => {
    if (level <= 2) return 'text-green-400'
    if (level <= 4) return 'text-yellow-400'
    if (level <= 6) return 'text-orange-400'
    if (level <= 8) return 'text-red-400'
    return 'text-red-600'
  }

  return (
    <div>
      <label className="block text-white font-medium mb-3">
        Spice Level
      </label>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 w-8">0</span>
          <input
            type="range"
            min="0"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-background-dark rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm text-gray-400 w-8">10</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`h-5 w-5 ${getSpiceColor(value)}`} />
            <span className={`font-medium ${getSpiceColor(value)}`}>
              {getSpiceLabel(value)}
            </span>
          </div>
          <span className="text-gray-400">Level {value}/10</span>
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  )
}
