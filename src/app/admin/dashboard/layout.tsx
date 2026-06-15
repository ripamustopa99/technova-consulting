 'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button, Typography, Drawer, Badge, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ProjectOutlined,
  FileTextOutlined,
  TeamOutlined,
  StarOutlined,
  MailOutlined,
  SettingOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  LoadingOutlined,
  BellOutlined,
  KeyOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link href="/admin/dashboard">Dashboard</Link> },
  { key: '/admin/dashboard/services', icon: <AppstoreOutlined />, label: <Link href="/admin/dashboard/services">Services</Link> },
  { key: '/admin/dashboard/portfolio', icon: <ProjectOutlined />, label: <Link href="/admin/dashboard/portfolio">Portfolio</Link> },
  { key: '/admin/dashboard/blog', icon: <FileTextOutlined />, label: <Link href="/admin/dashboard/blog">Blog</Link> },
  { key: '/admin/dashboard/team', icon: <TeamOutlined />, label: <Link href="/admin/dashboard/team">Team</Link> },
  { key: '/admin/dashboard/testimonials', icon: <StarOutlined />, label: <Link href="/admin/dashboard/testimonials">Testimonials</Link> },
  { key: '/admin/dashboard/settings', icon: <SettingOutlined />, label: <Link href="/admin/dashboard/settings">Settings</Link> },
];

const breadcrumbNameMap: Record<string, string> = {
  admin: 'Admin', dashboard: 'Dashboard', services: 'Services', portfolio: 'Portfolio',
  blog: 'Blog', team: 'Team', testimonials: 'Testimonials', messages: 'Messages',
  settings: 'Settings', create: 'Create',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileName, setProfileName] = useState('Admin');
  const [profileEmail, setProfileEmail] = useState('admin@technova.com');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.messages);
          setUnreadCount(data.total);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };
    fetchNotifications();

    // Fetch profile settings
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (data.success) {
          setProfileName(data.data.company_name || 'Admin');
          setProfileEmail(data.data.contact_email || 'admin@technova.com');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();

    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Re-fetch notifications on page navigation to keep badge in sync
  useEffect(() => {
    if (!mounted) return;
    const refreshUnread = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.messages);
          setUnreadCount(data.total);
        }
      } catch (err) {
        // Silently ignore — badge will update on next navigation
      }
    };
    refreshUnread();
  }, [pathname, mounted]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const getSelectedKey = () => {
    const allKeys = [...menuItems.map((i) => i.key), '/admin/dashboard/messages'];
    const sorted = allKeys.sort((a, b) => b.length - a.length);
    for (const key of sorted) {
      if (pathname.startsWith(key)) return key;
    }
    return '/admin/dashboard';
  };

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((seg, i) => {
      const path = '/' + segments.slice(0, i + 1).join('/');
      const name = breadcrumbNameMap[seg] || seg;
      const isLast = i === segments.length - 1;
      return {
        title: isLast
          ? <span style={{ color: '#1E293B', fontWeight: 600 }}>{name}</span>
          : <Link href={path} style={{ color: '#94A3B8' }}>{name}</Link>,
      };
    });
  };

  const handleProfileClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'logout') {
      setIsLoggingOut(true);
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        message.success('Berhasil logout');
        router.push('/admin/login');
        router.refresh();
      } catch (error) {
        message.error('Gagal melakukan logout');
        setIsLoggingOut(false);
      }
    } else {
      router.push('/admin/dashboard/settings');
    }
  };

  const profileMenu: MenuProps = {
    onClick: handleProfileClick,
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'My Profile' },
      { key: 'account-settings', icon: <KeyOutlined />, label: 'Account Settings' },
      { type: 'divider' },
      { key: 'logout', icon: isLoggingOut ? <LoadingOutlined /> : <LogoutOutlined />, label: isLoggingOut ? 'Logging out...' : 'Logout', danger: true },
    ],
  };

  const notificationMenu: MenuProps = {
    items: notifications.length > 0
      ? notifications.map((msg, idx) => ({
          key: `msg-${idx}`,
          label: (
            <div style={{ padding: '4px 0' }}>
              <Text strong style={{ display: 'block', fontSize: 13 }}>{msg.name}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{msg.email}</Text>
            </div>
          ),
          onClick: () => router.push('/admin/dashboard/messages')
        }))
      : [
          { key: 'empty', label: <Text type="secondary">Tidak ada pesan baru</Text>, disabled: true }
        ]
  };

  const fullMenuItems = [
    ...menuItems.slice(0, 6),
    {
      key: '/admin/dashboard/messages',
      icon: <MailOutlined />,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/admin/dashboard/messages">Messages</Link>
          {unreadCount > 0 && !collapsed && (
            <span style={{
              background: '#EF4444', color: '#fff', fontSize: 11, fontWeight: 600,
              borderRadius: 10, padding: '1px 7px', lineHeight: '18px', marginLeft: 8,
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </span>
      ),
    },
    menuItems[6],
  ];

  const sidebarMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      items={fullMenuItems}
      style={{ background: 'transparent', borderRight: 0, marginTop: 8 }}
    />
  );

  const logoFull = (
    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(100,116,139,0.3)' }}>
      <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #22D3EE, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>TN</span>
        </div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>TechNova</span>
      </Link>
    </div>
  );

  const logoCollapsed = (
    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(100,116,139,0.3)' }}>
      <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #22D3EE, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>TN</span>
        </div>
      </Link>
    </div>
  );

  // Show skeleton during hydration to prevent FOUC
  if (!mounted) {
    return (
      <div className={plusJakartaSans.className} style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC' }}>
        {/* Sidebar skeleton */}
        <div style={{ width: 260, background: '#0F172A', minHeight: '100vh', flexShrink: 0 }} className="hidden lg:block">
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(100,116,139,0.3)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #22D3EE, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>TN</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginLeft: 8 }}>TechNova</span>
          </div>
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: 40, borderRadius: 8, background: 'rgba(148,163,184,0.1)' }} />
            ))}
          </div>
        </div>
        {/* Main skeleton */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <div style={{ width: 200, height: 20, borderRadius: 6, background: '#E2E8F0' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#E2E8F0' }} />
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#E2E8F0' }} />
            </div>
          </div>
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ height: 28, width: '30%', borderRadius: 8, background: '#E2E8F0' }} />
            <div style={{ height: 200, borderRadius: 12, background: '#E2E8F0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ height: 120, borderRadius: 12, background: '#E2E8F0' }} />
              <div style={{ height: 120, borderRadius: 12, background: '#E2E8F0' }} />
              <div style={{ height: 120, borderRadius: 12, background: '#E2E8F0' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout className={plusJakartaSans.className} style={{ minHeight: '100vh' }}>
      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={260}
          collapsedWidth={80}
          style={{ background: '#0F172A', overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0, zIndex: 20 }}
        >
          {collapsed ? logoCollapsed : logoFull}
          {sidebarMenu}
        </Sider>
      )}

      {/* MAIN */}
      <Layout style={{ minHeight: '100vh', margin: 0 }}>
        <Header
          style={{
            background: '#FFFFFF', height: 64, lineHeight: '64px', padding: '0 16px', margin: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
            {!isMobile && <Breadcrumb items={generateBreadcrumbs()} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Dropdown menu={notificationMenu} placement="bottomRight" trigger={['click']}>
              <Badge count={unreadCount} size="small" offset={[-4, 4]}>
                <Button type="text" icon={<BellOutlined />} style={{ fontSize: 16, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              </Badge>
            </Dropdown>
            <Dropdown menu={profileMenu} placement="bottomRight" trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 10px', borderRadius: 10 }}>
                <Avatar size={34} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #22D3EE, #6366F1)' }} />
                {!isMobile && (
                  <div style={{ lineHeight: 1.3 }}>
                    <Text style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', display: 'block' }}>{profileName}</Text>
                    <Text style={{ fontSize: 11, color: '#94A3B8', display: 'block' }}>{profileEmail}</Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ background: '#F8FAFC', overflowX: 'hidden' }}>
          {children}
        </Content>
      </Layout>

      {/* MOBILE DRAWER */}
      <Drawer
        placement="left"
        open={isMobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closable={false}
        size={240}
        styles={{ body: { padding: 0, background: '#0F172A' }, header: { display: 'none' }, wrapper: { boxShadow: '4px 0 24px rgba(0,0,0,0.15)' } }}
      >
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <Button type="text" icon={<CloseOutlined />} onClick={() => setDrawerOpen(false)} style={{ color: '#94A3B8', fontSize: 16 }} />
        </div>
        {logoFull}
        {sidebarMenu}
      </Drawer>
    </Layout>
  );
}