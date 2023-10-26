import Link from 'next/link';

type TabProps = {
  href: string;
  isSelected: boolean;
  title: string;
};

export function Tab({ href, isSelected, title }: TabProps) {
  return (
    <Link href={href}>
      {isSelected && (
        <span className="relative w-full mr-8">
          <span className="cursor-pointer text-themePrimary before:content-[''] before:w-full before:absolute before:border-b-[2px] before:bottom-[-12px] before:bg-themePrimary before:border-themePrimary text-sm">
            {title}
          </span>
        </span>
      )}
      {!isSelected && (
        <span className="pr-8 text-sm transition-all cursor-pointer hover:text-themePrimary text">
          {title}
        </span>
      )}
    </Link>
  );
}
