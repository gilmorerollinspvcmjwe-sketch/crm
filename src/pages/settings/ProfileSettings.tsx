"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, User, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
  FormProvider,
} from "@/components/form"
import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from "@/schemas/settingsSchema"
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/api/useSettings"

// ============ ProfileSettings Page ============

export function ProfileSettingsPage() {
  const { data: profile, isLoading } = useProfileSettings()
  const updateProfile = useUpdateProfileSettings()

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      username: "",
      displayName: "",
      email: "",
      phone: "",
      avatar: "",
      position: "",
      department: "",
      bio: "",
    },
    mode: "onBlur",
  })

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        displayName: profile.displayName || "",
        email: profile.email,
        phone: profile.phone || "",
        avatar: profile.avatar || "",
        position: profile.position || "",
        department: profile.department || "",
        bio: profile.bio || "",
      })
    }
  }, [profile, form])

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (values: ProfileSettingsFormValues) => {
    try {
      await updateProfile.mutateAsync(values)
      // Show success message (would use toast in real app)
      console.log("Profile updated successfully")
    } catch (error) {
      console.error("Failed to update profile:", error)
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
    <FormProvider form={form}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">个人资料</h1>
            <p className="text-muted-foreground">管理您的个人信息和账户设置</p>
          </div>
        </div>

        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle>头像设置</CardTitle>
            <CardDescription>上传您的个人头像或使用默认头像</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Button variant="outline">上传头像</Button>
                <p className="text-xs text-muted-foreground">
                  支持 JPG、PNG 格式，最大 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>更新您的个人基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="账户信息">
              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="username"
                  label="用户名"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入用户名"
                      error={!!errors.username}
                      disabled
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="displayName"
                  label="显示名称"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入显示名称"
                      error={!!errors.displayName}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="email"
                  label="邮箱"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="请输入邮箱地址"
                      error={!!errors.email}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="phone"
                  label="手机号"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      placeholder="请输入手机号码"
                      error={!!errors.phone}
                    />
                  )}
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="工作信息">
              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="position"
                  label="职位"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入职位"
                      error={!!errors.position}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="department"
                  label="部门"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入部门"
                      error={!!errors.department}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="bio"
                  label="个人简介"
                  containerClassName="col-span-2"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入个人简介"
                      error={!!errors.bio}
                    />
                  )}
                </FormField>
              </FormGrid>
            </FormSection>

            <FormActions>
              <Button
                type="submit"
                disabled={isSubmitting || updateProfile.isPending}
              >
                {isSubmitting || updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存更改
                  </>
                )}
              </Button>
            </FormActions>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
}

export default ProfileSettingsPage