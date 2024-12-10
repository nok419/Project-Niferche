import { 
  Card, 
  Heading, 
  Text, 
  View,
  Divider,
  Flex,
  useTheme
} from '@aws-amplify/ui-react';
import { Helmet } from 'react-helmet-async';
import { ContentCard } from '../../components/common/ContentCard';

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

          <Divider orientation="horizontal"  />
          
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
            
            <ContentCard
              title="メインストーリー"
              description="記憶を失った研究者サレジアと、彼が想像/創造した不思議な存在ニファーシェ。
                二人の出会いが織りなす、現実と想像の境界を超えた物語。"
              imagePath="/images/about_mainstory.jpg"
              linkTo="/laboratory/mainstory"
            />
            <ContentCard 
              title="サイドストーリー"
              description="魔法世界「Quxe」、未来世界「Hodemei」、そして不思議な異世界「Alsarejia」。
                これらの世界を結ぶ物語の背景をご紹介します。"
              imagePath="/images/about_sidestory.jpg"
              linkTo="/laboratory/sidestory"
            />
            <ContentCard 
              title="設定資料集"
              description="全ての物語に共通する法則や各個別世界に登場するキャラクターや組織に関する設定資料を公開"
              imagePath="/images/about_sidestory.jpg"
              linkTo="/materials/common"
            />

            
          </Flex>
        </Card>
      </View>
    </View>
  );
};