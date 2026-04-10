/**
 * Privacy Policy Page - 隐私政策
 * Features: Data protection, Privacy rights
 */

import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Shield,
  ArrowLeft,
  Calendar,
  Lock,
  Eye,
  Database,
  Share2,
  UserX,
  Cookie,
  Globe,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  Info,
} from 'lucide-react'

// ============================================================
// Privacy Sections
// ============================================================
interface PrivacySection {
  id: string
  title: string
  icon: React.ReactNode
  description?: string
  items: { title: string; description: string; details?: string[] }[]
}

const privacySections: PrivacySection[] = [
  {
    id: 'collect',
    title: '我们收集的信息',
    icon: <Database className="h-5 w-5" />,
    items: [
      {
        title: '账户信息',
        description: '注册时您提供的基本信息',
        details: ['企业名称、联系人姓名', '电子邮箱、电话号码', '企业地址、所属行业'],
      },
      {
        title: '业务数据',
        description: '您在使用系统时录入的数据',
        details: ['客户信息、联系人数据', '商机、合同、订单数据', '活动记录、沟通记录'],
      },
      {
        title: '使用数据',
        description: '系统自动收集的使用信息',
        details: ['登录时间、访问页面', '操作日志、功能使用频率', '设备类型、浏览器类型'],
      },
    ],
  },
  {
    id: 'use',
    title: '信息使用方式',
    icon: <Eye className="h-5 w-5" />,
    items: [
      {
        title: '提供核心服务',
        description: '使用您的数据为您提供CRM系统功能服务。',
      },
      {
        title: '改进服务质量',
        description: '分析使用数据以优化系统功能和用户体验。',
      },
      {
        title: '发送通知',
        description: '发送系统更新、账户提醒等服务通知。',
      },
      {
        title: '安全保障',
        description: '检测异常登录、防止欺诈行为，保护账户安全。',
      },
    ],
  },
  {
    id: 'protect',
    title: '信息保护措施',
    icon: <Lock className="h-5 w-5" />,
    items: [
      {
        title: '数据加密',
        description: '所有敏感数据采用AES-256加密存储，传输使用SSL/TLS加密。',
      },
      {
        title: '访问控制',
        description: '严格的权限管理体系，员工只能访问必要数据。',
      },
      {
        title: '安全审计',
        description: '记录所有数据访问操作，定期审计安全日志。',
      },
      {
        title: '备份恢复',
        description: '每日自动备份，支持快速灾难恢复。',
      },
    ],
  },
  {
    id: 'share',
    title: '信息共享',
    icon: <Share2 className="h-5 w-5" />,
    items: [
      {
        title: '不会出售数据',
        description: '我们绝不会将您的个人数据出售给第三方。',
      },
      {
        title: '服务提供商',
        description: '仅与必要的服务提供商（如云服务器、支付平台）共享，且受保密协议约束。',
      },
      {
        title: '法律要求',
        description: '仅在法律法规要求或响应合法司法请求时共享。',
      },
      {
        title: '企业授权',
        description: '经您授权后，可向您的合作伙伴共享指定数据。',
      },
    ],
  },
  {
    id: 'rights',
    title: '您的隐私权利',
    icon: <CheckCircle className="h-5 w-5" />,
    items: [
      {
        title: '访问权',
        description: '您可以随时查看我们持有的关于您的个人信息。',
      },
      {
        title: '更正权',
        description: '您可以请求更正不准确或不完整的个人信息。',
      },
      {
        title: '删除权',
        description: '您可以请求删除您的个人信息（在法律允许范围内）。',
      },
      {
        title: '导出权',
        description: '您可以导出您存储在系统中的所有数据。',
      },
      {
        title: '撤回同意',
        description: '您可以撤回之前给予的隐私相关同意授权。',
      },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookie 使用',
    icon: <Cookie className="h-5 w-5" />,
    items: [
      {
        title: '必要性Cookie',
        description: '用于系统正常运行，如登录状态保持、安全验证。',
      },
      {
        title: '功能性Cookie',
        description: '用于记住您的偏好设置，如语言、界面主题。',
      },
      {
        title: '分析性Cookie',
        description: '用于统计分析使用情况，帮助我们改进服务。',
      },
    ],
  },
  {
    id: 'children',
    title: '未成年人保护',
    icon: <AlertTriangle className="h-5 w-5" />,
    items: [
      {
        title: '年龄限制',
        description: '本系统仅面向18岁及以上用户提供服务。',
      },
      {
        title: '监护人责任',
        description: '如发现未成年人使用，我们将通知监护人并限制访问。',
      },
    ],
  },
  {
    id: 'global',
    title: '跨境数据传输',
    icon: <Globe className="h-5 w-5" />,
    items: [
      {
        title: '数据存储',
        description: '默认情况下，您的数据存储在中国境内的服务器。',
      },
      {
        title: '跨境传输',
        description: '如需跨境传输数据，我们将确保符合相关法规并获得您的授权。',
      },
    ],
  },
  {
    id: 'delete',
    title: '数据删除与注销',
    icon: <UserX className="h-5 w-5" />,
    items: [
      {
        title: '账户注销',
        description: '您可以在设置页面申请注销账户。',
      },
      {
        title: '数据处理',
        description: '注销后，我们将在90天内彻底删除您的个人数据。',
      },
      {
        title: '业务数据',
        description: '业务数据（如客户、订单）可导出后由您自行决定是否删除。',
      },
    ],
  },
]

// ============================================================
// Privacy Page Component
// ============================================================
export function Privacy() {
  const navigate = useNavigate()
  const [expandedSection, setExpandedSection] = useState<string | null>('collect')

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">隐私政策</h1>
            <p className="text-muted-foreground">我们如何收集、使用和保护您的信息</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              更新: 2026-01-01
            </Badge>
            <Badge>生效版本</Badge>
          </div>
        </div>

        {/* Summary */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">我们高度重视您的隐私</p>
                <p className="text-sm text-muted-foreground">
                  本政策详细说明我们如何收集、使用、存储和保护您的个人信息，以及您拥有的隐私权利。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Points */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">数据加密存储</span>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-800">透明使用政策</span>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-800">用户可控权限</span>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-4">
          {privacySections.map(section => (
            <Card
              key={section.id}
              className={expandedSection === section.id ? 'border-primary/50' : ''}
            >
              <CardHeader
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {section.icon}
                    </div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    expandedSection === section.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </CardHeader>
              
              {expandedSection === section.id && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  
                  <div className="space-y-3">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium mb-1">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.details && (
                          <ul className="mt-2 space-y-1">
                            {item.details.map((detail, dIdx) => (
                              <li key={dIdx} className="text-xs text-muted-foreground flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">隐私问题联系</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              如有任何隐私相关问题或投诉，请联系我们的隐私保护团队：
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline">隐私邮箱: privacy@smartcrm.com</Badge>
              <Badge variant="outline">客服电话: 400-888-9999</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/terms')}>
            服务条款
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/about')}>
            关于我们
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Privacy