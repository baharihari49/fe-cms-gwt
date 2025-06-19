export interface GradientColorOption {
  id: string;
  label: string;
  value: string;
  category: string;
}

// Comprehensive gradient options - organized by categories
const baseGradientColorOptions: GradientColorOption[] = [
  // Blue variations
  { id: 'ocean-blue', label: 'Ocean Blue', value: 'bg-gradient-to-r from-blue-500 to-cyan-500', category: 'Blue' },
  { id: 'deep-blue', label: 'Deep Blue', value: 'bg-gradient-to-r from-blue-600 to-blue-800', category: 'Blue' },
  { id: 'sky-blue', label: 'Sky Blue', value: 'bg-gradient-to-r from-sky-400 to-blue-500', category: 'Blue' },
  { id: 'ice-blue', label: 'Ice Blue', value: 'bg-gradient-to-r from-blue-200 to-cyan-200', category: 'Blue' },
  { id: 'royal-blue', label: 'Royal Blue', value: 'bg-gradient-to-r from-indigo-500 to-blue-600', category: 'Blue' },
  { id: 'navy-blue', label: 'Navy Blue', value: 'bg-gradient-to-r from-blue-900 to-indigo-800', category: 'Blue' },
  { id: 'electric-blue', label: 'Electric Blue', value: 'bg-gradient-to-r from-cyan-400 to-blue-600', category: 'Blue' },
  
  // Purple variations
  { id: 'royal-purple', label: 'Royal Purple', value: 'bg-gradient-to-r from-purple-500 to-indigo-500', category: 'Purple' },
  { id: 'violet-dream', label: 'Violet Dream', value: 'bg-gradient-to-r from-violet-500 to-purple-600', category: 'Purple' },
  { id: 'purple-haze', label: 'Purple Haze', value: 'bg-gradient-to-r from-purple-400 to-pink-400', category: 'Purple' },
  { id: 'deep-purple', label: 'Deep Purple', value: 'bg-gradient-to-r from-purple-700 to-indigo-700', category: 'Purple' },
  { id: 'cosmic-purple', label: 'Cosmic Purple', value: 'bg-gradient-to-r from-indigo-600 to-purple-700', category: 'Purple' },
  { id: 'lavender', label: 'Lavender', value: 'bg-gradient-to-r from-purple-300 to-violet-300', category: 'Purple' },
  { id: 'mystic-purple', label: 'Mystic Purple', value: 'bg-gradient-to-r from-violet-600 to-indigo-600', category: 'Purple' },
  
  // Green variations
  { id: 'forest-green', label: 'Forest Green', value: 'bg-gradient-to-r from-green-500 to-emerald-500', category: 'Green' },
  { id: 'emerald-dream', label: 'Emerald Dream', value: 'bg-gradient-to-r from-emerald-400 to-teal-500', category: 'Green' },
  { id: 'fresh-green', label: 'Fresh Green', value: 'bg-gradient-to-r from-lime-400 to-green-500', category: 'Green' },
  { id: 'mint-fresh', label: 'Mint Fresh', value: 'bg-gradient-to-r from-green-300 to-emerald-300', category: 'Green' },
  { id: 'dark-forest-green', label: 'Dark Forest', value: 'bg-gradient-to-r from-green-700 to-emerald-700', category: 'Green' },
  { id: 'spring-green', label: 'Spring Green', value: 'bg-gradient-to-r from-lime-300 to-green-400', category: 'Green' },
  { id: 'jungle-green', label: 'Jungle Green', value: 'bg-gradient-to-r from-green-600 to-emerald-800', category: 'Green' },
  
  // Orange/Red variations
  { id: 'sunset-orange', label: 'Sunset Orange', value: 'bg-gradient-to-r from-orange-500 to-pink-500', category: 'Orange' },
  { id: 'fire-red', label: 'Fire Red', value: 'bg-gradient-to-r from-red-500 to-orange-500', category: 'Orange' },
  { id: 'warm-sunset', label: 'Warm Sunset', value: 'bg-gradient-to-r from-orange-400 to-red-400', category: 'Orange' },
  { id: 'coral-reef', label: 'Coral Reef', value: 'bg-gradient-to-r from-orange-300 to-pink-300', category: 'Orange' },
  { id: 'volcano', label: 'Volcano', value: 'bg-gradient-to-r from-red-600 to-orange-600', category: 'Orange' },
  { id: 'autumn-fire', label: 'Autumn Fire', value: 'bg-gradient-to-r from-red-500 to-yellow-500', category: 'Orange' },
  { id: 'cherry-red', label: 'Cherry Red', value: 'bg-gradient-to-r from-red-400 to-rose-500', category: 'Orange' },
  
  // Pink variations
  { id: 'cotton-candy', label: 'Cotton Candy', value: 'bg-gradient-to-r from-pink-400 to-purple-500', category: 'Pink' },
  { id: 'rose-garden', label: 'Rose Garden', value: 'bg-gradient-to-r from-rose-400 to-pink-500', category: 'Pink' },
  { id: 'pink-sunset', label: 'Pink Sunset', value: 'bg-gradient-to-r from-pink-300 to-orange-300', category: 'Pink' },
  { id: 'fuchsia-pink', label: 'Fuchsia Pink', value: 'bg-gradient-to-r from-fuchsia-500 to-pink-500', category: 'Pink' },
  { id: 'soft-pink', label: 'Soft Pink', value: 'bg-gradient-to-r from-pink-200 to-rose-200', category: 'Pink' },
  { id: 'hot-pink', label: 'Hot Pink', value: 'bg-gradient-to-r from-pink-500 to-fuchsia-600', category: 'Pink' },
  { id: 'bubblegum', label: 'Bubblegum', value: 'bg-gradient-to-r from-pink-300 to-purple-400', category: 'Pink' },
  
  // Yellow/Gold variations
  { id: 'golden-hour', label: 'Golden Hour', value: 'bg-gradient-to-r from-yellow-400 to-orange-500', category: 'Yellow' },
  { id: 'sunshine', label: 'Sunshine', value: 'bg-gradient-to-r from-yellow-300 to-orange-300', category: 'Yellow' },
  { id: 'amber-glow', label: 'Amber Glow', value: 'bg-gradient-to-r from-amber-400 to-orange-400', category: 'Yellow' },
  { id: 'gold-rush', label: 'Gold Rush', value: 'bg-gradient-to-r from-yellow-500 to-amber-600', category: 'Yellow' },
  { id: 'bright-sun', label: 'Bright Sun', value: 'bg-gradient-to-r from-yellow-200 to-orange-200', category: 'Yellow' },
  { id: 'honey-gold', label: 'Honey Gold', value: 'bg-gradient-to-r from-amber-300 to-yellow-400', category: 'Yellow' },
  { id: 'solar-flare', label: 'Solar Flare', value: 'bg-gradient-to-r from-yellow-500 to-red-500', category: 'Yellow' },
  
  // Teal/Cyan variations
  { id: 'ocean-breeze', label: 'Ocean Breeze', value: 'bg-gradient-to-r from-teal-400 to-cyan-500', category: 'Teal' },
  { id: 'tropical-sea', label: 'Tropical Sea', value: 'bg-gradient-to-r from-cyan-400 to-teal-500', category: 'Teal' },
  { id: 'aqua-fresh', label: 'Aqua Fresh', value: 'bg-gradient-to-r from-teal-300 to-cyan-300', category: 'Teal' },
  { id: 'deep-sea', label: 'Deep Sea', value: 'bg-gradient-to-r from-teal-600 to-cyan-700', category: 'Teal' },
  { id: 'caribbean', label: 'Caribbean', value: 'bg-gradient-to-r from-cyan-500 to-blue-500', category: 'Teal' },
  { id: 'turquoise', label: 'Turquoise', value: 'bg-gradient-to-r from-teal-200 to-cyan-400', category: 'Teal' },
  { id: 'deep-teal', label: 'Deep Teal', value: 'bg-gradient-to-r from-teal-700 to-cyan-800', category: 'Teal' },
  
  // Multi-color combinations
  { id: 'rainbow-light', label: 'Rainbow Light', value: 'bg-gradient-to-r from-red-300 via-yellow-300 to-green-300', category: 'Multi' },
  { id: 'aurora-borealis', label: 'Aurora Borealis', value: 'bg-gradient-to-r from-green-400 to-blue-500', category: 'Multi' },
  { id: 'neon-nights', label: 'Neon Nights', value: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500', category: 'Multi' },
  { id: 'sunset-sky', label: 'Sunset Sky', value: 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400', category: 'Multi' },
  { id: 'galaxy', label: 'Galaxy', value: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600', category: 'Multi' },
  { id: 'tropical-paradise', label: 'Tropical Paradise', value: 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500', category: 'Multi' },
  { id: 'fire-ice', label: 'Fire & Ice', value: 'bg-gradient-to-r from-red-400 via-purple-500 to-cyan-500', category: 'Multi' },
  
  // Dark themes
  { id: 'midnight', label: 'Midnight', value: 'bg-gradient-to-r from-slate-900 to-gray-900', category: 'Dark' },
  { id: 'dark-ocean', label: 'Dark Ocean', value: 'bg-gradient-to-r from-blue-900 to-slate-900', category: 'Dark' },
  { id: 'shadow', label: 'Shadow', value: 'bg-gradient-to-r from-gray-700 to-slate-800', category: 'Dark' },
  { id: 'dark-forest-theme', label: 'Dark Forest', value: 'bg-gradient-to-r from-green-800 to-emerald-900', category: 'Dark' },
  { id: 'deep-space', label: 'Deep Space', value: 'bg-gradient-to-r from-purple-900 to-slate-900', category: 'Dark' },
  { id: 'charcoal', label: 'Charcoal', value: 'bg-gradient-to-r from-gray-800 to-stone-900', category: 'Dark' },
  { id: 'dark-steel', label: 'Dark Steel', value: 'bg-gradient-to-r from-slate-700 to-gray-800', category: 'Dark' },
  
  // Light themes  
  { id: 'morning-mist', label: 'Morning Mist', value: 'bg-gradient-to-r from-gray-100 to-blue-100', category: 'Light' },
  { id: 'cotton-cloud', label: 'Cotton Cloud', value: 'bg-gradient-to-r from-white to-gray-100', category: 'Light' },
  { id: 'pearl', label: 'Pearl', value: 'bg-gradient-to-r from-slate-100 to-stone-200', category: 'Light' },
  { id: 'soft-dawn', label: 'Soft Dawn', value: 'bg-gradient-to-r from-rose-100 to-orange-100', category: 'Light' },
  { id: 'spring-morning', label: 'Spring Morning', value: 'bg-gradient-to-r from-green-100 to-emerald-100', category: 'Light' },
  { id: 'cream', label: 'Cream', value: 'bg-gradient-to-r from-orange-50 to-amber-100', category: 'Light' },
  { id: 'soft-lavender', label: 'Soft Lavender', value: 'bg-gradient-to-r from-purple-50 to-pink-100', category: 'Light' },
];

const newColorOptions = [
  { value: "bg-gradient-to-r from-blue-500 to-purple-600", label: "Blue to Purple" },
  { value: "bg-gradient-to-r from-green-500 to-teal-600", label: "Green to Teal" },
  { value: "bg-gradient-to-r from-orange-500 to-red-600", label: "Orange to Red" },
  { value: "bg-gradient-to-r from-pink-500 to-rose-600", label: "Pink to Rose" },
  { value: "bg-gradient-to-r from-indigo-500 to-blue-600", label: "Indigo to Blue" },
  { value: "bg-gradient-to-r from-purple-500 to-pink-600", label: "Purple to Pink" },
  { value: "bg-gradient-to-r from-yellow-500 to-orange-600", label: "Yellow to Orange" },
  { value: "bg-gradient-to-r from-teal-500 to-green-600", label: "Teal to Green" },
];

const availableColors = [
  { name: "Blue to Cyan", value: "from-blue-500 to-cyan-400" },
  { name: "Green to Emerald", value: "from-green-500 to-emerald-400" },
  { name: "Purple to Pink", value: "from-purple-500 to-pink-400" },
  { name: "Red to Pink", value: "from-red-500 to-pink-400" },
  { name: "Orange to Red", value: "from-orange-500 to-red-400" },
  { name: "Yellow to Orange", value: "from-yellow-500 to-orange-400" },
  { name: "Sky to Blue", value: "from-sky-500 to-blue-400" },
  { name: "Indigo to Purple", value: "from-indigo-500 to-purple-400" },
  { name: "Violet to Purple", value: "from-violet-500 to-purple-400" },
  { name: "Pink to Rose", value: "from-pink-500 to-rose-400" },
];

// Combine all color options, removing duplicates based on 'value'
export const gradientColorOptions: GradientColorOption[] = (() => {
  const combinedOptions: GradientColorOption[] = [...baseGradientColorOptions];
  const seenValues = new Set<string>(baseGradientColorOptions.map(option => option.value));
  const seenIds = new Set<string>(baseGradientColorOptions.map(option => option.id));

  const addOption = (option: { value: string; label?: string; name?: string; category?: string }) => {
    const fullValue = option.value.startsWith('bg-gradient-to-r') ? option.value : `bg-gradient-to-r ${option.value}`;
    const label = option.label || option.name || ''; // Ensure label is always a string
    const category = option.category || 'New Additions';
    const id = (label.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unnamed') + '-' + Math.random().toString(36).substring(2, 9); // Ensure id is valid even if label is empty

    if (!seenValues.has(fullValue)) {
      combinedOptions.push({ id, value: fullValue, label, category });
      seenValues.add(fullValue);
      seenIds.add(id);
    }
  };

  newColorOptions.forEach(addOption);
  availableColors.forEach(addOption);

  return combinedOptions;
})();

// Helper functions
export const getGradientsByCategory = (category: string): GradientColorOption[] => {
  return gradientColorOptions.filter(option => option.category === category)
}

export const getAllCategories = (): string[] => {
  return [...new Set(gradientColorOptions.map(option => option.category))]
}

export const getGradientByValue = (value: string): GradientColorOption | undefined => {
  return gradientColorOptions.find(option => option.value === value)
}

export const getGradientById = (id: string): GradientColorOption | undefined => {
  return gradientColorOptions.find(option => option.id === id)
}

export const searchGradients = (searchTerm: string): GradientColorOption[] => {
  const term = searchTerm.toLowerCase()
  return gradientColorOptions.filter(option =>
    option.label.toLowerCase().includes(term) ||
    option.category.toLowerCase().includes(term)
  )
}

// Validate for duplicates (development helper)
export const validateGradientOptions = () => {
  const seenValues = new Set<string>()
  const seenIds = new Set<string>()
  const duplicateValues: string[] = []
  const duplicateIds: string[] = []
  
  gradientColorOptions.forEach(option => {
    if (seenValues.has(option.value)) {
      duplicateValues.push(option.value)
    } else {
      seenValues.add(option.value)
    }
    
    if (seenIds.has(option.id)) {
      duplicateIds.push(option.id)
    } else {
      seenIds.add(option.id)
    }
  })
  
  if (duplicateValues.length > 0) {
    console.error('Duplicate gradient values found:', duplicateValues)
  }
  
  if (duplicateIds.length > 0) {
    console.error('Duplicate gradient IDs found:', duplicateIds)
  }
  
  return {
    isValid: duplicateValues.length === 0 && duplicateIds.length === 0,
    duplicateValues,
    duplicateIds
  }
}

// Popular/Featured gradients
export const popularGradients: GradientColorOption[] = [
  { id: 'ocean-blue', label: 'Ocean Blue', value: 'bg-gradient-to-r from-blue-500 to-cyan-500', category: 'Blue' },
  { id: 'sunset-orange', label: 'Sunset Orange', value: 'bg-gradient-to-r from-orange-500 to-pink-500', category: 'Orange' },
  { id: 'forest-green', label: 'Forest Green', value: 'bg-gradient-to-r from-green-500 to-emerald-500', category: 'Green' },
  { id: 'royal-purple', label: 'Royal Purple', value: 'bg-gradient-to-r from-purple-500 to-indigo-500', category: 'Purple' },
  { id: 'fire-red', label: 'Fire Red', value: 'bg-gradient-to-r from-red-500 to-orange-500', category: 'Orange' },
  { id: 'golden-hour', label: 'Golden Hour', value: 'bg-gradient-to-r from-yellow-400 to-orange-500', category: 'Yellow' },
  { id: 'cotton-candy', label: 'Cotton Candy', value: 'bg-gradient-to-r from-pink-400 to-purple-500', category: 'Pink' },
  { id: 'aurora-borealis', label: 'Aurora Borealis', value: 'bg-gradient-to-r from-green-400 to-blue-500', category: 'Multi' },
];

export default gradientColorOptions;


