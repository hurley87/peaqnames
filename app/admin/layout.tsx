import { Metadata } from 'next';
import { SidebarNav } from '@/components/sidebar-nav';
import Container from '@/components/container';

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'Yearly Fee',
    href: '/admin',
  },
  {
    title: 'Mint Limit',
    href: '/admin/limit',
  },
  {
    title: 'Reserve Name',
    href: '/admin/reserve',
  },
  {
    title: 'Mint Access',
    href: '/admin/access',
  },
  {
    title: 'Allowlist',
    href: '/admin/allowlist',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <Container>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </Container>
  );
}
