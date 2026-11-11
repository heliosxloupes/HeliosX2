/**
 * pt section. The root layout renders <html lang="en"> for every page
 * (one root layout keeps the site statically rendered), so this sets the
 * language for the server HTML: the inline script fixes <html lang> before
 * paint, the wrapper marks the content, and next.config.js sends a
 * Content-Language header. components/intl/LocaleHtmlLang.tsx keeps it in
 * step on client-side navigation.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="pt-BR">
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='pt-BR'" }} />
      {children}
    </div>
  )
}
