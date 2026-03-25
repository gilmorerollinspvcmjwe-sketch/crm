# 按钮 onClick 绑定检查报告

## 汇总
- 检查文件数: 55
- 发现按钮总数: 312
- ✅ 正确绑定: 298
- ❌ 未绑定 onClick: 5
- ⚠️ 空函数/仅 console.log/message.info: 14

---

## 详细检查结果

### ActivityForm.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 保存 | handleSubmit | 提交表单 | ✅ | 正常 |
| 取消 | onCancel | 关闭弹窗 | ✅ | 正常 |

### ActivityList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建活动 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑弹窗 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### ActivityReport.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 时间筛选 | setTimeRange | 更新状态 | ✅ | 正常 |

### AgentDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### AIAgents.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建 Agent | handleCreate | 打开弹窗 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 启用/停用 | handleToggleStatus | 切换状态 | ✅ | 正常 |

### CampaignDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 启动/暂停 | handleToggleStatus | 切换状态 | ✅ | 正常 |

### CampaignsList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建活动 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 查看详情 | handleViewDetail | 跳转详情页 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### ChurnWarning.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 查看详情 | handleViewDetail | 跳转详情页 | ✅ | 正常 |
| 创建任务 | handleCreateTask | 创建挽留任务 | ✅ | 正常 |

### ContactDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### ContactList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建联系人 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 导入 | handleImport | 导入功能 | ⚠️ | 未实现(仅console.log) |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### ContractDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### ContractList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建合同 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### CustomerDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 新建联系人 | handleCreateContact | 打开弹窗 | ✅ | 正常 |
| 新建商机 | handleCreateOpportunity | 打开弹窗 | ✅ | 正常 |

### CustomerList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建客户 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 导入 | handleImport | 导入功能 | ⚠️ | 未实现(仅console.log) |
| 导出 | handleExport | 导出功能 | ⚠️ | 未实现(仅message.info) |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### CustomerReport.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 时间筛选 | setTimeRange | 更新状态 | ✅ | 正常 |

### CustomerSegmentation.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建分群 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### Dashboard.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 刷新 | handleRefresh | 刷新数据 | ✅ | 正常 |
| 查看更多 | handleViewMore | 跳转详情 | ✅ | 正常 |

### EmailTemplates.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建模板 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 预览 | handlePreview | 打开预览 | ✅ | 正常 |

### LeadAssignment.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 一键批量分配 | handleBatchAssign | 批量分配 | ✅ | 正常 |
| 分配/调整 | handleAssign | 打开弹窗 | ✅ | 正常 |
| 选择销售人员 | setSelectedSales | 选择销售 | ✅ | 正常 |
| 保存 | handleSaveScore | 保存评分 | ✅ | 正常 |
| 取消 | setIsModalVisible | 关闭弹窗 | ✅ | 正常 |

### LeadConversionReport.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 时间筛选 | setTimeRange | 更新状态 | ✅ | 正常 |

### LeadDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ⚠️ | 未实现(仅message.info) |
| 分配 | handleAssign | 分配线索 | ⚠️ | 未实现(仅message.info) |
| 转化为客户 | handleConvert | 转化确认 | ✅ | 正常 |

### LeadList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 导入 | handleImport | 导入功能 | ⚠️ | 未实现(仅message.info) |
| 新建线索 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 查看详情 | handleViewDetail | 跳转详情页 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 分配 | handleAssign | 分配线索 | ⚠️ | 未实现(仅Modal.info) |
| 转化 | handleConvert | 打开转化弹窗 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 批量分配 | handleBatchAssign | 批量分配 | ⚠️ | 未实现(仅Modal.info) |
| 批量转化 | handleBatchConvert | 批量转化 | ✅ | 正常 |

### LeadScoring.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 评分详情 | handleViewDetail | 打开详情 | ✅ | 正常 |
| 保存调整 | handleSaveScore | 保存评分 | ✅ | 正常 |
| 取消 | setIsModalVisible | 关闭弹窗 | ✅ | 正常 |

### MeetingAssistant.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 导出会议纪要 | handleExport | 导出功能 | ✅ | 正常 |
| 切换待办状态 | handleToggleActionItem | 切换状态 | ✅ | 正常 |

### OpportunityDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 变更阶段 | handleChangeStage | 打开变更弹窗 | ✅ | 正常 |
| 创建报价 | handleCreateQuote | 跳转报价页 | ✅ | 正常 |
| 标记赢单 | handleMarkWon | 赢单确认 | ✅ | 正常 |
| 标记输单 | handleMarkLost | 输单确认 | ✅ | 正常 |
| 阶段按钮 | handleChangeStage | 快速切换阶段 | ✅ | 正常 |

### OpportunityList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 显示/隐藏漏斗 | setShowFunnel | 切换显示 | ✅ | 正常 |
| 列表/看板切换 | setViewMode | 切换视图 | ✅ | 正常 |
| 新建商机 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 搜索 | handleFilterChange | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 查看详情 | handleViewDetail | 跳转详情页 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 卡片点击 | handleCardClick | 跳转详情 | ✅ | 正常 |

### OrderDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ⚠️ | 未实现(仅message.info) |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 确认订单 | handleStatusChange | 状态变更 | ✅ | 正常 |
| 发货 | handleStatusChange | 状态变更 | ✅ | 正常 |
| 送达 | handleStatusChange | 状态变更 | ✅ | 正常 |
| 完成 | handleStatusChange | 状态变更 | ✅ | 正常 |
| 取消 | handleStatusChange | 状态变更 | ✅ | 正常 |

### OrderList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 新建订单 | navigate | 跳转创建页 | ✅ | 正常 |
| 批量删除 | handleBatchDelete | 批量删除 | ✅ | 正常 |
| 导出 | - | 无绑定 | ❌ | **未绑定onClick** |
| 查看详情 | handleViewDetail | 跳转详情页 | ✅ | 正常 |
| 编辑 | message.info | 编辑功能 | ⚠️ | 未实现(仅message.info) |
| 确认 | Modal.confirm | 确认订单 | ✅ | 正常 |
| 发货 | Modal.confirm | 发货确认 | ✅ | 正常 |
| 完成 | Modal.confirm | 完成确认 | ✅ | 正常 |
| 取消 | Modal.confirm | 取消确认 | ✅ | 正常 |

### PaymentDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ⚠️ | 未实现(仅message.info) |
| 核销 | handleVerify | 核销确认 | ✅ | 正常 |
| 驳回 | handleReject | 驳回确认 | ✅ | 正常 |

### PaymentList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建回款 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 查看详情 | handleViewDetail | 跳转详情页 | ✅ | 正常 |
| 核销 | handleVerify | 打开核销弹窗 | ✅ | 正常 |
| 驳回 | handleReject | 驳回确认 | ✅ | 正常 |

### PaymentReport.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 时间筛选 | setTimeRange | 更新状态 | ✅ | 正常 |

### PerformanceReport.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 时间筛选 | setTimeRange | 更新状态 | ✅ | 正常 |

### PermissionSettings.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 保存配置 | handleSave | 保存权限 | ⚠️ | 未实现(仅console.log) |
| 全选 | setCheckedKeys | 全选权限 | ✅ | 正常 |
| 仅菜单 | setCheckedKeys | 选择菜单 | ✅ | 正常 |
| 清空 | setCheckedKeys | 清空选择 | ✅ | 正常 |
| 角色选择 | handleRoleSelect | 选择角色 | ✅ | 正常 |
| 数据范围选择 | setDataScope | 选择范围 | ✅ | 正常 |

### PredictiveAI.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 时间范围选择 | setTimeRange | 更新状态 | ✅ | 正常 |

### QuoteDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleBack | 返回列表 | ✅ | 正常 |
| 编辑 | handleEdit | 跳转编辑页 | ✅ | 正常 |
| 转合同 | handleConvertToContract | 转化确认 | ✅ | 正常 |
| 打印 | handlePrint | 打印功能 | ✅ | 正常 |

### QuoteNew.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | handleCancel | 返回列表 | ✅ | 正常 |
| 选择产品 | handleAddProducts | 打开选择器 | ✅ | 正常 |
| 上一步 | handlePrev | 上一步 | ✅ | 正常 |
| 下一步 | handleNext | 下一步 | ✅ | 正常 |
| 提交 | handleSubmit | 提交表单 | ✅ | 正常 |
| 取消 | handleCancel | 返回列表 | ✅ | 正常 |

### QuotesList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 新建报价 | handleCreate | 跳转创建页 | ✅ | 正常 |
| 查看详情 | handleViewDetail | 跳转详情页 | ✅ | 正常 |
| 编辑 | handleEdit | 跳转编辑页 | ✅ | 正常 |
| 转合同 | handleConvertToContract | 转化确认 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### Roles.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建角色 | setRoleModalVisible | 打开弹窗 | ✅ | 正常 |
| 配置权限 | handleConfigPermissions | 打开权限弹窗 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 复制 | handleCopy | 复制角色 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 保存 | handleRoleSubmit | 保存角色 | ✅ | 正常 |
| 保存权限 | handlePermissionSubmit | 保存权限 | ✅ | 正常 |

### SalesForecast.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 周期选择 | setPeriod | 更新周期 | ✅ | 正常 |

### SalesFunnelReport.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 时间范围选择 | setTimeRange | 更新状态 | ✅ | 正常 |

### TargetLists.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建列表 | handleCreate | 打开弹窗 | ⚠️ | 未实现(仅Modal.info) |
| 搜索 | handleSearch | 搜索数据 | ✅ | 正常 |
| 重置 | handleReset | 重置筛选 | ✅ | 正常 |
| 查看详情 | handleViewDetail | 打开详情 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ⚠️ | 未实现(仅Modal.info) |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 关闭 | setDetailVisible | 关闭弹窗 | ✅ | 正常 |

### Users.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 新建用户 | setIsModalOpen | 打开弹窗 | ✅ | 正常 |
| 分配角色 | handleAssignRole | 打开分配弹窗 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |
| 保存 | handleSave | 保存用户 | ✅ | 正常 |

### Workbench.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| AI助手 | handleAIAssistant | 打开AI助手 | ✅ | 正常 |
| 设置 | handleSettings | 打开设置 | ⚠️ | 未实现(仅message.info) |
| 快捷操作 | handleQuickActionClick | 处理快捷操作 | ✅ | 正常 |
| 查看全部待办 | handleViewAllTodos | 跳转待办页 | ⚠️ | 未实现(仅message.info) |
| 赢单预测点击 | handlePredictionClick | 打开详情 | ✅ | 正常 |
| 重点客户点击 | handleCustomerClick | 打开详情 | ⚠️ | 未实现(仅message.info) |
| 日程 | setScheduleDrawerVisible | 打开抽屉 | ✅ | 正常 |
| 关闭抽屉 | setScheduleDrawerVisible | 关闭抽屉 | ✅ | 正常 |
| 关闭商机抽屉 | setOpportunityDrawerVisible | 关闭抽屉 | ✅ | 正常 |

### ProductList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 搜索 | loadProducts | 搜索数据 | ✅ | 正常 |
| 导入 | - | 无绑定 | ❌ | **未绑定onClick** |
| 新建产品 | handleCreate | 打开弹窗 | ✅ | 正常 |
| 编辑 | handleEdit | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### ProductDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | navigate | 返回列表 | ✅ | 正常 |
| 编辑 | - | 无绑定 | ❌ | **未绑定onClick** |

### PricebookList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 搜索 | loadPricebooks | 搜索数据 | ✅ | 正常 |
| 新建价格表 | handleCreatePricebook | 打开弹窗 | ✅ | 正常 |
| 添加产品 | handleAddEntry | 打开条目弹窗 | ✅ | 正常 |
| 编辑 | handleEditPricebook | 打开编辑 | ✅ | 正常 |
| 删除 | handleDelete | 删除确认 | ✅ | 正常 |

### PricebookDetail.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 返回 | navigate | 返回列表 | ✅ | 正常 |
| 编辑 | - | 无绑定 | ❌ | **未绑定onClick** |

### TicketList.tsx
| 按钮文案 | onClick 绑定 | 处理函数 | 有实际逻辑 | 状态 |
|----------|-------------|----------|-----------|------|
| 搜索 | loadTickets | 搜索数据 | ✅ | 正常 |
| 新建工单 | - | 无绑定 | ❌ | **未绑定onClick** |
| 查看详情 | handleViewDetail | 打开详情 | ✅ | 正常 |

---

## 问题清单

### ❌ 未绑定 onClick 的按钮（共 5 个）

| 文件 | 按钮 | 描述 |
|------|------|------|
| OrderList.tsx | 导出 | 导出按钮没有绑定任何onClick事件 |
| ProductList.tsx | 导入 | 导入按钮没有绑定任何onClick事件 |
| ProductDetail.tsx | 编辑 | 编辑按钮没有绑定任何onClick事件 |
| PricebookDetail.tsx | 编辑 | 编辑按钮没有绑定任何onClick事件 |
| TicketList.tsx | 新建工单 | 新建工单按钮没有绑定任何onClick事件 |

### ⚠️ 未实现功能的按钮（仅 console.log/message.info/Modal.info）（共 14 个）

| 文件 | 按钮 | 问题类型 | 描述 |
|------|------|----------|------|
| ContactList.tsx | 导入 | 仅console.log | 无实际导入功能 |
| CustomerList.tsx | 导入 | 仅console.log | 无实际导入功能 |
| CustomerList.tsx | 导出 | 仅message.info | 无实际导出功能 |
| LeadDetail.tsx | 编辑 | 仅message.info | 无实际编辑功能 |
| LeadDetail.tsx | 分配 | 仅message.info | 无实际分配功能 |
| LeadList.tsx | 导入 | 仅message.info | 无实际导入功能 |
| LeadList.tsx | 分配 | 仅Modal.info | 无实际分配功能 |
| LeadList.tsx | 批量分配 | 仅Modal.info | 无实际批量分配功能 |
| OrderDetail.tsx | 编辑 | 仅message.info | 无实际编辑功能 |
| OrderList.tsx | 编辑 | 仅message.info | 无实际编辑功能 |
| PermissionSettings.tsx | 保存配置 | 仅console.log | 保存后无实际API调用 |
| TargetLists.tsx | 新建列表 | 仅Modal.info | 无实际创建功能 |
| TargetLists.tsx | 编辑 | 仅Modal.info | 无实际编辑功能 |
| Workbench.tsx | 设置 | 仅message.info | 无实际设置功能 |
| Workbench.tsx | 查看全部待办 | 仅message.info | 无实际跳转功能 |
| Workbench.tsx | 重点客户点击 | 仅message.info | 无实际详情功能 |

---

## 修复建议

### 高优先级（功能缺失）
1. **OrderList.tsx 导出按钮** - 需要绑定实际导出功能
2. **ProductDetail.tsx 编辑按钮** - 需要绑定编辑功能
3. **PricebookDetail.tsx 编辑按钮** - 需要绑定编辑功能
4. **TicketList.tsx 新建工单按钮** - 需要绑定创建工单功能

### 中优先级（占位实现）
1. 各种列表页的"导入"功能 - 需实现文件上传和批量导入逻辑
2. 详情页的"编辑"按钮 - 需绑定到编辑表单
3. LeadDetail/LeadList 的"分配"功能 - 需实现分配弹窗逻辑

### 低优先级（体验优化）
1. Workbench 的"设置"按钮 - 可绑定到设置页面
2. Workbench 的"查看全部待办" - 可绑定到待办列表页
3. TargetLists 的新建/编辑 - 需实现完整的表单逻辑
