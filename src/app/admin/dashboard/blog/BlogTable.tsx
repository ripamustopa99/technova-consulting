'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Popconfirm, Tag, Space, Typography, Card, Input, Select, DatePicker, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { deleteBlog } from './actions';
import ResponsiveTable from '@/components/ResponsiveTable';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700'],
  display: 'swap',
});

export interface BlogData {
  id: string;
  title: string;
  author: string;
  status: string;
  createdAt: Date;
}

interface BlogTableProps {
  data: BlogData[];
}

export default function BlogTable({ data }: BlogTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q);
      const matchStatus = !filterStatus || item.status === filterStatus;
      let matchDate = true;
      if (filterDate?.[0] && filterDate?.[1]) {
        const d = new Date(item.createdAt);
        matchDate = d >= filterDate[0].startOf('day').toDate() && d <= filterDate[1].endOf('day').toDate();
      }
      return matchSearch && matchStatus && matchDate;
    });
  }, [data, search, filterStatus, filterDate]);

  const handleDelete = async (id: string) => {
    const res = await deleteBlog(id);
    if (res.success) {
      message.success('Artikel berhasil dihapus');
    } else {
      message.error(res.error || 'Gagal menghapus artikel');
    }
  };

  const columns = [
    {
      title: 'Judul Artikel',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: 'Penulis',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Tanggal Publikasi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => (
        <span className="text-slate-500 font-medium">
          {new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'PUBLISHED' ? 'green' : status === 'DRAFT' ? 'gold' : 'red';
        return <Tag color={color} className="font-semibold px-3 py-1 rounded-md tracking-wide">{status}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: BlogData) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium"
            onClick={() => router.push(`/admin/dashboard/blog/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus Artikel"
            description={`Apakah Anda yakin ingin menghapus "${record.title}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true, className: 'font-medium' }}
            cancelButtonProps={{ className: 'font-medium' }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              className="font-medium"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      className="shadow-sm border border-slate-200 rounded-xl" 
      styles={{ body: { padding: '24px' } }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <Title level={4} className={`${plusJakartaSans.className} m-0 text-slate-800`}>
            Daftar Artikel Blog
          </Title>
          <p className="text-slate-500 mt-1">Kelola artikel yang diterbitkan untuk SEO dan berita TechNova.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="bg-cyan-500 hover:bg-cyan-400 border-0 h-10 px-5 rounded-lg shadow-md shadow-cyan-500/20 font-semibold tracking-wide self-start sm:self-auto"
          onClick={() => router.push('/admin/dashboard/blog/create')}
        >
          Add New Article
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Cari judul atau penulis..."
          prefix={<SearchOutlined className="text-slate-400" />}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          <Select
            placeholder="Status"
            allowClear
            value={filterStatus}
            onChange={(v) => setFilterStatus(v ?? null)}
            className="min-w-[130px] flex-1 sm:flex-none"
            options={[
              { value: 'PUBLISHED', label: 'Published' },
              { value: 'DRAFT', label: 'Draft' },
            ]}
          />
          <DatePicker.RangePicker
            value={filterDate}
            onChange={(dates) => setFilterDate(dates)}
            className="flex-1 sm:flex-none"
            placeholder={['Dari tanggal', 'Sampai tanggal']}
          />
        </div>
      </div>

      <ResponsiveTable>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 10, className: 'mt-6' }}
          className="border border-slate-100 rounded-xl overflow-hidden [&_.ant-table-thead_th]:bg-slate-50 [&_.ant-table-thead_th]:text-slate-500 [&_.ant-table-thead_th]:font-semibold"
        />
      </ResponsiveTable>
    </Card>
  );
}
