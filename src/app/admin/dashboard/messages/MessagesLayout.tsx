'use client';

import React, { useState, useMemo } from 'react';
import { Typography, Card, Badge, Button, Popconfirm, Empty, Tag, Input, Select, message } from 'antd';
import { MailOutlined, CheckOutlined, DeleteOutlined, ClockCircleOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { getMessageDetail, markAsRead, deleteMessage } from './actions';

const { Title, Text, Paragraph } = Typography;

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

export interface MessageListItem {
  id: string;
  name: string;
  email: string;
  isRead: boolean;
  createdAt: Date;
}

interface MessageDetail {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface MessagesLayoutProps {
  data: MessageListItem[];
}

export default function MessagesLayout({ data }: MessagesLayoutProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MessageDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((msg) => {
      const q = search.toLowerCase();
      const matchSearch = !q || msg.name.toLowerCase().includes(q) || msg.email.toLowerCase().includes(q);
      const matchRead = filterRead === null || (filterRead === 'unread' ? !msg.isRead : msg.isRead);
      return matchSearch && matchRead;
    });
  }, [data, search, filterRead]);

  const handleSelectMessage = async (id: string) => {
    setSelectedId(id);
    setLoadingDetail(true);
    const res = await getMessageDetail(id);
    if (res.success && res.data) {
      const messageData = res.data as MessageDetail;
      setDetail(messageData);
      
      // Otomatis tandai sebagai sudah dibaca jika belum
      if (!messageData.isRead) {
        const readRes = await markAsRead(id);
        if (readRes.success) {
          setDetail({ ...messageData, isRead: true });
        }
      }
    }
    setLoadingDetail(false);
  };

  const handleMarkAsRead = async () => {
    if (!selectedId) return;
    const res = await markAsRead(selectedId);
    if (res.success) {
      message.success('Pesan ditandai sudah dibaca');
      if (detail) setDetail({ ...detail, isRead: true });
    } else {
      message.error(res.error || 'Gagal menandai pesan');
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteMessage(id);
    if (res.success) {
      message.success('Pesan berhasil dihapus');
      if (selectedId === id) {
        setSelectedId(null);
        setDetail(null);
      }
    } else {
      message.error(res.error || 'Gagal menghapus pesan');
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <div className="mb-6">
        <Title level={4} className={`${plusJakartaSans.className} m-0 text-slate-800`}>
          <MailOutlined className="mr-2 text-cyan-500" />Contact Messages
        </Title>
        <p className="text-slate-500 mt-1">Pesan masuk dari pengunjung website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[600px]">
        {/* LEFT PANEL — Message List */}
        <div className="lg:col-span-4">
          <Card
            className="shadow-sm border border-slate-200 rounded-xl h-full"
            styles={{ body: { padding: 0 } }}
          >
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <Text className="font-semibold text-slate-600 text-sm">Inbox ({filteredData.length}{filteredData.length !== data.length ? ` / ${data.length}` : ''})</Text>
            </div>

            {/* Search & Filter */}
            <div className="px-3 py-2 border-b border-slate-100 space-y-2">
              <Input
                placeholder="Cari nama atau email..."
                prefix={<SearchOutlined className="text-slate-400" />}
                allowClear
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg"
              />
              <Select
                placeholder="Semua pesan"
                allowClear
                size="small"
                value={filterRead}
                onChange={(v) => setFilterRead(v ?? null)}
                className="w-full"
                options={[
                  { value: 'unread', label: 'Belum Dibaca' },
                  { value: 'read', label: 'Sudah Dibaca' },
                ]}
              />
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {filteredData.length === 0 ? (
                <div className="p-8 text-center">
                  <Empty description="Tidak ada pesan yang cocok" />
                </div>
              ) : (
                filteredData.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`px-4 py-3 border-b border-slate-50 cursor-pointer transition-colors duration-150 hover:bg-cyan-50/50
                      ${selectedId === msg.id ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : ''}
                      ${!msg.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${!msg.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                        {msg.name}
                      </span>
                      {!msg.isRead && <Badge status="processing" />}
                    </div>
                    <Text className="text-xs text-slate-400 block">{msg.email}</Text>
                    <Text className="text-xs text-slate-400 mt-1 block">
                      <ClockCircleOutlined className="mr-1" />{formatDate(msg.createdAt)}
                    </Text>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL — Message Detail */}
        <div className="lg:col-span-8">
          <Card
            className="shadow-sm border border-slate-200 rounded-xl h-full"
            styles={{ body: { padding: '28px' } }}
          >
            {!selectedId || !detail ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <MailOutlined className="text-5xl text-slate-200 mb-4" />
                  <p className="text-slate-400 font-medium">Pilih pesan di sebelah kiri untuk melihat detailnya.</p>
                </div>
              </div>
            ) : loadingDetail ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-slate-400">Memuat pesan...</p>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-100">
                  <div>
                    <Title level={4} className="m-0 text-slate-800">{detail.name}</Title>
                    <div className="flex items-center gap-3 mt-2">
                      <Text className="text-slate-500 text-sm">
                        <MailOutlined className="mr-1" />{detail.email}
                      </Text>
                      {detail.company && (
                        <Text className="text-slate-500 text-sm">
                          <UserOutlined className="mr-1" />{detail.company}
                        </Text>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Text className="text-slate-400 text-xs">
                        <ClockCircleOutlined className="mr-1" />{formatDate(detail.createdAt)}
                      </Text>
                      {detail.isRead
                        ? <Tag color="green" className="rounded-md text-xs">Sudah Dibaca</Tag>
                        : <Tag color="blue" className="rounded-md text-xs">Belum Dibaca</Tag>
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!detail.isRead && (
                      <Button
                        icon={<CheckOutlined />}
                        onClick={handleMarkAsRead}
                        className="text-green-600 border-green-200 hover:bg-green-50 font-medium rounded-lg"
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Popconfirm
                      title="Hapus Pesan"
                      description="Yakin ingin menghapus pesan ini?"
                      onConfirm={() => handleDelete(detail.id)}
                      okText="Ya, Hapus"
                      cancelText="Batal"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        className="font-medium rounded-lg"
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <Paragraph className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap m-0">
                    {detail.message}
                  </Paragraph>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
