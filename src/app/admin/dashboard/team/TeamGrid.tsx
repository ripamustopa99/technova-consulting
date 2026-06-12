'use client';

import React, { useState } from 'react';
import { Card, Button, Popconfirm, Typography, Modal, Form, Input, Avatar, message, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, InboxOutlined, LinkOutlined, PictureOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { createTeamMember, updateTeamMember, deleteTeamMember, getTeamMember } from './actions';
import { Upload } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700'],
  display: 'swap',
});

export interface TeamData {
  id: string;
  name: string;
  position: string;
  photo: string | null;
}

interface TeamGridProps {
  data: TeamData[];
}

export default function TeamGrid({ data }: TeamGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  
  // State untuk modal custom platform
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customPlatformName, setCustomPlatformName] = useState('');
  const [customPlatformIcon, setCustomPlatformIcon] = useState('');
  const [customPlatforms, setCustomPlatforms] = useState<{label: string, value: string, customIconUrl?: string}[]>([]);

  const handleOpenModal = async (record?: TeamData) => {
    setIsModalOpen(true);
    if (record) {
      setEditingId(record.id);
      const res = await getTeamMember(record.id);
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
        try {
          formData.social_links = formData.linkedin ? JSON.parse(formData.linkedin) : [];
        } catch(e) {
          formData.social_links = [];
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
        formData.social_links = [];
        setTimeout(() => form.setFieldsValue(formData), 0);
      }
    } else {
      setEditingId(null);
      setTimeout(() => {
        form.resetFields();
        form.setFieldsValue({ social_links: [] });
      }, 0);
    }
  };

  const handleAddCustomPlatform = () => {
    if (!customPlatformName.trim()) {
      message.error('Nama platform tidak boleh kosong');
      return;
    }
    const newValue = customPlatformName.toLowerCase().replace(/[^a-z0-9]/g, '');
    setCustomPlatforms(prev => [
      ...prev,
      { label: customPlatformName, value: newValue, customIconUrl: customPlatformIcon }
    ]);
    setIsCustomModalOpen(false);
    setCustomPlatformName('');
    setCustomPlatformIcon('');
    message.success(`Platform ${customPlatformName} ditambahkan. Silakan pilih di dropdown.`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTeamMember(id);
    if (res.success) {
      message.success('Anggota tim berhasil dihapus');
    } else {
      message.error(res.error || 'Gagal menghapus anggota tim');
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
      linkedin: JSON.stringify(values.social_links || []),
    };

    let res;
    if (editingId) {
      res = await updateTeamMember(editingId, payload);
    } else {
      res = await createTeamMember(payload);
    }

    if (res.success) {
      message.success('Data tim berhasil disimpan!');
      handleCloseModal();
    } else {
      message.error(res.error || 'Gagal menyimpan data tim');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} className={`${plusJakartaSans.className} m-0 text-slate-800`}>
            Team Management
          </Title>
          <p className="text-slate-500 mt-1">Kelola profil anggota tim TechNova.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="bg-cyan-500 hover:bg-cyan-400 border-0 h-10 px-5 rounded-lg shadow-md shadow-cyan-500/20 font-semibold tracking-wide"
          onClick={() => handleOpenModal()}
        >
          Add Member
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="shadow-sm border border-slate-200 rounded-xl text-center py-12">
          <UserOutlined className="text-4xl text-slate-300 mb-4" />
          <p className="text-slate-400 font-medium">Belum ada anggota tim. Klik "Add Member" untuk memulai.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.map((member) => (
            <Card
              key={member.id}
              className="shadow-sm border border-slate-200 rounded-xl hover:shadow-md transition-shadow duration-200"
              styles={{ body: { padding: '24px', textAlign: 'center' } }}
              actions={[
                <Button 
                  key="edit"
                  type="text" 
                  icon={<EditOutlined />}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => handleOpenModal(member)}
                >
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Hapus Anggota Tim"
                  description={`Yakin ingin menghapus "${member.name}"?`}
                  onConfirm={() => handleDelete(member.id)}
                  okText="Ya, Hapus"
                  cancelText="Batal"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    className="font-medium"
                  >
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Avatar 
                size={80} 
                src={member.photo} 
                icon={<UserOutlined />}
                className="mb-4 bg-gradient-to-br from-cyan-400 to-indigo-500"
              />
              <Title level={5} className="m-0 text-slate-800">{member.name}</Title>
              <Text className="text-cyan-600 font-medium text-sm">{member.position}</Text>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL FORM CREATE/EDIT */}
      <Modal
        title={<span className={`${plusJakartaSans.className} text-xl text-slate-800`}>{editingId ? 'Edit Member' : 'Add New Member'}</span>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={560}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
          size="large"
        >
          <Form.Item
            name="name"
            label={<span className="font-semibold text-slate-700">Nama Lengkap</span>}
            rules={[{ required: true, message: 'Harap masukkan nama' }]}
          >
            <Input placeholder="Misal: John Doe" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="position"
            label={<span className="font-semibold text-slate-700">Jabatan / Posisi</span>}
            rules={[{ required: true, message: 'Harap masukkan posisi' }]}
          >
            <Input placeholder="Misal: CTO, Lead Developer" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="photo"
            label={<span className="font-semibold text-slate-700">Foto Anggota</span>}
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

          <Form.Item
            name="bio"
            label={<span className="font-semibold text-slate-700">Bio</span>}
          >
            <TextArea rows={4} placeholder="Deskripsi singkat tentang anggota tim ini..." className="rounded-lg" />
          </Form.Item>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 mb-2">
            <h4 className="font-semibold text-slate-700 mb-4 flex items-center"><LinkOutlined className="mr-2 text-cyan-500" />Social Media & Links</h4>
            <Form.List name="social_links">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-4">
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-white p-4 rounded-xl border border-slate-200 relative group shadow-sm"
                    >
                      <div className="w-full sm:w-1/3">
                        <span className="block text-xs font-semibold text-slate-600 mb-1">Platform</span>
                        <Form.Item
                          {...restField}
                          name={[name, 'platform']}
                          rules={[{ required: true, message: 'Platform wajib dipilih' }]}
                          noStyle
                        >
                          <Space.Compact style={{ width: '100%' }}>
                            <Select
                              placeholder="Pilih Platform"
                              size="large"
                              className="w-full"
                              options={[
                                { label: 'WhatsApp', value: 'whatsapp' },
                                { label: 'Instagram', value: 'instagram' },
                                { label: 'LinkedIn', value: 'linkedin' },
                                { label: 'Email', value: 'email' },
                                ...customPlatforms.map(p => ({ label: p.label, value: p.value })),
                              ]}
                              onChange={(val) => {
                                const custom = customPlatforms.find(p => p.value === val);
                                if (custom) {
                                  form.setFieldValue(['social_links', name, 'isCustom'], true);
                                  form.setFieldValue(['social_links', name, 'customIconUrl'], custom.customIconUrl);
                                } else {
                                  form.setFieldValue(['social_links', name, 'isCustom'], false);
                                  form.setFieldValue(['social_links', name, 'customIconUrl'], undefined);
                                }
                              }}
                            />
                            <Button
                              type="primary"
                              size="large"
                              icon={<PlusOutlined />}
                              onClick={() => setIsCustomModalOpen(true)}
                              className="bg-slate-800 hover:bg-slate-700"
                              title="Tambah Platform Kustom"
                            />
                          </Space.Compact>
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'isCustom']} hidden><Input /></Form.Item>
                        <Form.Item {...restField} name={[name, 'customIconUrl']} hidden><Input /></Form.Item>
                      </div>

                      <div className="w-full sm:w-2/3 flex-1">
                        <span className="block text-xs font-semibold text-slate-600 mb-1">URL / Link</span>
                        <Form.Item
                          {...restField}
                          name={[name, 'url']}
                          rules={[{ required: true, message: 'URL tidak boleh kosong' }]}
                          noStyle
                        >
                          <Input placeholder="https://..." size="large" className="rounded-lg" />
                        </Form.Item>
                      </div>

                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        className="absolute -top-3 -right-3 bg-red-50 border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-500 hover:text-white"
                        shape="circle"
                      />
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    size="large"
                    className="border-slate-300 text-slate-500 hover:text-cyan-600 hover:border-cyan-500 rounded-xl"
                  >
                    Tambah Link / Social Media
                  </Button>
                </div>
              )}
            </Form.List>
          </div>

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

      {/* MODAL CUSTOM PLATFORM */}
      <Modal
        title="Tambah Platform Kustom"
        open={isCustomModalOpen}
        onOk={handleAddCustomPlatform}
        onCancel={() => {
          setIsCustomModalOpen(false);
          setCustomPlatformName('');
          setCustomPlatformIcon('');
        }}
        okText="Tambah"
        cancelText="Batal"
        okButtonProps={{ className: 'bg-cyan-500 hover:bg-cyan-400 border-0' }}
      >
        <div className="py-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Platform</label>
            <Input
              placeholder="Contoh: TikTok, Discord, GitHub"
              value={customPlatformName}
              onChange={e => setCustomPlatformName(e.target.value)}
              size="large"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <PictureOutlined className="mr-2" />
              URL Icon (Opsional)
            </label>
            <Input
              placeholder="https://example.com/icon.png"
              value={customPlatformIcon}
              onChange={e => setCustomPlatformIcon(e.target.value)}
              size="large"
            />
            <p className="text-xs text-slate-500 mt-2">
              Masukkan URL gambar SVG/PNG untuk icon platform ini. Jika kosong, tidak akan ada icon yang ditampilkan.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
