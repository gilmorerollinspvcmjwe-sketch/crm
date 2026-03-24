/**
 * 自定义对象状态管理
 * 使用 Zustand 管理
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CustomObject,
  CustomObjectDefinition,
  ObjectProperty,
  ObjectRelation,
  ObjectForm,
  ObjectRecord,
  PropertyType,
} from '../types/customObject';
import {
  systemObjects,
  customObjectExamples,
  systemObjectProperties,
  objectRecords,
} from '../mock/customObjectsData';

interface CustomObjectsState {
  // 对象列表
  objects: CustomObject[];
  
  // 对象属性
  properties: Record<string, ObjectProperty[]>;
  
  // 对象关系
  relationships: Record<string, ObjectRelation[]>;
  
  // 对象表单
  forms: Record<string, ObjectForm[]>;
  
  // 对象数据
  records: Record<string, ObjectRecord[]>;
  
  // 加载状态
  loading: boolean;
  
  // Actions
  loadObjects: () => Promise<void>;
  
  // 对象 CRUD
  createObject: (object: Omit<CustomObject, 'id' | 'createdAt' | 'updatedAt'>) => CustomObject;
  updateObject: (id: string, updates: Partial<CustomObject>) => void;
  deleteObject: (id: string) => void;
  getObjectById: (id: string) => CustomObjectDefinition | undefined;
  getObjectByName: (name: string) => CustomObjectDefinition | undefined;
  
  // 属性 CRUD
  createProperty: (objectId: string, property: Omit<ObjectProperty, 'id' | 'objectId' | 'createdAt'>) => ObjectProperty;
  updateProperty: (objectId: string, propertyId: string, updates: Partial<ObjectProperty>) => void;
  deleteProperty: (objectId: string, propertyId: string) => void;
  getProperties: (objectId: string) => ObjectProperty[];
  reorderProperties: (objectId: string, propertyIds: string[]) => void;
  
  // 关系 CRUD
  createRelationship: (objectId: string, relation: Omit<ObjectRelation, 'id' | 'createdAt'>) => ObjectRelation;
  updateRelationship: (objectId: string, relationId: string, updates: Partial<ObjectRelation>) => void;
  deleteRelationship: (objectId: string, relationId: string) => void;
  getRelationships: (objectId: string) => ObjectRelation[];
  
  // 表单 CRUD
  createForm: (objectId: string, form: Omit<ObjectForm, 'id' | 'createdAt'>) => ObjectForm;
  updateForm: (objectId: string, formId: string, updates: Partial<ObjectForm>) => void;
  deleteForm: (objectId: string, formId: string) => void;
  getForms: (objectId: string) => ObjectForm[];
  getDefaultForm: (objectId: string, type: ObjectForm['type']) => ObjectForm | undefined;
  
  // 数据 CRUD
  createRecord: (objectId: string, data: Record<string, any>) => ObjectRecord;
  updateRecord: (objectId: string, recordId: string, data: Record<string, any>) => void;
  deleteRecord: (objectId: string, recordId: string) => void;
  getRecords: (objectId: string) => ObjectRecord[];
  getRecordById: (objectId: string, recordId: string) => ObjectRecord | undefined;
}

// 生成唯一 ID
const generateId = () => {
  return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generatePropertyId = () => {
  return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateRelationId = () => {
  return `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateFormId = () => {
  return `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateRecordId = () => {
  return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 初始化数据
const initializeData = () => {
  const objects: CustomObject[] = [...systemObjects, ...customObjectExamples];
  const properties: Record<string, ObjectProperty[]> = { ...systemObjectProperties };
  const relationships: Record<string, ObjectRelation[]> = {};
  const forms: Record<string, ObjectForm[]> = {};
  const records: Record<string, ObjectRecord[]> = { ...objectRecords };
  
  // 为每个对象创建默认表单
  objects.forEach(obj => {
    if (!forms[obj.id]) {
      forms[obj.id] = [
        {
          id: `${obj.id}_form_create`,
          objectId: obj.id,
          name: 'default_create',
          label: 'Default Create Form',
          type: 'create',
          layout: {
            type: 'two_column',
            sections: [
              {
                id: 'section_1',
                title: 'Basic Information',
                fields: properties[obj.id]?.slice(0, 6).map(p => p.id) || [],
                sortOrder: 0,
              },
            ],
          },
          isDefault: true,
          enabled: true,
          createdBy: 'system',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  });
  
  return { objects, properties, relationships, forms, records };
};

export const useCustomObjectsStore = create<CustomObjectsState>()(
  persist(
    (set, get) => {
      const initialData = initializeData();
      
      return {
        objects: initialData.objects,
        properties: initialData.properties,
        relationships: initialData.relationships,
        forms: initialData.forms,
        records: initialData.records,
        loading: false,
        
        loadObjects: async () => {
          set({ loading: true });
          // 模拟加载
          await new Promise(resolve => setTimeout(resolve, 300));
          set({ loading: false });
        },
        
        createObject: (objectData) => {
          const newObject: CustomObject = {
            ...objectData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({
            objects: [...state.objects, newObject],
            properties: { ...state.properties, [newObject.id]: [] },
            relationships: { ...state.relationships, [newObject.id]: [] },
            forms: { ...state.forms, [newObject.id]: [] },
            records: { ...state.records, [newObject.id]: [] },
          }));
          
          // 创建默认表单
          const defaultForm: ObjectForm = {
            id: generateFormId(),
            objectId: newObject.id,
            name: 'default_create',
            label: 'Default Create Form',
            type: 'create',
            layout: {
              type: 'two_column',
              sections: [
                {
                  id: 'section_1',
                  title: 'Basic Information',
                  fields: [],
                  sortOrder: 0,
                },
              ],
            },
            isDefault: true,
            enabled: true,
            createdBy: objectData.createdBy,
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            forms: {
              ...state.forms,
              [newObject.id]: [defaultForm],
            },
          }));
          
          return newObject;
        },
        
        updateObject: (id, updates) => {
          set(state => ({
            objects: state.objects.map(obj =>
              obj.id === id
                ? { ...obj, ...updates, updatedAt: new Date().toISOString() }
                : obj
            ),
          }));
        },
        
        deleteObject: (id) => {
          const obj = get().objects.find(o => o.id === id);
          if (obj?.isSystem) {
            throw new Error('Cannot delete system object');
          }
          
          set(state => {
            const { [id]: _, ...remainingProperties } = state.properties;
            const { [id]: __, ...remainingRelationships } = state.relationships;
            const { [id]: ___, ...remainingForms } = state.forms;
            const { [id]: ____, ...remainingRecords } = state.records;
            
            return {
              objects: state.objects.filter(obj => obj.id !== id),
              properties: remainingProperties,
              relationships: remainingRelationships,
              forms: remainingForms,
              records: remainingRecords,
            };
          });
        },
        
        getObjectById: (id) => {
          const state = get();
          const obj = state.objects.find(o => o.id === id);
          if (!obj) return undefined;
          
          return {
            ...obj,
            properties: state.properties[id] || [],
            relationships: state.relationships[id] || [],
            forms: state.forms[id] || [],
          };
        },
        
        getObjectByName: (name) => {
          const state = get();
          const obj = state.objects.find(o => o.name === name);
          if (!obj) return undefined;
          
          return {
            ...obj,
            properties: state.properties[obj.id] || [],
            relationships: state.relationships[obj.id] || [],
            forms: state.forms[obj.id] || [],
          };
        },
        
        createProperty: (objectId, propertyData) => {
          const newProperty: ObjectProperty = {
            ...propertyData,
            id: generatePropertyId(),
            objectId,
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            properties: {
              ...state.properties,
              [objectId]: [...(state.properties[objectId] || []), newProperty],
            },
          }));
          
          return newProperty;
        },
        
        updateProperty: (objectId, propertyId, updates) => {
          set(state => ({
            properties: {
              ...state.properties,
              [objectId]: state.properties[objectId]?.map(prop =>
                prop.id === propertyId ? { ...prop, ...updates } : prop
              ) || [],
            },
          }));
        },
        
        deleteProperty: (objectId, propertyId) => {
          set(state => ({
            properties: {
              ...state.properties,
              [objectId]: state.properties[objectId]?.filter(prop => prop.id !== propertyId) || [],
            },
          }));
        },
        
        getProperties: (objectId) => {
          return get().properties[objectId] || [];
        },
        
        reorderProperties: (objectId, propertyIds) => {
          set(state => {
            const currentProperties = state.properties[objectId] || [];
            const reorderedProperties = propertyIds.map((id, index) => {
              const prop = currentProperties.find(p => p.id === id);
              return prop ? { ...prop, sortOrder: index } : null;
            }).filter(Boolean) as ObjectProperty[];
            
            return {
              properties: {
                ...state.properties,
                [objectId]: reorderedProperties,
              },
            };
          });
        },
        
        createRelationship: (objectId, relationData) => {
          const newRelation: ObjectRelation = {
            ...relationData,
            id: generateRelationId(),
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            relationships: {
              ...state.relationships,
              [objectId]: [...(state.relationships[objectId] || []), newRelation],
            },
          }));
          
          return newRelation;
        },
        
        updateRelationship: (objectId, relationId, updates) => {
          set(state => ({
            relationships: {
              ...state.relationships,
              [objectId]: state.relationships[objectId]?.map(rel =>
                rel.id === relationId ? { ...rel, ...updates } : rel
              ) || [],
            },
          }));
        },
        
        deleteRelationship: (objectId, relationId) => {
          set(state => ({
            relationships: {
              ...state.relationships,
              [objectId]: state.relationships[objectId]?.filter(rel => rel.id !== relationId) || [],
            },
          }));
        },
        
        getRelationships: (objectId) => {
          return get().relationships[objectId] || [];
        },
        
        createForm: (objectId, formData) => {
          const newForm: ObjectForm = {
            ...formData,
            id: generateFormId(),
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            forms: {
              ...state.forms,
              [objectId]: [...(state.forms[objectId] || []), newForm],
            },
          }));
          
          return newForm;
        },
        
        updateForm: (objectId, formId, updates) => {
          set(state => ({
            forms: {
              ...state.forms,
              [objectId]: state.forms[objectId]?.map(form =>
                form.id === formId ? { ...form, ...updates } : form
              ) || [],
            },
          }));
        },
        
        deleteForm: (objectId, formId) => {
          set(state => ({
            forms: {
              ...state.forms,
              [objectId]: state.forms[objectId]?.filter(form => form.id !== formId) || [],
            },
          }));
        },
        
        getForms: (objectId) => {
          return get().forms[objectId] || [];
        },
        
        getDefaultForm: (objectId, type) => {
          const forms = get().forms[objectId] || [];
          return forms.find(f => f.type === type && f.isDefault && f.enabled);
        },
        
        createRecord: (objectId, data) => {
          const newRecord: ObjectRecord = {
            id: generateRecordId(),
            objectId,
            data,
            createdBy: 'current_user',
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            records: {
              ...state.records,
              [objectId]: [...(state.records[objectId] || []), newRecord],
            },
          }));
          
          return newRecord;
        },
        
        updateRecord: (objectId, recordId, data) => {
          set(state => ({
            records: {
              ...state.records,
              [objectId]: state.records[objectId]?.map(rec =>
                rec.id === recordId
                  ? { ...rec, data: { ...rec.data, ...data }, updatedAt: new Date().toISOString() }
                  : rec
              ) || [],
            },
          }));
        },
        
        deleteRecord: (objectId, recordId) => {
          set(state => ({
            records: {
              ...state.records,
              [objectId]: state.records[objectId]?.filter(rec => rec.id !== recordId) || [],
            },
          }));
        },
        
        getRecords: (objectId) => {
          return get().records[objectId] || [];
        },
        
        getRecordById: (objectId, recordId) => {
          const records = get().records[objectId] || [];
          return records.find(r => r.id === recordId);
        },
      };
    },
    {
      name: 'custom-objects-store',
      partialize: (state) => ({
        objects: state.objects,
        properties: state.properties,
        relationships: state.relationships,
        forms: state.forms,
        records: state.records,
      }),
    }
  )
);