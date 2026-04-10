'use client'

import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react'
import { DashletContainer } from './DashletContainer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashletConfig, CalendarConfig, CalendarEvent } from '@/types/dashlet'

interface CalendarDashletProps {
  config: DashletConfig
  calendarConfig: CalendarConfig
  isEditing?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onRefresh?: (id: string) => void
  onEventClick?: (event: CalendarEvent) => void
}

// Mock calendar data
const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', title: '销售周会', date: '2026-04-08', time: '09:00', type: 'meeting', color: '#3b82f6' },
  { id: '2', title: '客户拜访 - 华腾科技', date: '2026-04-08', time: '14:00', type: 'meeting', color: '#10b981' },
  { id: '3', title: '季度报告提交', date: '2026-04-10', time: '17:00', type: 'deadline', color: '#ef4444' },
  { id: '4', title: '新产品培训', date: '2026-04-12', time: '10:00', type: 'meeting', color: '#8b5cf6' },
  { id: '5', title: '合同审批 - 盛世集团', date: '2026-04-14', time: '11:00', type: 'task', color: '#f59e0b' },
  { id: '6', title: '客户回访提醒', date: '2026-04-15', time: '09:00', type: 'reminder', color: '#06b6d4' },
]

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

export function CalendarDashlet({
  config,
  calendarConfig,
  isEditing = false,
  onRemove,
  onEdit,
  onRefresh,
  onEventClick,
}: CalendarDashletProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date(2026, 3, 8)) // April 2026
  const events = calendarConfig.events?.length ? calendarConfig.events : MOCK_CALENDAR_EVENTS

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date(2026, 3, 8)
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const renderEventDot = (event: CalendarEvent) => {
    const EventTypeIcon = () => {
      switch (event.type) {
        case 'meeting':
          return <span className="text-xs">{'>'}</span>
        case 'task':
          return <span className="text-xs">☐</span>
        case 'deadline':
          return <span className="text-xs">!</span>
        case 'reminder':
          return <span className="text-xs">🔔</span>
        default:
          return null
      }
    }

    return (
      <div
        key={event.id}
        onClick={(e) => {
          e.stopPropagation()
          onEventClick?.(event)
        }}
        className="flex items-center gap-1 px-1 py-0.5 rounded text-xs truncate cursor-pointer hover:bg-black/10"
        style={{ backgroundColor: `${event.color}20`, borderLeft: `2px solid ${event.color}` }}
        title={`${event.time || ''} ${event.title}`}
      >
        <EventTypeIcon />
        <span className="truncate">{event.title}</span>
      </div>
    )
  }

  return (
    <DashletContainer
      config={config}
      isEditing={isEditing}
      onRemove={onRemove}
      onEdit={onEdit}
      onRefresh={onRefresh}
    >
      <div className="space-y-3">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold">
              {year}年 {MONTHS[month]}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-1 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-muted-foreground'}`}
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="min-h-[60px] p-1" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            return (
              <div
                key={day}
                className={`
                  min-h-[60px] p-1 rounded text-sm
                  ${isToday(day) ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted/30'}
                `}
              >
                <div className={`
                  text-center font-medium mb-1
                  ${isToday(day) ? 'text-primary' : ''}
                  ${WEEKDAYS[new Date(year, month, day).getDay()] === '日' ? 'text-red-500' : ''}
                  ${WEEKDAYS[new Date(year, month, day).getDay()] === '六' ? 'text-blue-500' : ''}
                `}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map(renderEventDot)}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{dayEvents.length - 2} 更多
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashletContainer>
  )
}

export default CalendarDashlet
