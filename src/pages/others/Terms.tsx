/**
 * Terms of Service Page - 服务条款
 * Features: Legal terms, Usage policy
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  FileText,
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Scale,
  Shield,
  Users,
  DollarSign,
  Gavel,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'

// ============================================================
// Terms Content Sections
// ============================================================
interface TermSection {
  id: string
  title: string
  icon: React.ReactNode
  content?: string[]
  items?: { title: string; description: string }[]
}

const termsSections: TermSection[] = [
  {
    id: 'overview',
    title: '服务概述',
    icon: <FileText className="h-5 w-5" />,
    content: [
      '智慧CRM（以下简称"本系统"）是由智慧CRM团队开发和运营的客户关系管理服务平台。',
      '本服务条款（以下简称"本条款"）是您与智慧CRM之间关于使用本系统服务的法律协议。',
      '在使用本系统服务前，请您仔细阅读并充分理解本条款的全部内容。',
    ],
  },
  {
    id: 'account',
    title: '账户与注册',
    icon: <Users className="h-5 w-5" />,
    items: [
      { title: '账户注册', description: '您需要提供真实、准确的信息完成账户注册，并对账户安全负责。' },
      { title: '账户使用', description: '一个企业仅可注册一个账户，不得将账户转让或出租给第三方使用。' },
      { title: '账户安全', description: '您应妥善保管账户密码，如发现账户被盗用，应立即通知我们。' },
    ],
  },
  {
    id: 'usage',
    title: '使用规范',
    icon: <CheckCircle className="h-5 w-5" />,
    items: [
      { title: '合法使用', description: '您承诺遵守相关法律法规，不利用本系统从事违法活动。' },
      { title: '数据安全', description: '您应确保存储的客户数据合法合规，不侵犯他人隐私权。' },
      { title: '禁止行为', description: '禁止破解、反向工程本系统，或干扰系统正常运行。' },
      { title: '合理使用', description: '不得滥用系统资源，影响其他用户的正常使用体验。' },
    ],
  },
  {
    id: 'payment',
    title: '费用与支付',
    icon: <DollarSign className="h-5 w-5" />,
    items: [
      { title: '收费标准', description: '本系统提供多种套餐方案，具体费用详见价格页面。' },
      { title: '支付方式', description: '支持在线支付、银行转账等多种支付方式。' },
      { title: '退款政策', description: '付费后7天内可申请全额退款，超过7天按实际使用时间计算。' },
      { title: '续费说明', description: '订阅到期前7天会发送续费提醒，到期后数据保留30天。' },
    ],
  },
  {
    id: 'data',
    title: '数据与隐私',
    icon: <Shield className="h-5 w-5" />,
    items: [
      { title: '数据归属', description: '您存储在本系统的数据归您所有，我们不会擅自使用或转让。' },
      { title: '数据安全', description: '我们采用行业标准加密技术保护您的数据安全。' },
      { title: '数据导出', description: '您可随时导出自己的数据，导出格式支持Excel、CSV等。' },
      { title: '数据删除', description: '账户注销后，我们将在90天内彻底删除您的所有数据。' },
    ],
  },
  {
    id: 'rights',
    title: '权利与责任',
    icon: <Scale className="h-5 w-5" />,
    items: [
      { title: '服务保障', description: '我们承诺99.9%的系统可用性，因故障造成的损失按约定补偿。' },
      { title: '功能更新', description: '我们有权对系统功能进行更新、调整，但会提前通知用户。' },
      { title: '用户责任', description: '因用户违规使用造成的损失，用户需承担相应责任。' },
      { title: '免责条款', description: '因不可抗力导致的损失，我们不承担责任。' },
    ],
  },
  {
    id: 'termination',
    title: '服务终止',
    icon: <RefreshCw className="h-5 w-5" />,
    items: [
      { title: '用户终止', description: '您可随时申请终止服务并注销账户。' },
      { title: '系统终止', description: '严重违规用户，我们有权终止其服务并保留追责权利。' },
      { title: '数据处理', description: '服务终止后，我们将按规定处理您的数据。' },
    ],
  },
  {
    id: 'legal',
    title: '法律条款',
    icon: <Gavel className="h-5 w-5" />,
    content: [
      '本条款的解释及争议解决均适用中华人民共和国法律。',
      '如本条款任何条款被认定为无效，不影响其他条款的效力。',
      '我们有权根据业务发展需要修改本条款，修改后将在官网公布。',
      '如有争议，双方应友好协商解决；协商不成的，可向我们所在地法院提起诉讼。',
    ],
  },
]

// ============================================================
// Terms Page Component
// ============================================================
export function Terms() {
  const navigate = useNavigate()
  const [expandedSection, setExpandedSection] = React.useState<string | null>('overview')

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
            <h1 className="text-2xl font-bold tracking-tight">服务条款</h1>
            <p className="text-muted-foreground">使用本系统的法律协议</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              更新: 2026-01-01
            </Badge>
            <Badge>生效版本</Badge>
          </div>
        </div>

        {/* Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <p className="text-yellow-800">
              请在使用本系统服务前仔细阅读本条款的全部内容。如您不同意本条款的任何内容，请立即停止使用本系统服务。
            </p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-4">
          {termsSections.map(section => (
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
                  
                  {/* Content paragraphs */}
                  {section.content && (
                    <div className="space-y-2">
                      {section.content.map((text, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                          {text}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {/* Item list */}
                  {section.items && (
                    <div className="space-y-3">
                      {section.items.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-muted/50">
                          <p className="font-medium mb-1">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Agreement */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm">
                继续使用本系统服务即表示您已阅读、理解并同意接受本服务条款的约束。
              </p>
            </div>
            <Separator className="mb-4" />
            <p className="text-xs text-muted-foreground">
              如有任何疑问，请联系我们的客服团队或发送邮件至 legal@smartcrm.com。
            </p>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/privacy')}>
            隐私政策
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

export default Terms