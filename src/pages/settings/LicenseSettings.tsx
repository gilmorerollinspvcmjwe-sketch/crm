"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, FileCheck, Save, Key, Calendar, Users, CheckCircle, XCircle, AlertCircle, Star, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  licenseSettingsSchema,
  type LicenseSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useLicenseSettings,
  useUpdateLicenseSettings,
  useValidateLicense,
} from "@/hooks/api/useSettings"

// ============ LicenseSettings Page ============

export function LicenseSettingsPage() {
  const { data: license, isLoading } = useLicenseSettings()
  const updateLicense = useUpdateLicenseSettings()
  const validateLicense = useValidateLicense()

  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const form = useForm<LicenseSettingsFormValues>({
    resolver: zodResolver(licenseSettingsSchema),
    defaultValues: {
      licenseKey: "",
      companyName: "",
      contactEmail: "",
    },
    mode: "onBlur",
  })

  const handleUpdate = async (values: LicenseSettingsFormValues) => {
    try {
      await updateLicense.mutateAsync(values)
      setShowUpdateModal(false)
      form.reset()
      console.log("License updated successfully")
    } catch (error) {
      console.error("Failed to update license:", error)
    }
  }

  const handleValidate = async () => {
    if (!license?.licenseKey) return
    try {
      const result = await validateLicense.mutateAsync(license.licenseKey)
      console.log("Validation result:", result)
    } catch (error) {
      console.error("Failed to validate license:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const statusConfig = {
    valid: { icon: CheckCircle, color: "text-green-500", label: "有效", badge: "default" },
    expired: { icon: XCircle, color: "text-red-500", label: "已过期", badge: "destructive" },
    invalid: { icon: AlertCircle, color: "text-yellow-500", label: "无效", badge: "secondary" },
  }

  const currentStatus = license?.status || "invalid"
  const statusInfo = statusConfig[currentStatus]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileCheck className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">许可证管理</h1>
          <p className="text-muted-foreground">查看和管理系统许可证</p>
        </div>
      </div>

      {/* License Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            许可证状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">状态</p>
              <div className="flex items-center gap-2 mt-1">
                <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
                <Badge variant={statusInfo.badge as any}>{statusInfo.label}</Badge>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">当前用户数</p>
              <p className="text-lg font-semibold">{license?.currentUsers || 0} / {license?.maxUsers || "无限制"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">过期日期</p>
              <p className="text-lg font-semibold">{license?.expiryDate || "永久"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">版本类型</p>
              <Badge variant="default">专业版</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            许可证详情
          </CardTitle>
          <CardDescription>查看当前许可证的详细信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormSection title="基本信息">
            <FormGrid cols={2}>
              <div className="space-y-2">
                <Label>许可证密钥</Label>
                <div className="p-3 rounded-lg border bg-muted/30 font-mono text-sm">
                  {license?.licenseKey ? `${license.licenseKey.slice(0, 20)}...` : "未设置"}
                </div>
              </div>

              <div className="space-y-2">
                <Label>授权公司</Label>
                <p className="text-base">{license?.companyName || "未设置"}</p>
              </div>

              <div className="space-y-2">
                <Label>联系邮箱</Label>
                <p className="text-base">{license?.contactEmail || "未设置"}</p>
              </div>

              <div className="space-y-2">
                <Label>用户数限制</Label>
                <p className="text-base">{license?.maxUsers || "无限制"}</p>
              </div>
            </FormGrid>
          </FormSection>

          <FormSection title="授权功能">
            <div className="grid grid-cols-3 gap-4">
              {license?.features?.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30"
                >
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </FormSection>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              许可证密钥是系统正常运行的关键，请确保在过期前更新许可证
            </AlertDescription>
          </Alert>

          <FormActions>
            <Button
              onClick={handleValidate}
              disabled={validateLicense.isPending}
            >
              {validateLicense.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  验证中...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  验证许可证
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(true)}
            >
              <Key className="mr-2 h-4 w-4" />
              更新许可证
            </Button>
          </FormActions>
        </CardContent>
      </Card>

      {/* User Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            用户使用情况
          </CardTitle>
          <CardDescription>查看许可证用户数使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">当前用户数</span>
              <span className="font-semibold">{license?.currentUsers || 0}</span>
            </div>
            <div className="h-4 rounded-full bg-muted">
              <div
                className="h-4 rounded-full bg-primary transition-all"
                style={{
                  width: license?.maxUsers
                    ? `${((license?.currentUsers || 0) / license.maxUsers) * 100}%`
                    : "25%",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>已使用</span>
              <span>
                {license?.maxUsers
                  ? `${Math.round(((license?.currentUsers || 0) / license.maxUsers) * 100)}%`
                  : "未知"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiry Warning */}
      {license?.expiryDate && new Date(license.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            许可证将在 30 天内过期，请及时更新许可证以确保系统正常运行
          </AlertDescription>
        </Alert>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <Card>
          <CardHeader>
            <CardTitle>更新许可证</CardTitle>
            <CardDescription>输入新的许可证密钥</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="licenseKey"
                label="许可证密钥"
                required
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="CRM-PRO-XXXXX-XXXXX-XXXXX"
                  />
                )}
              </FormField>

              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="companyName"
                  label="公司名称"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="公司名称"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="contactEmail"
                  label="联系邮箱"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="联系邮箱"
                    />
                  )}
                </FormField>
              </FormGrid>

              <FormActions>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUpdateModal(false)}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={updateLicense.isPending}
                >
                  {updateLicense.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      更新中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      确认更新
                    </>
                  )}
                </Button>
              </FormActions>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LicenseSettingsPage