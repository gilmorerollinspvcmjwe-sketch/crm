/**
 * 线索重复检测工具
 * 检测维度：手机、邮箱、公司
 */

import { Lead } from '@/types';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicates: Lead[];
  matchType: 'phone' | 'email' | 'company' | 'multiple';
  message: string;
}

/**
 * 检查线索是否重复
 * @param phone 手机号
 * @param email 邮箱
 * @param company 公司
 * @param existingLeads 现有线索列表
 * @param currentId 当前编辑的线索 ID（排除自身）
 */
export const checkDuplicateLead = (
  phone: string,
  email: string,
  company: string,
  existingLeads: Lead[],
  currentId?: string
): DuplicateCheckResult => {
  const duplicates: Lead[] = [];
  const matchTypes: Set<'phone' | 'email' | 'company'> = new Set();

  // 过滤掉当前正在编辑的线索
  const otherLeads = currentId 
    ? existingLeads.filter(lead => lead.id !== currentId)
    : existingLeads;

  // 检查重复
  for (const lead of otherLeads) {
    let isMatch = false;
    
    // 手机号匹配（模糊匹配，去掉空格和特殊字符）
    if (phone) {
      const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
      const normalizedLeadPhone = (lead.phone || '').replace(/[\s\-\(\)]/g, '');
      if (normalizedLeadPhone && normalizedLeadPhone === normalizedPhone) {
        isMatch = true;
        matchTypes.add('phone');
      }
    }

    // 邮箱匹配（忽略大小写）
    if (email && !isMatch) {
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedLeadEmail = (lead.email || '').toLowerCase().trim();
      if (normalizedLeadEmail && normalizedLeadEmail === normalizedEmail) {
        isMatch = true;
        matchTypes.add('email');
      }
    }

    // 公司匹配（模糊匹配，包含关键词）
    if (company && !isMatch) {
      const normalizedCompany = company.toLowerCase().trim();
      const normalizedLeadCompany = (lead.company || '').toLowerCase().trim();
      if (normalizedLeadCompany && 
          (normalizedLeadCompany.includes(normalizedCompany) || 
           normalizedCompany.includes(normalizedLeadCompany))) {
        isMatch = true;
        matchTypes.add('company');
      }
    }

    if (isMatch) {
      duplicates.push(lead);
    }
  }

  const isDuplicate = duplicates.length > 0;
  
  let matchType: 'phone' | 'email' | 'company' | 'multiple' = 'phone';
  if (matchTypes.size > 1) {
    matchType = 'multiple';
  } else if (matchTypes.has('phone')) {
    matchType = 'phone';
  } else if (matchTypes.has('email')) {
    matchType = 'email';
  } else if (matchTypes.has('company')) {
    matchType = 'company';
  }

  let message = '';
  if (isDuplicate) {
    const typeText = {
      phone: '手机号',
      email: '邮箱',
      company: '公司名称',
      multiple: '多个信息',
    }[matchType];
    
    message = `发现 ${duplicates.length} 条重复线索（${typeText}重复）`;
  }

  return {
    isDuplicate,
    duplicates,
    matchType,
    message,
  };
};

/**
 * 获取重复检测的提示信息
 */
export const getDuplicateMessage = (result: DuplicateCheckResult): string => {
  if (!result.isDuplicate) {
    return '未检测到重复线索';
  }

  const typeIcons: Record<DuplicateCheckResult['matchType'], string> = {
    phone: '📱',
    email: '📧',
    company: '🏢',
    multiple: '⚠️',
  };

  return `${typeIcons[result.matchType]} ${result.message}`;
};