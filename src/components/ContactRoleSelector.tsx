import React, { useState, useCallback } from 'react'
import { ContactRoleMapping, ContactRole } from '@/types/competitor'
import { ContactPerson } from '@/types/contactPerson'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, User, Edit2, Trash2, Star, TrendingUp, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// 角色配置
// ============================================================

/** 角色颜色映射 */
const ROLE_COLORS: Record<ContactRole, string> = {
  '决策者': 'bg-red-500 hover:bg-red-600',
  '影响者': 'bg-purple-500 hover:bg-purple-600',
  '使用者': 'bg-blue-500 hover:bg-blue-600',
  '把关者': 'bg-orange-500 hover:bg-orange-600',
  '其他': 'bg-gray-500 hover:bg-gray-600',
}

/** 角色图标映射 */
const ROLE_ICONS: Record<ContactRole, React.ReactNode> = {
  '决策者': <Star className="h-4 w-4" />,
  '影响者': <TrendingUp className="h-4 w-4" />,
  '使用者': <Users className="h-4 w-4" />,
  '把关者': <User className="h-4 w-4" />,
  '其他': <User className="h-4 w-4" />,
}

/** 支持度颜色映射 */
const SUPPORT_COLORS: Record<'支持' | '中立' | '反对', string> = {
  '支持': 'bg-green-100 text-green-800 border-green-300',
  '中立': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  '反对': 'bg-red-100 text-red-800 border-red-300',
}

// ============================================================
// 组件 Props
// ============================================================

interface ContactRoleSelectorProps {
  /** 联系人列表 */
  contacts: ContactPerson[]
  
  /** 已关联的角色映射 */
  value?: ContactRoleMapping[]
  
  /** 变更回调 */
  onChange?: (roles: ContactRoleMapping[]) => void
  
  /** 是否只读 */
  readOnly?: boolean
  
  /** 自定义类名 */
  className?: string
}

// ============================================================
// 联系人角色选择器组件
// ============================================================

/**
 * 联系人角色选择器
 * 用于在商机中为联系人分配决策角色
 */
export const ContactRoleSelector: React.FC<ContactRoleSelectorProps> = ({
  contacts,
  value = [],
  onChange,
  readOnly = false,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<ContactRoleMapping | null>(null)

  // 处理添加/编辑角色
  const handleSaveRole = useCallback((roleMapping: ContactRoleMapping) => {
    const newValue = editingRole
      ? value.map((r) => (r.contactId === editingRole.contactId ? roleMapping : r))
      : [...value, roleMapping]
    
    onChange?.(newValue)
    setIsDialogOpen(false)
    setEditingRole(null)
  }, [value, onChange, editingRole])

  // 处理删除角色
  const handleDeleteRole = useCallback((contactId: string) => {
    const newValue = value.filter((r) => r.contactId !== contactId)
    onChange?.(newValue)
  }, [value, onChange])

  // 处理编辑角色
  const handleEditRole = useCallback((role: ContactRoleMapping) => {
    setEditingRole(role)
    setIsDialogOpen(true)
  }, [])

  // 获取联系人的角色
  const getContactRole = useCallback((contactId: string): ContactRoleMapping | undefined => {
    return value.find((r) => r.contactId === contactId)
  }, [value])

  // 获取未分配的联系人
  const unassignedContacts = contacts.filter(
    (contact) => !value.some((r) => r.contactId === contact.id)
  )

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">联系人角色</CardTitle>
        {!readOnly && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingRole(null)}
                disabled={unassignedContacts.length === 0}
              >
                <Plus className="h-4 w-4 mr-1" />
                添加角色
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <RoleMappingForm
                contacts={editingRole ? contacts : unassignedContacts}
                initialData={editingRole}
                onSave={handleSaveRole}
                onCancel={() => {
                  setIsDialogOpen(false)
                  setEditingRole(null)
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {value.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            暂无联系人角色，请添加
          </div>
        ) : (
          <div className="space-y-2">
            {value.map((roleMapping) => (
              <ContactRoleItem
                key={roleMapping.contactId}
                contact={contacts.find((c) => c.id === roleMapping.contactId)}
                roleMapping={roleMapping}
                readOnly={readOnly}
                onEdit={() => handleEditRole(roleMapping)}
                onDelete={() => handleDeleteRole(roleMapping.contactId)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================
// 角色映射表单
// ============================================================

interface RoleMappingFormProps {
  contacts: ContactPerson[]
  initialData?: ContactRoleMapping | null
  onSave: (data: ContactRoleMapping) => void
  onCancel: () => void
}

const RoleMappingForm: React.FC<RoleMappingFormProps> = ({
  contacts,
  initialData,
  onSave,
  onCancel,
}) => {
  const [contactId, setContactId] = useState(initialData?.contactId || '')
  const [role, setRole] = useState<ContactRole>(initialData?.role || '影响者')
  const [influenceScore, setInfluenceScore] = useState(initialData?.influenceScore?.toString() || '5')
  const [supportLevel, setSupportLevel] = useState<
    '支持' | '中立' | '反对' | ''
  >(initialData?.supportLevel || '')
  const [remark, setRemark] = useState(initialData?.remark || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) return

    onSave({
      contactId,
      contactName: contact.name,
      contactPosition: contact.position,
      role,
      influenceScore: parseInt(influenceScore) || 5,
      supportLevel: supportLevel || undefined,
      remark: remark || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  const selectedContact = contacts.find((c) => c.id === contactId)

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {initialData ? '编辑联系人角色' : '添加联系人角色'}
        </DialogTitle>
        <DialogDescription>
          为联系人分配在商机中的决策角色和影响力
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        {!initialData && (
          <div className="grid gap-2">
            <Label htmlFor="contact">联系人</Label>
            <Select value={contactId} onValueChange={setContactId} required>
              <SelectTrigger>
                <SelectValue placeholder="选择联系人" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} - {contact.position || '无职位'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedContact && (
          <div className="text-sm text-muted-foreground">
            职位：{selectedContact.position || '未设置'} | 
            部门：{selectedContact.jobLevel || '未设置'}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="role">决策角色</Label>
          <Select value={role} onValueChange={(v) => setRole(v as ContactRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="决策者">
                <div className="flex items-center gap-2">
                  <span>决策者</span>
                  <Badge variant="secondary" className="text-xs">最终决定权</Badge>
                </div>
              </SelectItem>
              <SelectItem value="影响者">
                <div className="flex items-center gap-2">
                  <span>影响者</span>
                  <Badge variant="secondary" className="text-xs">影响决策</Badge>
                </div>
              </SelectItem>
              <SelectItem value="使用者">
                <div className="flex items-center gap-2">
                  <span>使用者</span>
                  <Badge variant="secondary" className="text-xs">实际使用</Badge>
                </div>
              </SelectItem>
              <SelectItem value="把关者">
                <div className="flex items-center gap-2">
                  <span>把关者</span>
                  <Badge variant="secondary" className="text-xs">信息控制</Badge>
                </div>
              </SelectItem>
              <SelectItem value="其他">
                <div className="flex items-center gap-2">
                  <span>其他</span>
                  <Badge variant="secondary" className="text-xs">其他角色</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="influence">影响力评分 (1-10)</Label>
          <Input
            id="influence"
            type="number"
            min="1"
            max="10"
            value={influenceScore}
            onChange={(e) => setInfluenceScore(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="support">支持度</Label>
          <Select
            value={supportLevel}
            onValueChange={(value) => setSupportLevel(value as '支持' | '中立' | '反对' | '')}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择支持度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="支持">支持</SelectItem>
              <SelectItem value="中立">中立</SelectItem>
              <SelectItem value="反对">反对</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="remark">备注</Label>
          <Textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="添加备注信息..."
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          {initialData ? '保存修改' : '添加角色'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// ============================================================
// 联系人角色项
// ============================================================

interface ContactRoleItemProps {
  contact?: ContactPerson
  roleMapping: ContactRoleMapping
  readOnly?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

const ContactRoleItem: React.FC<ContactRoleItemProps> = ({
  contact,
  roleMapping,
  readOnly = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border bg-card',
        'hover:border-primary/50 transition-colors'
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* 角色图标 */}
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full text-white',
            ROLE_COLORS[roleMapping.role]
          )}
        >
          {ROLE_ICONS[roleMapping.role]}
        </div>

        {/* 联系人信息 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{roleMapping.contactName}</span>
            {roleMapping.contactPosition && (
              <span className="text-sm text-muted-foreground">
                {roleMapping.contactPosition}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {roleMapping.role}
            </Badge>
            
            {roleMapping.supportLevel && (
              <Badge
                variant="outline"
                className={cn('text-xs', SUPPORT_COLORS[roleMapping.supportLevel])}
              >
                {roleMapping.supportLevel}
              </Badge>
            )}
            
            {roleMapping.influenceScore && (
              <span className="text-xs text-muted-foreground">
                影响力：{roleMapping.influenceScore}/10
              </span>
            )}
          </div>
          
          {roleMapping.remark && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {roleMapping.remark}
            </p>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      {!readOnly && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ContactRoleSelector
