'use client';

import React from 'react';
import { Table, Button, Popconfirm, Tag, Space, Typography, Card, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { deleteBlog } from './actions';
import ResponsiveTable from '@/components/ResponsiveTable';

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

      <ResponsiveTable>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{ pageSize: 10, className: 'mt-6' }}
          className="border border-slate-100 rounded-xl overflow-hidden [&_.ant-table-thead_th]:bg-slate-50 [&_.ant-table-thead_th]:text-slate-500 [&_.ant-table-thead_th]:font-semibold"
        />
      </ResponsiveTable>
    </Card>
  );
}
