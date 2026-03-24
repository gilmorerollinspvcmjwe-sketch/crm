/**
 * CRM 后端服务 - Phase 1 MVP
 * 端口：3001
 * 技术栈：Node.js + Express
 * 数据库：JSON 文件存储（MVP 阶段）
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 日志中间件
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('zh-CN');
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');

// 辅助函数：读写 JSON 数据
const loadData = (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取 ${filename} 失败:`, error.message);
    return [];
  }
};

const saveData = (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`保存 ${filename} 失败:`, error.message);
    return false;
  }
};

// 生成唯一 ID
const generateId = (prefix) => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${dateStr}${random}`;
};

// ==================== 客户管理 API ====================

// 获取客户列表（支持查询和分页）
app.get('/api/customers', (req, res) => {
  try {
    const { name, industry, level, status, region, page = 1, pageSize = 20 } = req.query;
    let customers = loadData('customers.json');

    // 筛选
    if (name) {
      customers = customers.filter(c => 
        c.name.includes(name) || c.shortName?.includes(name)
      );
    }
    if (industry) {
      customers = customers.filter(c => c.industry === industry);
    }
    if (level) {
      customers = customers.filter(c => c.level === level);
    }
    if (status) {
      customers = customers.filter(c => c.status === status);
    }
    if (region) {
      customers = customers.filter(c => c.region?.includes(region));
    }

    const total = customers.length;
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const list = customers.slice(start, end);

    res.json({
      success: true,
      data: { list, total, page: parseInt(page), pageSize: parseInt(pageSize) },
      message: '查询成功',
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取客户详情
app.get('/api/customers/:id', (req, res) => {
  try {
    const customers = loadData('customers.json');
    const contacts = loadData('contacts.json');
    const activities = loadData('activities.json');
    
    const customer = customers.find(c => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    // 关联联系人
    const customerContacts = contacts.filter(c => c.customerId === customer.id);
    
    // 关联跟进记录
    const customerActivities = activities.filter(a => 
      a.relatedObjectType === '客户' && a.relatedObjectId === customer.id
    );

    res.json({
      success: true,
      data: { ...customer, contacts: customerContacts, activities: customerActivities },
      message: '查询成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建客户
app.post('/api/customers', (req, res) => {
  try {
    const customers = loadData('customers.json');
    const newCustomer = {
      id: generateId('CUST'),
      ...req.body,
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    // 必填字段校验
    if (!newCustomer.name) {
      return res.status(400).json({ success: false, message: '客户名称为必填项' });
    }

    customers.push(newCustomer);
    saveData('customers.json', customers);

    res.status(201).json({
      success: true,
      data: newCustomer,
      message: '客户创建成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新客户
app.put('/api/customers/:id', (req, res) => {
  try {
    const customers = loadData('customers.json');
    const index = customers.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    customers[index] = {
      ...customers[index],
      ...req.body,
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    saveData('customers.json', customers);

    res.json({
      success: true,
      data: customers[index],
      message: '客户更新成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除客户
app.delete('/api/customers/:id', (req, res) => {
  try {
    const customers = loadData('customers.json');
    const filtered = customers.filter(c => c.id !== req.params.id);
    
    if (filtered.length === customers.length) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    saveData('customers.json', filtered);

    res.json({ success: true, message: '客户删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 分配客户
app.post('/api/customers/assign', (req, res) => {
  try {
    const { customerIds, ownerId, ownerName } = req.body;
    const customers = loadData('customers.json');

    const updated = customers.map(c => {
      if (customerIds.includes(c.id)) {
        return {
          ...c,
          ownerId,
          ownerName,
          updatedAt: new Date().toLocaleString('zh-CN')
        };
      }
      return c;
    });

    saveData('customers.json', updated);

    res.json({
      success: true,
      data: { updatedCount: customerIds.length },
      message: `已分配 ${customerIds.length} 个客户`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 转移客户
app.post('/api/customers/transfer', (req, res) => {
  try {
    const { customerIds, newOwnerId, newOwnerName } = req.body;
    const customers = loadData('customers.json');

    const updated = customers.map(c => {
      if (customerIds.includes(c.id)) {
        return {
          ...c,
          ownerId: newOwnerId,
          ownerName: newOwnerName,
          updatedAt: new Date().toLocaleString('zh-CN')
        };
      }
      return c;
    });

    saveData('customers.json', updated);

    res.json({
      success: true,
      data: { updatedCount: customerIds.length },
      message: `已转移 ${customerIds.length} 个客户`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 导入客户（简化版，实际应处理 Excel）
app.post('/api/customers/import', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ success: false, message: '数据格式错误' });
    }

    const customers = loadData('customers.json');
    let successCount = 0;
    let failCount = 0;

    data.forEach(item => {
      if (item.name) {
        customers.push({
          id: generateId('CUST'),
          ...item,
          createdAt: new Date().toLocaleString('zh-CN'),
          updatedAt: new Date().toLocaleString('zh-CN')
        });
        successCount++;
      } else {
        failCount++;
      }
    });

    saveData('customers.json', customers);

    res.json({
      success: true,
      data: { successCount, failCount },
      message: `导入完成：成功 ${successCount} 条，失败 ${failCount} 条`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 导出客户
app.get('/api/customers/export', (req, res) => {
  try {
    const customers = loadData('customers.json');
    res.json({
      success: true,
      data: customers,
      message: '导出成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 联系人管理 API ====================

// 获取联系人列表
app.get('/api/contacts', (req, res) => {
  try {
    const { name, customerId, position, mobile, page = 1, pageSize = 20 } = req.query;
    let contacts = loadData('contacts.json');

    if (name) {
      contacts = contacts.filter(c => c.name.includes(name));
    }
    if (customerId) {
      contacts = contacts.filter(c => c.customerId === customerId);
    }
    if (position) {
      contacts = contacts.filter(c => c.position?.includes(position));
    }
    if (mobile) {
      contacts = contacts.filter(c => c.mobile?.includes(mobile));
    }

    const total = contacts.length;
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const list = contacts.slice(start, end);

    res.json({
      success: true,
      data: { list, total, page: parseInt(page), pageSize: parseInt(pageSize) },
      message: '查询成功',
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取联系人详情
app.get('/api/contacts/:id', (req, res) => {
  try {
    const contacts = loadData('contacts.json');
    const activities = loadData('activities.json');
    
    const contact = contacts.find(c => c.id === req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: '联系人不存在' });
    }

    const contactActivities = activities.filter(a =>
      a.contactIds?.includes(contact.id)
    );

    res.json({
      success: true,
      data: { ...contact, activities: contactActivities },
      message: '查询成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建联系人
app.post('/api/contacts', (req, res) => {
  try {
    const contacts = loadData('contacts.json');
    const newContact = {
      id: generateId('CONT'),
      ...req.body,
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    if (!newContact.name || !newContact.customerId) {
      return res.status(400).json({ success: false, message: '姓名和所属客户为必填项' });
    }

    contacts.push(newContact);
    saveData('contacts.json', contacts);

    res.status(201).json({
      success: true,
      data: newContact,
      message: '联系人创建成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新联系人
app.put('/api/contacts/:id', (req, res) => {
  try {
    const contacts = loadData('contacts.json');
    const index = contacts.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: '联系人不存在' });
    }

    contacts[index] = {
      ...contacts[index],
      ...req.body,
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    saveData('contacts.json', contacts);

    res.json({
      success: true,
      data: contacts[index],
      message: '联系人更新成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除联系人
app.delete('/api/contacts/:id', (req, res) => {
  try {
    const contacts = loadData('contacts.json');
    const filtered = contacts.filter(c => c.id !== req.params.id);
    
    if (filtered.length === contacts.length) {
      return res.status(404).json({ success: false, message: '联系人不存在' });
    }

    saveData('contacts.json', filtered);

    res.json({ success: true, message: '联系人删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 导入联系人
app.post('/api/contacts/import', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ success: false, message: '数据格式错误' });
    }

    const contacts = loadData('contacts.json');
    let successCount = 0;
    let failCount = 0;

    data.forEach(item => {
      if (item.name && item.customerId) {
        contacts.push({
          id: generateId('CONT'),
          ...item,
          createdAt: new Date().toLocaleString('zh-CN'),
          updatedAt: new Date().toLocaleString('zh-CN')
        });
        successCount++;
      } else {
        failCount++;
      }
    });

    saveData('contacts.json', contacts);

    res.json({
      success: true,
      data: { successCount, failCount },
      message: `导入完成：成功 ${successCount} 条，失败 ${failCount} 条`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 导出联系人
app.get('/api/contacts/export', (req, res) => {
  try {
    const contacts = loadData('contacts.json');
    res.json({
      success: true,
      data: contacts,
      message: '导出成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 线索管理 API ====================

// 获取线索列表
app.get('/api/leads', (req, res) => {
  try {
    const { name, source, status, ownerId, page = 1, pageSize = 20 } = req.query;
    let leads = loadData('leads.json');

    if (name) {
      leads = leads.filter(l => l.name.includes(name) || l.contactName.includes(name));
    }
    if (source) {
      leads = leads.filter(l => l.source === source);
    }
    if (status) {
      leads = leads.filter(l => l.status === status);
    }
    if (ownerId) {
      leads = leads.filter(l => l.ownerId === ownerId);
    }

    const total = leads.length;
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const list = leads.slice(start, end);

    res.json({
      success: true,
      data: { list, total, page: parseInt(page), pageSize: parseInt(pageSize) },
      message: '查询成功',
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取线索详情
app.get('/api/leads/:id', (req, res) => {
  try {
    const leads = loadData('leads.json');
    const activities = loadData('activities.json');
    
    const lead = leads.find(l => l.id === req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: '线索不存在' });
    }

    const leadActivities = activities.filter(a =>
      a.relatedObjectType === '线索' && a.relatedObjectId === lead.id
    );

    res.json({
      success: true,
      data: { ...lead, activities: leadActivities },
      message: '查询成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建线索
app.post('/api/leads', (req, res) => {
  try {
    const leads = loadData('leads.json');
    const newLead = {
      id: generateId('LEAD'),
      ...req.body,
      status: req.body.status || '待跟进',
      score: req.body.score || 50,
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    if (!newLead.name || !newLead.mobile) {
      return res.status(400).json({ success: false, message: '线索名称和手机为必填项' });
    }

    leads.push(newLead);
    saveData('leads.json', leads);

    res.status(201).json({
      success: true,
      data: newLead,
      message: '线索创建成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新线索
app.put('/api/leads/:id', (req, res) => {
  try {
    const leads = loadData('leads.json');
    const index = leads.findIndex(l => l.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: '线索不存在' });
    }

    leads[index] = {
      ...leads[index],
      ...req.body,
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    saveData('leads.json', leads);

    res.json({
      success: true,
      data: leads[index],
      message: '线索更新成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除线索
app.delete('/api/leads/:id', (req, res) => {
  try {
    const leads = loadData('leads.json');
    const filtered = leads.filter(l => l.id !== req.params.id);
    
    if (filtered.length === leads.length) {
      return res.status(404).json({ success: false, message: '线索不存在' });
    }

    saveData('leads.json', filtered);

    res.json({ success: true, message: '线索删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 线索转化
app.post('/api/leads/:id/convert', (req, res) => {
  try {
    const leads = loadData('leads.json');
    const customers = loadData('customers.json');
    const contacts = loadData('contacts.json');
    
    const leadIndex = leads.findIndex(l => l.id === req.params.id);
    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: '线索不存在' });
    }

    const lead = leads[leadIndex];
    const now = new Date().toLocaleString('zh-CN');

    // 创建客户
    const newCustomer = {
      id: generateId('CUST'),
      name: lead.companyName || lead.name,
      shortName: lead.companyName,
      industry: lead.industry,
      companySize: lead.companySize,
      source: lead.source,
      level: lead.level || 'C',
      status: '潜在',
      ownerId: lead.ownerId,
      ownerName: lead.ownerName,
      createdBy: lead.ownerName,
      createdAt: now,
      updatedAt: now,
      remark: `由线索 ${lead.name} 转化`
    };

    // 创建联系人
    const newContact = {
      id: generateId('CONT'),
      name: lead.contactName,
      position: lead.position,
      mobile: lead.mobile,
      email: lead.email,
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      ownerId: lead.ownerId,
      ownerName: lead.ownerName,
      createdBy: lead.ownerName,
      createdAt: now,
      updatedAt: now
    };

    // 更新线索状态
    leads[leadIndex] = {
      ...lead,
      status: '已转化',
      convertedAt: now,
      convertedCustomerId: newCustomer.id,
      convertedCustomerName: newCustomer.name,
      updatedAt: now
    };

    customers.push(newCustomer);
    contacts.push(newContact);

    saveData('leads.json', leads);
    saveData('customers.json', customers);
    saveData('contacts.json', contacts);

    res.json({
      success: true,
      data: {
        customer: newCustomer,
        contact: newContact,
        lead: leads[leadIndex]
      },
      message: '线索转化成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 分配线索
app.post('/api/leads/assign', (req, res) => {
  try {
    const { leadIds, ownerId, ownerName } = req.body;
    const leads = loadData('leads.json');

    const updated = leads.map(l => {
      if (leadIds.includes(l.id)) {
        return {
          ...l,
          ownerId,
          ownerName,
          updatedAt: new Date().toLocaleString('zh-CN')
        };
      }
      return l;
    });

    saveData('leads.json', updated);

    res.json({
      success: true,
      data: { updatedCount: leadIds.length },
      message: `已分配 ${leadIds.length} 个线索`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 导入线索
app.post('/api/leads/import', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ success: false, message: '数据格式错误' });
    }

    const leads = loadData('leads.json');
    let successCount = 0;
    let failCount = 0;

    data.forEach(item => {
      if (item.name && item.mobile) {
        // 去重检查
        const exists = leads.some(l => l.mobile === item.mobile);
        if (!exists) {
          leads.push({
            id: generateId('LEAD'),
            ...item,
            status: item.status || '待跟进',
            score: item.score || 50,
            createdAt: new Date().toLocaleString('zh-CN'),
            updatedAt: new Date().toLocaleString('zh-CN')
          });
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }
    });

    saveData('leads.json', leads);

    res.json({
      success: true,
      data: { successCount, failCount, duplicateCount: failCount },
      message: `导入完成：成功 ${successCount} 条，重复/失败 ${failCount} 条`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 导出线索
app.get('/api/leads/export', (req, res) => {
  try {
    const leads = loadData('leads.json');
    res.json({
      success: true,
      data: leads,
      message: '导出成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 跟进记录 API ====================

// 获取跟进记录列表
app.get('/api/activities', (req, res) => {
  try {
    const { type, relatedObjectType, relatedObjectId, dateFrom, dateTo, page = 1, pageSize = 20 } = req.query;
    let activities = loadData('activities.json');

    if (type) {
      activities = activities.filter(a => a.type === type);
    }
    if (relatedObjectType) {
      activities = activities.filter(a => a.relatedObjectType === relatedObjectType);
    }
    if (relatedObjectId) {
      activities = activities.filter(a => a.relatedObjectId === relatedObjectId);
    }
    if (dateFrom) {
      activities = activities.filter(a => a.activityTime >= dateFrom);
    }
    if (dateTo) {
      activities = activities.filter(a => a.activityTime <= dateTo);
    }

    // 按时间倒序
    activities.sort((a, b) => new Date(b.activityTime) - new Date(a.activityTime));

    const total = activities.length;
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const list = activities.slice(start, end);

    res.json({
      success: true,
      data: { list, total, page: parseInt(page), pageSize: parseInt(pageSize) },
      message: '查询成功',
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取跟进记录详情
app.get('/api/activities/:id', (req, res) => {
  try {
    const activities = loadData('activities.json');
    const activity = activities.find(a => a.id === req.params.id);
    
    if (!activity) {
      return res.status(404).json({ success: false, message: '跟进记录不存在' });
    }

    res.json({
      success: true,
      data: activity,
      message: '查询成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建跟进记录
app.post('/api/activities', (req, res) => {
  try {
    const activities = loadData('activities.json');
    const newActivity = {
      id: generateId('ACT'),
      ...req.body,
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    if (!newActivity.content) {
      return res.status(400).json({ success: false, message: '跟进内容为必填项' });
    }

    // 至少关联一个对象
    if (!newActivity.relatedObjectType || !newActivity.relatedObjectId) {
      return res.status(400).json({ success: false, message: '至少需要关联客户/联系人/线索之一' });
    }

    activities.unshift(newActivity);
    saveData('activities.json', activities);

    res.status(201).json({
      success: true,
      data: newActivity,
      message: '跟进记录创建成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新跟进记录
app.put('/api/activities/:id', (req, res) => {
  try {
    const activities = loadData('activities.json');
    const index = activities.findIndex(a => a.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: '跟进记录不存在' });
    }

    activities[index] = {
      ...activities[index],
      ...req.body,
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    saveData('activities.json', activities);

    res.json({
      success: true,
      data: activities[index],
      message: '跟进记录更新成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除跟进记录
app.delete('/api/activities/:id', (req, res) => {
  try {
    const activities = loadData('activities.json');
    const filtered = activities.filter(a => a.id !== req.params.id);
    
    if (filtered.length === activities.length) {
      return res.status(404).json({ success: false, message: '跟进记录不存在' });
    }

    saveData('activities.json', filtered);

    res.json({ success: true, message: '跟进记录删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 健康检查 ====================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'running',
      timestamp: new Date().toLocaleString('zh-CN'),
      version: '1.0.0'
    },
    message: '服务运行正常'
  });
});

// ==================== 启动服务 ====================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 CRM 后端服务已启动');
  console.log(`📍 端口：${PORT}`);
  console.log(`📁 数据目录：${DATA_DIR}`);
  console.log(`⏰ 启动时间：${new Date().toLocaleString('zh-CN')}`);
  console.log('='.repeat(50));
  console.log('API 端点:');
  console.log('  客户管理：GET/POST /api/customers');
  console.log('  联系人：GET/POST /api/contacts');
  console.log('  线索管理：GET/POST /api/leads');
  console.log('  跟进记录：GET/POST /api/activities');
  console.log('='.repeat(50));
});
