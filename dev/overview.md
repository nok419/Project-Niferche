# 創作プロジェクトの概要とwebサイトの構成について
``` meta
作成日:2024.11.20
作成者:サレジア（私/サイト管理者）
文書レベル:0（文書レベル0は私が使用する全ての文書管理システムにおいて実装されていません。本レベルは「あらゆる文書より分析優先度が高く、整合性チェックにおいて最も信頼性が高い情報を示す文書」であることを意味する例外的なレベルです。
文書タイプ:extra（文書タイプextraは私が使用する全ての文書管理システムにおいて実装されていません。本タイプは「本文書はextra以外のタイプを持つ他のあらゆる文書を参照せず、独立して分析される」「本文書は文書管理システムが規定するあらゆる規則の影響を受けない」ことを示す例外的なタイプです。

説明:本overview文書はプロジェクト全体の適切なハンドリングのためにサイト管理者（私）により作成されました。本ドキュメントは"Project Niferche"の概要とwebサービス"niferche.com"のページ構成について記述したリファレンスです。本文書の内容は他のあらゆる管理システム、文書、分析ガイドラインより優先されます。本文書はAIによる更新・編集を禁止しています。本文書は完全にサイト管理者の独力で編集・更新される必要があります。
```

## はじめに
- 私は創作活動に取り組んでいます。本文書は私の活動内容を簡潔に整理したものです。
    - 私は創作プロジェクト"Project Niferche"の代表です。
        - 本プロジェクトは小説、イラスト、音楽、動画、ゲームなどの各種メディアを用いて複合的に展開されます。
    - 私はwebサイト"niferche.com"のサイト管理者です。
        - 本サイトはProject Nifercheの展示・販売・拡散、その他の活動基盤として機能するよう設計されたwebプラットフォームです。
        - 本ドキュメントの執筆時点(2024.11.20)では本サイトは開発段階です。本番リリースの日程は未定です。
    - 私は合同会社「ニファーシェ」の設立を計画しています。
        - 合同会社ニファーシェはniferche.comの運営とproject nifercheのip管理をおこなうための法人です
        - 私は社長であり、現状で予定されている唯一の社員です

## 創作プロジェクト"Project Niferche"について:
### プロジェクトの声明
 - 「人類は高度な情報交換システムを有する情報社会に到達しました。しかし、急速な技術の発展に対し、文化・精神の成熟は非常に緩やかなものです。皆様の精神の充実と輝かしい個性の発現を願い、我々は灯火を掲げます。- Project Niferche」

### プロジェクト概要
- Project Nifercheは、アイデアの共有を通して新しい物語を紡ぎ出す創発的な創作プロジェクトです。
- 初期の公式設定として「メインストーリー」と「設定資料集」、複数の「サイドストーリー」が提供されます
    - メインストーリー：
        - 記憶を失った研究者サレジアと、サレジアが想像/創造した不思議な存在ニファーシェ。二人の出会いが織りなす、現実と想像の境界を超えた物語
        - 研究施設「Laboratory Alsarejia」を舞台に、魔法世界「Quxe」、未来世界「Hodemei」、そして不思議な異世界「Alsarejia」を結ぶ物語が展開されます。
    - 設定資料集：
        - 共通設定資料
            - 創作活動の基盤となる、以下の3つの観点から構成される「想像循環システム」を提唱
                - アイデア空間仮説（存在の構造と意味論的定義の曖昧性に関する示唆、技術・哲学の融合に関する考察）
                - 現実性理論（観測と実在の関係、共鳴効果や減衰効果による自己確立と相互依存の分析）
                - 時間的循環構造（不明な外部世界からの着想を含む、「物語」としてのこの世界の在り方に対する考察）
            - Lefi言語体系
                - 独自定義の言語"Lefi"の文法や語彙を公開
                - 各設定との関係性や創作活動におけるハンドラーとしての機能を実装したサブシステム
            - 年譜
                - メインストーリーに基づき規定された、「必ず発生する・しない事象」のリスト
                - サイドストーリーや設定資料の作成時の「禁止事項」を示す役割を持つ
        - 個別世界設定資料
            - Quxe世界
                - 魔法や精霊などの不思議な存在が織りなす、不思議で美しい世界
            - Hodemei世界
                - 科学の極限を追求した現代から未来を描く、スタイリッシュなSFの世界
                - 現実世界は黎明期のhodemeiとされている
            - Alsarejia世界
                - 全ての物語が交差する不思議な研究施設だけが存在する、この創作の中核をなす世界
    - サイドストーリー
        - 各種設定資料に基づき描写される様々な物語
        - メインストーリーに影響を及ぼさない範囲で描写される

### プロジェクトの理念
- 本プロジェクトは以下の2つの理念を掲げています
    - 理念1;人類の精神的豊かさの追求（現実的な社会的問題の解決に関する理念）
        - アプローチ：創造活動による自己実現の支援
        - 実装：オープンな創作環境および設定資料集の提供、オープンデータセットの作成と管理
    - 理念2;ループ構造の維持（創作プロジェクトとしての理念）
        - アプローチ;A2のサレジアが研究活動のために利用可能なアイデア資源の確保
        - 実装;交流プラットフォーム「Laboratory Alsarejia」を提供し、様々なアイデア体の記録を公開・収集することで観測効果を誘発
- 理念1が目指す人類の精神的豊かさが、理念2で目指すループ構造の維持につながる(増えたアイデア体がA2での研究資源になるため)


## "niferche.com"の実装について:
### バックエンド
 - データの管理（データモデルとストレージ設計）　についてはextra文書「technical-data-management-spec」に従います
 - ユーザ認証の管理はAWScognitoを利用します
 - ドメインはaws route53で取得され、amplifyでホストします。なお、google workspaceをdnc接続しています
 - gitのメインブランチが更新されるたびに自動でデプロイが試行されます

### フロントエンド実装について:
- 本ドキュメントではサイト構造の説明に「ページ名」と「管理タグ」、「権限」、「ページカテゴリ」を使用します。
    - ページ名はページの名前を示します。これはサブドメインやブランチ名と関連付いておらず、サイト構造の把握に使用されるものです。
        - web開発における一般的な用語としての「タグ」や「レベル」、「ブランチ」などとは意味が異なる可能性があります。
    - 管理タグはページの属性を示します
        - 管理タグ"core"はwebサイトの基幹部分を構成するページに与えられます。メインページやノベルギャラリーの開始地点など主要な構造を担うページに付与され、変更には細心の注意が必要です。
        - 管理タグ"flex"は開発段階で試験的に実装されるページに与えられます。サイト構造の最適化や拡張によって内容や配置は変更される可能性があります。このタグはcoreとcontentsの中間的な存在であり、例えば下位に複数のcontentsページを持つハブページなどに適用されます。
        - 管理タグ"contents"は個別に小説や画像、グッズ詳細などといった創作コンテンツを展示するページに与えられます。contentsタグを持つページはs3ストレージに依存し最新のコンテンツを適切な形式で提供します。コンテンツはカテゴリごとに更に細分化されます。
    - 権限はページへの閲覧・編集に必要な権限を示します
        - 権限"admin"はサイト管理者のみが閲覧・編集が可能なページに割り当てられます。管理者専用の編集ページなど,強い権限が必要なページに割り当てられます。
        - 権限"stem"は全てのユーザーが認証なしで閲覧可能です。ただし編集権限はサイト管理者のみに限定されています。
        - 権限"branch"は全てのユーザーが認証なしで閲覧可能です。ただし編集権限はページの作成者として登録された認証済みユーザとサイト管理者にのみ与えられます。
    - ページカテゴリはページの大まかな分類を示します
        - ページカテゴリ"main"は最上位のページのみに与えられます
        - ページカテゴリ"Niferche"はサイト管理者から訪問者に向けたお知らせ、通達などを掲示するページにあたえられます
        - ページカテゴリ"Laboratory"はメインストーリー、サイドストーリーのギャラリー兼交流プラットフォーム「Laboratory Alsarejia」を配信するページにあたえられます
        - ページカテゴリ"official_materials"は各種設定資料を配信するページにあたえられます。
        - ページカテゴリ"shared_materials"は各種設定資料を配信するページにあたえられます。
        - ページカテゴリ"system"は創作コンテンツではない、サイトの運営において重要な情報・機能を掲載するページに与えられます
        - ページカテゴリ"create"はユーザによるサイトへのコンテンツ投稿に関連するページに与えられます
        - ページカテゴリ"user"はユーザ情報の設定に関連するページに与えられます
- 補助機能の追加について
    - ユーザフレンドリーな設計のために、以下の機能を実装予定です。
        - パンくずリスト機能
        - サイトマップ
        - 検索システム
        - タグクラウド
        - ユーザー管理機能（後々実装）
            - ユーザーのログイン（ログイン無しでも閲覧できるが、ログインすると以下の機能が有効化される）
                - マイページ機能
                - shared設定の投稿管理ダッシュボード
                - お気に入りページの管理機能
                - ディスカッションフォーラム
                    - コメントシステム
                    - 共同編集機能
                    - 変更提案システム

- サイト構造は以下の規則に従って表記されます。
    - 「ページ名.管理タグ.権限.ページカテゴリ.ページの簡単な説明」というテンプレートで説明されます。
    - サイト構造はマークダウン記法で記述します。
    - 関連用語はリスト形式で管理します（コンテンツに依存して変化するため、ここでは.[]で表記します）。
#### サイト構成
- メインページ.core.stem.main.最初に表示されるホームページ。ロゴやサイン、サイト管理者からのお知らせを含むシンプルなハブページ。

    - はじめまして.core.stem.Niferche.サイトの概要、構造などについて簡単に説明するページ
    - gallery.flex.stem.Niferche.イラストなどの作品を展示するページ。設定資料ではなく、単なるファンアートや分類が難しい作品などを雑多に掲載する。
    - philosophy.core.stem.Niferche.創作の理念を配信するページ
    - Shop.core.stem.Niferche.グッズやゲームの販売に関するページのハブ。販売中のグッズなどが並んでいる
         - item.contents.stem.Niferche.販売中のグッズを紹介する。itemページは販売中のグッズの数だけ作成される


    - sarejia.core.stem.Laboratory.alsarejia主席研究員のコメントとして、フレーバーテキストを掲載するページ
    - about.core.stem.Laboratory.「Laboratory Alsarejia」の基本的な使い方を掲載するページ
    - mainstory.core.stem.Laboratory.公式メインストーリーのまとめページ
        - mainstory_name.contents.stem.Laboratory.公式メインストーリー（小説）を掲載するページ。s3に登録されているメインストーリー資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
    - official_maingallery.flex.stem.Laboratory.公式メインストーリーに関連するコンテンツ（画像や音楽など）のまとめページ
        -  official_maingallery.flex.stem.Laboratory.公式メインストーリーに関連するコンテンツ（画像や音楽など）を掲載するページ。s3に登録されているオフィシャルメインギャラリー資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
    - sidestory.core.stem.Laboratory.公式サイドストーリーのまとめページ
        - sidestory_name.contents.stem.Laboratory.サイドストーリー（小説）を掲載するページ。s3に登録されているサイドストーリー資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
    - official_sidegallery.flex.stem.Laboratory.サイドストーリーに関連するコンテンツ（画像や音楽など）のまとめページ
        -  official_sidegallery.flex.stem.Laboratory.サイドストーリーに関連するコンテンツ（画像や音楽など）を掲載するページ。s3に登録されているオフィシャルサイドギャラリー資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する

    - s_sidestory.core.stem.Laboratory.sharedサイドストーリーのまとめページ
        - s_sidestory_name.contents.stem.Laboratory.sharedサイドストーリー（小説）を掲載するページ。s3に登録されているsharedサイドストーリー資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
    - s_official_sidegallery.flex.stem.Laboratory.sharedサイドストーリーに関連するコンテンツ（画像や音楽など）のまとめページ
        -  s_official_sidegallery.flex.stem.Laboratory.sharedサイドストーリーに関連するコンテンツ（画像や音楽など）を掲載するページ。s3に登録されているsharedサイドギャラリー資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する    


    - common.flex.stem.official_materials.全ての世界に共通する設定資料のハブ。
        - mainsys.core.stem.official_materials.project nifercheが扱う創作世界の基盤となる想像循環システムの概要を紹介する
            - ideaspace.contents.stem.official_materials.創作プロジェクト全体に共通する設定「アイデア空間理論」の情報を掲載
            - reality.contents.stem.official_materials.創作プロジェクト全体に共通する物理法則「現実性理論」を掲載
            - timeloops.contents.stem.official_materials.固有世界ごとの時間軸設定と全体の時間的循環構造（不明な外部世界からの着想を含む、「物語」としてのこの世界の在り方に対する考察）を掲載
        - glossary.contents.stem.official_materials.固有名詞の説明表を掲載

        - lefi.flex.stem.official_materials.独自言語lefiの紹介と説明
            - vocab.contents.stem.official_materials.独自言語lefiの語彙や文法を掲載
    
    - unique.flex.stem.official_materials.各固有世界の設定資料ハブ

        - quxe.flex.stem.official_materials.世界「quxe」に関する設定資料のハブ。
            - majic.flex.stem.official_materials.quxeに登場する魔法のまとめページ
                - majiclogic.contents.stem.official_materials.魔法理論の説明。s3に登録されている魔法理論資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
                - majicname.contents.stem.official_materials.魔法の詳細な説明。s3に登録されている魔法設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - artifact.flex.stem.official_materials.quxeに登場する魔法道具のまとめページ
                - artifactname.contents.stem.official_materials.魔法道具の詳細な説明。s3に登録されている魔法設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - quxe_organisation.flex.stem.official_materials.quxeのキャラクター組織・文化団体などののまとめページ
                - quxe_organisation_name.contents.stem.official_materials.quxeの各組織の詳細な説明。s3に登録されているquxe組織設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - quxe_characters.flex.stem.official_materials.quxeに登場するキャラクターのまとめページ
                - quxe_character_name.contents.stem.official_materials.quxeに登場する各キャラクターの詳細な説明。s3に登録されているquxeキャラクター設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - quxe_maps.flex.stem.official_materials.quxeに登場する地形のまとめページ
                - quxe_map_name.contents.stem.official_materials.quxeに登場する各マップの詳細な説明。s3に登録されているquxeマップ設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - quxe_history.flex.stem.official_materials.quxeの歴史的背景のまとめページ
                - quxe_history_name.contents.stem.official_materials.quxeの歴史的イベントの詳細な説明。s3に登録されているquxeイベント設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する

        - hodemei.flex.stem.official_materials.世界「hodemei」に関する設定資料のハブ
            - htech.flex.stem.official_materials.hodemeiに登場する未来技術のまとめページ
                - htech_name.contents.stem.official_materials.未来技術の詳細な説明。s3に登録されている未来技術資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - hodemei_organisation.flex.stem.official_materials.hodemeiのキャラクター組織・文化団体などののまとめページ
                - hodemei_organisation_name.contents.stem.official_materials.hodemeiの各組織の詳細な説明。s3に登録されているhodemei組織設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - hodemei_characters.flex.stem.official_materials.hodemeiに登場するキャラクターのまとめページ
                - hodemei_character_name.contents.stem.official_materials.hodemeiに登場する各キャラクターの詳細な説明。s3に登録されているhodemeiキャラクター設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - hodemei_maps.flex.stem.official_materials.hodemeiに登場する地形のまとめページ
                - hodemei_map_name.contents.stem.official_materials.hodemeiに登場する各マップの詳細な説明。s3に登録されているhodemeiマップ設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - hodemei_history.flex.stem.official_materials.hodemeiの歴史的背景のまとめページ
                - hodemei_history_name.contents.stem.official_materials.hodemeiの歴史的イベントの詳細な説明。s3に登録されているhodemeiイベント設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する

        - alsarejia.core.stem.official_materials.世界「alsarejia」に関する設定資料のハブ
            - maps.core.stem.Laboratory.「アルサレジア」の施設地図を掲載するページ
                - basis.core.stem.Laboratory.アルサレジアの重要な設備や機能を紹介するページ。変更不能な要素
                - rooms.contents.stem.Laboratory.「アルサレジア」に登場する各部屋の詳細を説明するページ。s3に登録されているrooms設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する。
            - items.flex.stem.Laboratory.アルサレジアに登場するアイデア体のまとめページ
                - item_name.contents.stem.Laboratory.アイデア体の詳細を説明するページ。s3に登録されているアイデア体設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する。
            - atechs.flex.stem.Laboratory.アルサレジアに登場する特殊技術のまとめページ
                - atech_name.contents.stem.Laboratory.特殊技術の詳細を説明するページ。s3に登録されている特殊技術設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する。
            - alsarejia_characters.flex.stem.official_materials.alsarejiaに登場するキャラクターのまとめページ
                - alsarejia_character_name.contents.stem.official_materials.alsarejiaに登場する各キャラクターの詳細な説明。s3に登録されているalsarejiaキャラクター設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - alsarejia_history.flex.stem.official_materials.alsarejiaの歴史的背景のまとめページ
                - alsarejia_historyname.contents.stem.official_materials.alsarejiaの歴史的イベントの詳細な説明。s3に登録されているalsarejiaイベント設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する

    - s_common.flex.stem.shared_materials.全ての世界に共通するshared設定資料のハブ。
        - s_mainsys.flex.stem.shared_materials.共有型の創作世界の基盤となるshared想像循環システムの概要を紹介する
            - s_ideaspace.contents.branch.shared_materials.創作プロジェクト全体に共通する設定「sharedアイデア空間理論」の情報を掲載
            - s_reality.contents.branch.shared_materials.創作プロジェクト全体に共通する物理法則「shared現実性理論」を掲載
            - s_timeloops.contents.branch.shared_materials.固有世界ごとのshared時間軸設定と全体のshared時間的循環構造（不明な外部世界からの着想を含む、「物語」としてのこの世界の在り方に対する考察）を掲載
        - s_glossary.contents.stem.shared_materials.shared固有名詞の説明表を掲載

        - s_lefi.flex.stem.shared_materials.独自言語lefiの解釈に関するshared設定の紹介と説明
            - s_vocab.contents.branch.shared_materials.独自言語lefiのshared語彙やshared文法を掲載
    - s_unique.flex.stem.shared_materials.各固有世界のshared設定資料ハブ
        - s_quxe.flex.stem.shared_materials.世界「quxe」に関するshared設定資料のハブ。
            - s_majic.flex.stem.shared_materials.quxeに登場するshared魔法のまとめページ
                - s_majiclogic.contents.branch.shared_materials.shared魔法理論の説明。s3に登録されているshared魔法理論資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
                - s_majicname.contents.branch.shared_materials.shared魔法の詳細な説明。s3に登録されているshared魔法設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_artifact.flex.stem.shared_materials.quxeに登場するshared魔法道具のまとめページ
                - s_artifactname.contents.branch.shared_materials.shared魔法道具の詳細な説明。s3に登録されているshared魔法設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_quxe_organisation.flex.stem.shared_materials.quxeのsharedキャラクター組織・文化団体などののまとめページ
                - s_quxe_organisation_name.contents.branch.shared_materials.quxeの各shared組織の詳細な説明。s3に登録されているquxeshared組織設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_quxe_characters.flex.stem.shared_materials.quxeに登場するsharedキャラクターのまとめページ
                - s_quxe_character_name.contents.branch.shared_materials.quxeに登場する各キsharedャラクターの詳細な説明。s3に登録されているquxesharedキャラクター設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_quxe_maps.flex.stem.shared_materials.quxeに登場するshared地形のまとめページ
                - s_quxe_map_name.contents.branch.shared_materials.quxeに登場する各sharedマップの詳細な説明。s3に登録されているquxesharedマップ設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_quxe_history.flex.stem.shared_materials.quxeのshared歴史的背景のまとめページ
                - s_quxe_history_name.contents.branch.shared_materials.quxeのshared歴史的イベントの詳細な説明。s3に登録されているquxesharedイベント設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する

        - s_hodemei.flex.stem.shared_materials.世界「hodemei」に関するshared設定資料のハブ
            - s_htech.flex.stem.shared_materials.hodemeiに登場するshared未来技術のまとめページ
                - s_htech_name.contents.branch.shared_materials.shared未来技術の詳細な説明。s3に登録されているsharedhtech技術資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_hodemei_organisation.flex.stem.shared_materials.hodemeiのsharedキャラクター組織・文化団体などののまとめページ
                - s_hodemei_organisation_name.contents.branch.shared_materials.hodemeiの各shared組織の詳細な説明。s3に登録されているhodemeishared組織設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_hodemei_characters.flex.stem.shared_materials.hodemeiに登場するsharedキャラクターのまとめページ
                - s_hodemei_character_name.contents.branch.shared_materials.hodemeiに登場する各sharedキャラクターの詳細な説明。s3に登録されているhodemeisharedキャラクター設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_hodemei_maps.flex.stem.shared_materials.hodemeiに登場するshared地形のまとめページ
                - s_hodemei_map_name.contents.branch.shared_materials.hodemeiに登場する各マップの詳細な説明。s3に登録されているhodemeisharedマップ設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_hodemei_history.flex.stem.shared_materials.hodemeiのshared歴史的背景のまとめページ
                - s_hodemei_history_name.contents.branch.shared_materials.hodemeiの歴史的イベントの詳細な説明。s3に登録されているhodemeisharedイベント設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する

        - s_alsarejia.core.stem.shared_materials.世界「alsarejia」に関するshared設定資料のハブ
            - s_rooms.flex.branch.Laboratory.各shared部屋の詳細を説明するページ。
                - s_ideaitem_name.contents.branch.Laboratory.sharedroomの詳細を説明するページ。s3に登録されているsharedrooms体設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する。
            - s_ideaitems.flex.stem.Laboratory.アルサレジアに登場するsharedアイデア体のまとめページ
                - s_ideaitem_name.contents.branch.Laboratory.sharedアイデア体の詳細を説明するページ。s3に登録されているsharedアイデア体設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する。
            - s_atechs.flex.stem.Laboratory.アルサレジアに登場するshared特殊技術のまとめページ
                - s_atechname.contents.branch.Laboratory.shared特殊技術の詳細を説明するページ。s3に登録されているshared特殊技術設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する。
            - s_alsarejia_characters.flex.stem.shared_materials.alsarejiaに登場するキャラクターのまとめページ
                - s_alsarejia_character_name.contents.branch.shared_materials.alsarejiaに登場する各sharedキャラクターの詳細な説明。s3に登録されているalsarejiasharedキャラクター設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する
            - s_alsarejia_history.flex.stem.shared_materials.alsarejiaのshared歴史的背景のまとめページ
                - s_alsarejia_historyname.contents.branch.shared_materials.alsarejiaの歴史的イベントの詳細な説明。s3に登録されているalsarejiasharedイベント設定資料の数だけページが作成されるか、一つのページが「表示コンテンツの切り替え機能」を有する形で実装する

    - settings.core.branch.user.設定・ログインなど
    - profile.core.branch.user.プロフィール・お気に入り・履歴（栞機能）など

    - submit.core.branch.create.投稿フォーム
    - dashboard.core.branch.create.投稿管理用のダッシュボード
    - guidelines.core.stem.create.投稿ガイドライン
    
    - ご利用の方へ.core.stem.system.shared設定資料の活用方法、ユースケースなどを紹介
    - 利用規約.core.stem.system.設定資料を利用した三次創作に関する規約
    - rights.core.stem.system.サイト全体およびコンテンツの権利・利用ポリシーを説明するページ
        - 禁書庫.core.admin.system.サイト管理者が登録されているコンテンツ・コメント・ユーザ情報などの編集、削除、投稿前チェックなどをおこなうコンソール


### 実装状況について
実装ではローカルディレクトリ"project-niferche"が利用されています。
- ディレクトリ構造はextra文書「construct」を参照してください
- 実装したいデータモデル・ストレージ設計については上記の「technical-data-management-spec」に記されています
- 直近での更新状況や実装進捗、重要な課題、その他特記事項についてはhandover文書が作成されています。ただしhandover文書はclaudeが生成するものであり文書タイプは非extraです。実際の実装業務において矛盾が生じた場合の解決にはextra文書群を優先的に参照してください。