import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              const s = JSON.parse(localStorage.getItem('refurnish_settings') || '{}');
              const theme = s.theme || 'light';
              if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch {}
          `,
        }}
      />
      <Sidebar>{children}</Sidebar>
    </>
  );
}