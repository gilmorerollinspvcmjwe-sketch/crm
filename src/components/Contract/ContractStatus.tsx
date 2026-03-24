import React from 'react';
import { Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { ContractStatus } from '../../types/contract';

// 合同状态标签属性
interface ContractStatusProps {
  // 合同状态
  status: ContractStatus;
  // 是否显示提示
  showTooltip?: boolean;
}

// 状态颜色配置
const STATUS_COLORS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: 'default',
  [ContractStatus.PENDING_APPROVAL]: 'processing',
  [ContractStatus.ACTIVE]: 'success',
  [ContractStatus.ARCHIVED]: 'blue',
  [ContractStatus.TERMINATED]: 'red'
};

// 状态图标
const STATUS_ICONS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: '📝',
  [ContractStatus.PENDING_APPROVAL]: '⏳',
  [ContractStatus.ACTIVE]: '✅',
  [ContractStatus.ARCHIVED]: '🗄️',
  [ContractStatus.TERMINATED]: '❌'
};

/**
 * 合同状态标签组件
 * 展示不同状态的合同标签
 */
export const ContractStatusTag: React.FC<ContractStatusProps> = ({
  status,
  showTooltip = true
}) => {
  const { t } = useTranslation();

  // 获取状态文本
  const getStatusText = (status: ContractStatus) => {
    const statusMap: Record<ContractStatus, string> = {
      [ContractStatus.DRAFT]: t('contract.status.draft'),
      [ContractStatus.PENDING_APPROVAL]: t('contract.status.pendingApproval'),
      [ContractStatus.ACTIVE]: t('contract.status.active'),
      [ContractStatus.ARCHIVED]: t('contract.status.archived'),
      [ContractStatus.TERMINATED]: t('contract.status.terminated')
    };
    return statusMap[status] || status;
  };

  // 获取状态描述
  const getStatusDescription = (status: ContractStatus) => {
    const descMap: Record<ContractStatus, string> = {
      [ContractStatus.DRAFT]: t('contract.status.draft') + '，可以编辑和修改',
      [ContractStatus.PENDING_APPROVAL]: '已提交审批，等待审批结果',
      [ContractStatus.ACTIVE]: '已生效，合同正在执行中',
      [ContractStatus.ARCHIVED]: '已归档，合同执行完毕',
      [ContractStatus.TERMINATED]: '已终止，合同提前结束'
    };
    return descMap[status] || '';
  };

  const tag = (
    <Tag color={STATUS_COLORS[status]}>
      {getStatusText(status)}
    </Tag>
  );

  if (showTooltip) {
    return (
      <Tooltip title={getStatusDescription(status)}>
        {tag}
      </Tooltip>
    );
  }

  return tag;
};

export default ContractStatusTag;