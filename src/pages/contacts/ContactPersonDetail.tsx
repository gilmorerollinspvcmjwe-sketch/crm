"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft, Phone, Mail, Building, Calendar, User, Clock, MessageSquare, Activity, Edit, Trash2,
  Share2, Copy, Download, MoreHorizontal, Star, ChevronDown, ChevronUp, Lightbulb, CheckCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { ContactPersonForm } from "@/forms/ContactPersonForm"

// Inline editable field component
import { InlineEditableField } from "@/components/InlineEditableField"

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"
import { InfoCard, type InfoField } from "@/components/DetailSidebar/InfoCard"
import { ActionButtons, type ActionButtonConfig } from "@/components/DetailSidebar/ActionButtons"
import { RelatedListCard, type RelatedItem } from "@/components/DetailSidebar/RelatedListCard"
import { DetailTabs, type DetailTabConfig } from "@/components/DetailContent/DetailTabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  useContactPerson,
  useUpdateContactPerson,
  useDeleteContactPerson,
} from "@/hooks/api/useContactPersons"
import { useCustomer } from "@/hooks/api/useCustomers"
import type { ContactPerson, ContactPersonDecisionRole, ContactPersonJobLevel } from "@/types/contactPerson"
import type { ContactPersonFormValues } from "@/schemas/contactPerson"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// ============================================================
// Badge Config
// ============================================================

const decisionRoleConfig: Record<ContactPersonDecisionRole, { className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "决策者": { className: "bg-red-100 text-red-800 border-red-200", variant: "destructive" },
  "影响者": { className: "bg-orange-100 text-orange-800 border-orange-200", variant: "warning" },
  "使用者": { className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "把关者": { className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "其他": { className: "bg-gray-100 text-gray-800 border-gray-200", variant: "secondary" },
}

const jobLevelConfig: Record<ContactPersonJobLevel, { variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "高管": { variant: "default" },
  "中层": { variant: "info" },
  "基层": { variant: "secondary" },
  "其他": { variant: "outline" },
}

const genderConfig: Record<string, { className: string }> = {
  "男": { className: "bg-blue-100 text-blue-800 border-blue-200" },
  "女": { className: "bg-pink-100 text-pink-800 border-pink-200" },
  "未知": { className: "bg-gray-100 text-gray-800 border-gray-200" },
}

function GenderBadge({ gender }: { gender?: string }) {
  if (!gender) return null
  const config = genderConfig[gender]
  if (!config) return null
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {gender}
    </span>
  )
}

// ============================================================
// ContactPersonDetail Page
// ============================================================

export function ContactPersonDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const params = useParams()
  const navigate = useNavigate()
  const contactId = params.id || ""

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [inlineEditLoading, setInlineEditLoading] = React.useState<string | null>(null)
  const [contactsExpanded, setContactsExpanded] = React.useState(true)
  const [activitiesExpanded, setActivitiesExpanded] = React.useState(true)

  // API Hooks
  const { data: contact, isLoading, refetch } = useContactPerson(contactId)
  const { data: customer } = useCustomer(contact?.customerId || null)
  const updateMutation = useUpdateContactPerson()
  const deleteMutation = useDeleteContactPerson()

  // Inline edit handler
  const handleInlineEdit = async (field: keyof ContactPerson, value: string) => {
    try {
      await updateMutation.mutateAsync({
        id: contactId,
        data: {
          [field]: value,
        },
      })
      toast({
        title: "已更新",
        duration: 2000,
      })
      refetch()
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: "更新失败",
        variant: "destructive",
      })
    }
  }

  // Handlers
  const handleEdit = async (values: ContactPersonFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: contactId,
        data: values,
      })
      setEditModalOpen(false)
      toast({
        title: "联系人更新成功",
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: "更新失败",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(contactId)
      toast({
        title: "联系人已删除",
      })
      navigate("/contacts")
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: "删除失败",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    navigate("/contacts")
  }

  const handleViewCustomer = () => {
    if (contact?.customerId) {
      navigate(`/customers/${contact.customerId}`)
    }
  }

  const handleCall = () => {
    if (contact?.mobile) {
      window.open(`tel:${contact.mobile}`)
    }
  }

  const handleEmail = () => {
    if (contact?.email) {
      window.open(`mailto:${contact.email}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-background p-6 animate-in fade-in duration-300">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back", "返回列表")}
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{t("contactPerson.detail.notFound", "联系人不存在或已被删除")}</p>
          </div>
        </div>
      </div>
    )
  }

  // InfoCard fields with inline editing
  const infoFields: InfoField[] = [
    { 
      key: "position", 
      label: "职位", 
      value: contact.position, 
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="text"
          placeholder="请输入职位"
          onSave={(v: string) => handleInlineEdit("position", v)}
          disabled={inlineEditLoading === "position"}
        />
      ),
    },
    { 
      key: "jobLevel", 
      label: "职级", 
      value: contact.jobLevel, 
      type: "badge",
      badgeVariant: jobLevelConfig[contact.jobLevel || '其他']?.variant,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="select"
          options={[
            { label: "高管", value: "高管" },
            { label: "中层", value: "中层" },
            { label: "基层", value: "基层" },
            { label: "其他", value: "其他" },
          ]}
          onSave={(v: string) => handleInlineEdit("jobLevel", v)}
          disabled={inlineEditLoading === "jobLevel"}
        />
      ),
    },
    { 
      key: "decisionRole", 
      label: "决策角色", 
      value: contact.decisionRole, 
      type: "badge",
      badgeVariant: decisionRoleConfig[contact.decisionRole || '其他']?.variant,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="select"
          options={[
            { label: "决策者", value: "决策者" },
            { label: "影响者", value: "影响者" },
            { label: "使用者", value: "使用者" },
            { label: "把关者", value: "把关者" },
            { label: "其他", value: "其他" },
          ]}
          onSave={(v: string) => handleInlineEdit("decisionRole", v)}
          disabled={inlineEditLoading === "decisionRole"}
        />
      ),
    },
    { 
      key: "mobile", 
      label: "手机", 
      value: contact.mobile, 
      icon: <Phone className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="phone"
          placeholder="请输入手机号"
          onSave={(v: string) => handleInlineEdit("mobile", v)}
          disabled={inlineEditLoading === "mobile"}
        />
      ),
    },
    { 
      key: "email", 
      label: "邮箱", 
      value: contact.email, 
      icon: <Mail className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="email"
          placeholder="请输入邮箱"
          onSave={(v: string) => handleInlineEdit("email", v)}
          disabled={inlineEditLoading === "email"}
        />
      ),
    },
    { 
      key: "wechat", 
      label: "微信", 
      value: contact.wechat, 
      icon: <MessageSquare className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="text"
          placeholder="请输入微信号"
          onSave={(v: string) => handleInlineEdit("wechat", v)}
          disabled={inlineEditLoading === "wechat"}
        />
      ),
    },
    { 
      key: "customer", 
      label: "关联客户", 
      value: customer?.name || contact.customerName, 
      icon: <Building className="w-4 h-4" />,
      render: (_val: unknown) => (
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={handleViewCustomer}
        >
          {customer?.name || contact.customerName || "未知客户"}
        </Button>
      ),
    },
    { 
      key: "ownerName", 
      label: "负责人", 
      value: contact.ownerName, 
      icon: <User className="w-4 h-4" />,
      render: (val: unknown) => (
        <span className="text-muted-foreground">{val as string || "-"}</span>
      ),
    },
    { 
      key: "createdAt", 
      label: "创建时间", 
      value: contact.createdAt, 
      icon: <Calendar className="w-4 h-4" />,
      render: (val: unknown) => (
        <span className="text-muted-foreground">{val as string}</span>
      ),
    },
  ]

  // Action buttons
  const actionButtons: ActionButtonConfig[] = [
    { key: "edit", label: "编辑", onClick: () => setEditModalOpen(true) },
    { key: "separator", label: "" },
    { key: "call", label: "拨打电话", onClick: handleCall },
    { key: "email", label: "发送邮件", onClick: handleEmail },
    { key: "separator", label: "" },
    { key: "delete", label: "删除", danger: true, onClick: () => setDeleteConfirmOpen(true) },
  ]

  // Tabs configuration
  const tabs: DetailTabConfig[] = [
    {
      key: "overview",
      label: t("contactPerson.detail.tabs.overview", "概览"),
      icon: <User className="w-4 h-4" />,
      content: (
        <div className="space-y-4 p-4">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Star className="w-5 h-5 text-red-600 fill-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">决策角色</p>
                    <p className="text-lg font-bold text-slate-900">{contact.decisionRole || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">职级</p>
                    <p className="text-lg font-bold text-slate-900">{contact.jobLevel || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">主要联系人</p>
                    <p className="text-lg font-bold text-slate-900">{contact.isPrimary ? "是" : "否"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">关联客户</p>
                    <p className="text-lg font-bold text-slate-900 truncate">{customer?.name || contact.customerName || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Info Section */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">联系信息</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">手机：</span>
                  <span className="text-slate-700">{contact.mobile || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">邮箱：</span>
                  <span className="text-slate-700">{contact.email || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">微信：</span>
                  <span className="text-slate-700">{contact.wechat || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">负责人：</span>
                  <span className="text-slate-700">{contact.ownerName || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notes Section */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">备注</h3>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {contact.remark || "暂无备注"}
              </p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      key: "activity",
      label: t("contactPerson.detail.tabs.activity", "活动"),
      icon: <Activity className="w-4 h-4" />,
      content: (
        <div className="bg-muted/30 rounded-lg p-4 min-h-[200px]">
          <p className="text-sm text-muted-foreground">暂无活动记录</p>
        </div>
      ),
    },
  ]

  // Related items
  const relatedCustomerItem: RelatedItem[] = customer ? [{
    id: customer.id || "customer",
    title: customer.name || "未知客户",
    subtitle: customer.company,
    onClick: handleViewCustomer,
    isPrimary: true,
  }] : []

  return (
    <>
      <div className="animate-in fade-in duration-300">
        {/* Main Layout */}
        <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={
              <span className="font-semibold">
                {contact.name}
                {contact.isPrimary && (
                  <Badge variant="default" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                    主要
                  </Badge>
                )}
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  {t("common.edit", "编辑")}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  分享
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />复制链接</DropdownMenuItem>
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出联系人</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />删除</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                  {t("common.delete", "删除")}
                </Button>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Enhanced Contact Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header with Avatar */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-white shadow-md">
                    <AvatarFallback className="bg-blue-500 text-white text-xl font-bold">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-slate-900 truncate">{contact.name}</h2>
                      {contact.isPrimary && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building className="w-4 h-4" />
                      <span className="text-sm truncate">{customer?.name || contact.customerName || "未填写客户"}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-500">{contact.position || "无职位"}</span>
                      {contact.gender && <GenderBadge gender={contact.gender} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Info Cards */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Decision Role */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">决策角色</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {contact.decisionRole || "-"}
                    </div>
                  </div>

                  {/* Job Level */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">职级</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {contact.jobLevel || "-"}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">联系方式</h4>
                  <div className="space-y-2">
                    {contact.mobile && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{contact.mobile}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.wechat && (
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{contact.wechat}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setEditModalOpen(true)}>
                      <Edit className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">编辑</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleCall}>
                      <Phone className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">拨打电话</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleEmail}>
                      <Mail className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">发送邮件</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleViewCustomer}>
                      <Building className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">查看客户</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Related Customer */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={contactsExpanded} onOpenChange={setContactsExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">关联客户</span>
                        <Badge variant="secondary" className="text-xs">{relatedCustomerItem.length}</Badge>
                      </div>
                      {contactsExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="divide-y divide-slate-100">
                        {relatedCustomerItem.map((item) => (
                          <div
                            key={item.id}
                            onClick={item.onClick}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors overflow-hidden"
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                                  {(item.title || "C").charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-medium text-sm text-slate-900 truncate flex-1">
                                    {item.title || "未知"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                    <Phone className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                    <Mail className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {relatedCustomerItem.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无关联客户
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Related Activities */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={activitiesExpanded} onOpenChange={setActivitiesExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-slate-900">相关活动</span>
                        <Badge variant="secondary" className="text-xs">0</Badge>
                      </div>
                      {activitiesExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="p-4 text-center text-sm text-slate-500">
                        暂无活动记录
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </>
        }
      >
        <DetailTabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          className="h-full"
        />
      </DetailLayout>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="编辑联系人"
        width={700}
      >
        <ContactPersonForm
          mode="edit"
          initialValues={contact as Partial<ContactPersonFormValues>}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
          loading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="确认删除"
        content={`删除后数据将无法恢复，确定要删除联系人"${contact.name}"吗？`}
        okType="danger"
        okText="删除"
        onOk={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />
    </>
  )
}

export default ContactPersonDetail
