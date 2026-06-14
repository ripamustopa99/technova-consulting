'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Tag, Badge } from 'antd';
import {
  ProjectOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const { Title, Text } = Typography;

// Custom tooltip components (declared outside render to avoid state reset)
const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', padding: '8px 14px', borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Text style={{ fontWeight: 600, color: '#1E293B', display: 'block' }}>{payload[0].name}</Text>
        <Text style={{ color: '#64748B', fontSize: 13 }}>{payload[0].value} projects</Text>
      </div>
    );
  }
  return null;
};

const AreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', padding: '8px 14px', borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Text style={{ fontWeight: 600, color: '#1E293B', display: 'block' }}>{label}</Text>
        <Text style={{ color: '#4F46E5', fontSize: 13 }}>{payload[0].value} pesan</Text>
      </div>
    );
  }
  return null;
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const DONUT_COLORS = ['#06B6D4', '#4F46E5', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

interface DashboardOverviewProps {
  totalProjects: number;
  totalServices: number;
  totalArticles: number;
  totalMessages: number;
  recentMessages: {
    id: string;
    name: string;
    email: string;
    company: string | null;
    isRead: boolean;
    createdAt: Date;
  }[];
  categoryData: { name: string; value: number }[];
  messageTrendData: { month: string; count: number }[];
}

export default function DashboardOverview({
  totalProjects,
  totalServices,
  totalArticles,
  totalMessages,
  recentMessages,
  categoryData,
  messageTrendData,
}: DashboardOverviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stat card configs
  const statCards = [
    { title: 'Total Projects', value: totalProjects, icon: <ProjectOutlined style={{ fontSize: 28, color: '#6366F1' }} />, bg: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '#C7D2FE' },
    { title: 'Total Services', value: totalServices, icon: <AppstoreOutlined style={{ fontSize: 28, color: '#06B6D4' }} />, bg: 'linear-gradient(135deg, #ECFEFF, #CFFAFE)', border: '#A5F3FC' },
    { title: 'Total Articles', value: totalArticles, icon: <FileTextOutlined style={{ fontSize: 28, color: '#F59E0B' }} />, bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '#FDE68A' },
    { title: 'Total Messages', value: totalMessages, icon: <MailOutlined style={{ fontSize: 28, color: '#10B981' }} />, bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '#A7F3D0' },
  ];

  // Table columns
  const recentColumns = [
    {
      title: 'Pengirim',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <span style={{ fontWeight: 600, color: '#1E293B' }}>{text}</span>
          <br />
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'Perusahaan',
      dataIndex: 'company',
      key: 'company',
      responsive: ['md' as const],
      render: (text: string | null) => text || <Text style={{ color: '#CBD5E1' }}>—</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'isRead',
      key: 'isRead',
      render: (isRead: boolean) =>
        isRead
          ? <Tag color="green" style={{ borderRadius: 6 }}>Dibaca</Tag>
          : <Badge status="processing" text={<span style={{ color: '#3B82F6', fontWeight: 500 }}>Baru</span>} />,
    },
    {
      title: 'Waktu',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['sm' as const],
      render: (date: Date) => (
        <Text style={{ fontSize: 13, color: '#64748B' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Text>
      ),
    },
  ];

  return (
    <div className={plusJakartaSans.className}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#0F172A', fontWeight: 700 }}>Dashboard Overview</Title>
        <Text style={{ color: '#64748B', fontSize: 15 }}>Selamat datang kembali. Berikut ringkasan data TechNova.</Text>
      </div>

      {/* ROW 1: ANALYTICS CHARTS */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {/* Donut Chart — Sebaran Kategori Proyek */}
        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: '100%' }}
            styles={{ body: { padding: '20px' } }}
          >
            <Title level={5} style={{ margin: 0, color: '#0F172A', fontWeight: 700, marginBottom: 4 }}>
              Sebaran Kategori Proyek
            </Title>
            <Text style={{ color: '#94A3B8', fontSize: 13 }}>Distribusi proyek berdasarkan kategori</Text>

            {categoryData.length > 0 ? (
              <div style={{ width: '100%', height: 260, marginTop: 16 }}>
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => <span style={{ color: '#64748B', fontSize: 12 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 160, height: 160, borderRadius: '50%', background: '#F1F5F9' }} />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#CBD5E1' }}>Belum ada data proyek</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Area Chart — Tren Pesan Masuk */}
        <Col xs={24} lg={16}>
          <Card
            style={{ borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: '100%' }}
            styles={{ body: { padding: '20px' } }}
          >
            <Title level={5} style={{ margin: 0, color: '#0F172A', fontWeight: 700, marginBottom: 4 }}>
              Tren Pesan Masuk
            </Title>
            <Text style={{ color: '#94A3B8', fontSize: 13 }}>Jumlah pesan kontak 6 bulan terakhir</Text>

            <div style={{ width: '100%', height: 260, marginTop: 16 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={messageTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#94A3B8' }}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#94A3B8' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<AreaTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#4F46E5"
                      strokeWidth={2.5}
                      fill="url(#colorMessages)"
                      dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8, paddingBottom: 30 }}>
                  <div style={{ height: 16, borderRadius: 4, background: '#F1F5F9', width: '90%' }} />
                  <div style={{ height: 16, borderRadius: 4, background: '#F1F5F9', width: '70%' }} />
                  <div style={{ height: 16, borderRadius: 4, background: '#F1F5F9', width: '80%' }} />
                  <div style={{ height: 16, borderRadius: 4, background: '#F1F5F9', width: '60%' }} />
                  <div style={{ height: 16, borderRadius: 4, background: '#F1F5F9', width: '75%' }} />
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ROW 2: STAT WIDGETS */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {statCards.map((card, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card
              style={{ borderRadius: 16, border: `1px solid ${card.border}`, background: card.bg, boxShadow: 'none' }}
              styles={{ body: { padding: '20px 24px' } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ fontSize: 13, color: '#64748B', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    {card.title}
                  </Text>
                  <Statistic
                    value={card.value}
                    styles={{ content: { fontSize: 36, fontWeight: 700, color: '#0F172A', lineHeight: 1.1 } }}
                  />
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ROW 3: RECENT MESSAGES */}
      <Card
        style={{ borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0, color: '#0F172A', fontWeight: 700 }}>
            <MailOutlined style={{ marginRight: 8, color: '#06B6D4' }} />
            Pesan Masuk Terbaru
          </Title>
          <Text style={{ color: '#94A3B8', fontSize: 13 }}>5 pesan kontak terbaru dari pengunjung</Text>
        </div>
        <Table
          columns={recentColumns}
          dataSource={recentMessages}
          rowKey="id"
          pagination={false}
          size="middle"
          style={{ borderRadius: 12, overflow: 'hidden' }}
        />
      </Card>
    </div>
  );
}
