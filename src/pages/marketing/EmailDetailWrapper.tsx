/**
 * 邮件详情页面包装器
 * Email Detail Page Wrapper
 * 
 * 从路由参数中获取 emailId 并传递给 EmailDetailPage
 */

import { useParams, useNavigate } from 'react-router-dom'
import { EmailDetailPage } from './EmailDetail'

export default function EmailDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  if (!id) {
    return <div>邮件 ID 不存在</div>
  }
  
  return (
    <EmailDetailPage 
      emailId={id} 
      onBack={() => navigate('/marketing/email-templates')}
    />
  )
}