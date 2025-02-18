// src/pages/library/SideStoryDetailPage.tsx
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { View, Heading, Button} from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';

/**
 * サイドストーリーの詳細ページ例。
 * ルート: /library/sidestory/detail/:storyId
 * 
 * ここではダミーデータのみを用意。
 */
const DUMMY_STORIES = [
  {
    id: 'quxe-researcher',
    title: '研究者の日記',
    author: 'サレジア',
    totalChapters: 3
  }
];

export const SideStoryDetailPage: React.FC = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();

  // ダミー検索
  const story = useMemo(() => DUMMY_STORIES.find(s => s.id === storyId), [storyId]);

  if (!story) {
    return (
      <View padding="2rem">
        <Heading level={3}>ストーリーが見つかりません</Heading>
        <Button onClick={() => navigate('/library/sidestory')}>
          一覧に戻る
        </Button>
      </View>
    );
  }

  return (
    <View padding="2rem">
      <Button 
        onClick={() => navigate('/library/sidestory')} 
        variation="link"
        marginBottom="1rem"
      >
        ← サイドストーリー一覧に戻る
      </Button>

      <StoryViewer
        // 例: pathは "/library/sidestory/official/quxe-researcher"
        // ここでは簡易的に仮パス
        storyPath={`library/sidestory/official/${story.id}`}
        currentChapter={1}
        totalChapters={story.totalChapters}
        metadata={{
          title: story.title,
          category: 'Quxe',
          reference: 'official'
        }}
        author={{
          name: story.author,
          showAuthor: true
        }}
      />
    </View>
  );
};
