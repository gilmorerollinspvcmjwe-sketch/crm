/**
 * 营销活动详情页面包装器
 * Campaign Detail Page Wrapper
 * 
 * 从路由参数中获取 campaignId 并传递给 CampaignDetailPage
 */

import { useParams, useNavigate } from 'react-router-dom'
import { CampaignDetailPage } from './CampaignDetail'

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  if (!id) {
    return <div>活动 ID 不存在</div>
  }
  
  return (
    <CampaignDetailPage 
      campaignId={id} 
      onBack={() => navigate('/marketing/campaigns')}
    />
  )
}