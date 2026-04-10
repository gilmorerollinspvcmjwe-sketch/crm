import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Send,
  Bell,
  Mail,
  UserPlus,
  ShoppingCart,
  MessageSquare,
  Webhook,
  Code,
  Plus,
  Trash2,
  Settings2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export type ActionType =
  | "notify"
  | "email"
  | "webhook"
  | "create_customer"
  | "create_order"
  | "update_field"
  | "http_request"
  | "delay";

export interface ActionConfigData {
  type: ActionType;
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface ActionStep {
  id: string;
  actions: ActionConfigData[];
}

const ACTION_OPTIONS: Array<{
  value: ActionType;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: "notification" | "data" | "integration" | "flow";
}> = [
  {
    value: "notify",
    label: "站内通知",
    icon: <Bell className="h-4 w-4" />,
    description: "发送站内消息通知",
    category: "notification",
  },
  {
    value: "email",
    label: "发送邮件",
    icon: <Mail className="h-4 w-4" />,
    description: "发送邮件给指定人员",
    category: "notification",
  },
  {
    value: "webhook",
    label: "Webhook",
    icon: <Webhook className="h-4 w-4" />,
    description: "向外部系统发送 Webhook 请求",
    category: "integration",
  },
  {
    value: "http_request",
    label: "HTTP 请求",
    icon: <Code className="h-4 w-4" />,
    description: "发送自定义 HTTP 请求",
    category: "integration",
  },
  {
    value: "create_customer",
    label: "创建客户",
    icon: <UserPlus className="h-4 w-4" />,
    description: "在系统中创建新客户记录",
    category: "data",
  },
  {
    value: "create_order",
    label: "创建订单",
    icon: <ShoppingCart className="h-4 w-4" />,
    description: "创建新的订单记录",
    category: "data",
  },
  {
    value: "update_field",
    label: "更新字段",
    icon: <Settings2 className="h-4 w-4" />,
    description: "更新客户或订单的字段值",
    category: "data",
  },
  {
    value: "delay",
    label: "延时等待",
    icon: <MessageSquare className="h-4 w-4" />,
    description: "等待指定时间后再执行下一步",
    category: "flow",
  },
];

const ACTION_CATEGORIES = [
  { value: "notification", label: "通知" },
  { value: "data", label: "数据操作" },
  { value: "integration", label: "集成" },
  { value: "flow", label: "流程控制" },
];

interface ActionConfigProps {
  value?: ActionConfigData;
  onChange?: (value: ActionConfigData) => void;
  readOnly?: boolean;
}

const DEFAULT_DATA: ActionConfigData = {
  type: "notify",
  name: "",
  enabled: true,
  config: {},
};

function ActionIcon({ type, className }: { type: ActionType; className?: string }) {
  const opt = ACTION_OPTIONS.find((o) => o.value === type);
  if (!opt) return null;
  return <span className={className}>{opt.icon}</span>;
}

export function ActionConfig({ value, onChange, readOnly = false }: ActionConfigProps) {
  const data = value ?? DEFAULT_DATA;

  const update = (patch: Partial<ActionConfigData>) => {
    if (!readOnly && onChange) {
      onChange({ ...data, ...patch });
    }
  };

  const updateConfig = (key: string, val: unknown) => {
    if (!readOnly && onChange) {
      onChange({ ...data, config: { ...data.config, [key]: val } });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            动作配置
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
        {/* Action Type Selection */}
        <div className="space-y-2">
          <Label>动作类型</Label>
          <Tabs defaultValue="notification" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-8">
              {ACTION_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-xs h-7">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {ACTION_CATEGORIES.map((cat) => (
              <TabsContent key={cat.value} value={cat.value} className="mt-2">
                <div className="grid grid-cols-2 gap-2">
                  {ACTION_OPTIONS.filter((o) => o.category === cat.value).map((opt) => (
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
                        mt-0.5 p-1.5 rounded-md shrink-0
                        ${data.type === opt.value ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
                      `}>
                        {opt.icon}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${data.type === opt.value ? "text-primary" : ""}`}>
                          {opt.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {opt.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <Separator />

        {/* Action Name */}
        <div className="space-y-2">
          <Label htmlFor="action-name">动作名称</Label>
          <Input
            id="action-name"
            placeholder="例如：发送客户生日祝福"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            disabled={readOnly}
          />
        </div>

        {/* Type-specific Config */}
        <ActionConfigPanel
          type={data.type}
          config={data.config}
          onChange={updateConfig}
          readOnly={readOnly}
        />
      </CardContent>
    </Card>
  );
}

interface ActionConfigPanelProps {
  type: ActionType;
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}

function ActionConfigPanel({ type, config, onChange, readOnly }: ActionConfigPanelProps) {
  switch (type) {
    case "notify":
      return <NotifyConfig config={config} onChange={onChange} readOnly={readOnly} />;
    case "email":
      return <EmailConfig config={config} onChange={onChange} readOnly={readOnly} />;
    case "webhook":
      return <WebhookConfig config={config} onChange={onChange} readOnly={readOnly} />;
    case "http_request":
      return <HttpRequestConfig config={config} onChange={onChange} readOnly={readOnly} />;
    case "create_customer":
      return <CreateCustomerConfig config={config} onChange={onChange} readOnly={readOnly} />;
    case "create_order":
      return <CreateOrderConfig config={config} onChange={onChange} readOnly={readOnly} />;
    case "update_field":
      return <UpdateFieldConfig config={config} onChange={onChange} readOnly={readOnly} />;
    case "delay":
      return <DelayConfig config={config} onChange={onChange} readOnly={readOnly} />;
    default:
      return null;
  }
}

function NotifyConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notify-receiver">接收人</Label>
        <Input
          id="notify-receiver"
          placeholder='{{customer.name}} 或 user_id'
          value={(config.receiver as string) ?? ""}
          onChange={(e) => onChange("receiver", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notify-title">通知标题</Label>
        <Input
          id="notify-title"
          placeholder="请输入通知标题"
          value={(config.title as string) ?? ""}
          onChange={(e) => onChange("title", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notify-content">通知内容</Label>
        <Textarea
          id="notify-content"
          placeholder="请输入通知内容，支持变量 {{customer.name}}"
          value={(config.content as string) ?? ""}
          onChange={(e) => onChange("content", e.target.value)}
          disabled={readOnly}
          rows={3}
        />
      </div>
    </div>
  );
}

function EmailConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-to">收件人</Label>
        <Input
          id="email-to"
          placeholder='{{customer.email}} 或 email@example.com'
          value={(config.to as string) ?? ""}
          onChange={(e) => onChange("to", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-cc">抄送（可选）</Label>
        <Input
          id="email-cc"
          placeholder="多个用逗号分隔"
          value={(config.cc as string) ?? ""}
          onChange={(e) => onChange("cc", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-subject">邮件主题</Label>
        <Input
          id="email-subject"
          placeholder="请输入邮件主题"
          value={(config.subject as string) ?? ""}
          onChange={(e) => onChange("subject", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-body">邮件正文</Label>
        <Textarea
          id="email-body"
          placeholder="支持 HTML 和变量 {{customer.name}}"
          value={(config.body as string) ?? ""}
          onChange={(e) => onChange("body", e.target.value)}
          disabled={readOnly}
          rows={5}
        />
      </div>
    </div>
  );
}

function WebhookConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-url">Webhook URL</Label>
        <Input
          id="webhook-url"
          placeholder="https://example.com/webhook"
          value={(config.url as string) ?? ""}
          onChange={(e) => onChange("url", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="webhook-method">请求方法</Label>
        <Select
          value={(config.method as string) ?? "POST"}
          onValueChange={(val) => onChange("method", val)}
          disabled={readOnly}
        >
          <SelectTrigger id="webhook-method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="webhook-headers">请求头（可选，JSON 格式）</Label>
        <Textarea
          id="webhook-headers"
          placeholder='{"Authorization": "Bearer xxx"}'
          value={(config.headers as string) ?? ""}
          onChange={(e) => onChange("headers", e.target.value)}
          disabled={readOnly}
          rows={2}
          className="font-mono text-xs"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="webhook-body">请求体（JSON 格式）</Label>
        <Textarea
          id="webhook-body"
          placeholder='{"customer_id": "{{customer.id}}"}'
          value={(config.body as string) ?? ""}
          onChange={(e) => onChange("body", e.target.value)}
          disabled={readOnly}
          rows={4}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}

function HttpRequestConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="http-url">请求 URL</Label>
        <Input
          id="http-url"
          placeholder="https://api.example.com/v1/endpoint"
          value={(config.url as string) ?? ""}
          onChange={(e) => onChange("url", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="http-method">请求方法</Label>
        <Select
          value={(config.method as string) ?? "GET"}
          onValueChange={(val) => onChange("method", val)}
          disabled={readOnly}
        >
          <SelectTrigger id="http-method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="http-headers">请求头</Label>
        <Textarea
          id="http-headers"
          placeholder='{"Content-Type": "application/json"}'
          value={(config.headers as string) ?? ""}
          onChange={(e) => onChange("headers", e.target.value)}
          disabled={readOnly}
          rows={2}
          className="font-mono text-xs"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="http-body">请求体</Label>
        <Textarea
          id="http-body"
          placeholder="请求体内容"
          value={(config.body as string) ?? ""}
          onChange={(e) => onChange("body", e.target.value)}
          disabled={readOnly}
          rows={4}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}

function CreateCustomerConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cc-name">客户姓名</Label>
        <Input
          id="cc-name"
          placeholder='{{trigger.customer_name}} 或固定值'
          value={(config.name as string) ?? ""}
          onChange={(e) => onChange("name", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cc-phone">手机号</Label>
        <Input
          id="cc-phone"
          placeholder="手机号"
          value={(config.phone as string) ?? ""}
          onChange={(e) => onChange("phone", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cc-email">邮箱</Label>
        <Input
          id="cc-email"
          placeholder="邮箱"
          value={(config.email as string) ?? ""}
          onChange={(e) => onChange("email", e.target.value)}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function CreateOrderConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="co-customer">关联客户</Label>
        <Input
          id="co-customer"
          placeholder='{{customer.id}}'
          value={(config.customer_id as string) ?? ""}
          onChange={(e) => onChange("customer_id", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="co-amount">订单金额</Label>
        <Input
          id="co-amount"
          type="number"
          placeholder="0.00"
          value={(config.amount as string) ?? ""}
          onChange={(e) => onChange("amount", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="co-products">产品列表（JSON）</Label>
        <Textarea
          id="co-products"
          placeholder='[{"product_id": "1", "quantity": 1}]'
          value={(config.products as string) ?? ""}
          onChange={(e) => onChange("products", e.target.value)}
          disabled={readOnly}
          rows={3}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}

function UpdateFieldConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="uf-target">目标对象类型</Label>
        <Select
          value={(config.target_type as string) ?? "customer"}
          onValueChange={(val) => onChange("target_type", val)}
          disabled={readOnly}
        >
          <SelectTrigger id="uf-target">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">客户</SelectItem>
            <SelectItem value="order">订单</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="uf-target-id">目标对象 ID</Label>
        <Input
          id="uf-target-id"
          placeholder='{{customer.id}}'
          value={(config.target_id as string) ?? ""}
          onChange={(e) => onChange("target_id", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uf-field">字段名</Label>
        <Input
          id="uf-field"
          placeholder="status, level, notes..."
          value={(config.field as string) ?? ""}
          onChange={(e) => onChange("field", e.target.value)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uf-value">字段值</Label>
        <Input
          id="uf-value"
          placeholder="新的字段值"
          value={(config.value as string) ?? ""}
          onChange={(e) => onChange("value", e.target.value)}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function DelayConfig({
  config,
  onChange,
  readOnly,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: unknown) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="delay-duration">等待时长</Label>
        <Input
          id="delay-duration"
          type="number"
          placeholder="1"
          value={(config.duration as number) ?? 1}
          onChange={(e) => onChange("duration", parseInt(e.target.value) || 1)}
          disabled={readOnly}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="delay-unit">时间单位</Label>
        <Select
          value={(config.unit as string) ?? "hours"}
          onValueChange={(val) => onChange("unit", val)}
          disabled={readOnly}
        >
          <SelectTrigger id="delay-unit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minutes">分钟</SelectItem>
            <SelectItem value="hours">小时</SelectItem>
            <SelectItem value="days">天</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
