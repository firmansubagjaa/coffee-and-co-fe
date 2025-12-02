
import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

// --- Internal Reusable Components ---

interface FilterSectionProps {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen = true, children }) => {
  const [open, setOpen] = useState(isOpen);
  const contentId = useId();
  const triggerId = useId();

  return (
    <div className="border-b border-coffee-100 py-4 last:border-0">
      <h3 className="m-0 font-medium">
        <button 
          id={triggerId}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between text-base font-medium text-coffee-900 hover:text-coffee-600 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-400 focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls={contentId}
        >
          <span>{title}</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </h3>
      <AnimatePresence>
        {open && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CheckboxFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ label, checked, onChange, id }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex items-center space-x-3">
      <Checkbox 
        id={inputId} 
        checked={checked} 
        onCheckedChange={(c) => onChange(c as boolean)} 
      />
      <Label 
        htmlFor={inputId} 
        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-coffee-600 hover:text-coffee-900 cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

// --- Main Sidebar Component ---

interface ProductFilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedPriceRanges: string[];
  onPriceChange: (range: string) => void;
  className?: string;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  selectedCategories,
  onCategoryChange,
  selectedPriceRanges,
  onPriceChange,
  className = ""
}) => {
  return (
    <div className={className}>
      <div className="pb-4 border-b border-coffee-200 mb-2">
          <h3 className="font-bold text-lg text-coffee-900">Filters</h3>
      </div>

      <FilterSection title="Category" isOpen>
          {['coffee', 'pastry', 'merch'].map(cat => (
              <CheckboxFilter 
                  key={cat}
                  label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => onCategoryChange(cat)}
              />
          ))}
      </FilterSection>

      <FilterSection title="Price Range" isOpen>
          <CheckboxFilter 
              label="Under $5" 
              checked={selectedPriceRanges.includes('under-5')} 
              onChange={() => onPriceChange('under-5')} 
          />
          <CheckboxFilter 
              label="$5 - $10" 
              checked={selectedPriceRanges.includes('5-10')} 
              onChange={() => onPriceChange('5-10')} 
          />
      </FilterSection>

      <FilterSection title="Roast Level" isOpen={false}>
          {/* Mock Filters for visuals */}
          <CheckboxFilter label="Light Roast" checked={false} onChange={() => {}} />
          <CheckboxFilter label="Medium Roast" checked={false} onChange={() => {}} />
          <CheckboxFilter label="Dark Roast" checked={false} onChange={() => {}} />
      </FilterSection>

      <FilterSection title="Dietary" isOpen={false}>
          <CheckboxFilter label="Vegan" checked={false} onChange={() => {}} />
          <CheckboxFilter label="Gluten Free" checked={false} onChange={() => {}} />
          <CheckboxFilter label="Dairy Free" checked={false} onChange={() => {}} />
      </FilterSection>
    </div>
  );
};
