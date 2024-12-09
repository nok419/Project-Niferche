// src/components/materials/DocumentFilter.tsx
import { Flex, SearchField, SelectField, ToggleButtonGroup, ToggleButton } from '@aws-amplify/ui-react';

interface DocumentFilterProps {
  onSearch: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onViewChange: (view: 'grid' | 'list') => void; // onViewModeからonViewChangeに修正
  onSortChange: (sort: string) => void;
}

export const DocumentFilter = ({
  onSearch,
  onCategoryChange,
  onViewChange
}: DocumentFilterProps) => {
  return (
    <Flex direction="column" gap="medium" marginBottom="2rem">
      <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
        <SearchField
          label="検索"
          placeholder="キーワードを入力"
          onChange={(e) => onSearch(e.target.value)}
          width="300px"
        />
        
        <Flex gap="medium" alignItems="center">
          <SelectField
            label="カテゴリ"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="THEORY">理論</option>
            <option value="WORLD">世界</option>
            <option value="LANGUAGE">言語</option>
          </SelectField>

          <ToggleButtonGroup
            value="grid"
            isExclusive
            onChange={(value) => onViewChange(value as 'grid' | 'list')}
          >
            <ToggleButton value="grid">グリッド</ToggleButton>
            <ToggleButton value="list">リスト</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
    </Flex>
  );
};