// src/pages/library/LibraryPage.tsx
import { 
  View, 
  Collection,
  useTheme 
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';
import { ContentSection } from '../../components/common/ContentSection';

const sections = [
  {
    id: 'mainstory',
    title: 'メインストーリー',
    description: 'サレジアとニファーシェの物語',
    path: '/library/mainstory',
    image: '/images/main-story.jpg'
  },
  {
    id: 'sidestory',
    title: 'サイドストーリー',
    description: '様々な視点から描かれる物語群',
    path: '/library/sidestory',
    image: '/images/side-story.jpg'
  },
  {
    id: 'records',
    title: '研究記録集',
    description: 'アイデア体の観測記録と考察',
    path: '/library/records',
    image: '/images/records.jpg'
  }
];

export const LibraryPage = () => {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.large}>
      <ContentSection
        title="Library"
        description="Project Nifercheの世界観を紡ぐ物語と記録"
      >
        <Collection
          type="grid"
          items={sections}
          gap={tokens.space.medium}
          templateColumns={{
            base: "1fr",
            medium: "1fr 1fr",
            large: "1fr 1fr 1fr"
          }}
        >
          {(item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              imagePath={item.image}
              linkTo={item.path}
            />
          )}
        </Collection>
      </ContentSection>
    </View>
  );
};