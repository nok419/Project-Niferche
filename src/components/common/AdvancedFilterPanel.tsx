// src/components/common/AdvancedFilterPanel.tsx

import React, { useState, useEffect } from 'react';
import { 
  Flex,
  SelectField,
  SearchField,
  Button,
  Text,
  Badge,
  View
} from '@aws-amplify/ui-react';

interface FilterCondition {
  keyword: string;
  world: string;
  tags: string[];
}

interface AdvancedFilterPanelProps {
  availableTags: string[];   // 外部からタグ一覧を渡す
  availableWorlds: string[]; // 外部から世界観一覧を渡す
  onChange: (filter: FilterCondition) => void;
}

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  availableTags,
  availableWorlds,
  onChange,
}) => {
  const [keyword, setKeyword] = useState('');
  const [world, setWorld] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // フィルタ条件が変更されるたびに親コンポーネントへ通知
  useEffect(() => {
    onChange({
      keyword,
      world,
      tags: selectedTags,
    });
  }, [keyword, world, selectedTags, onChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleReset = () => {
    setKeyword('');
    setWorld('all');
    setSelectedTags([]);
  };

  return (
    <Flex 
      direction="column" 
      gap="small"
      padding="1rem"
      border="1px solid var(--amplify-colors-border-primary)"
      borderRadius="0.5rem"
    >
      <SearchField
        label="キーワード検索"
        placeholder="キーワードを入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <SelectField
        label="世界観"
        value={world}
        onChange={(e) => setWorld(e.target.value)}
      >
        <option value="all">すべて</option>
        {availableWorlds.map((w) => (
          <option value={w} key={w}>{w}</option>
        ))}
      </SelectField>

      <Text>タグで絞り込み:</Text>
      <Flex gap="small" wrap="wrap">
        {availableTags.map((tag) => (
          <Badge
          key={tag}
          variation={selectedTags.includes(tag) ? 'info' : 'warning'} // 例としてwarningを未選択時に
          style={{ cursor: 'pointer' }}
          onClick={() => handleTagToggle(tag)}
        >
          {tag}
        </Badge>
        ))}
      </Flex>

      {selectedTags.length > 0 && (
        <View>
          <Text>選択中のタグ:</Text>
          <Flex gap="xsmall" wrap="wrap">
            {selectedTags.map((tag) => (
              <Badge 
                key={`selected-${tag}`} 
                variation="info"
                onClick={() => handleTagToggle(tag)}
                style={{ cursor: 'pointer' }}
              >
                {tag} x
              </Badge>
            ))}
          </Flex>
        </View>
      )}

      <Flex justifyContent="flex-end">
        <Button onClick={handleReset} size="small" variation="link">
          リセット
        </Button>
      </Flex>
    </Flex>
  );
};
