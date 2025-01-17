import { TreePine } from 'lucide-react';

interface RatingInputProps {
  rating: number;
  hoveredRating: number;
  onRatingChange: (rating: number) => void;
  onHoverChange: (rating: number) => void;
}

export const RatingInput = ({
  rating,
  hoveredRating,
  onRatingChange,
  onHoverChange,
}: RatingInputProps) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const treeValue = index + 1;
        const isFilled = (hoveredRating || rating) >= treeValue;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => onRatingChange(treeValue)}
            onMouseEnter={() => onHoverChange(treeValue)}
            onMouseLeave={() => onHoverChange(0)}
            className="p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          >
            <TreePine 
              className={`w-6 h-6 transition-colors ${
                isFilled 
                  ? 'fill-primary text-primary' 
                  : 'fill-muted text-muted hover:fill-primary/20 hover:text-primary/20'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};