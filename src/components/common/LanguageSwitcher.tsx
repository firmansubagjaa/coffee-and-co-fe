import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from '../../components/common/Button';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-coffee-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch Language</span>
          <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-coffee-100 dark:bg-coffee-800 px-1 rounded uppercase">
            {language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-coffee-50 dark:bg-coffee-800 font-bold' : ''}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('id')} className={language === 'id' ? 'bg-coffee-50 dark:bg-coffee-800 font-bold' : ''}>
          🇮🇩 Indonesia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
