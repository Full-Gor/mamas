import { categories } from '../data/categories';

interface CategoryGridProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string;
}

export function CategoryGrid({ onCategorySelect, selectedCategoryId }: CategoryGridProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        40 Catégories disponibles
      </h2>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
        {categories.map(category => {
          const isSelected = category.id === selectedCategoryId;

          // Déterminer si la couleur est claire pour ajuster le texte
          const isLightColor = isColorLight(category.color);

          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className={`
                relative p-2 rounded-lg transition-all text-xs font-medium
                ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'hover:scale-105'}
              `}
              style={{
                backgroundColor: category.color,
                color: isLightColor ? '#333' : '#fff',
                border: isLightColor ? '1px solid #ddd' : 'none'
              }}
              title={category.keywords.join(', ')}
            >
              <span className="line-clamp-2 text-center">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Cliquez sur une catégorie pour voir ses mots-clés associés
      </p>
    </div>
  );
}

// Fonction pour déterminer si une couleur est claire
function isColorLight(hexColor: string): boolean {
  // Convertir hex en RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculer la luminosité (formule standard)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6;
}
