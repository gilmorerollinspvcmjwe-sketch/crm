/**
 * 工作流状态管理
 * Workflow State Management using Zustand
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowExecutionLog,
  WorkflowVersion,
  TriggerConfig,
  WorkflowStatus,
} from '../types/workflow';
import {
  mockWorkflows,
  mockExecutionLogs,
  workflowTemplates,
} from '../mock/workflowData';

interface WorkflowsState {
  // 工作流列表
  workflows: Workflow[];
  
  // 执行日志
  executionLogs: WorkflowExecutionLog[];
  
  // 加载状态
  loading: boolean;
  
  // 当前编辑的工作流
  currentWorkflow: Workflow | null;
  
  // Actions
  loadWorkflows: () => Promise<void>;
  
  // 工作流 CRUD
  createWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'failedCount'>) => Workflow;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  getWorkflowById: (id: string) => Workflow | undefined;
  getWorkflowsByObjectId: (objectId: string) => Workflow[];
  
  // 工作流状态管理
  activateWorkflow: (id: string) => void;
  deactivateWorkflow: (id: string) => void;
  
  // 节点操作
  addNode: (workflowId: string, node: WorkflowNode) => void;
  updateNode: (workflowId: string, nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (workflowId: string, nodeId: string) => void;
  reorderNodes: (workflowId: string, nodes: WorkflowNode[]) => void;
  
  // 连线操作
  addEdge: (workflowId: string, edge: WorkflowEdge) => void;
  updateEdge: (workflowId: string, edgeId: string, updates: Partial<WorkflowEdge>) => void;
  deleteEdge: (workflowId: string, edgeId: string) => void;
  
  // 版本管理
  publishWorkflow: (id: string) => void;
  getWorkflowVersions: (id: string) => WorkflowVersion[];
  
  // 执行日志
  getExecutionLogs: (workflowId: string) => WorkflowExecutionLog[];
  addExecutionLog: (log: WorkflowExecutionLog) => void;
  
  // 模板
  getTemplates: (objectId?: string) => typeof workflowTemplates;
  createFromTemplate: (templateId: string, objectId: string) => Workflow;
  
  // 当前编辑
  setCurrentWorkflow: (workflow: Workflow | null) => void;
}

// 生成唯一 ID
const generateId = () => {
  return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateNodeId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateEdgeId = () => {
  return `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useWorkflowsStore = create<WorkflowsState>()(
  persist(
    (set, get) => ({
      workflows: mockWorkflows,
      executionLogs: mockExecutionLogs,
      loading: false,
      currentWorkflow: null,
      
      loadWorkflows: async () => {
        set({ loading: true });
        // 模拟加载
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ loading: false });
      },
      
      createWorkflow: (workflowData) => {
        const now = new Date().toISOString();
        const newWorkflow: Workflow = {
          ...workflowData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          runCount: 0,
          successCount: 0,
          failedCount: 0,
          currentVersion: 1,
          versions: [
            {
              id: 'v1',
              version: 1,
              publishedAt: now,
              publishedBy: workflowData.createdBy,
              nodes: workflowData.nodes,
              edges: workflowData.edges,
              changeLog: '初始版本',
            },
          ],
        };
        
        set(state => ({
          workflows: [...state.workflows, newWorkflow],
        }));
        
        return newWorkflow;
      },
      
      updateWorkflow: (id, updates) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === id
              ? { ...wf, ...updates, updatedAt: new Date().toISOString() }
              : wf
          ),
        }));
      },
      
      deleteWorkflow: (id) => {
        set(state => ({
          workflows: state.workflows.filter(wf => wf.id !== id),
        }));
      },
      
      getWorkflowById: (id) => {
        return get().workflows.find(wf => wf.id === id);
      },
      
      getWorkflowsByObjectId: (objectId) => {
        return get().workflows.filter(wf => wf.objectId === objectId);
      },
      
      activateWorkflow: (id) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === id ? { ...wf, status: 'active' as WorkflowStatus, updatedAt: new Date().toISOString() } : wf
          ),
        }));
      },
      
      deactivateWorkflow: (id) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === id ? { ...wf, status: 'inactive' as WorkflowStatus, updatedAt: new Date().toISOString() } : wf
          ),
        }));
      },
      
      addNode: (workflowId, node) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === workflowId
              ? {
                  ...wf,
                  nodes: [...wf.nodes, node],
                  updatedAt: new Date().toISOString(),
                }
              : wf
          ),
        }));
      },
      
      updateNode: (workflowId, nodeId, updates) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === workflowId
              ? {
                  ...wf,
                  nodes: wf.nodes.map(node =>
                    node.id === nodeId ? { ...node, ...updates } : node
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : wf
          ),
        }));
      },
      
      deleteNode: (workflowId, nodeId) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === workflowId
              ? {
                  ...wf,
                  nodes: wf.nodes.filter(node => node.id !== nodeId),
                  edges: wf.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
                  updatedAt: new Date().toISOString(),
                }
              : wf
          ),
        }));
      },
      
      reorderNodes: (workflowId, nodes) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === workflowId
              ? { ...wf, nodes, updatedAt: new Date().toISOString() }
              : wf
          ),
        }));
      },
      
      addEdge: (workflowId, edge) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === workflowId
              ? {
                  ...wf,
                  edges: [...wf.edges, edge],
                  updatedAt: new Date().toISOString(),
                }
              : wf
          ),
        }));
      },
      
      updateEdge: (workflowId, edgeId, updates) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === workflowId
              ? {
                  ...wf,
                  edges: wf.edges.map(edge =>
                    edge.id === edgeId ? { ...edge, ...updates } : edge
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : wf
          ),
        }));
      },
      
      deleteEdge: (workflowId, edgeId) => {
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === workflowId
              ? {
                  ...wf,
                  edges: wf.edges.filter(edge => edge.id !== edgeId),
                  updatedAt: new Date().toISOString(),
                }
              : wf
          ),
        }));
      },
      
      publishWorkflow: (id) => {
        const workflow = get().getWorkflowById(id);
        if (!workflow) return;
        
        const newVersion: WorkflowVersion = {
          id: `v${Date.now()}`,
          version: (workflow.currentVersion || 1) + 1,
          publishedAt: new Date().toISOString(),
          publishedBy: 'current_user',
          nodes: workflow.nodes,
          edges: workflow.edges,
          changeLog: '版本更新',
        };
        
        set(state => ({
          workflows: state.workflows.map(wf =>
            wf.id === id
              ? {
                  ...wf,
                  status: 'active' as WorkflowStatus,
                  currentVersion: newVersion.version,
                  versions: [...(wf.versions || []), newVersion],
                  updatedAt: new Date().toISOString(),
                }
              : wf
          ),
        }));
      },
      
      getWorkflowVersions: (id) => {
        const workflow = get().getWorkflowById(id);
        return workflow?.versions || [];
      },
      
      getExecutionLogs: (workflowId) => {
        return get().executionLogs.filter(log => log.workflowId === workflowId);
      },
      
      addExecutionLog: (log) => {
        set(state => ({
          executionLogs: [log, ...state.executionLogs],
        }));
      },
      
      getTemplates: (objectId) => {
        if (objectId) {
          return workflowTemplates.filter(t => t.objectId === objectId);
        }
        return workflowTemplates;
      },
      
      createFromTemplate: (templateId, objectId) => {
        const template = workflowTemplates.find(t => t.id === templateId);
        if (!template) {
          throw new Error('Template not found');
        }
        
        const now = new Date().toISOString();
        const newWorkflow: Workflow = {
          id: generateId(),
          objectId,
          name: template.name,
          description: template.description,
          status: 'draft',
          trigger: template.trigger,
          nodes: template.nodes.map(node => ({
            ...node,
            id: generateNodeId(),
          })),
          edges: template.edges.map(edge => ({
            ...edge,
            id: generateEdgeId(),
          })),
          createdAt: now,
          updatedAt: now,
          createdBy: 'current_user',
          runCount: 0,
          successCount: 0,
          failedCount: 0,
          currentVersion: 1,
        };
        
        set(state => ({
          workflows: [...state.workflows, newWorkflow],
        }));
        
        return newWorkflow;
      },
      
      setCurrentWorkflow: (workflow) => {
        set({ currentWorkflow: workflow });
      },
    }),
    {
      name: 'workflows-store',
      partialize: (state) => ({
        workflows: state.workflows,
        executionLogs: state.executionLogs,
      }),
    }
  )
);