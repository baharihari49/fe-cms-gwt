// utils/gradientColors.ts

export interface GradientOption {
  label: string;
  value: string;
  colors: {
    from: string;
    to: string;
  };
}

// Tailwind color palette
const tailwindColors = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose'
];

const intensities = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Generate all gradient combinations
export const generateGradientOptions = (): GradientOption[] => {
  const gradients: GradientOption[] = [];
  
  tailwindColors.forEach(fromColor => {
    tailwindColors.forEach(toColor => {
      if (fromColor !== toColor) {
        intensities.forEach(fromIntensity => {
          intensities.forEach(toIntensity => {
            const gradientClass = `bg-gradient-to-r from-${fromColor}-${fromIntensity} to-${toColor}-${toIntensity}`;
            gradients.push({
              label: `${fromColor.charAt(0).toUpperCase() + fromColor.slice(1)} ${fromIntensity} to ${toColor.charAt(0).toUpperCase() + toColor.slice(1)} ${toIntensity}`,
              value: gradientClass,
              colors: {
                from: `${fromColor}-${fromIntensity}`,
                to: `${toColor}-${toIntensity}`
              }
            });
          });
        });
      }
    });
  });
  
  return gradients;
};

// Popular gradient presets
export const popularGradients: GradientOption[] = [
  { label: 'Ocean Blue', value: 'bg-gradient-to-r from-blue-500 to-cyan-500', colors: { from: 'blue-500', to: 'cyan-500' } },
  { label: 'Sunset', value: 'bg-gradient-to-r from-orange-500 to-pink-500', colors: { from: 'orange-500', to: 'pink-500' } },
  { label: 'Forest', value: 'bg-gradient-to-r from-green-500 to-emerald-500', colors: { from: 'green-500', to: 'emerald-500' } },
  { label: 'Royal Purple', value: 'bg-gradient-to-r from-purple-500 to-indigo-500', colors: { from: 'purple-500', to: 'indigo-500' } },
  { label: 'Fire', value: 'bg-gradient-to-r from-red-500 to-orange-500', colors: { from: 'red-500', to: 'orange-500' } },
  { label: 'Ice', value: 'bg-gradient-to-r from-blue-200 to-cyan-200', colors: { from: 'blue-200', to: 'cyan-200' } },
  { label: 'Midnight', value: 'bg-gradient-to-r from-slate-900 to-gray-900', colors: { from: 'slate-900', to: 'gray-900' } },
  { label: 'Aurora', value: 'bg-gradient-to-r from-green-400 to-blue-500', colors: { from: 'green-400', to: 'blue-500' } },
  { label: 'Candy', value: 'bg-gradient-to-r from-pink-400 to-purple-500', colors: { from: 'pink-400', to: 'purple-500' } },
  { label: 'Gold Rush', value: 'bg-gradient-to-r from-yellow-400 to-orange-500', colors: { from: 'yellow-400', to: 'orange-500' } },
  { label: 'Emerald Dream', value: 'bg-gradient-to-r from-emerald-400 to-teal-500', colors: { from: 'emerald-400', to: 'teal-500' } },
  { label: 'Neon Nights', value: 'bg-gradient-to-r from-fuchsia-500 to-pink-500', colors: { from: 'fuchsia-500', to: 'pink-500' } },
];

// Gradient directions
export const gradientDirections = [
  { label: 'To Right', value: 'bg-gradient-to-r' },
  { label: 'To Left', value: 'bg-gradient-to-l' },
  { label: 'To Bottom', value: 'bg-gradient-to-b' },
  { label: 'To Top', value: 'bg-gradient-to-t' },
  { label: 'To Bottom Right', value: 'bg-gradient-to-br' },
  { label: 'To Bottom Left', value: 'bg-gradient-to-bl' },
  { label: 'To Top Right', value: 'bg-gradient-to-tr' },
  { label: 'To Top Left', value: 'bg-gradient-to-tl' },
];

// Utility functions
export const createGradientClass = (
  direction: string,
  fromColor: string,
  toColor: string
): string => {
  return `${direction} from-${fromColor} to-${toColor}`;
};

export const parseGradientClass = (gradientClass: string) => {
  const parts = gradientClass.split(' ');
  const direction = parts[0];
  const fromColor = parts[1]?.replace('from-', '');
  const toColor = parts[2]?.replace('to-', '');
  
  return { direction, fromColor, toColor };
};

export const getGradientPreview = (gradientClass: string): string => {
  return gradientClass;
};

// Filter gradients by color
export const filterGradientsByColor = (
  gradients: GradientOption[],
  color: string
): GradientOption[] => {
  return gradients.filter(gradient => 
    gradient.colors.from.includes(color) || 
    gradient.colors.to.includes(color)
  );
};

// Search gradients
export const searchGradients = (
  gradients: GradientOption[],
  searchTerm: string
): GradientOption[] => {
  const term = searchTerm.toLowerCase();
  return gradients.filter(gradient =>
    gradient.label.toLowerCase().includes(term) ||
    gradient.colors.from.includes(term) ||
    gradient.colors.to.includes(term)
  );
};

// Get random gradient
export const getRandomGradient = (gradients: GradientOption[]): GradientOption => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};