'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Clock,
  Zap,
  GitBranch,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";

export type TriggerType = "manual" | "scheduled" | "event" | "condition";

export interface TriggerConfigData {
  type: TriggerType;
  name: string;
  enabled: boolean;
  config: {
    // Scheduled
    cron?: string;
    timezone?: string;
    // Event
    eventType?: string;
    eventPayload?: string;
    // Condition
    conditions?: Array<{
      field: string;
      operator: string;
      value: string;
    }>;
  };
}

interface TriggerConfigProps {
  value?: TriggerConfigData;
  onChange?: (value: TriggerConfigData) => void;
  readOnly?: boolean;
}

const TRIGGER_OPTIONS: Array<{
  value: TriggerType;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    value: "manual",
    label: "手动触发",
    icon: <Play className="h-4 w-4" />,
    description: "由用户在界面上手动启动",
  },
  {
    value: "scheduled",
    label: "定时触发",
    icon: <Clock className="h-4 w-4" />,
    description: "按照 Cron 表达式定时执行",
  },
  {
    value: "event",
    label: "事件触发",
    icon: <Zap className="h-4 w-4" />,
    description: "当特定事件发生时触发",
  },
  {
    value: "condition",
    label: "条件触发",
    icon: <GitBranch className="h-4 w-4" />,
    description: "当条件满足时触发",
  },
];

const DEFAULT_DATA: TriggerConfigData = {
  type: "manual",
  name: "",
  enabled: true,
  config: {},
};

export function TriggerConfig({ value, onChange, readOnly = false }: TriggerConfigProps) {
  const data = value ?? DEFAULT_DATA;

  const update = (patch: Partial<TriggerConfigData>) => {
    if (!readOnly && onChange) {
      onChange({ ...data, ...patch });
    }
  };

  const updateConfig = (patch: Partial<TriggerConfigData["config"]>) => {
    if (!readOnly && onChange) {
      onChange({ ...data, config: { ...data.config, ...patch } });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            触发器配置
          </CardTitle>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">启用</span>
              <Switch
                checked={data.enabled}
                onCheckedChange={(checked) => update({ enabled: checked })}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trigger Type Selection */}
        <div className="space-y-2">
          <Label>触发类型</Label>
          <div className="grid grid-cols-2 gap-2">
            {TRIGGER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={readOnly}
                onClick={() => update({ type: opt.value })}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border text-left transition-all
                  ${data.type === opt.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }
                  ${readOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div className={`
                  mt-0.5 p-1.5 rounded-md
                  ${data.type === opt.value ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
                `}>
                  {opt.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-medium ${data.type === opt.value ? "text-primary" : ""}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {opt.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Trigger Name */}
        <div className="space-y-2">
          <Label htmlFor="trigger-name">触发器名称</Label>
          <Input
            id="trigger-name"
            placeholder="例如：客户生日提醒"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            disabled={readOnly}
          />
        </div>

        {/* Type-specific Config */}
        {data.type === "scheduled" && (
          <ScheduledConfig
            cron={data.config.cron}
            timezone={data.config.timezone}
            onChange={updateConfig}
            readOnly={readOnly}
          />
        )}

        {data.type === "event" && (
          <EventConfig
            eventType={data.config.eventType}
            eventPayload={data.config.eventPayload}
            onChange={updateConfig}
            readOnly={readOnly}
          />
        )}

        {data.type === "condition" && (
          <ConditionTriggerConfig
            conditions={data.config.conditions}
            onChange={updateConfig}
            readOnly={readOnly}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ScheduledConfig({
  cron,
  timezone,
  onChange,
  readOnly,
}: {
  cron?: string;
  timezone?: string;
  onChange: (patch: Partial<TriggerConfigData["config"]>) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trigger-cron">Cron 表达式</Label>
        <Input
          id="trigger-cron"
          placeholder="0 9 * * * (每天早上9点)"
          value={cron ?? ""}
          onChange={(e) => onChange({ cron: e.target.value })}
          disabled={readOnly}
        />
        <p className="text-xs text-muted-foreground">
          格式：分 时 日 月 周，例如 "0 9 * * *" 表示每天 9:00
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="trigger-timezone">时区</Label>
        <Select
          value={timezone ?? "Asia/Shanghai"}
          onValueChange={(val) => onChange({ timezone: val })}
          disabled={readOnly}
        >
          <SelectTrigger id="trigger-timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
            <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
            <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
            <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
            <SelectItem value="UTC">UTC</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function EventConfig({
  eventType,
  eventPayload,
  onChange,
  readOnly,
}: {
  eventType?: string;
  eventPayload?: string;
  onChange: (patch: Partial<TriggerConfigData["config"]>) => void;
  readOnly: boolean;
}) {
  const COMMON_EVENTS = [
    "customer.created",
    "customer.updated",
    "customer.deleted",
    "order.created",
    "order.paid",
    "order.shipped",
    "order.completed",
    "form.submitted",
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trigger-event-type">事件类型</Label>
        <Select
          value={eventType ?? ""}
          onValueChange={(val) => onChange({ eventType: val })}
          disabled={readOnly}
        >
          <SelectTrigger id="trigger-event-type">
            <SelectValue placeholder="选择或输入事件类型" />
          </SelectTrigger>
          <SelectContent>
            {COMMON_EVENTS.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="trigger-event-payload">事件载荷（可选，JSON 格式）</Label>
        <Textarea
          id="trigger-event-payload"
          placeholder='{"field": "value"}'
          value={eventPayload ?? ""}
          onChange={(e) => onChange({ eventPayload: e.target.value })}
          disabled={readOnly}
          rows={3}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}

function ConditionTriggerConfig({
  conditions,
  onChange,
  readOnly,
}: {
  conditions?: Array<{ field: string; operator: string; value: string }>;
  onChange: (patch: Partial<TriggerConfigData["config"]>) => void;
  readOnly: boolean;
}) {
  const rows = conditions?.length ? conditions : [{ field: "", operator: "equals", value: "" }];

  const updateRows = (newRows: typeof rows) => {
    onChange({ conditions: newRows });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>触发条件</Label>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateRows([...rows, { field: "", operator: "equals", value: "" }])}
          >
            <Plus className="h-3 w-3 mr-1" />
            添加条件
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <Badge variant="outline" className="shrink-0 text-xs">
                AND
              </Badge>
            )}
            <Input
              placeholder="字段名"
              value={row.field}
              onChange={(e) => {
                const updated = [...rows];
                updated[i] = { ...updated[i], field: e.target.value };
                updateRows(updated);
              }}
              disabled={readOnly}
              className="flex-1"
            />
            <Select
              value={row.operator}
              onValueChange={(val) => {
                const updated = [...rows];
                updated[i] = { ...updated[i], operator: val };
                updateRows(updated);
              }}
              disabled={readOnly}
            >
              <SelectTrigger className="w-32 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">等于</SelectItem>
                <SelectItem value="not_equals">不等于</SelectItem>
                <SelectItem value="contains">包含</SelectItem>
                <SelectItem value="gt">大于</SelectItem>
                <SelectItem value="gte">大于等于</SelectItem>
                <SelectItem value="lt">小于</SelectItem>
                <SelectItem value="lte">小于等于</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="值"
              value={row.value}
              onChange={(e) => {
                const updated = [...rows];
                updated[i] = { ...updated[i], value: e.target.value };
                updateRows(updated);
              }}
              disabled={readOnly}
              className="flex-1"
            />
            {!readOnly && rows.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 text-destructive"
                onClick={() => updateRows(rows.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
