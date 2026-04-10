import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserFormData } from '@/schemas/userSchema';
import { useRoles } from '@/hooks/api/useRoles';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
// import { MultiSelect } from '@/components/ui/multi-select'; // TODO: Create multi-select component

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}

export function UserForm({ defaultValues, onSubmit, isSubmitting }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      status: 'active',
      roleIds: [],
      ...defaultValues,
    },
  });

  const { data: rolesData } = useRoles();

  const roles = rolesData?.map((role) => ({
    value: role.id,
    label: role.name,
  })) || [];

  const departments = [
    { value: 'sales', label: '销售部' },
    { value: 'marketing', label: '市场部' },
    { value: 'service', label: '客服部' },
    { value: 'product', label: '产品部' },
    { value: 'tech', label: '技术部' },
    { value: 'hr', label: '人力资源部' },
    { value: 'finance', label: '财务部' },
    { value: 'admin', label: '行政部' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名 *</FormLabel>
                <FormControl>
                  <Input placeholder="请输入用户名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱 *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="请输入邮箱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入手机号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>职位</FormLabel>
                <FormControl>
                  <Input placeholder="请输入职位" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>部门</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择部门" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">禁用</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="roleIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>角色</FormLabel>
              <FormControl>
                <MultiSelect
                  options={roles}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="请选择角色"
                />
              </FormControl>
              <FormDescription>用户将拥有所选角色的所有权限</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!defaultValues?.id && (
          <FormField
            control={form.control}
            name="sendWelcomeEmail"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">发送欢迎邮件</FormLabel>
                  <FormDescription>
                    向用户邮箱发送包含登录信息的欢迎邮件
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => form.reset()}
          >
            重置
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '提交中...' : defaultValues?.id ? '更新' : '创建'}
          </button>
        </div>
      </form>
    </Form>
  );
}