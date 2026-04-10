"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft, Clock,
  Calendar, User, MessageSquare, Building, Activity, Mail, Phone
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { ContactForm } from "@/forms/ContactForm"

// Inline editable field component
import { InlineEditableField } from "@/components/InlineEditableField"

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"
import { InfoCard, type InfoField } from "@/components/DetailSidebar/InfoCard"
import { ActionButtons, type ActionButtonConfig } from "@/components/DetailSidebar/ActionButtons"
import { RelatedListCard, type RelatedItem } from "@/components/DetailSidebar/RelatedListCard"
import { DetailTabs, type DetailTabConfig } from "@/components/DetailContent/DetailTabs"

import {
  useContact,
  useUpdateContact,
  useDeleteContact,
} from "@/hooks/api/useContacts"
import { useCustomer } from "@/hooks/api/useCustomers"
import type { ContactType, Contact } from "@/types/api"
import type { ContactFormValues } from "@/schemas"
import { useToast } from "@/hooks/use-toast"

// ============ Contact Type Config ============

const typeConfig: Record<ContactType, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "电话": { label: "电话", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "邮件": { label: "邮件", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "微信": { label: "微信", className: "bg-emerald-100 text-emerald-800 border-emerald-200", variant: "success" },
  "短信": { label: "短信", className: "bg-yellow-100 text-yellow-800 border-yellow-200", variant: "warning" },
  "面谈": { label: "面谈", className: "bg-purple-100 text-purple-800 border-purple-200", variant: "default" },
  "其他": { label: "其他", className: "bg-gray-100 text-gray-800 border-gray-200", variant: "secondary" },
}

// ============ ContactDetail Page ============

export function ContactDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const params = useParams()
  const navigate = useNavigate()
  const contactId = params.id || ""

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")

  // API Hooks
  const { data: contact, isLoading, refetch } = useContact(contactId)
  const { data: customer } = useCustomer(contact?.customerId || null)
  const updateMutation = useUpdateContact()
  const deleteMutation = useDeleteContact()

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Contact, value: string) => {
    try {
      const parsedValue = field === 'duration' 
        ? Number(value) 
        : value
      
      await updateMutation.mutateAsync({
        id: contactId,
        [field]: parsedValue,
      })
      toast({
        title: t("contact.inlineEditSuccess", "已更新"),
        duration: 2000,
      })
      refetch()
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("contact.inlineEditFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  // Handlers
  const handleEdit = async (values: ContactFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: contactId,
        ...values,
      })
      setEditModalOpen(false)
      toast({
        title: t("contact.updateSuccess", "沟通记录更新成功"),
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("contact.updateFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(contactId)
      toast({
        title: t("contact.deleteSuccess", "沟通记录已删除"),
      })
      navigate("/contacts")
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: t("contact.deleteFailed", "删除失败"),
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back", "返回列表")}
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{t("contact.detail.notFound", "沟通记录不存在或已被删除")}</p>
          </div>
        </div>
      </div>
    )
  }

  // InfoCard fields with inline editing
  const infoFields: InfoField[] = [
    { 
      key: "type", 
      label: t("contact.detail.fields.type", "类型"), 
      value: contact.type, 
      type: "badge", 
      badgeVariant: typeConfig[contact.type]?.variant,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="select"
          options={[
            { label: "电话", value: "电话" },
            { label: "邮件", value: "邮件" },
            { label: "微信", value: "微信" },
            { label: "短信", value: "短信" },
            { label: "面谈", value: "面谈" },
            { label: "其他", value: "其他" },
          ]}
          onSave={(v: string) => handleInlineEdit("type", v)}
          placeholder="选择类型"
        />
      ),
    },
    { 
      key: "customer", 
      label: t("contact.detail.fields.customer", "关联客户"), 
      value: customer?.name || contact.customerName, 
      icon: <Building className="w-4 h-4" />,
      render: (_val: unknown) => (
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={handleViewCustomer}
        >
          {customer?.name || contact.customerName || t("common.unknown", "未知客户")}
        </Button>
      ),
    },
    { 
      key: "content", 
      label: t("contact.detail.fields.content", "联系人"), 
      value: contact.content, 
      icon: <User className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="text"
          placeholder="请输入联系人姓名"
          onSave={(v: string) => handleInlineEdit("content", v)}
          inputWidth={150}
        />
      ),
    },
    { 
      key: "contactDate", 
      label: t("contact.detail.fields.contactDate", "联系日期"), 
      value: contact.contactDate, 
      icon: <Calendar className="w-4 h-4" />,
      render: (val: unknown) => (
        <span className="text-muted-foreground">{val as string}</span>
      ),
    },
    { 
      key: "duration", 
      label: t("contact.detail.fields.duration", "时长"), 
      value: contact.duration, 
      icon: <Clock className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as number}
          type="number"
          min={0}
          placeholder="输入时长"
          onSave={(v: string) => handleInlineEdit("duration", v)}
          format={(v: string | number | null | undefined) => v ? `${v}分钟` : "-"}
        />
      ),
    },
    { 
      key: "assignee", 
      label: t("contact.detail.fields.assignee", "负责人"), 
      value: contact.assignee, 
      icon: <User className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="select"
          options={[
            { label: "李明", value: "李明" },
            { label: "王芳", value: "王芳" },
            { label: "陈静", value: "陈静" },
          ]}
          placeholder="请选择负责人"
          onSave={(v: string) => handleInlineEdit("assignee", v)}
        />
      ),
    },
    { 
      key: "createdAt", 
      label: t("contact.detail.fields.createdAt", "创建时间"), 
      value: contact.createdAt, 
      icon: <Calendar className="w-4 h-4" />,
      render: (val: unknown) => (
        <span className="text-muted-foreground">{val as string}</span>
      ),
    },
  ]

  // Action buttons
  const actionButtons: ActionButtonConfig[] = [
    { key: "edit", label: t("common.edit", "编辑"), onClick: () => setEditModalOpen(true) },
    { key: "separator", label: "" },
    { key: "delete", label: t("common.delete", "删除"), danger: true, onClick: () => setDeleteConfirmOpen(true) },
  ]

  // Tabs configuration
  const tabs: DetailTabConfig[] = [
    {
      key: "overview",
      label: t("contact.detail.tabs.overview", "概览"),
      icon: <MessageSquare className="w-4 h-4" />,
      content: (
        <div className="space-y-4 p-4">
          {/* Communication Content */}
          <div className="bg-muted/30 rounded-lg p-4 min-h-[200px]">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("contact.detail.content", "沟通内容")}
            </h3>
            <p className="text-sm whitespace-pre-wrap">{contact.content || t("common.noData", "暂无内容")}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {customer?.email && (
              <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${customer.email}`)}>
                <Mail className="mr-1 h-3 w-3" />
                {t("contact.detail.actions.sendEmail", "发送邮件")}
              </Button>
            )}
            {customer?.phone && (
              <Button variant="outline" size="sm" onClick={() => window.open(`tel:${customer.phone}`)}>
                <Phone className="mr-1 h-3 w-3" />
                {t("contact.detail.actions.call", "拨打电话")}
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "activity",
      label: t("contact.detail.tabs.activity", "活动"),
      icon: <Activity className="w-4 h-4" />,
      content: (
        <div className="bg-muted/30 rounded-lg p-4 min-h-[200px]">
          <p className="text-sm text-muted-foreground">{t("common.noData", "暂无活动记录")}</p>
        </div>
      ),
    },
  ]

  // Related items
  const relatedCustomerItem: RelatedItem[] = customer ? [{
    id: customer.id || "customer",
    title: customer.name || t("common.unknown", "未知客户"),
    subtitle: customer.company,
    onClick: handleViewCustomer,
    isPrimary: true,
  }] : []

  return (
    <>
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={
              <span className="font-semibold">
                {t("contact.detail.title", "沟通记录详情")}
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                  {t("common.edit", "编辑")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                  {t("common.delete", "删除")}
                </Button>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            <InfoCard
              name={t("contact.detail.title", "沟通记录")}
              subtitle={`${contact.customerName || t("common.unknown", "未知客户")} · ${contact.contactDate}`}
              headerBadges={[
                { label: contact.type, variant: typeConfig[contact.type]?.variant },
              ]}
              fields={infoFields}
              onEdit={() => setEditModalOpen(true)}
              editLabel={t("common.edit", "编辑")}
            />
            <ActionButtons buttons={actionButtons} />
          </>
        }
        rightSidebar={
          <>
            <RelatedListCard
              title={t("contact.detail.related.customer", "关联客户")}
              icon={<Building className="w-4 h-4" />}
              items={relatedCustomerItem}
              totalCount={relatedCustomerItem.length}
              emptyMessage={t("common.noData", "暂无关联客户")}
            />
            <RelatedListCard
              title={t("contact.detail.related.activities", "相关活动")}
              icon={<Activity className="w-4 h-4" />}
              items={[]}
              totalCount={0}
              emptyMessage={t("common.noData", "暂无活动记录")}
            />
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

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={t("contact.detail.editTitle", "编辑沟通记录")}
        width={600}
      >
        <ContactForm
          mode="edit"
          initialValues={contact as Partial<ContactFormValues>}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
          loading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("contact.detail.deleteTitle", "确认删除")}
        content={t("contact.detail.deleteContent", "删除后数据将无法恢复，确定要删除该沟通记录吗？")}
        okType="danger"
        okText={t("common.delete", "删除")}
        onOk={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />
    </>
  )
}

export default ContactDetail