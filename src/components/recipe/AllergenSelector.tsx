'use client'

import { X } from 'lucide-react'

const ALLERGENS = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame'
]

interface AllergenSelectorProps {
  selected: string[]
  onChange: (allergens: string[]) => void
}

export default function AllergenSelector({ selected, onChange }: AllergenSelectorProps) {
  const toggleAllergen = (allergen: string) => {
    if (selected.includes(allergen)) {
      onChange(selected.filter(a => a !== allergen))
    } else {
      onChange([...selected, allergen])
    }
  }

  return (
    <div>
      <label className="block text-white font-medium mb-3">
        Allergens to avoid (optional)
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
        {ALLERGENS.map(allergen => (
          <button
            key={allergen}
            onClick={() => toggleAllergen(allergen)}
            className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selected.includes(allergen)
                ? 'bg-red-500 text-white'
                : 'bg-background-dark text-gray-300 hover:bg-gray-700'
            }`}
          >
            {allergen}
            {selected.includes(allergen) && (
              <X className="h-3 w-3 absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5" />
            )}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-sm text-gray-400 mt-2">
          Avoiding: {selected.join(', ')}
        </p>
      )}
    </div>
  )
}
