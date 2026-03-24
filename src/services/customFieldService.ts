/**
 * 自定义字段服务层
 * @description 提供自定义字段的 CRUD 操作和字段值管理
 */
import { CustomField, CustomFieldValue, ModuleType, OptionsSet } from '../types/customField';
import { allCustomFields, allFieldValues, optionsSets } from '../mock/customFieldData';

/**
 * 模拟 API 延迟
 */
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 本地存储 key
 */
const STORAGE_KEYS = {
  CUSTOM_FIELDS: 'crm_custom_fields',
  FIELD_VALUES: 'crm_field_values',
  OPTIONS_SETS: 'crm_options_sets',
};

/**
 * 初始化本地存储
 */
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FIELDS, JSON.stringify(allCustomFields));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FIELD_VALUES)) {
    localStorage.setItem(STORAGE_KEYS.FIELD_VALUES, JSON.stringify(allFieldValues));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPTIONS_SETS)) {
    localStorage.setItem(STORAGE_KEYS.OPTIONS_SETS, JSON.stringify(optionsSets));
  }
};

// 初始化存储
if (typeof window !== 'undefined') {
  initStorage();
}

/**
 * 获取自定义字段服务
 */
export const customFieldService = {
  /**
   * 获取所有自定义字段
   * @param module - 可选，按模块筛选
   */
  async getCustomFields(module?: ModuleType): Promise<CustomField[]> {
    await delay();
    const fields = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS) || '[]');
    
    if (module) {
      return fields.filter((f: CustomField) => 
        f.enabled && f.modules.includes(module)
      ).sort((a: CustomField, b: CustomField) => a.sortOrder - b.sortOrder);
    }
    
    return fields.filter((f: CustomField) => f.enabled);
  },

  /**
   * 根据 ID 获取自定义字段
   */
  async getCustomFieldById(id: string): Promise<CustomField | undefined> {
    await delay();
    const fields = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS) || '[]');
    return fields.find((f: CustomField) => f.id === id);
  },

  /**
   * 创建自定义字段
   */
  async createCustomField(data: Omit<CustomField, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>): Promise<CustomField> {
    await delay();
    const fields = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS) || '[]');
    
    const newField: CustomField = {
      ...data,
      id: `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      createdBy: 'current_user', // 实际应从用户上下文获取
    };
    
    fields.push(newField);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FIELDS, JSON.stringify(fields));
    
    return newField;
  },

  /**
   * 更新自定义字段
   */
  async updateCustomField(id: string, data: Partial<CustomField>): Promise<CustomField> {
    await delay();
    const fields = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS) || '[]');
    const index = fields.findIndex((f: CustomField) => f.id === id);
    
    if (index === -1) {
      throw new Error('字段不存在');
    }
    
    fields[index] = {
      ...fields[index],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current_user',
    };
    
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FIELDS, JSON.stringify(fields));
    
    return fields[index];
  },

  /**
   * 删除自定义字段
   */
  async deleteCustomField(id: string): Promise<void> {
    await delay();
    const fields = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS) || '[]');
    const filteredFields = fields.filter((f: CustomField) => f.id !== id);
    
    if (filteredFields.length === fields.length) {
      throw new Error('字段不存在');
    }
    
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FIELDS, JSON.stringify(filteredFields));
  },

  /**
   * 批量更新字段排序
   */
  async batchUpdateOrder(fieldOrders: { id: string; sortOrder: number }[]): Promise<void> {
    await delay();
    const fields = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS) || '[]');
    
    fieldOrders.forEach(order => {
      const field = fields.find((f: CustomField) => f.id === order.id);
      if (field) {
        field.sortOrder = order.sortOrder;
      }
    });
    
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FIELDS, JSON.stringify(fields));
  },

  /**
   * 获取记录的自定义字段值
   * @param module - 模块类型
   * @param recordId - 记录 ID
   */
  async getFieldValues(module: ModuleType, recordId: string): Promise<Record<string, any>> {
    await delay();
    const allValues = JSON.parse(localStorage.getItem(STORAGE_KEYS.FIELD_VALUES) || '{}');
    const moduleValues = allValues[module] || {};
    
    return moduleValues[recordId] || {};
  },

  /**
   * 保存记录的自定义字段值
   * @param module - 模块类型
   * @param recordId - 记录 ID
   * @param values - 字段值集合
   */
  async saveFieldValues(module: ModuleType, recordId: string, values: Record<string, any>): Promise<void> {
    await delay();
    const allValues = JSON.parse(localStorage.getItem(STORAGE_KEYS.FIELD_VALUES) || '{}');
    
    if (!allValues[module]) {
      allValues[module] = {};
    }
    
    allValues[module][recordId] = {
      ...values,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current_user',
    };
    
    localStorage.setItem(STORAGE_KEYS.FIELD_VALUES, JSON.stringify(allValues));
  },

  /**
   * 获取所有选项集
   */
  async getOptionsSets(): Promise<OptionsSet[]> {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.OPTIONS_SETS) || '[]');
  },

  /**
   * 获取单个选项集
   */
  async getOptionsSet(id: string): Promise<OptionsSet | undefined> {
    await delay();
    const sets = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPTIONS_SETS) || '[]');
    return sets.find((s: OptionsSet) => s.id === id);
  },

  /**
   * 创建选项集
   */
  async createOptionsSet(data: Omit<OptionsSet, 'id' | 'createdAt' | 'createdBy'>): Promise<OptionsSet> {
    await delay();
    const sets = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPTIONS_SETS) || '[]');
    
    const newSet: OptionsSet = {
      ...data,
      id: `os_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      createdBy: 'current_user',
    };
    
    sets.push(newSet);
    localStorage.setItem(STORAGE_KEYS.OPTIONS_SETS, JSON.stringify(sets));
    
    return newSet;
  },

  /**
   * 更新选项集
   */
  async updateOptionsSet(id: string, data: Partial<OptionsSet>): Promise<OptionsSet> {
    await delay();
    const sets = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPTIONS_SETS) || '[]');
    const index = sets.findIndex((s: OptionsSet) => s.id === id);
    
    if (index === -1) {
      throw new Error('选项集不存在');
    }
    
    sets[index] = {
      ...sets[index],
      ...data,
    };
    
    localStorage.setItem(STORAGE_KEYS.OPTIONS_SETS, JSON.stringify(sets));
    
    return sets[index];
  },

  /**
   * 删除选项集
   */
  async deleteOptionsSet(id: string): Promise<void> {
    await delay();
    const sets = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPTIONS_SETS) || '[]');
    const filteredSets = sets.filter((s: OptionsSet) => s.id !== id);
    
    if (filteredSets.length === sets.length) {
      throw new Error('选项集不存在');
    }
    
    localStorage.setItem(STORAGE_KEYS.OPTIONS_SETS, JSON.stringify(filteredSets));
  },
};

export default customFieldService;
