'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Popconfirm, Tag, Space, Typography, Card, Modal, Form, Input, Switch, Select, Upload, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { createProject, updateProject, deleteProject, getProjectDetail } from './actions';
import ResponsiveTable from '@/components/ResponsiveTable';

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700'],
  display: 'swap',
});

export interface ProjectData {
  id: string;
  title: string;
  client: string | null;
  category: string | null;
  featured: boolean;
}

interface PortfolioTableProps {
  data: ProjectData[];
}

export default function PortfolioTable({ data }: PortfolioTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterFeatured, setFilterFeatured] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.title.toLowerCase().includes(q) || (item.client?.toLowerCase().includes(q)) || (item.category?.toLowerCase().includes(q));
      const matchCategory = !filterCategory || item.category === filterCategory;
      const matchFeatured = filterFeatured === null || (filterFeatured === 'featured' ? item.featured : !item.featured);
      return matchSearch && matchCategory && matchFeatured;
    });
  }, [data, search, filterCategory, filterFeatured]);

  const handleOpenModal = async (record?: ProjectData) => {
    setIsModalOpen(true);
    if (record) {
      setEditingId(record.id);
      setLoadingForm(true);
      const res = await getProjectDetail(record.id);
      if (res.success && res.data) {
        const fullData = res.data;

        // Ubah relasi gambar dari database menjadi format fileList Ant Design
        const fileList = (fullData.images || []).map((imgObj: any) => ({
          uid: imgObj.id,
          name: imgObj.image.split('/').pop() || 'image.png',
          status: 'done',
          url: imgObj.image,
        }));

        form.setFieldsValue({
          ...fullData,
          technology: fullData.technology ? fullData.technology.split(', ') : [],
          images: fileList,
        });
      }
      setLoadingForm(false);
    } else {
      setEditingId(null);
      form.resetFields();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteProject(id);
    if (res.success) {
      message.success(`Project berhasil dihapus`);
    } else {
      message.error(res.error || 'Gagal menghapus project');
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
    // Ekstrak URL gambar dari fileList (baik yang sudah ada maupun yang baru diunggah)
    const imageUrls = (values.images || [])
      .map((file: any) => {
        if (file.url) return file.url;
        if (file.response && file.response.secure_url) return file.response.secure_url;
        return null;
      })
      .filter((url: string | null): url is string => url !== null);

    const submitData = {
      ...values,
      images: imageUrls,
    };

    let res;
    if (editingId) {
      res = await updateProject(editingId, submitData);
    } else {
      res = await createProject(submitData);
    }

    if (res.success) {
      message.success('Project berhasil disimpan!');
      handleCloseModal();
    } else {
      message.error(res.error || 'Gagal menyimpan project');
    }
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (text: string | null) => text || '-',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string | null) => text ? <Tag color="cyan" className="rounded-md px-2">{text}</Tag> : '-',
    },
    {
      title: 'Featured Status',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured: boolean) => (
        featured ? <Tag color="purple" className="font-semibold rounded-md">Featured</Tag> : <Tag color="default" className="rounded-md">Regular</Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: ProjectData) => (
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
            title="Hapus Project"
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
    <>
      <Card 
        className="shadow-sm border border-slate-200 rounded-xl" 
        styles={{ body: { padding: '24px' } }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <Title level={4} className={`${plusJakartaSans.className} m-0 text-slate-800`}>
              Portfolio Showcases
            </Title>
            <p className="text-slate-500 mt-1">Kelola portofolio dan studi kasus proyek.</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="bg-cyan-500 hover:bg-cyan-400 border-0 h-10 px-5 rounded-lg shadow-md shadow-cyan-500/20 font-semibold tracking-wide self-start sm:self-auto"
            onClick={() => handleOpenModal()}
          >
            Add New Project
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Cari project, client, atau kategori..."
            prefix={<SearchOutlined className="text-slate-400" />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            <Select
              placeholder="Kategori"
              allowClear
              value={filterCategory}
              onChange={(v) => setFilterCategory(v ?? null)}
              className="min-w-[140px] flex-1 sm:flex-none"
              options={[
                { value: 'Web Development', label: 'Web Development' },
                { value: 'Mobile App', label: 'Mobile App' },
                { value: 'Cloud Solutions', label: 'Cloud Solutions' },
                { value: 'Cybersecurity', label: 'Cybersecurity' },
              ]}
            />
            <Select
              placeholder="Status"
              allowClear
              value={filterFeatured}
              onChange={(v) => setFilterFeatured(v ?? null)}
              className="min-w-[120px] flex-1 sm:flex-none"
              options={[
                { value: 'featured', label: 'Featured' },
                { value: 'regular', label: 'Regular' },
              ]}
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

      {/* MODAL FORM CREATE/EDIT */}
      <Modal
        title={<span className={`${plusJakartaSans.className} text-xl text-slate-800`}>{editingId ? 'Edit Project' : 'Add New Project'}</span>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
        >
          <Spin spinning={loadingForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Form.Item
                name="title"
                label={<span className="font-semibold text-slate-700">Project Name</span>}
                rules={[{ required: true, message: 'Harap masukkan nama project' }]}
              >
                <Input placeholder="Misal: ERP System for Enterprise" size="large" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                name="client"
                label={<span className="font-semibold text-slate-700">Client</span>}
              >
                <Input placeholder="Nama perusahaan klien" size="large" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                name="category"
                label={<span className="font-semibold text-slate-700">Category</span>}
              >
                <Select placeholder="Pilih kategori" size="large" className="rounded-lg">
                  <Select.Option value="Web Development">Web Development</Select.Option>
                  <Select.Option value="Mobile App">Mobile App</Select.Option>
                  <Select.Option value="Cloud Solutions">Cloud Solutions</Select.Option>
                  <Select.Option value="Cybersecurity">Cybersecurity</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="technology"
                label={<span className="font-semibold text-slate-700">Tech Stack Tags</span>}
              >
                <Select mode="tags" placeholder="Ketik lalu tekan enter (Misal: React, Node.js)" size="large" className="rounded-lg" />
              </Form.Item>
            </div>

            <Form.Item
              name="challenge"
              label={<span className="font-semibold text-slate-700">The Challenge</span>}
            >
              <TextArea rows={4} placeholder="Jelaskan masalah awal yang dihadapi klien..." className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="solution"
              label={<span className="font-semibold text-slate-700">The Solution</span>}
            >
              <TextArea rows={4} placeholder="Jelaskan solusi teknis yang diberikan..." className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="result"
              label={<span className="font-semibold text-slate-700">The Results</span>}
            >
              <TextArea rows={4} placeholder="Hasil, data, atau pencapaian yang didapat..." className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="featured"
              label={<span className="font-semibold text-slate-700">Featured Status</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Featured" unCheckedChildren="Regular" />
            </Form.Item>

            <Form.Item
              name="images"
              label={<span className="font-semibold text-slate-700">Thumbnail & Gallery Images</span>}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList;
              }}
            >
              <Dragger
                customRequest={handleUpload}
                multiple
                listType="picture"
                className="bg-slate-50 border-slate-300"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-cyan-500" />
                </p>
                <p className="ant-upload-text font-semibold text-slate-700">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint text-slate-500 px-4">
                  Gambar pertama otomatis akan menjadi Thumbnail. Anda dapat melakukan drag-and-drop beberapa gambar sekaligus untuk kebutuhan galeri studi kasus.
                </p>
              </Dragger>
            </Form.Item>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
              <Button size="large" onClick={handleCloseModal} className="rounded-lg font-medium hover:bg-slate-100">
                Batal
              </Button>
              <Button type="primary" htmlType="submit" size="large" className="bg-slate-900 hover:bg-slate-800 border-0 rounded-lg font-medium px-8 shadow-lg shadow-slate-900/20">
                Simpan Project
              </Button>
            </div>
          </Spin>
        </Form>
      </Modal>
    </>
  );
}
