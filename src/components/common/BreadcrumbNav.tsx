// src/components/common/BreadcrumbNav.tsx
import { Flex, Text, Link } from '@aws-amplify/ui-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items }) => {
  return (
    <Flex gap="small" padding="medium">
      {items.map((item, index) => (
        <Flex key={item.path} gap="small" alignItems="center">
          {index > 0 && <Text color="font.tertiary">/</Text>}
          {index === items.length - 1 ? (
            <Text color="font.secondary">{item.label}</Text>
          ) : (
            <Link href={item.path}>{item.label}</Link>
          )}
        </Flex>
      ))}
    </Flex>
  );
};