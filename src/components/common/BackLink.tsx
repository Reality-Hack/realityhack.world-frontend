import { AppLink } from '@/routing';

type BackLinkProps = {
  href: string;
  label: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <AppLink href={href} className="text-sm text-gray-500 hover:text-themePrimary">
      ← {label}
    </AppLink>
  );
}
