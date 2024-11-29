import { View, Heading, Text, Divider, Flex } from '@aws-amplify/ui-react';

export const RightsPage = () => {
  return (
    <View padding="medium" maxWidth="800px" margin="0 auto">
      <Flex direction="column" gap="large">
        <Heading level={1}>権利表記</Heading>
        
        <Section
          title="著作権について"
          content={`Project Niferche（当プロジェクト）で公開される全てのコンテンツ（文章、画像、音楽、プログラム等）の著作権は、特に明記がない限り当プロジェクトに帰属します。\n
各コンテンツの著作権者および制作者については、コンテンツ詳細ページにて個別に記載されています。`}
        />

        <Section
          title="コンテンツの利用について"
          content={`当プロジェクトのコンテンツは、以下のカテゴリに分類されます：\n
1. 公式コンテンツ
・メインストーリー、公式サイドストーリー
・公式設定資料、イラスト等
・プロジェクトロゴ、キャラクターデザイン等

2. 共有（Shared）コンテンツ
・ユーザー投稿によるサイドストーリー
・ユーザー作成の設定資料、イラスト等

各カテゴリの利用規約は以下の通りです。`}
        />

        <Section
          title="公式コンテンツの利用規約"
          content={`以下の条件を遵守する限り、商用・非商用目的を問わず利用を許可します：\n
1. 出典の明記
2. コンテンツの改変を行う場合、オリジナルとの区別を明確にすること
3. 公序良俗に反する利用を行わないこと
4. 当プロジェクトの信用を損なう利用を行わないこと
`}
        />

        <Section
          title="共有（Shared）コンテンツの利用規約"
          content={`共有コンテンツは、Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License（CC BY-NC-SA 4.0）に基づいて提供されます。\n
主な条件：
1. 作品のクレジットを表示すること
2. 営利目的での利用を行わないこと
3. 改変した場合、同じライセンスで公開すること`}
        />

        <Section
          title="免責事項"
          content={`当プロジェクトのコンテンツを利用したことによって生じたいかなる損害についても、当プロジェクトは責任を負いません。\n
コンテンツの利用者は、自己の責任において利用するものとします。`}
        />

        <Section
          title="権利侵害に関する申し立て"
          content="当プロジェクトのコンテンツが著作権その他の権利を侵害していると思われる場合は、お問い合わせフォームよりご連絡ください。適切な対応を取らせていただきます。"
        />

        <View marginTop="xxl">
          <Text variation="tertiary">
            最終更新日: 2024年11月26日
          </Text>
        </View>
      </Flex>
    </View>
  );
};

interface SectionProps {
  title: string;
  content: string;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
  <View>
    <Heading level={2} fontSize="large">{title}</Heading>
    <Divider marginBlock="medium" />
    <Text whiteSpace="pre-wrap">{content}</Text>
  </View>
);
