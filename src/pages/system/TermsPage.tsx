import { View, Heading, Text, Divider, Flex } from '@aws-amplify/ui-react';

export const TermsPage = () => {
  return (
    <View padding="medium" maxWidth="800px" margin="0 auto">
      <Flex direction="column" gap="large">
        <Heading level={1}>利用規約</Heading>
        <Text>
          この利用規約（以下「本規約」）は、Project Niferche（以下「当プロジェクト」）が提供するウェブサイトおよびサービス（以下「本サービス」）の利用条件を定めるものです。
        </Text>

        <Section
          title="1. 適用"
          content="本規約は、本サービスの利用に関する当プロジェクトとユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当プロジェクトとの間の本サービスの利用に関わる一切の関係に適用されます。"
        />

        <Section
          title="2. 知的財産権"
          content={`当プロジェクトが提供する全てのコンテンツ（文章、画像、デザイン、ロゴ等を含む）に関する知的財産権は、当プロジェクトまたは当プロジェクトにライセンスを許諾している者に帰属します。\n
ユーザーは、当プロジェクトの明示的な許可なく、これらのコンテンツを複製、転載、改変、二次利用することはできません。`}
        />

        <Section
          title="3. 設定資料の利用"
          content={`当プロジェクトが提供する設定資料は、以下の条件下で利用可能です：\n
・非商用の創作活動における参照および利用\n
・出典の明記\n
・当プロジェクトの世界観を著しく損なわない形での利用`}
        />

        <Section
          title="4. ユーザー投稿"
          content={`ユーザーが本サービスに投稿したコンテンツの著作権はユーザーに帰属します。\n
ただし、ユーザーは当プロジェクトに対し、投稿コンテンツを本サービスの提供、改善、宣伝のために利用する権利を許諾するものとします。`}
        />

        <Section
          title="5. 禁止事項"
          content={`以下の行為を禁止します：\n
・法令または公序良俗に違反する行為\n
・当プロジェクトまたは第三者の知的財産権を侵害する行為\n
・本サービスの運営を妨害する行為\n
・その他、当プロジェクトが不適切と判断する行為`}
        />

        <Section
          title="6. 免責事項"
          content="当プロジェクトは、本サービスの内容の正確性、完全性、有用性、安全性等について、いかなる保証も行うものではありません。"
        />

        <Section
          title="7. 規約の変更"
          content="当プロジェクトは、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。"
        />

        <View marginTop="xxl">
          <Text variation="tertiary">
            最終更新日: 2024年11月24日
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
