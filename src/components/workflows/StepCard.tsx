import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  GripVertical,
  Play,
  Clock,
  Zap,
  GitBranch,
  Send,
  ChevronDown,
  ChevronRight,
  Trash2,
  Copy,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export type StepType = "trigger" | "condition" | "action" | "delay" | "end";

export interface StepCardData {
  id: string;
  type: StepType;
  name: string;
  enabled: boolean;
  summary?: string;
  error?: string;
  children?: StepCardData[];
  config?: Record<string, unknown>;
}

interface StepCardProps {
  data: StepCardData;
  index: number;
  total: number;
  onChange?: (data: StepCardData) => void;
  onRemove?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  readOnly?: boolean;
  renderContent?: (data: StepCardData) => React.ReactNode;
}

const STEP_ICONS: Record<StepType, React.ReactNode> = {
  trigger: <GitBranch className="h-4 w-4" />,
  condition: <Zap className="h-4 w-4" />,
  action: <Send className="h-4 w-4" />,
  delay: <Clock className="h-4 w-4" />,
  end: <Play className="h-4 w-4" />,
};

const STEP_LABELS: Record<StepType, string> = {
  trigger: "触发",
  condition: "条件",
  action: "动作",
  delay: "延时",
  end: "结束",
};

const STEP_COLORS: Record<StepType, string> = {
  trigger: "bg-blue-500/10 text-blue-600 border-blue-200",
  condition: "bg-amber-500/10 text-amber-600 border-amber-200",
  action: "bg-green-500/10 text-green-600 border-green-200",
  delay: "bg-purple-500/10 text-purple-600 border-purple-200",
  end: "bg-slate-500/10 text-slate-600 border-slate-200",
};

export function StepCard({
  data,
  index,
  total,
  onChange,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  readOnly = false,
  renderContent,
}: StepCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const update = (patch: Partial<StepCardData>) => {
    if (!readOnly && onChange) {
      onChange({ ...data, ...patch });
    }
  };

  return (
    <div className="relative">
      {/* Connector Line (top) */}
      {index > 0 && (
        <div className="absolute -top-6 left-6 flex flex-col items-center">
          <div className="w-px h-6 bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>
      )}

      <Card
        className={`
          transition-all
          ${data.enabled ? "" : "opacity-60"}
          ${data.error ? "border-destructive ring-1 ring-destructive/20" : ""}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b">
          {/* Drag Handle */}
          <div className="text-muted-foreground/40 cursor-grab hover:text-muted-foreground transition-colors">
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Step Number & Type Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`
              flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
              ${STEP_COLORS[data.type].split(" ")[1].replace("/10", "")}
              bg-current/10 text-current
            `}>
              {index + 1}
            </div>
            <Badge
              variant="outline"
              className={`text-xs gap-1 ${STEP_COLORS[data.type]}`}
            >
              {STEP_ICONS[data.type]}
              {STEP_LABELS[data.type]}
            </Badge>
          </div>

          {/* Step Name */}
          <div className="flex-1 min-w-0">
            <input
              className="w-full bg-transparent text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -mx-1 disabled:cursor-not-allowed"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              disabled={readOnly}
              placeholder="步骤名称..."
            />
          </div>

          {/* Error Indicator */}
          {data.error && (
            <div className="flex items-center gap-1 text-destructive text-xs shrink-0">
              <AlertCircle className="h-3 w-3" />
              <span className="hidden sm:inline">配置错误</span>
            </div>
          )}

          {/* Enable/Disable */}
          {!readOnly && (
            <Switch
              checked={data.enabled}
              onCheckedChange={(checked) => update({ enabled: checked })}
              className="shrink-0"
            />
          )}

          {/* Expand/Collapse */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {/* More Menu */}
          {!readOnly && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate?.();
                  }}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  复制步骤
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveUp?.();
                  }}
                  disabled={index === 0}
                >
                  上移
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveDown?.();
                  }}
                  disabled={index === total - 1}
                >
                  下移
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onRemove?.();
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  删除步骤
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        {expanded && (
          <CardContent className="p-3 space-y-3">
            {/* Summary line */}
            {data.summary && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1.5 font-mono line-clamp-1">
                {data.summary}
              </div>
            )}

            {/* Custom content from parent */}
            {renderContent && renderContent(data)}

            {/* Children (for condition branches) */}
            {data.children && data.children.length > 0 && (
              <div className="space-y-2 mt-2">
                <Separator />
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  分支 ({data.children.length})
                </div>
                {data.children.map((child, ci) => (
                  <div key={child.id} className="pl-4 border-l-2 border-primary/30">
                    {/* Branch label */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {ci === 0 ? "满足条件" : `分支 ${ci + 1}`}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate">
                        {child.name}
                      </span>
                    </div>
                    {/* Recursive children would go here */}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Connector Arrow (bottom) */}
      {index < total - 1 && (
        <div className="absolute -bottom-4 left-6 flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-px h-4 bg-border" />
        </div>
      )}
    </div>
  );
}
