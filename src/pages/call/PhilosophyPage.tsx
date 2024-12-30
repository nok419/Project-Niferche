import { 
  Card,
  Heading,
  Text,
  View,
  Flex,
  Button,
  Badge,
  Divider,
  Alert,
  useTheme
} from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const PhilosophyPage = () => {
  const { tokens } = useTheme();

  return (
    <>
      <Helmet>
        <title>理念 - Project Niferche</title>
        <meta name="description" content="Project Nifercheが掲げる理念と活動方針について" />
      </Helmet>

      <View padding={tokens.space.large}>
        <Card
          backgroundColor="background.primary"
          borderRadius="medium"
          padding={tokens.space.large}
          maxWidth="800px"
          margin="0 auto"
        >
          <Heading level={1} textAlign="center">理念</Heading>
          
          <Alert variation="info" margin={tokens.space.medium}>
            Project Nifercheは創作活動支援のためのプラットフォームです。
            特定の思想や信条を広めることを目的とした活動ではありません。
          </Alert>

          <Divider margin={tokens.space.large} />

          <Card backgroundColor="background.secondary" margin={tokens.space.medium}>
            <Badge variation="success">理念1</Badge>
            <Heading level={3}>人類の精神的豊かさの追求</Heading>
            <Text padding={tokens.space.small}>
              創造活動による自己実現の支援を通じて、現実的な社会的問題の解決に貢献します。
              オープンな創作環境および設定資料集の提供、オープンデータセットの作成と管理を行います。
            </Text>
            <Flex 
            direction={{ base: 'column', medium: 'row' }}
            gap={tokens.space.medium}
            justifyContent="center"
            alignItems="center"
            marginTop={tokens.space.large}
          >
              <Link to="/rights" style={{ textDecoration: 'none' }}>
                <Button variation="link">利用規約</Button>
              </Link>
              <Link to="/guidelines" style={{ textDecoration: 'none' }}>
                <Button variation="link">ガイドライン</Button>
              </Link>
            </Flex>
          </Card>

          <Card backgroundColor="background.secondary" margin={tokens.space.medium}>
            <Badge variation="info">理念2</Badge>
            <Heading level={3}>ループ構造の維持</Heading>
            <Text padding={tokens.space.small}>
              本理念の詳細な理解には創作世界の深い知識が必要です。
              A2のサレジアが研究活動のために利用可能なアイデア資源の確保を目指し、
              交流プラットフォーム「Laboratory Alsarejia」を提供します。
            </Text>
            <Flex justifyContent="flex-end" padding={tokens.space.small}>
              <Link to="/laboratory/mainstory" style={{ textDecoration: 'none' }}>
                <Button variation="primary">メインストーリーを読む</Button>
              </Link>
            </Flex>
          </Card>

          <Divider margin={tokens.space.large} />

          <Heading level={3} textAlign="center">最新のお知らせ</Heading>
          <Card margin={tokens.space.medium}>
            {/* お知らせコンポーネントを後ほど実装 */}
            <Text color="font.secondary">お知らせはまもなく実装されます</Text>
          </Card>
        </Card>
      </View>
    </>
  );
};



