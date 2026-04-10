# Phase 4: 弹窗和导航组件 — API 文档

> 迁移自 Ant Design 5.x → shadcn/ui + Tailwind CSS  
> 项目路径：`C:\Users\13609\Projects\crm-ui-upgrade`

---

## 📁 组件目录

| 组件目录 | Ant Design 原始组件 | shadcn/ui 底层 | 状态 |
|---------|-------------------|---------------|------|
| `modal/` | Modal | Dialog | ✅ |
| `drawer/` | Drawer | Sheet | ✅ |
| `dropdown/` | Dropdown | DropdownMenu | ✅ |
| `tooltip/` | Tooltip | Tooltip | ✅ |
| `popconfirm/` | Popconfirm | Popover | ✅ |
| `tabs/` | Tabs | Tabs | ✅ |
| `collapse/` | Collapse | Accordion | ✅ |
| `timeline/` | Timeline | **自定义** | ✅ |
| `steps/` | Steps | **自定义** | ✅ |

---

## 1. Modal / Dialog 组件

**文件**: `src/components/modal/Dialog.tsx`

### API

```tsx
import { Modal } from "@/components/modal"

// 基础用法
<Modal
  open={open}
  onOpenChange={setOpen}
  title="确认删除"
  description="此操作不可撤销"
  onOk={() => handleDelete()}
  onCancel={() => setOpen(false)}
  okText="删除"
  cancelText="取消"
  width={480}
  confirmLoading={loading}
>
  <p>确定要删除这条记录吗？</p>
</Modal>
```

### Modal.confirm() 静态方法

```tsx
// Modal.confirm()
Modal.confirm({
  title: "确认删除",
  content: "此操作不可撤销",
  okText: "删除",
  cancelText: "取消",
  okType: "danger",
  onOk: () => handleDelete(),
})

// Modal.info()
Modal.info({
  title: "提示",
  content: "操作成功",
})

// Modal.success()
Modal.success({
  title: "成功",
  content: "数据已保存",
})

// Modal.error()
Modal.error({
  title: "错误",
  content: "保存失败，请重试",
})

// Modal.warning()
Modal.warning({
  title: "警告",
  content: "磁盘空间不足",
})
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `open` | `boolean` | — | 对话框可见性 |
| `onOpenChange` | `(open: boolean) => void` | — | 可见性变化回调 |
| `title` | `ReactNode` | — | 标题 |
| `description` | `ReactNode` | — | 描述文字 |
| `footer` | `ReactNode` | — | 自定义底部（默认有取消/确认按钮） |
| `width` | `number \| string` | `520` | 宽度 |
| `okText` | `ReactNode` | `"确定"` | 确认按钮文字 |
| `cancelText` | `ReactNode` | `"取消"` | 取消按钮文字 |
| `onOk` | `() => void` | — | 确认回调 |
| `onCancel` | `() => void` | — | 取消回调 |
| `confirmLoading` | `boolean` | `false` | 确认按钮 Loading |
| `maskClosable` | `boolean` | `true` | 点击遮罩关闭 |
| `closable` | `boolean` | `true` | 显示关闭按钮 |
| `contentClassName` | `string` | — | 内容区 className |
| `okButtonProps` | `ButtonProps` | — | 确认按钮额外 props |
| `cancelButtonProps` | `ButtonProps` | — | 取消按钮额外 props |

---

## 2. Drawer 组件

**文件**: `src/components/drawer/Sheet.tsx`

### API

```tsx
import { Drawer } from "@/components/drawer"

// 右侧抽屉
<Drawer
  open={open}
  onOpenChange={setOpen}
  title="编辑详情"
  placement="right"
  width={600}
  onOk={() => handleSave()}
>
  <Form />
</Drawer>

// 左侧抽屉
<Drawer open={open} placement="left" width={400}>
  <Sidebar />
</Drawer>

// 底部抽屉
<Drawer open={open} placement="bottom" height={400}>
  <Content />
</Drawer>

// 带 footer
<Drawer
  open={open}
  title="确认"
  footer={
    <>
      <Button onClick={() => setOpen(false)}>取消</Button>
      <Button variant="primary" onClick={handleOk}>确定</Button>
    </>
  }
>
  <Content />
</Drawer>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `open` | `boolean` | — | 可见性 |
| `onOpenChange` | `(open: boolean) => void` | — | 变化回调 |
| `title` | `ReactNode` | — | 标题 |
| `description` | `ReactNode` | — | 描述 |
| `placement` | `"left" \| "right" \| "top" \| "bottom"` | `"right"` | 弹出位置 |
| `width` | `number \| string` | — | 宽度（左右） |
| `height` | `number \| string` | — | 高度（上下） |
| `footer` | `ReactNode` | — | 自定义底部 |
| `maskClosable` | `boolean` | `true` | 点击遮罩关闭 |
| `closable` | `boolean` | `true` | 显示关闭按钮 |
| `okText` / `cancelText` | `ReactNode` | — | 快捷 footer 按钮文字 |
| `onOk` / `onCancel` | `() => void` | — | 快捷 footer 回调 |
| `confirmLoading` | `boolean` | `false` | 确认 Loading |
| `destroyOnClose` | `boolean` | `false` | 关闭时销毁内容 |
| `zIndex` | `number` | — | z-index |

---

## 3. DropdownMenu 组件

**文件**: `src/components/dropdown/DropdownMenu.tsx`

### API

```tsx
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/dropdown"

<DropdownMenu
  trigger={<Button>操作</Button>}
  align="end"
  onOpenChange={setOpen}
>
  <DropdownMenuItem icon={<EditIcon />} onClick={() => handleEdit()}>
    编辑
  </DropdownMenuItem>
  <DropdownMenuItem icon={<CopyIcon />} onClick={() => handleCopy()}>
    复制
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem danger icon={<TrashIcon />} onClick={() => handleDelete()}>
    删除
  </DropdownMenuItem>
</DropdownMenu>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `trigger` | `ReactNode` | — | 触发器 |
| `children` | `ReactNode` | — | 菜单内容 |
| `align` | `"start" \| "center" \| "end"` | `"end"` | 对齐方式 |
| `disabled` | `boolean` | `false` | 禁用 |
| `open` | `boolean` | — | 受控展开状态 |
| `onOpenChange` | `(open: boolean) => void` | — | 变化回调 |
| `sideOffset` | `number` | `4` | 偏移量 |

### DropdownMenuItem Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `danger` | `boolean` | `false` | 危险操作样式（红色） |
| `inset` | `boolean` | `false` | 左缩进（配合 label） |
| 其他 | `DropdownMenuPrimitive.Item` | — | Radix 原生 props |

---

## 4. Tooltip 组件

**文件**: `src/components/tooltip/Tooltip.tsx`

### API

```tsx
import { Tooltip, TooltipWrapper } from "@/components/tooltip"

// 基础用法
<Tooltip content="保存当前编辑">
  <Button icon={<SaveIcon />}>保存</Button>
</Tooltip>

// 受控
<Tooltip content="提示文字" placement="top" open={isOpen} onOpenChange={setIsOpen}>
  <Button>hover</Button>
</Tooltip>

// 包裹多个 Tooltip（需在外层使用 TooltipWrapper）
<TooltipWrapper>
  <Tooltip content="编辑"><IconButton icon={<Edit />} /></Tooltip>
  <Tooltip content="删除"><IconButton icon={<Trash />} /></Tooltip>
  <Tooltip content="导出"><IconButton icon={<Export />} /></Tooltip>
</TooltipWrapper>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `content` | `ReactNode` | — | 提示内容 |
| `children` | `ReactNode` | — | 触发器 |
| `placement` | `TooltipPlacement` | `"top"` | 位置 |
| `sideOffset` | `number` | `4` | 偏移量 |
| `mouseEnterDelay` | `number` | `0` | 显示延迟（秒） |
| `mouseLeaveDelay` | `number` | `0` | 隐藏延迟（秒） |
| `disabled` | `boolean` | `false` | 禁用 |
| `open` | `boolean` | — | 受控状态 |
| `onOpenChange` | `(open: boolean) => void` | — | 变化回调 |

---

## 5. ConfirmPopover 组件

**文件**: `src/components/popconfirm/ConfirmPopover.tsx`

### API

```tsx
import { ConfirmPopover } from "@/components/popconfirm"

// 基础用法
<ConfirmPopover
  title="确认删除？"
  description="删除后将无法恢复"
  confirmText="删除"
  cancelText="取消"
  onConfirm={() => handleDelete()}
  placement="top"
>
  <Button danger>删除</Button>
</ConfirmPopover>

// 危险操作
<ConfirmPopover
  title="确认清空数据？"
  confirmType="danger"
  onConfirm={handleClear}
>
  <Button>清空</Button>
</ConfirmPopover>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `children` | `ReactNode` | — | 触发器 |
| `title` | `ReactNode` | — | 标题 |
| `description` | `ReactNode` | — | 描述 |
| `confirmText` | `ReactNode` | `"确定"` | 确认文字 |
| `cancelText` | `ReactNode` | `"取消"` | 取消文字 |
| `onConfirm` | `() => void \| Promise<void>` | — | 确认回调 |
| `onCancel` | `() => void` | — | 取消回调 |
| `confirmType` | `"primary" \| "danger" \| "default"` | `"primary"` | 确认按钮类型 |
| `placement` | `PopoverPlacement` | `"top"` | 弹出位置 |
| `trigger` | `"click" \| "hover" \| "focus"` | `"click"` | 触发方式 |
| `open` | `boolean` | — | 受控状态 |
| `onOpenChange` | `(open: boolean) => void` | — | 变化回调 |
| `disabled` | `boolean` | `false` | 禁用 |

---

## 6. Tabs 组件

**文件**: `src/components/tabs/Tabs.tsx`

### API

```tsx
import { Tabs, TabPane } from "@/components/tabs"

// 基础用法
<Tabs defaultActiveKey="1">
  <TabPane key="1" title="用户信息">内容1</TabPane>
  <TabPane key="2" title="安全设置">内容2</TabPane>
  <TabPane key="3" title="通知" disabled>内容3</TabPane>
</Tabs>

// 卡片类型
<Tabs type="card" activeKey={activeKey} onChange={setActiveKey}>
  <TabPane key="tab1" title="标签1">内容1</TabPane>
  <TabPane key="tab2" title="标签2">内容2</TabPane>
</Tabs>

// 垂直方向
<Tabs tabPosition="left">
  <TabPane key="1" title="概览">...</TabPane>
  <TabPane key="2" title="详情">...</TabPane>
</Tabs>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `activeKey` | `string` | — | 当前激活（受控） |
| `defaultActiveKey` | `string` | — | 默认激活 |
| `onChange` | `(key: string) => void` | — | 切换回调 |
| `type` | `"line" \| "card"` | `"line"` | 类型 |
| `tabPosition` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | 位置 |
| `children` | `TabPane[]` | — | Tab 面板 |
| `tabListClassName` | `string` | — | Tab 列表 className |
| `contentClassName` | `string` | — | 内容区 className |
| `animated` | `boolean` | `true` | 动画切换 |

### TabPane Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `key` | `string` | — | 唯一标识 |
| `title` | `ReactNode` | — | Tab 标题 |
| `children` | `ReactNode` | — | 内容 |
| `disabled` | `boolean` | `false` | 禁用 |
| `hidden` | `boolean` | `false` | 隐藏 |

---

## 7. Accordion / Collapse 组件

**文件**: `src/components/collapse/Accordion.tsx`

### API

```tsx
import { Accordion, AccordionPanel } from "@/components/collapse"

// 手风琴模式（只展开一个）
<Accordion accordion defaultActiveKey="1">
  <AccordionPanel key="1" title="基本信息">
    姓名、年龄、职业等
  </AccordionPanel>
  <AccordionPanel key="2" title="联系方式">
    电话、邮箱、地址等
  </AccordionPanel>
  <AccordionPanel key="3" title="更多信息" disabled>
    暂不可用
  </AccordionPanel>
</Accordion>

// 多选模式
<Accordion defaultActiveKey={["1", "2"]}>
  <AccordionPanel key="1" title="步骤一">内容</AccordionPanel>
  <AccordionPanel key="2" title="步骤二">内容</AccordionPanel>
</Accordion>

// 带图标
<Accordion>
  <AccordionPanel key="1" title="基础信息" icon={<InfoIcon />}>
    内容
  </AccordionPanel>
</Accordion>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `accordion` | `boolean` | `false` | 手风琴模式 |
| `activeKey` | `string \| string[]` | — | 当前展开（受控） |
| `defaultActiveKey` | `string \| string[]` | — | 默认展开 |
| `onChange` | `(key) => void` | — | 切换回调 |
| `bordered` | `boolean` | `true` | 显示边框 |
| `panelClassName` | `string` | — | 所有 Panel 的 className |
| `panelIcon` | `ReactNode` | — | 所有 Panel 的默认图标 |
| `children` | `AccordionPanel[]` | — | 面板内容 |

### AccordionPanel Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `key` | `string` | — | 唯一标识 |
| `title` | `ReactNode` | — | 面板标题 |
| `children` | `ReactNode` | — | 面板内容 |
| `disabled` | `boolean` | `false` | 禁用 |
| `icon` | `ReactNode` | — | 标题前图标 |

---

## 8. Timeline 组件

**文件**: `src/components/timeline/Timeline.tsx`

> shadcn/ui 无此组件，自定义实现

### API

```tsx
import { Timeline, TimelineItem } from "@/components/timeline"

// 基础用法
<Timeline>
  <TimelineItem label="2024-01-01">项目启动</TimelineItem>
  <TimelineItem label="2024-02-01" color="blue">需求确认</TimelineItem>
  <TimelineItem label="2024-03-01" color="green">开发完成</TimelineItem>
  <TimelineItem label="2024-04-01" color="red">上线发布</TimelineItem>
</Timeline>

// 自定义图标
<Timeline>
  <TimelineItem
    label="今天"
    dot={<Icon.Check className="h-3 w-3 text-white" />}
  >
    任务完成
  </TimelineItem>
</Timeline>

// 交替对齐
<Timeline mode="alternate">
  <TimelineItem label="左侧">左侧内容</TimelineItem>
  <TimelineItem label="右侧">右侧内容</TimelineItem>
</Timeline>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `mode` | `"left" \| "right" \| "alternate"` | `"left"` | 对齐方式 |
| `children` | `TimelineItem[]` | — | 时间项 |
| `dotSize` | `"sm" \| "md" \| "lg"` | `"md"` | 节点大小 |
| `lineColored` | `boolean` | `false` | 连接线使用节点颜色 |
| `itemClassName` | `string` | — | 所有项的 className |

### TimelineItem Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `label` | `ReactNode` | — | 时间标签 |
| `children` | `ReactNode` | — | 内容 |
| `color` | `TimelineItemColor` | `"default"` | 颜色 |
| `dot` | `ReactNode` | — | 自定义图标（覆盖 color） |
| `dotSize` | `"sm" \| "md" \| "lg"` | `"md"` | 节点大小 |
| `className` | `string` | — | className |
| `contentClassName` | `string` | — | 内容区 className |
| `lineColored` | `boolean` | `false` | 连接线使用 color |

### TimelineItemColor

```ts
type TimelineItemColor = "default" | "blue" | "green" | "red" | "yellow" | "purple" | "gray"
```

---

## 9. Steps 组件

**文件**: `src/components/steps/Steps.tsx`

### API

```tsx
import { Steps, StepsStep } from "@/components/steps"

// 基础用法
<Steps current={1} status="process">
  <Steps.Step title="填写信息" description="填写基本信息" />
  <Steps.Step title="确认" description="确认订单" />
  <Steps.Step title="完成" description="订单完成" />
</Steps>

// 可点击切换
<Steps current={current} onChange={setCurrent} clickable>
  <Steps.Step title="步骤1" />
  <Steps.Step title="步骤2" />
  <Steps.Step title="步骤3" />
</Steps>

// 垂直方向
<Steps direction="vertical" current={1}>
  <Steps.Step title="第一步" description="填写信息" />
  <Steps.Step title="第二步" description="审核" />
  <Steps.Step title="第三步" description="完成" />
</Steps>

// 错误状态
<Steps current={1} status="error">
  <Steps.Step title="完成" />
  <Steps.Step title="当前" />
  <Steps.Step title="待处理" />
</Steps>
```

### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `current` | `number` | `0` | 当前步骤（从 0 开始） |
| `status` | `StepsStatus` | `"process"` | 当前步骤状态 |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | 方向 |
| `onChange` | `(current: number) => void` | — | 点击切换回调 |
| `clickable` | `boolean` | `false` | 是否可点击切换 |
| `labelPlacement` | `"horizontal" \| "vertical"` | `"horizontal"` | 标签位置 |
| `children` | `StepsStep[]` | — | 步骤列表 |
| `size` | `"default" \| "small"` | `"default"` | 尺寸 |

### StepsStatus

```ts
type StepsStatus = "wait" | "process" | "finish" | "error"
```

### Steps.Step Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `title` | `ReactNode` | — | 标题 |
| `description` | `ReactNode` | — | 描述 |
| `icon` | `ReactNode` | — | 自定义图标 |
| `status` | `StepsStatus` | — | 状态（由 Steps 自动计算） |
| `disabled` | `boolean` | `false` | 禁用 |
| `subTitle` | `ReactNode` | — | 子标题 |
| `tail` | `ReactNode` | — | 尾部额外内容 |

---

## 🔄 迁移对照表

| Ant Design | shadcn/ui 替代 | 文件 |
|-----------|---------------|------|
| `<Modal />` | `<Modal />` | `src/components/modal/Dialog.tsx` |
| `Modal.confirm()` | `Modal.confirm()` | 同上 |
| `Modal.info()` | `Modal.info()` | 同上 |
| `<Drawer />` | `<Drawer />` | `src/components/drawer/Sheet.tsx` |
| `<Dropdown />` | `<DropdownMenu />` | `src/components/dropdown/DropdownMenu.tsx` |
| `<Tooltip />` | `<Tooltip />` | `src/components/tooltip/Tooltip.tsx` |
| `<Popconfirm />` | `<ConfirmPopover />` | `src/components/popconfirm/ConfirmPopover.tsx` |
| `<Tabs><TabPane /></Tabs>` | `<Tabs><TabPane /></Tabs>` | `src/components/tabs/Tabs.tsx` |
| `<Collapse><Panel /></Collapse>` | `<Accordion><AccordionPanel /></Accordion>` | `src/components/collapse/Accordion.tsx` |
| `<Timeline>` | `<Timeline>` | `src/components/timeline/Timeline.tsx` |
| `<Steps><Step /></Steps>` | `<Steps><Steps.Step /></Steps>` | `src/components/steps/Steps.tsx` |

---

## 📦 依赖安装

所有组件基于已安装的 shadcn/ui 组件：

```bash
# 确认已安装的 shadcn/ui 组件
npx shadcn@latest show
```

如果需要重新安装：
```bash
npx shadcn@latest add dialog sheet dropdown-menu tooltip popover accordion tabs -y
```

---

*Phase 4 完成时间：2026-04-03*
