import { 
  Heading,
  View,
  Text,
  Button,
  Flex,
  useTheme
} from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ContentCard } from '../components/common/ContentCard';

  // 更新情報の登録
  const newsItems = [
    {
      date: '2024.11.24',
      text: 'Webサイトをリニューアルしました'
    },
    {
      date: '2024.11.23',
      text: 'メインストーリー第一章を公開しました'
    },
    {
      date: '2024.11.22',
      text: 'Laboratory Alsarejiaの設定資料を追加しました'
    }
  ];




//出力
export const MainPage = () => {
  const { tokens } = useTheme();

  return (
    <>
      <Helmet>
        <title>Project Niferche</title>
        <meta name="description" content="Project Nifercheは、アイデアの共有を通して新しい物語を紡ぎ出す創発的な創作プロジェクトです。" />
      </Helmet>

      {/* ヒーローセクション */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        padding={{ base: 'medium', large: 'xxl' }}
        height="80vh"
        style={{
          zIndex:'5',
          backgroundImage: 'url("../images/sc.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {/* 背景オーバーレイ */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        />

        {/* メインコンテンツ */}
        <Flex
          direction="column"
          alignItems="center"
          gap="large"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Heading
            level={1}
            color={tokens.colors.white}
            fontSize={{ base: tokens.fontSizes.xxxl, large: '4rem' }}
            textAlign="center"
          >
            Project Niferche
          </Heading>

          <Text
            color={tokens.colors.white}
            fontSize={{ base: tokens.fontSizes.medium, large: tokens.fontSizes.l }}
            textAlign="center"
            maxWidth="900px"
            padding="medium"
          >
            「人類は高度な情報交換システムを有する情報社会に到達しました。
            しかし、急速な技術の発展に対し、文化・精神の成熟は非常に緩やかなものです。
            皆様の精神の充実と輝かしい個性の発現を願い、我々は灯火を掲げます。」
          </Text>

          <Flex direction="row" gap="medium">
            <Button
              as={Link}
              to="/about"
              variation="primary"
              size="large"
            >
              プロジェクトについて
            </Button>
            <Button
              as={Link}
              to="/laboratory/about"
              variation="primary"//スタイル指定
              size="large"
            >
              Laboratory へ
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* ニュースセクション */}
      <View
        backgroundColor={tokens.colors.background.secondary}
        padding={{ base: 'medium', large: 'xl' }}
      >
        <Flex direction="column" maxWidth="1200px" margin="0 auto" gap="medium">
          <Heading level={3}>ニファーシェからのお知らせ</Heading>
          <Flex direction="column" gap="small">
            {newsItems.map((item, index) => (
              <Flex
                key={index}
                direction="row"
                gap="medium"
                padding="small"
                backgroundColor={index === 0 ? tokens.colors.background.primary : undefined}
                borderRadius="small"
              >
                <Text fontWeight="bold">{item.date}</Text>
                <Text>{item.text}</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </View>

      {/* フィーチャーセクション */}
      <View padding={{ base: 'medium', large: 'xl' }}>
        <Flex direction="column" maxWidth="1200px" margin="0 auto" gap="xl">
          <Heading level={2}>主なコンテンツ</Heading>
          
          <Flex 
            direction={{ base: 'column', large: 'row' }}
            gap="large"
            alignItems="stretch"
          >
            <ContentCard
              title="メインストーリー"
              description="記憶を失った研究者サレジアと、不思議な存在ニファーシェの物語"
              imagePath="/images/main-story.jpg"
              linkTo="/laboratory/mainstory"
            />

            <ContentCard
              title="Laboratory"
              description="創作活動の拠点となる研究施設、あなたの想像が新しい物語を生み出します"
              imagePath="/images/laboratory.jpg"
              linkTo="/laboratory/about"
            />

            <ContentCard
              title="世界設定資料"
              description="Quxe、Hodemei、Alsarejiaの3つの世界の詳細な設定資料"
              imagePath="/images/worlds.jpg"
              linkTo="/materials/common"
            />
          </Flex>
        </Flex>
      </View>

      {/* コミュニティセクション */}
      <View
        backgroundColor={tokens.colors.background.secondary}
        padding={{ base: 'medium', large: 'xl' }}
      >
        <Flex direction="column" maxWidth="1200px" margin="0 auto" gap="large" alignItems="center">
          <Heading level={2} textAlign="center">創作の輪に参加しませんか？</Heading>
          <Text textAlign="center" maxWidth="600px">
            Laboratory Alsarejiaでは、あなたのアイデアや創作物を共有し、
            新しい物語を一緒に紡ぎ出すことができます。
          </Text>
          <Button
            as={Link}
            to="/about"
            variation="primary"
            size="large"
          >
            参加方法を確認する
          </Button>
        </Flex>
      </View>
    </>
  );
};