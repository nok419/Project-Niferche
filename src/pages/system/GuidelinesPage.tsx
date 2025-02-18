// src/pages/system/GuidelinesPage.tsx
import { View, Heading, Text, Divider, Flex, Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

export const GuidelinesPage = () => {
  const navigate = useNavigate();
  
  return (
    <View padding="medium" maxWidth="800px" margin="0 auto">
      <Heading level={1}>ガイドライン</Heading>
      <Divider marginBlock="medium" />

      <Text>
        ここでは、Project Niferche内で創作活動や投稿を行うにあたってのガイドラインを示します。
        ユーザーの皆様に安心して活動いただくために、以下の点をご一読ください。
      </Text>

      <Flex direction="column" gap="medium" marginTop="1.5rem">
        <Section
          title="1. 投稿コンテンツに関して"
          content={`公序良俗に反する表現、極端に攻撃的な言動はお控えください。二次創作などを行う場合は、原著作者の権利を尊重しましょう。`}
        />

        <Section
          title="2. コミュニティマナー"
          content={`コメント欄やフォーラムでは他者の意見を尊重し、建設的な議論を行ってください。誹謗中傷や荒らし行為は警告やアカウント停止の対象となります。`}
        />

        <Section
          title="3. 二次利用規約"
          content={`公式コンテンツを含む作品を使用する際は、必ず出典を明記し、改変がある場合は改変箇所を明確に示してください。`}
        />

        <Section
          title="4. 運営ポリシー"
          content={`運営チームは、投稿内容が本ガイドラインに反すると判断した場合、投稿を削除する権利を有します。重大な違反にはアカウント停止等の措置を取ることがあります。`}
        />
      </Flex>

      <Divider marginBlock="medium" />

      <Button onClick={() => navigate('/call/philosophy')} variation="link">
        戻る
      </Button>
    </View>
  );
};

const Section = ({ title, content }: { title: string; content: string }) => (
  <View marginBottom="1rem">
    <Heading level={2} fontSize="large">{title}</Heading>
    <Text whiteSpace="pre-wrap" marginTop="small">
      {content}
    </Text>
  </View>
);
