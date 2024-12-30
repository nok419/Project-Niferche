// src/pages/call/NewsPage.tsx
import { 
  Card, 
  Heading, 
  Text, 
  View,
  Collection,
  Badge,
  Flex,
  useTheme 
} from '@aws-amplify/ui-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'update' | 'event' | 'important';
  isNew: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: '研究施設の大規模アップデート',
    content: 'Laboratory Alsarejiaに新しい観測機能が追加されました。',
    date: '2024-03-20',
    category: 'update',
    isNew: true
  },
  // ... その他のニュース項目
];

export const NewsPage = () => {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.large}>
      <Card>
        <Heading level={1}>ニファーシェからのお知らせ</Heading>
        <Collection
          items={newsItems}
          type="list"
          gap={tokens.space.medium}
          padding={tokens.space.large}
        >
          {(item) => (
            <Card key={item.id}>
              <Flex justifyContent="space-between" alignItems="center">
                <Heading level={3}>{item.title}</Heading>
                {item.isNew && (
                  <Badge variation="success">NEW</Badge>
                )}
              </Flex>
              <Text>{item.content}</Text>
              <Text variation="tertiary">{item.date}</Text>
            </Card>
          )}
        </Collection>
      </Card>
    </View>
  );
};