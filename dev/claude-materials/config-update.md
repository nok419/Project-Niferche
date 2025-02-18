# document_management_config.yaml v3.0.0

metadata:
  document_type: system_config
  version: 3.0.0
  relationships:
    - logs: version_logs_v1.5.0
    - guidelines: creative_process_guidelines_v1.4.0
    - development_status: development_status_v1.4.0
  update_notes: "文書管理構造の体系化と引継ぎ性能の強化"

document_hierarchy:
  levels:
    level_1:
      type: "project_foundation"
      purpose: "project_integrity_maintenance"
      documents:
        - config
        - guidelines
        - logs
        - development_status
      authority: "system_foundation"
      sync_requirement: "none"
      validation_rules:
        - "システム状態の完全な記述"
        - "優先度の明確な定義"
        - "進行状況の詳細な記録"
        - "次期アクションの明示"
        - "変更履歴の完全な保持"
    
    level_2:
      type: "grand_design"
      purpose: "world_structure_definition"
      documents:
        pairs:
          - human: "creative-world-design-human"
            tech: "creative-world-design-technical"
      authority: "world_structure"
      sync_requirement: "human_tech_pair"
      validation_rules:
        - "完全な世界構造の定義"
        - "基本法則の明確な記述"
        - "世界間相互作用の定義"
        - "共通制約の管理"
        - "時間構造の完全な定義"
        - "因果関係の体系的記述"
    
    level_3:
      type: "world_specific"
      purpose: "individual_world_management"
      documents:
        world_settings:
          - pair:
              human: "hodemei-human"
              tech: "hodemei-technical"
          - pair:
              human: "quxe-human"
              tech: "quxe-technical"
          - pair:
              human: "alsarejia-human"
              tech: "alsarejia-technical"
        character_settings:
          - human: "quxe-characters"
            tech: "quxe-characters-technical"
      authority: "independent_implementation"
      sync_requirement: "human_tech_pair"
      validation_rules:
        - "グランドデザインとの整合性"
        - "世界固有要素の完全な記述"
        - "外部影響イベントの実装"
        - "世界固有制約の定義"
        - "時間構造との整合性"
        - "独立した実装定義"

reference_control:
  rules:
    upward_reference:
      allowed: false
      reason: "システムの一貫性維持"
    
    same_level_reference:
      human_tech_pair:
        allowed: true
        conditions: "同期維持必須"
      world_specific:
        allowed: true
        conditions: "同一世界内のみ"
        validation: "整合性確認必須"
    
    downward_reference:
      allowed: true
      conditions: "なし"
      validation: "参照先の存在確認"

document_types:
  human:
    purpose: "human_readable_documentation"
    description: "人間可読性に最適化された文書"
    requirements:
      - "明確な構造化"
      - "理解しやすい説明"
      - "tech文書との同期"
      - "完全な情報の記述"
      - "プロジェクトの方向性の明確化"
    validation:
      - "読解性の確認"
      - "情報の完全性"
      - "構造の妥当性"
  
  tech:
    purpose: "technical_and_inheritance_support"
    description: "引継ぎ補完と技術詳細を管理する文書"
    content_requirements:
      implementation_details:
        - "システム仕様と実装詳細"
        - "具体的なパラメータ定義"
        - "検証用数値基準"
        - "技術的整合性の確保手段"
      inheritance_support:
        - "世界観の深層的な文脈情報"
        - "キャラクターの心理的背景"
        - "出来事の因果関係の詳細"
        - "設定間の微細な関連性"
        - "メタ構造的な意味付け"
        - "暗黙的な前提や含意"
        - "システムの哲学的基盤"
    update_triggers:
      primary: "対応するhuman文書の更新"
      timing: "human文書と同時"
      validation: "同期状態の確認必須"

version_control:
  format: "v{major}.{minor}.{patch}"
  paired_documents:
    sync_requirement: "mandatory"
    version_match: "exact"
    update_process:
      - "human文書の更新"
      - "tech文書の同期更新"
      - "整合性の検証"

validation_requirements:
  content_validation:
    completeness:
      - "情報の完全性"
      - "説明の十分性"
      - "省略の不使用"
      - "時間構造の整合"
    
    consistency:
      - "文書階層間の整合性"
      - "参照規則の遵守"
      - "内部矛盾の排除"
      - "相互作用の一貫性"
    
    clarity:
      - "構造の明確さ"
      - "説明の明瞭性"
      - "用語の統一"
      - "概念の明確化"

  inheritance_validation:
    quality:
      - "文脈情報の保持"
      - "暗黙知の明示化"
      - "関連性の完全な記述"
    
    completeness:
      - "技術情報の網羅"
      - "質的情報の保持"
      - "メタ構造の維持"

error_prevention:
  validation_process:
    structural:
      - "文書構造の検証"
      - "参照整合性の確認"
      - "時間構造の確認"
    
    content:
      - "バージョン同期の確認"
      - "完全性の確認"
      - "相互作用の検証"
  
  documentation:
    required:
      - "変更内容の記録"
      - "影響範囲の文書化"
      - "検証結果の保存"
    
    tracking:
      - "更新過程の記録"
      - "変更理由の文書化"
      - "影響範囲の分析"
      - "検証結果の追跡"