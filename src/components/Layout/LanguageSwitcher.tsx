/**
 * 语言切换组件
 * Language Switcher Component
 * 
 * 使用 react-i18next 实现多语言切换
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { changeLanguage, supportedLanguages, getCurrentLanguage } from '@/i18n'

interface LanguageSwitcherProps {
  className?: string
  compact?: boolean
  onLanguageChange?: (langCode: string) => void
}

export function LanguageSwitcher({
  className,
  compact = true,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = React.useState(getCurrentLanguage())

  const handleLanguageChange = async (langCode: 'zh-CN' | 'en-US') => {
    await changeLanguage(langCode)
    setCurrentLang(langCode)
    onLanguageChange?.(langCode)
  }

  const currentLanguage = supportedLanguages.find((lang) => lang.code === currentLang)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? 'icon' : 'sm'}
          className={cn('gap-1', className)}
        >
          <Languages className="h-4 w-4" />
          {!compact && <span className="text-sm">{currentLanguage?.name}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as 'zh-CN' | 'en-US')}
            className={cn(
              'gap-2',
              currentLang === lang.code && 'bg-accent'
            )}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher