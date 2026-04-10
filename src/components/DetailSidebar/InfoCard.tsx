/**
 * InfoCard - Information Display Card Component
 * 
 * Displays key entity information with:
 * - Avatar/Name header
 * - Configurable field list
 * - Edit button
 * - Tags/Badges for status/level
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Users,
} from 'lucide-react'

/** Field configuration for InfoCard */
export interface InfoField {
  /** Field key for i18n label */
  key: string
  /** Display label (overrides i18n) */
  label?: string
  /** Field value */
  value?: string | number | null
  /** Custom render function for value */
  render?: (value: unknown) => React.ReactNode
  /** Icon for the field */
  icon?: React.ReactNode
  /** Whether this is a full-width field */
  fullWidth?: boolean
  /** Field type for special rendering */
  type?: 'text' | 'badge' | 'link' | 'date' | 'tag'
  /** Badge variant (for type='badge') */
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
}

export interface InfoCardProps {
  /** Entity avatar URL */
  avatarUrl?: string
  /** Entity name (fallback avatar text) */
  name: string
  /** Entity subtitle (industry, company size, etc.) */
  subtitle?: string
  /** Badge configurations for header */
  headerBadges?: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  }>
  /** Field configuration list */
  fields?: InfoField[]
  /** Edit button callback */
  onEdit?: () => void
  /** Edit button label (i18n key) */
  editLabel?: string
  /** Custom class name */
  className?: string
  /** Show edit button */
  showEdit?: boolean
  /** Additional header actions */
  headerActions?: React.ReactNode
}

/** Icon mapping for common fields */
const fieldIconMap: Record<string, React.ReactNode> = {
  id: <User className="w-4 h-4" />,
  name: <Building2 className="w-4 h-4" />,
  industry: <Building2 className="w-4 h-4" />,
  address: <MapPin className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  createdAt: <Calendar className="w-4 h-4" />,
  owner: <Users className="w-4 h-4" />,
}

/**
 * InfoCard Component
 * 
 * Displays entity information in a card format with:
 * - Avatar and name header
 * - Configurable fields with icons
 * - Edit action button
 */
export function InfoCard({
  avatarUrl,
  name,
  subtitle,
  headerBadges,
  fields,
  onEdit,
  editLabel = 'common.edit',
  className,
  showEdit = true,
  headerActions,
}: InfoCardProps) {
  const { t } = useTranslation()

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="p-4 pb-2">
        {/* Avatar and Name */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{name}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
            {/* Header Badges */}
            {headerBadges && headerBadges.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {headerBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant || 'secondary'}
                    className="text-xs"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        {showEdit && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              {t(editLabel)}
            </Button>
            {headerActions}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Field Grid */}
        {fields && fields.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {fields.map((field) => (
              <div
                key={field.key}
                className={cn(
                  'flex items-start gap-2',
                  field.fullWidth && 'col-span-1'
                )}
              >
                {/* Field Icon */}
                <span className="text-muted-foreground flex-shrink-0 mt-0.5">
                  {field.icon || fieldIconMap[field.key] || <User className="w-4 h-4" />}
                </span>
                
                {/* Field Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground block">
                    {field.label || t(`detail.fields.${field.key}`, field.key)}
                  </span>
                  <div className="text-sm font-medium truncate">
                    {field.render
                      ? field.render(field.value)
                      : renderFieldValue(field)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/** Render field value based on type */
function renderFieldValue(field: InfoField): React.ReactNode {
  const { value, type, badgeVariant } = field

  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">-</span>
  }

  switch (type) {
    case 'badge':
      return (
        <Badge variant={badgeVariant || 'secondary'} className="text-xs">
          {String(value)}
        </Badge>
      )
    case 'tag':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs">
          {String(value)}
        </span>
      )
    case 'link':
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline truncate"
        >
          {String(value)}
        </a>
      )
    case 'date':
      return <span>{String(value)}</span>
    default:
      return <span>{String(value)}</span>
  }
}

export default InfoCard