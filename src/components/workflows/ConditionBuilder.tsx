import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "is_empty"
  | "is_not_empty";

export type LogicOperator = "AND" | "OR";

export interface ConditionRow {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string;
}

export interface ConditionGroup {
  id: string;
  logic: LogicOperator;
  conditions: ConditionRow[];
}

export interface ConditionBuilderData {
  groups: ConditionGroup[];
}

const OPERATOR_LABELS: Record<ConditionOperator, string> = {
  equals: "等于",
  not_equals: "不等于",
  contains: "包含",
  not_contains: "不包含",
  starts_with: "开头是",
  ends_with: "结尾是",
  gt: "大于",
  gte: "大于等于",
  lt: "小于",
  lte: "小于等于",
  is_empty: "为空",
  is_not_empty: "不为空",
};

const VALUE_LESS_OPERATORS: ConditionOperator[] = ["is_empty", "is_not_empty"];

interface ConditionBuilderProps {
  value?: ConditionBuilderData;
  onChange?: (value: ConditionBuilderData) => void;
  readOnly?: boolean;
  availableFields?: Array<{ value: string; label: string; type?: "string" | "number" | "date" | "boolean" }>;
}

const DEFAULT_DATA: ConditionBuilderData = {
  groups: [
    {
      id: "1",
      logic: "AND",
      conditions: [{ id: "c1", field: "", operator: "equals", value: "" }],
    },
  ],
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function ConditionBuilder({
  value,
  onChange,
  readOnly = false,
  availableFields = [],
}: ConditionBuilderProps) {
  const data = value ?? DEFAULT_DATA;

  const update = (patch: Partial<ConditionBuilderData>) => {
    if (!readOnly && onChange) {
      onChange({ ...data, ...patch });
    }
  };

  const addGroup = () => {
    const newGroup: ConditionGroup = {
      id: generateId(),
      logic: "AND",
      conditions: [{ id: generateId(), field: "", operator: "equals", value: "" }],
    };
    update({ groups: [...data.groups, newGroup] });
  };

  const removeGroup = (groupId: string) => {
    if (data.groups.length <= 1) return;
    update({ groups: data.groups.filter((g) => g.id !== groupId) });
  };

  const updateGroupLogic = (groupId: string, logic: LogicOperator) => {
    update({
      groups: data.groups.map((g) => (g.id === groupId ? { ...g, logic } : g)),
    });
  };

  const addCondition = (groupId: string) => {
    update({
      groups: data.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: [
                ...g.conditions,
                { id: generateId(), field: "", operator: "equals", value: "" },
              ],
            }
          : g
      ),
    });
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    update({
      groups: data.groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter((c) => c.id !== conditionId) }
          : g
      ),
    });
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    patch: Partial<ConditionRow>
  ) => {
    update({
      groups: data.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.map((c) =>
                c.id === conditionId ? { ...c, ...patch } : c
              ),
            }
          : g
      ),
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <span className="text-primary font-bold">IF</span>
          条件构建器
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.groups.map((group, gi) => (
          <div key={group.id} className="space-y-3">
            {/* Group Header */}
            {gi > 0 && (
              <div className="flex items-center gap-2">
                <Separator className="flex-1" />
                <Select
                  value={group.logic}
                  onValueChange={(v) => updateGroupLogic(group.id, v as LogicOperator)}
                  disabled={readOnly}
                >
                  <SelectTrigger className="w-20 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
                <Separator className="flex-1" />
              </div>
            )}

            {/* Conditions */}
            <div className="space-y-2 pl-3 border-l-2 border-muted">
              {group.conditions.map((condition, ci) => (
                <ConditionRowInput
                  key={condition.id}
                  condition={condition}
                  availableFields={availableFields}
                  showLogic={ci > 0}
                  logic={group.logic}
                  onChange={(patch) => updateCondition(group.id, condition.id, patch)}
                  onRemove={
                    !readOnly && group.conditions.length > 1
                      ? () => removeCondition(group.id, condition.id)
                      : undefined
                  }
                />
              ))}

              {!readOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => addCondition(group.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  添加条件
                </Button>
              )}
            </div>

            {/* Group remove */}
            {!readOnly && data.groups.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive"
                  onClick={() => removeGroup(group.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  删除条件组
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Add Group */}
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addGroup}
          >
            <Plus className="h-3 w-3 mr-1" />
            添加条件组
          </Button>
        )}

        {/* Summary */}
        {data.groups.some((g) => g.conditions.some((c) => c.field && c.value)) && (
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">条件预览</p>
            <p className="text-xs text-muted-foreground font-mono">
              {data.groups.map((g, gi) => {
                const filled = g.conditions.filter((c) => c.field);
                if (!filled.length) return null;
                const parts = filled.map((c) => {
                  const label = OPERATOR_LABELS[c.operator];
                  return VALUE_LESS_OPERATORS.includes(c.operator)
                    ? `${c.field} ${label}`
                    : `${c.field} ${label} "${c.value}"`;
                });
                return gi > 0 ? `${g.logic} (${parts.join(` ${g.logic} `)})` : `(${parts.join(` ${g.logic} `)})`;
              }).filter(Boolean).join(" ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ConditionRowInputProps {
  condition: ConditionRow;
  availableFields: ConditionBuilderProps["availableFields"];
  showLogic: boolean;
  logic: LogicOperator;
  onChange: (patch: Partial<ConditionRow>) => void;
  onRemove?: () => void;
}

function ConditionRowInput({
  condition,
  availableFields,
  showLogic,
  logic,
  onChange,
  onRemove,
}: ConditionRowInputProps) {
  const [expanded, setExpanded] = useState(true);
  const isValueLess = VALUE_LESS_OPERATORS.includes(condition.operator);

  return (
    <div className="flex items-start gap-2">
      {/* Drag Handle */}
      <div className="mt-2 text-muted-foreground/50 cursor-grab">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Field */}
      <div className="flex-1 min-w-0">
        <Select
          value={condition.field}
          onValueChange={(val) => onChange({ field: val })}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="选择字段..." />
          </SelectTrigger>
          <SelectContent>
            {(availableFields || []).length > 0 ? (
              (availableFields || []).map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="customer.status">客户状态</SelectItem>
                <SelectItem value="customer.level">客户等级</SelectItem>
                <SelectItem value="order.amount">订单金额</SelectItem>
                <SelectItem value="order.count">订单数量</SelectItem>
                <SelectItem value="customer.created_at">创建时间</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Operator */}
      <Select
        value={condition.operator}
        onValueChange={(val) => onChange({ operator: val as ConditionOperator })}
      >
        <SelectTrigger className="w-28 h-8 text-sm shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(OPERATOR_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value */}
      {!isValueLess && (
        <Input
          className="h-8 text-sm flex-1 min-w-0"
          placeholder="值"
          value={condition.value}
          onChange={(e) => onChange({ value: e.target.value })}
        />
      )}

      {isValueLess && (
        <div className="h-8 flex items-center px-2 text-sm text-muted-foreground italic">
          (无需值)
        </div>
      )}

      {/* Remove */}
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
