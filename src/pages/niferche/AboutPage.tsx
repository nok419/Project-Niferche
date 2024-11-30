import { 
  Card, 
  Heading, 
  Text, 
  View,
  Divider,
  Flex,
  Button,
  useTheme
} from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const AboutPage = () => {
  const { tokens } = useTheme();

  return (
    <View>
      <Helmet>
        <title>はじめまして - Project Niferche</title>
        <meta name="description" content="Project Nifercheは、アイデアの共有を通して新しい物語を紡ぎ出す創発的な創作プロジェクトです。" />
      </Helmet>

      <View padding={tokens.space.large}>
        <Card variation="elevated" maxWidth="800px" margin="0 auto">
          <Heading 
            level={1}
            color="font.primary"
            textAlign="center"
            padding={tokens.space.medium}
          >
            はじめまして
          </Heading>
          
          <Text
            textAlign="center"
            fontSize="large"
            color="font.secondary"
            padding={tokens.space.medium}
          >
            Project Nifercheは、アイデアの共有を通して新しい物語を紡ぎ出す創発的な創作プロジェクトです。
          </Text>

          <Divider orientation="horizontal" margin={tokens.space.large} />
          
          <Heading 
            level={2}
            textAlign="center"
            padding={tokens.space.medium}
          >
            物語の世界へようこそ
          </Heading>

          <Flex 
            direction={{ base: 'column', medium: 'row' }}
            gap={tokens.space.medium}
            justifyContent="center"
            alignItems="center"
            marginTop={tokens.space.large}
          >
            <Card backgroundColor="background.secondary">
              <Heading level={3} color="font.primary">メインストーリー</Heading>
              <Text padding={tokens.space.small}>
                記憶を失った研究者サレジアと、彼が想像/創造した不思議な存在ニファーシェ。
                二人の出会いが織りなす、現実と想像の境界を超えた物語。
              </Text>
              <Flex justifyContent="flex-end" padding={tokens.space.small}>
                <Link to="/laboratory/mainstory" style={{ textDecoration: 'none' }}>
                  <Button variation="primary">読んでみる</Button>
                </Link>
              </Flex>
            </Card>

            <Card backgroundColor="background.secondary">
              <Heading level={3} color="font.primary">設定資料</Heading>
              <Text padding={tokens.space.small}>
                魔法世界「Quxe」、未来世界「Hodemei」、そして不思議な異世界「Alsarejia」。
                これらの世界を結ぶ物語の背景をご紹介します。
              </Text>
              <Flex justifyContent="flex-end" padding={tokens.space.small}>
                <Link to="/materials/common" style={{ textDecoration: 'none' }}>
                  <Button variation="primary">詳しく見る</Button>
                </Link>
              </Flex>
            </Card>
          </Flex>
        </Card>
      </View>
    </View>
  );
};