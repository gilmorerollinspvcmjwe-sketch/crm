/**
 * About Page - 关于页面
 * Features: Product info, Team, Contact, Version
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Info,
  ArrowLeft,
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Target,
  Heart,
  Award,
  Rocket,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react'

// ============================================================
// Mock Company Data
// ============================================================
const companyInfo = {
  name: '智慧CRM',
  version: 'v2.1.0',
  releaseDate: '2026-04-03',
  description: '新一代智能客户关系管理系统，融合AI技术，助力企业数字化转型。',
  mission: '让每一家企业都能拥有智能化的客户管理能力',
  website: 'https://www.smartcrm.com',
  email: 'contact@smartcrm.com',
  phone: '400-888-9999',
  address: '北京市海淀区中关村科技园区',
}

const teamMembers = [
  { name: '张明', role: '创始人 & CEO', avatar: '👨‍💼' },
  { name: '李芳', role: '产品总监', avatar: '👩‍💻' },
  { name: '王磊', role: '技术总监', avatar: '👨‍🔬' },
  { name: '陈静', role: '设计总监', avatar: '👩‍🎨' },
  { name: '赵伟', role: '运营总监', avatar: '👨‍📊' },
]

const achievements = [
  { icon: <Users className="h-6 w-6" />, value: '10,000+', label: '企业用户' },
  { icon: <Target className="h-6 w-6" />, value: '50万+', label: '活跃客户' },
  { icon: <Award className="h-6 w-6" />, value: '99.9%', label: '系统稳定性' },
  { icon: <Heart className="h-6 w-6" />, value: '4.8', label: '用户评分' },
]

const features = [
  { icon: <Zap className="h-5 w-5" />, title: 'AI智能', description: '内置AI助手，智能分析客户行为' },
  { icon: <Shield className="h-6 w-6" />, title: '安全可靠', description: '数据加密存储，多重安全保障' },
  { icon: <Rocket className="h-6 w-6" />, title: '快速部署', description: '云端托管，分钟级上线' },
]

// ============================================================
// About Page Component
// ============================================================
export function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">关于我们</h1>
            <p className="text-muted-foreground">了解产品与团队</p>
          </div>
        </div>

        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-primary/20">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{companyInfo.name}</h2>
                  <Badge>{companyInfo.version}</Badge>
                </div>
                <p className="text-muted-foreground">{companyInfo.description}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  发布日期: {companyInfo.releaseDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              我们的使命
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{companyInfo.mission}</p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map(item => (
            <Card key={item.label}>
              <CardContent className="pt-4 text-center">
                <div className="p-2 rounded-lg bg-primary/10 mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>核心特性</CardTitle>
            <CardDescription>我们的产品优势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {features.map(f => (
                <div key={f.title} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-primary">{f.icon}</div>
                    <span className="font-medium">{f.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              核心团队
            </CardTitle>
            <CardDescription>专业的产品与技术团队</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {teamMembers.map(member => (
                <div key={member.name} className="text-center">
                  <div className="text-4xl mb-2">{member.avatar}</div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>联系方式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">官方网站</p>
                  <a href={companyInfo.website} className="text-primary hover:underline">
                    {companyInfo.website}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">联系邮箱</p>
                  <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline">
                    {companyInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">客服电话</p>
                  <p>{companyInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">公司地址</p>
                  <p>{companyInfo.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/terms')}>
            服务条款
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/privacy')}>
            隐私政策
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/changelog')}>
            更新日志
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Copyright */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025-2026 {companyInfo.name}. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default About