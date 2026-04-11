"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Mail, Phone, User, Users, Lightbulb, Activity, Edit, Star, DollarSign, Clock3, Globe, Building2, MessageSquare, FileText, CheckCircle2, AlertTriangle, MoreHorizontal, Share2, Copy, Download, PhoneCall } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Modal, ConfirmDialog } from "@/components/modal/Dialog"
import { CustomerForm } from "@/forms/CustomerForm"
import { DataTable } from "@/components/DataTable"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Timeline, TimelineItem } from "@/components/timeline/Timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"
import { useCustomer, useUpdateCustomer, useDeleteCustomer } from "@/hooks/api/useCustomers"
import { useContactsByCustomer } from "@/hooks/api/useContacts"
import { useOpportunities } from "@/hooks/api/useOpportunities"
import type { CustomerStatus, Contact, Opportunity } from "@/types/api"
import type { CustomerFormValues } from "@/schemas"
import { cn } from "@/lib/utils"

const statusMap: Record<CustomerStatus, { variant: "info" | "success" | "warning" | "destructive"; note: string }> = {
  潜在: { variant: "info", note: "关系仍在建立阶段，需要确认关键人和需求。" },
  活跃: { variant: "success", note: "客户互动稳定，适合持续推进商机和合作深度。" },
  沉默: { variant: "warning", note: "最近缺少有效互动，建议尽快恢复触达。" },
  流失: { variant: "destructive", note: "客户关系正在衰减，需要挽回动作或重新评估。" },
}

const contactColumns: ColumnDef<Contact>[] = [
  { accessorKey: "type", header: "互动方式" },
  { accessorKey: "content", header: "内容摘要" },
  { accessorKey: "contactDate", header: "记录时间" },
  { accessorKey: "assignee", header: "负责人" },
]

const opportunityColumns: ColumnDef<Opportunity>[] = [
  { accessorKey: "name", header: "商机" },
  { accessorKey: "stage", header: "阶段" },
  { accessorKey: "amount", header: "金额" },
  { accessorKey: "probability", header: "概率" },
  { accessorKey: "expectedCloseDate", header: "预计成交" },
]

const formatShortDate = (value?: string) => {
  if (!value) return "暂无记录"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })
}

const money = (value: number) =>
  new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0)

const healthMeta = (score: number) => {
  if (score >= 80) return { label: "核心", variant: "success" as const, width: "100%" }
  if (score >= 60) return { label: "稳态", variant: "info" as const, width: "76%" }
  if (score >= 40) return { label: "观察", variant: "warning" as const, width: "54%" }
  return { label: "预警", variant: "destructive" as const, width: "30%" }
}

function SignalCard({ label, value, note, icon }: { label: string; value: string | number; note: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">{value}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-muted/60 text-foreground/78">{icon}</span>
      </div>
    </div>
  )
}

export function CustomerDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const { data: customer, isLoading } = useCustomer(id)
  const { data: contactsData } = useContactsByCustomer(id)
  const { data: opportunitiesData } = useOpportunities({ customerId: id })
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomer()

  const contacts = contactsData?.data || []
  const opportunities = opportunitiesData?.data?.filter((item) => item.customerId === id) || []
  const healthScore = customer?.score || 0
  const health = healthMeta(healthScore)
  const activeOpportunities = opportunities.filter((item) => item.stage !== "成交" && item.stage !== "失败")
  const totalOpportunityAmount = activeOpportunities.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  const timeline = React.useMemo(
    () => [
      { id: "1", color: "blue" as const, label: customer?.lastContact ? `${formatShortDate(customer.lastContact)} 最近触达` : "暂无最近触达", title: "客户关系状态", description: statusMap[customer?.status || "潜在"].note },
      { id: "2", color: "green" as const, label: `${contacts.length} 位联系人`, title: "关系网络", description: contacts.length > 0 ? "已建立联系人网络，可继续补齐决策链。" : "尚未沉淀关键联系人，建议优先补齐。", },
      { id: "3", color: "yellow" as const, label: `${activeOpportunities.length} 个活跃商机`, title: "业务机会", description: activeOpportunities.length > 0 ? "当前已有在跟进机会，适合围绕关键动作推进。" : "当前没有活跃商机，建议回到需求和关系建设。", },
    ],
    [customer?.lastContact, customer?.status, contacts.length, activeOpportunities.length]
  )

  const tasks = React.useMemo(
    () => [
      { id: "task-1", title: "确认下一次高价值触达", note: "围绕最近互动安排下一步动作" },
      { id: "task-2", title: "补齐关键联系人链路", note: "识别决策者、影响者和使用者" },
      { id: "task-3", title: "更新客户经营备注", note: "整理当前阶段、风险和合作窗口" },
    ],
    []
  )

  const handleEdit = async (values: CustomerFormValues) => {
    if (!customer) return
    try {
      await updateMutation.mutateAsync({ id, name: values.name, company: values.contactName || customer.company, email: values.contactEmail || customer.email, phone: values.contactPhone || customer.phone, status: customer.status, score: customer.score, assignee: customer.assignee })
      setEditModalOpen(false)
      toast({ title: t("customer.updateSuccess", "客户更新成功") })
    } catch (error) {
      console.error("更新失败:", error)
      toast({ title: t("customer.updateFailed", "更新失败"), variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      toast({ title: t("customer.deleteSuccess", "客户已删除") })
      navigate("/customers")
    } catch (error) {
      console.error("删除失败:", error)
      toast({ title: t("customer.deleteFailed", "删除失败"), variant: "destructive" })
    }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>
  if (!customer) return <div className="space-y-4"><Button variant="ghost" onClick={() => navigate("/customers")}><ArrowLeft className="mr-2 h-4 w-4" />返回列表</Button><div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-muted-foreground">客户不存在或已被删除</div></div>

  return (
    <div className="animate-in fade-in duration-300">
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={() => navigate("/customers")}
            backLabel="返回客户列表"
            breadcrumb={<span className="font-semibold text-foreground">{customer.name}</span>}
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => setActiveTab("activity")}><PhoneCall className="mr-2 h-4 w-4" />记录跟进</Button>
                <Button variant="outline" onClick={() => setEditModalOpen(true)}><Edit className="mr-2 h-4 w-4" />编辑客户</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" size="iconSm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Copy className="mr-2 h-4 w-4" />复制链接</DropdownMenuItem>
                    <DropdownMenuItem><Download className="mr-2 h-4 w-4" />导出客户</DropdownMenuItem>
                    <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" />分享档案</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)}>删除</Button>
              </div>
            }
          />
        }
        leftSidebar={
          <div className="space-y-4">
            <Card className="overflow-hidden border-border/70">
              <div className="border-b border-border/70 bg-muted/40 p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border border-border/70 shadow-[var(--shadow-sm)]">
                    <AvatarImage src={(customer as Customer & { avatarUrl?: string }).avatarUrl} alt={customer.name} />
                    <AvatarFallback className="bg-foreground text-background text-lg font-semibold">{customer.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-semibold tracking-[-0.03em]">{customer.name}</h2>
                      <Badge variant={statusMap[customer.status].variant}>{customer.status}</Badge>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="h-4 w-4" />{customer.company || "未填写公司"}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{statusMap[customer.status].note}</p>
                  </div>
                </div>
              </div>
              <CardContent className="space-y-4 p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">关系健康度</span>
                    <Badge variant={health.variant}>{health.label}</Badge>
                  </div>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-semibold tracking-[-0.03em]">{healthScore}</span>
                    <span className="mb-1 text-xs text-muted-foreground">/100</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/85" style={{ width: health.width }} /></div>
                </div>
                <div className="space-y-3 border-t border-border/70 pt-4 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground"><Mail className="mt-0.5 h-4 w-4" /><span className="break-all">{customer.email || "暂无邮箱"}</span></div>
                  <div className="flex items-start gap-2 text-muted-foreground"><Phone className="mt-0.5 h-4 w-4" /><span>{customer.phone || "暂无电话"}</span></div>
                  <div className="flex items-start gap-2 text-muted-foreground"><User className="mt-0.5 h-4 w-4" /><span>{customer.assignee || "未分配负责人"}</span></div>
                  {customer.website && <div className="flex items-start gap-2 text-muted-foreground"><Globe className="mt-0.5 h-4 w-4" /><a href={customer.website} target="_blank" rel="noreferrer" className="break-all text-primary hover:underline">{customer.website}</a></div>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start"><Lightbulb className="mr-2 h-4 w-4" />新建商机</Button>
                  <Button variant="outline" size="sm" className="justify-start"><MessageSquare className="mr-2 h-4 w-4" />记录备注</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        }
        rightSidebar={
          <div className="space-y-4">
            <Card className="border-border/70">
              <CardHeader className="pb-2"><h3 className="text-sm font-semibold">下一步动作</h3></CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task) => <div key={task.id} className="rounded-2xl border border-border/70 bg-muted/30 px-3 py-3"><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /><div><p className="text-sm font-medium">{task.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{task.note}</p></div></div></div>)}
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardHeader className="pb-2"><h3 className="text-sm font-semibold">关键联系人</h3></CardHeader>
              <CardContent className="space-y-3">
                {contacts.length > 0 ? contacts.slice(0, 4).map((contact) => <button key={contact.id} type="button" className="flex w-full items-start gap-3 rounded-2xl border border-transparent px-2 py-2 text-left hover:border-border/70 hover:bg-accent/45" onClick={() => navigate(`/contacts/${contact.id}`)}><div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-muted text-sm font-semibold text-foreground/78">{(contact.assignee || "C").charAt(0)}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{contact.assignee}</p><p className="mt-1 text-xs text-muted-foreground">{contact.type} · {formatShortDate(contact.contactDate)}</p></div></button>) : <div className="rounded-2xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">暂无联系人记录</div>}
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardHeader className="pb-2"><h3 className="text-sm font-semibold">风险提醒</h3></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/70 bg-muted/30 px-3 py-3"><div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-warning-foreground" /><div><p className="text-sm font-medium">{customer.status === "沉默" || customer.status === "流失" ? "需要恢复互动" : "关系仍然稳定"}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{customer.lastContact ? `最近一次互动在 ${formatShortDate(customer.lastContact)}。` : "当前没有已记录的互动。"} </p></div></div></div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
          <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-border/70 bg-transparent p-0 pb-3">
            <TabsTrigger value="overview" className="rounded-xl">关系概览</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl">最近互动</TabsTrigger>
            <TabsTrigger value="opportunities" className="rounded-xl">商机机会</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="m-0 flex-1 pt-6">
            <div className="space-y-6">
              <div className="grid gap-4 xl:grid-cols-3">
                <SignalCard label="活跃商机" value={activeOpportunities.length} note="当前仍在推进中的机会数量" icon={<Lightbulb className="h-4 w-4" />} />
                <SignalCard label="机会金额" value={money(totalOpportunityAmount)} note="活跃机会对应的当前金额总和" icon={<DollarSign className="h-4 w-4" />} />
                <SignalCard label="最近互动" value={formatShortDate(customer.lastContact)} note="衡量关系是否持续推进的关键时间点" icon={<Clock3 className="h-4 w-4" />} />
              </div>
              <Card className="border-border/70">
                <CardHeader className="border-b border-border/70"><h3 className="text-sm font-semibold">关系摘要</h3></CardHeader>
                <CardContent className="grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-3">
                    <p className="text-sm leading-7 text-foreground/86">{customer.description || "当前客户档案尚未沉淀完整经营描述，建议围绕行业背景、合作目标、关键关注点和当前阶段补齐经营备注。"}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3"><p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">客户行业</p><p className="mt-2 text-sm font-medium">{customer.industry || "未填写"}</p></div>
                      <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3"><p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">客户等级</p><p className="mt-2 text-sm font-medium">{customer.level || "未分层"}</p></div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">经营判断</p>
                    <div className="mt-4 space-y-4">
                      <div><p className="text-sm font-medium">当前关系阶段</p><p className="mt-1 text-sm text-muted-foreground">{statusMap[customer.status].note}</p></div>
                      <div><p className="text-sm font-medium">下一步重点</p><p className="mt-1 text-sm text-muted-foreground">{activeOpportunities.length > 0 ? "围绕现有商机推进关键动作和决策节点。" : "先恢复互动频率，再识别新的业务机会。"}</p></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/70">
                <CardHeader className="border-b border-border/70"><h3 className="text-sm font-semibold">关系时间线</h3></CardHeader>
                <CardContent className="p-5">
                  <Timeline>
                    {timeline.map((item) => <TimelineItem key={item.id} color={item.color} label={item.label} dot={<div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background"><Activity className="h-3.5 w-3.5" /></div>}><div><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></div></TimelineItem>)}
                  </Timeline>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="activity" className="m-0 flex-1 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">最近互动</h3><p className="mt-1 text-sm text-muted-foreground">把互动记录作为客户关系判断的一手依据。</p></div><Button><PhoneCall className="mr-2 h-4 w-4" />添加活动</Button></div>
              <DataTable columns={contactColumns} data={contacts} showPagination={false} showSearch={false} showDensityToggle={false} emptyText="暂无互动记录" className="rounded-[1.25rem] border-none" />
            </div>
          </TabsContent>
          <TabsContent value="opportunities" className="m-0 flex-1 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">商机机会</h3><p className="mt-1 text-sm text-muted-foreground">把客户关系与正在推进的业务机会放在同一视角中查看。</p></div><Button variant="outline"><FileText className="mr-2 h-4 w-4" />新建商机</Button></div>
              <DataTable columns={opportunityColumns} data={opportunities} showPagination={false} showSearch={false} showDensityToggle={false} emptyText="暂无商机" className="rounded-[1.25rem] border-none" />
            </div>
          </TabsContent>
        </Tabs>
      </DetailLayout>
      <Modal open={editModalOpen} onOpenChange={setEditModalOpen} title={t("customer.detail.editTitle", "编辑客户")} width={600}>
        <CustomerForm mode="edit" initialValues={{ name: customer.name, type: "enterprise", status: "active", contactName: customer.company, contactEmail: customer.email, contactPhone: customer.phone }} onSubmit={handleEdit} onCancel={() => setEditModalOpen(false)} loading={updateMutation.isPending} />
      </Modal>
      <ConfirmDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} title={t("customer.detail.deleteTitle", "确认删除")} content={t("customer.detail.deleteContent", `删除后数据将无法恢复，确定要删除客户「${customer.name}」吗？`)} okType="danger" okText={t("common.delete", "删除")} onOk={handleDelete} confirmLoading={deleteMutation.isPending} />
    </div>
  )
}

export default CustomerDetail
