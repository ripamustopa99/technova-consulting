'use client';

import React, { useState } from 'react';
import { Tabs, Form, Input, Button, Card, Typography, message, Select, Modal } from 'antd';
import { GlobalOutlined, PhoneOutlined, ShareAltOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { updateSettings } from './actions';

const { Title } = Typography;

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

interface SettingsFormProps {
  initialData: Record<string, string>;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [form] = Form.useForm();
  const [customForm] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  // Inisialisasi daftar platform kustom dari data awal database
  const [customPlatforms, setCustomPlatforms] = useState<{ label: string; value: string; customIconUrl: string; isCustom: boolean }[]>(() => {
    try {
      if (initialData.social_links) {
        const parsed = JSON.parse(initialData.social_links);
        if (Array.isArray(parsed)) {
          const list: { label: string; value: string; customIconUrl: string; isCustom: boolean }[] = [];
          parsed.forEach((item: any) => {
            if (item.isCustom && item.platform) {
              const lowerName = item.platform.toLowerCase();
              if (!list.some(p => p.value === lowerName)) {
                list.push({
                  label: item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
                  value: lowerName,
                  customIconUrl: item.customIconUrl || '',
                  isCustom: true,
                });
              }
            }
          });
          return list;
        }
      }
    } catch (e) {
      console.error('Gagal parse platform kustom dari data awal:', e);
    }
    return [];
  });

  // Ambil data awal social_links (di-parse dari JSON String)
  const initialSocialLinks = React.useMemo(() => {
    try {
      if (initialData.social_links) {
        return JSON.parse(initialData.social_links);
      }
    } catch (e) {
      console.error('Gagal parsing social_links awal:', e);
    }
    return [];
  }, [initialData.social_links]);

  const initialValues = React.useMemo(() => ({
    ...initialData,
    social_links: initialSocialLinks,
  }), [initialData, initialSocialLinks]);

  const handleOpenCustomModal = (index: number) => {
    setEditingFieldIndex(index);
    setIsModalOpen(true);
  };

  const handleCustomSubmit = () => {
    customForm.validateFields().then((values) => {
      const { platformName, customIconUrl } = values;
      const lowerName = platformName.toLowerCase().trim();

      const newOption = {
        label: platformName.trim(),
        value: lowerName,
        customIconUrl: customIconUrl.trim(),
        isCustom: true,
      };

      // Simpan ke daftar pilihan kustom dropdown
      setCustomPlatforms((prev) => {
        if (prev.some(p => p.value === lowerName)) {
          return prev.map(p => p.value === lowerName ? newOption : p);
        }
        return [...prev, newOption];
      });

      // Set value form untuk baris terkait
      if (editingFieldIndex !== null) {
        form.setFieldValue(['social_links', editingFieldIndex, 'platform'], lowerName);
        form.setFieldValue(['social_links', editingFieldIndex, 'isCustom'], true);
        form.setFieldValue(['social_links', editingFieldIndex, 'customIconUrl'], customIconUrl.trim());
      }

      customForm.resetFields();
      setIsModalOpen(false);
    });
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    const res = await updateSettings(values);
    setIsSubmitting(false);

    if (res.success) {
      message.success('Pengaturan berhasil disimpan!');
    } else {
      message.error(res.error || 'Gagal menyimpan pengaturan');
    }
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span className="font-medium">
          <GlobalOutlined className="mr-2" />General
        </span>
      ),
      children: (
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="company_name"
              label={<span className="font-semibold text-slate-700">Company Name</span>}
            >
              <Input placeholder="TechNova Consulting" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="tagline"
              label={<span className="font-semibold text-slate-700">Tagline</span>}
            >
              <Input placeholder="Empowering Digital Transformation" size="large" className="rounded-lg" />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: (
        <span className="font-medium">
          <PhoneOutlined className="mr-2" />Contact Info
        </span>
      ),
      children: (
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="contact_email"
              label={<span className="font-semibold text-slate-700">Email</span>}
            >
              <Input placeholder="info@technova.com" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="contact_phone"
              label={<span className="font-semibold text-slate-700">Phone</span>}
            >
              <Input placeholder="+62 812 3456 7890" size="large" className="rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="contact_address"
            label={<span className="font-semibold text-slate-700">Address</span>}
          >
            <Input.TextArea rows={3} placeholder="Jl. Sudirman No. 123, Jakarta Pusat" size="large" className="rounded-lg" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'social',
      label: (
        <span className="font-medium">
          <ShareAltOutlined className="mr-2" />Social Media
        </span>
      ),
      children: (
        <div className="py-4">
          <Form.List name="social_links">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-4">
                {fields.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShareAltOutlined className="text-3xl text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">Belum ada social media</p>
                    <p className="text-slate-300 text-xs mt-1">Klik tombol di bawah untuk menambahkan</p>
                  </div>
                )}
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-slate-50 p-4 rounded-xl border border-slate-200 relative group"
                  >
                    <div className="w-full sm:w-1/3">
                      <span className="block text-xs font-semibold text-slate-600 mb-1">Platform</span>
                      <div className="flex gap-2">
                        <Form.Item
                          {...restField}
                          name={[name, 'platform']}
                          rules={[{ required: true, message: 'Platform wajib dipilih' }]}
                          noStyle
                        >
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
                                form.setFieldValue(['social_links', name, 'customIconUrl'], custom.customIconUrl || '');
                              } else {
                                form.setFieldValue(['social_links', name, 'isCustom'], false);
                                form.setFieldValue(['social_links', name, 'customIconUrl'], '');
                              }
                            }}
                          />
                        </Form.Item>
                        <Button
                          type="primary"
                          size="large"
                          icon={<PlusOutlined />}
                          onClick={() => handleOpenCustomModal(name)}
                          className="flex-shrink-0"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <span className="block text-xs font-semibold text-slate-600 mb-1">URL / No HP / Email</span>
                      <Form.Item
                        {...restField}
                        name={[name, 'url']}
                        rules={[{ required: true, message: 'URL/Username/Nomor wajib diisi' }]}
                        noStyle
                      >
                        <Input placeholder="Contoh: https://... atau nomor HP" size="large" className="rounded-lg" />
                      </Form.Item>
                    </div>

                    {/* Hidden fields */}
                    <Form.Item {...restField} name={[name, 'isCustom']} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'customIconUrl']} hidden>
                      <Input />
                    </Form.Item>

                    <div>
                      <Button
                        danger
                        type="text" 
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        className="hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add({ platform: 'whatsapp', isCustom: false, customIconUrl: '', url: '' })}
                  block
                  icon={<PlusOutlined />}
                  size="large"
                  className="border-slate-300 text-slate-600 hover:text-slate-800 hover:border-slate-500 h-12 rounded-xl"
                >
                  Tambah Platform / Kontak Baru
                </Button>
              </div>
            )}
          </Form.List>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        className="shadow-sm border border-slate-200 rounded-xl"
        styles={{ body: { padding: '28px' } }}
      >
        <div className="mb-6 pb-5 border-b border-slate-100">
          <Title level={4} className={`${plusJakartaSans.className} m-0 text-slate-800`}>
            Website Settings
          </Title>
          <p className="text-slate-500 mt-1">Konfigurasi informasi dasar website TechNova.</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab]:px-5 [&_.ant-tabs-tab]:py-3"
          />

          <div className="flex justify-end pt-6 mt-4 border-t border-slate-100">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              icon={<SaveOutlined />}
              className="bg-slate-900 hover:bg-slate-800 border-0 rounded-lg font-medium px-8 shadow-lg shadow-slate-900/20"
            >
              Save All Settings
            </Button>
          </div>
        </Form>
      </Card>

      <Modal
        title={
          <span className={`${plusJakartaSans.className} text-slate-800 font-bold text-lg`}>
            Tambah Platform Kustom
          </span>
        }
        open={isModalOpen}
        onOk={handleCustomSubmit}
        onCancel={() => {
          customForm.resetFields();
          setIsModalOpen(false);
        }}
        okText="Tambah"
        cancelText="Batal"
        okButtonProps={{ className: 'bg-slate-900 hover:bg-slate-800 border-0' }}
      >
        <Form
          form={customForm}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="platformName"
            label={<span className="font-semibold text-slate-700">Platform Name</span>}
            rules={[{ required: true, message: 'Platform Name wajib diisi' }]}
          >
            <Input placeholder="Contoh: GitHub, TikTok" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="customIconUrl"
            label={<span className="font-semibold text-slate-700">Custom Icon Link / SVG Path</span>}
            rules={[{ required: true, message: 'Custom Icon Link wajib diisi' }]}
          >
            <Input placeholder="Contoh: https://example.com/icons/github.svg" size="large" className="rounded-lg" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
