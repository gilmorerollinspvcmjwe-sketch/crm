"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Shield, Key, Smartphone, Monitor, MapPin, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FormGrid,
  FormActions,
  FormField,
  FormProvider,
} from "@/components/form"
import {
  securitySettingsSchema,
  type SecuritySettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useSecuritySettings,
  useChangePassword,
  useEnableTwoFactor,
  useDisableTwoFactor,
  useTerminateSession,
} from "@/hooks/api/useSettings"

// ============ SecuritySettings Page ============

export function SecuritySettingsPage() {
  const { data: security, isLoading } = useSecuritySettings()
  const changePassword = useChangePassword()
  const enableTwoFactor = useEnableTwoFactor()
  const disableTwoFactor = useDisableTwoFactor()
  const terminateSession = useTerminateSession()

  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const passwordForm = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  })

  const handlePasswordSubmit = async (values: SecuritySettingsFormValues) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      passwordForm.reset()
      setShowPasswordForm(false)
      console.log("Password changed successfully")
    } catch (error) {
      console.error("Failed to change password:", error)
    }
  }

  const handleEnable2FA = async () => {
    try {
      const result = await enableTwoFactor.mutateAsync()
      console.log("2FA enabled:", result)
    } catch (error) {
      console.error("Failed to enable 2FA:", error)
    }
  }

  const handleDisable2FA = async () => {
    try {
      await disableTwoFactor.mutateAsync()
      console.log("2FA disabled")
    } catch (error) {
      console.error("Failed to disable 2FA:", error)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession.mutateAsync(sessionId)
      console.log("Session terminated:", sessionId)
    } catch (error) {
      console.error("Failed to terminate session:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">安全设置</h1>
          <p className="text-muted-foreground">管理您的账户安全和登录设置</p>
        </div>
      </div>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            密码管理
          </CardTitle>
          <CardDescription>
            上次修改密码：{security?.lastPasswordChange || "未知"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              修改密码
            </Button>
          ) : (
            <FormProvider form={passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormGrid cols={1}>
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  label="当前密码"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="请输入当前密码"
                      error={!!passwordForm.formState.errors.currentPassword}
                    />
                  )}
                </FormField>

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  label="新密码"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="请输入新密码（至少8位，包含大小写字母和数字）"
                      error={!!passwordForm.formState.errors.newPassword}
                    />
                  )}
                </FormField>

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  label="确认新密码"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="请再次输入新密码"
                      error={!!passwordForm.formState.errors.confirmPassword}
                    />
                  )}
                </FormField>
              </FormGrid>

              <FormActions>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    passwordForm.reset()
                    setShowPasswordForm(false)
                  }}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting || changePassword.isPending}
                >
                  {changePassword.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    "确认修改"
                  )}
                </Button>
              </FormActions>
            </form>
            </FormProvider>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            双因素认证
          </CardTitle>
          <CardDescription>
            启用双因素认证以提高账户安全性
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={security?.twoFactorEnabled ? "default" : "secondary"}>
                {security?.twoFactorEnabled ? "已启用" : "未启用"}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {security?.twoFactorEnabled
                  ? "您的账户已启用双因素认证"
                  : "建议启用双因素认证以增强账户安全"}
              </p>
            </div>
            <Button
              variant={security?.twoFactorEnabled ? "destructive" : "default"}
              onClick={security?.twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
              disabled={enableTwoFactor.isPending || disableTwoFactor.isPending}
            >
              {enableTwoFactor.isPending || disableTwoFactor.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {security?.twoFactorEnabled ? "禁用" : "启用"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            登录会话
          </CardTitle>
          <CardDescription>
            查看和管理您的活跃登录会话
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {security?.sessions?.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="font-medium">{session.device}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {session.location || "未知位置"}
                      <span>·</span>
                      最后活跃：{session.lastActive}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session.id)}
                  disabled={terminateSession.isPending}
                >
                  <LogOut className="mr-2 h-3 w-3" />
                  注销
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecuritySettingsPage