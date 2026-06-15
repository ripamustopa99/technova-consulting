'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Popconfirm, Tag, Space, Typography, Card, Modal, Form, Input, Rate, message, Upload, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, StarFilled, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { createTestimonial, updateTestimonial, deleteTestimonial, getTestimonial } from './actions';
import ResponsiveTable from '@/components/ResponsiveTable';
import Image from 'next/image';

const { Title } = Typography;
const { TextArea } = Input;

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700'],
  display: 'swap',
});

export interface TestimonialData {
  id: string;
  clientName: string;
  company: string | null;
  rating: number;
  createdAt: Date;
}

interface TestimonialsTableProps {
  data: TestimonialData[];
}

export default function TestimonialsTable({ data }: TestimonialsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.clientName.toLowerCase().includes(q) || (item.company?.toLowerCase().includes(q));
      const matchRating = !filterRating || item.rating === Number(filterRating);
      return matchSearch && matchRating;
    });
  }, [data, search, filterRating]);

  const handleOpenModal = async (record?: TestimonialData) => {
    setIsModalOpen(true);
    if (record) {
      setEditingId(record.id);
      const res = await getTestimonial(record.id);
      if (res.success && res.data) {
        const formData: any = { ...res.data };
        if (formData.photo) {
          formData.photo = [
            {
              uid: '-1',
              name: 'photo',
              status: 'done',
              url: formData.photo,
            },
          ];
        }
        setTimeout(() => form.setFieldsValue(formData), 0);
      } else {
        const formData: any = { ...record };
        if (formData.photo) {
          formData.photo = [
            {
              uid: '-1',
              name: 'photo',
              status: 'done',
              url: formData.photo,
            },
          ];
        }
        setTimeout(() => form.setFieldsValue(formData), 0);
      }
    } else {
      setEditingId(null);
      setTimeout(() => form.resetFields(), 0);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTestimonial(id);
    if (res.success) {
      message.success('Testimonial berhasil dihapus');
    } else {
      message.error(res.error || 'Gagal menghapus testimonial');
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload gagal');
      const responseData = await res.json();
      
      onSuccess(responseData, file);
      message.success(`${file.name} berhasil diunggah`);
    } catch (err) {
      console.error(err);
      onError(err);
      message.error(`${file.name} gagal diunggah`);
    }
  };

  const onFinish = async (values: any) => {
    let photoUrl = null;
    if (values.photo && values.photo.length > 0) {
      const file = values.photo[0];
      photoUrl = file.url || (file.response && file.response.secure_url);
    }

    const payload = {
      ...values,
      photo: photoUrl,
    };

    let res;
    if (editingId) {
      res = await updateTestimonial(editingId, payload);
    } else {
      res = await createTestimonial(payload);
    }

    if (res.success) {
      message.success('Testimonial berhasil disimpan!');
      handleCloseModal();
    } else {
      message.error(res.error || 'Gagal menyimpan testimonial');
    }
  };

  const columns = [
    {
      title: 'Nama Klien',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (text: string) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: 'Perusahaan',
      dataIndex: 'company',
      key: 'company',
      render: (text: string | null) => text || <span className="text-slate-400">-</span>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <StarFilled key={i} className="text-amber-400 text-sm" />
          ))}
          <span className="text-slate-500 ml-1 font-medium">{rating}/5</span>
        </div>
      ),
    },
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => (
        <span className="text-slate-500 font-medium">
          {new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: TestimonialData) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium"
            onClick={() => handleOpenModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus Testimonial"
            description={`Yakin ingin menghapus testimoni dari "${record.clientName}"?`}
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
    <>
      <Card 
        className="shadow-sm border border-slate-200 rounded-xl" 
        styles={{ body: { padding: '24px' } }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <Title level={4} className={`${plusJakartaSans.className} m-0 text-slate-800`}>
              Client Testimonials
            </Title>
            <p className="text-slate-500 mt-1">Kelola testimoni dari klien TechNova.</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="bg-cyan-500 hover:bg-cyan-400 border-0 h-10 px-5 rounded-lg shadow-md shadow-cyan-500/20 font-semibold tracking-wide self-start sm:self-auto"
            onClick={() => handleOpenModal()}
          >
            Add Testimonial
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Cari nama klien atau perusahaan..."
            prefix={<SearchOutlined className="text-slate-400" />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg flex-1"
            size="large"
          />
          <Select
            placeholder="Rating"
            allowClear
            value={filterRating}
            onChange={(v) => setFilterRating(v ?? null)}
            className="sm:min-w-[140px]"
            size="large"
            options={[
              { value: '5', label: '⭐⭐⭐⭐⭐ (5)' },
              { value: '4', label: '⭐⭐⭐⭐ (4)' },
              { value: '3', label: '⭐⭐⭐ (3)' },
              { value: '2', label: '⭐⭐ (2)' },
              { value: '1', label: '⭐ (1)' },
            ]}
          />
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

      {/* MODAL FORM CREATE/EDIT */}
      <Modal
        title={<span className={`${plusJakartaSans.className} text-xl text-slate-800`}>{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</span>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
          size="large"
          initialValues={{ rating: 5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="clientName"
              label={<span className="font-semibold text-slate-700">Nama Klien</span>}
              rules={[{ required: true, message: 'Harap masukkan nama klien' }]}
            >
              <Input placeholder="Misal: Budi Santoso" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="company"
              label={<span className="font-semibold text-slate-700">Perusahaan</span>}
            >
              <Input placeholder="Misal: PT Maju Jaya" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="position"
              label={<span className="font-semibold text-slate-700">Jabatan</span>}
            >
              <Input placeholder="Misal: CEO, CTO" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="photo"
              label={<span className="font-semibold text-slate-700">Foto Klien</span>}
              valuePropName="fileList"
              getValueFromEvent={(e: any) => {
                if (Array.isArray(e)) return e;
                return e?.fileList;
              }}
            >
              <Upload.Dragger
                name="file"
                multiple={false}
                maxCount={1}
                customRequest={handleUpload}
                accept="image/*"
                listType="picture"
                className="bg-slate-50 border-slate-200 hover:border-cyan-400 transition-colors"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-cyan-500" />
                </p>
                <p className="ant-upload-text font-medium text-slate-700">
                  Klik atau drag file ke area ini
                </p>
                <p className="ant-upload-hint text-slate-500 text-sm">
                  Format: JPG, PNG, WEBP (Max 1 foto)
                </p>
              </Upload.Dragger>
            </Form.Item>
          </div>

          <Form.Item
            name="testimonial"
            label={<span className="font-semibold text-slate-700">Isi Testimonial</span>}
            rules={[{ required: true, message: 'Harap masukkan isi testimoni' }]}
          >
            <TextArea rows={4} placeholder="Tulis testimoni klien di sini..." className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="rating"
            label={<span className="font-semibold text-slate-700">Rating</span>}
          >
            <Rate className="text-amber-400" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <Button size="large" onClick={handleCloseModal} className="rounded-lg font-medium">
              Batal
            </Button>
            <Button type="primary" htmlType="submit" size="large" className="bg-slate-900 hover:bg-slate-800 border-0 rounded-lg font-medium px-8 shadow-lg shadow-slate-900/20">
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
