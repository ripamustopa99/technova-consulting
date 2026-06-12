'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700'],
  display: 'swap',
});

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        message.success('Login berhasil!');
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        message.error(data.message || 'Kredensial tidak valid');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Terjadi kesalahan pada sistem. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
      {/* Subtle Background Decorations */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Card 
        className="w-full max-w-[420px] shadow-2xl border-0 z-10 relative bg-white/80 backdrop-blur-xl"
        styles={{ body: { padding: '40px 32px' } }}
        style={{ borderRadius: '24px' }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 mb-5 shadow-lg shadow-slate-900/20">
            {/* TechNova Icon Placeholder */}
            <span className="text-cyan-400 font-extrabold text-2xl tracking-tighter">TN</span>
          </div>
          <Title level={2} className={`${plusJakartaSans.className}`} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
            Admin Portal
          </Title>
          <Text className="block mt-2 text-slate-500">
            Sign in to manage TechNova content
          </Text>
        </div>

        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'The input is not a valid E-mail address!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-slate-400 mr-1" />} 
              placeholder="Email Address" 
              className="rounded-xl px-4 py-3 bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
            className="mb-6"
          >
            <Input.Password 
              prefix={<LockOutlined className="text-slate-400 mr-1" />} 
              placeholder="Password" 
              className="rounded-xl px-4 py-3 bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
            />
          </Form.Item>

          <Form.Item className="mb-8">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-slate-600">Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 border-0 shadow-lg shadow-slate-900/20"
              style={{ height: '52px', fontWeight: 600, fontSize: '16px' }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}