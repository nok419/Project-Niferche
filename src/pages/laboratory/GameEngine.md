# Project Niferche 2D Adventure Game Engine Design

## 概要

Project Nifercheの世界観を活かした2Dアドベンチャーゲームエンジンの設計案です。このエンジンは、コマンド選択とキャラクター移動を中心とした、テキストアドベンチャーとビジュアルノベルの要素を組み合わせたゲーム体験を提供します。

## 設計原則

1. **シンプルな操作性**: 複雑なアクションは必要なく、移動とコマンド選択のみでゲームが完結
2. **ストーリー重視**: 物語体験を最優先し、ゲームメカニクスはストーリーをサポートする形で設計
3. **世界観との一貫性**: Project Nifercheの世界観を反映したビジュアルと設定
4. **拡張可能性**: 将来的な機能拡張を見据えたモジュラー設計

## コアシステム

### 1. ゲームエンジン基盤

```typescript
// src/core/game-engine/engine.ts
export class GameEngine {
  private scenes: Map<string, Scene>; 
  private currentScene: Scene | null;
  private gameState: GameState;
  private eventEmitter: EventEmitter;
  
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this.gameState = new GameState();
    this.eventEmitter = new EventEmitter();
  }
  
  // シーンの追加
  addScene(id: string, scene: Scene): void {
    this.scenes.set(id, scene);
  }
  
  // シーンの切り替え
  changeScene(id: string): void {
    if (!this.scenes.has(id)) {
      throw new Error(`Scene with id '${id}' does not exist`);
    }
    
    // 現在のシーンのクリーンアップ
    if (this.currentScene) {
      this.currentScene.onExit();
    }
    
    // 新しいシーンへの切り替え
    const newScene = this.scenes.get(id)!;
    this.currentScene = newScene;
    newScene.onEnter(this.gameState);
    
    // イベント発火
    this.eventEmitter.emit('sceneChanged', id);
  }
  
  // ゲームの状態更新
  update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime, this.gameState);
    }
  }
  
  // 描画処理
  render(renderer: Renderer): void {
    if (this.currentScene) {
      this.currentScene.render(renderer, this.gameState);
    }
  }
  
  // 入力処理
  handleInput(input: UserInput): void {
    if (this.currentScene) {
      this.currentScene.handleInput(input, this.gameState);
    }
  }
}
```

### 2. シーンシステム

```typescript
// src/core/game-engine/scene.ts
export interface Scene {
  onEnter(gameState: GameState): void;
  onExit(): void;
  update(deltaTime: number, gameState: GameState): void;
  render(renderer: Renderer, gameState: GameState): void;
  handleInput(input: UserInput, gameState: GameState): void;
}

// 具体的な実装例：マップシーン
export class MapScene implements Scene {
  private map: TileMap;
  private entities: Entity[];
  private dialogManager: DialogManager;
  
  constructor(mapData: MapData) {
    this.map = new TileMap(mapData);
    this.entities = [];
    this.dialogManager = new DialogManager();
  }
  
  onEnter(gameState: GameState): void {
    // プレイヤーの位置を設定
    gameState.player.setPosition(this.map.getSpawnPoint());
    
    // NPCやアイテムを追加
    this.loadEntities(gameState);
  }
  
  onExit(): void {
    // クリーンアップ処理
  }
  
  update(deltaTime: number, gameState: GameState): void {
    // エンティティの更新
    this.entities.forEach(entity => entity.update(deltaTime, gameState));
    
    // 衝突検出
    this.detectCollisions(gameState);
    
    // ダイアログの更新
    this.dialogManager.update(deltaTime);
  }
  
  render(renderer: Renderer, gameState: GameState): void {
    // マップの描画
    this.map.render(renderer);
    
    // エンティティの描画
    this.entities.forEach(entity => entity.render(renderer));
    
    // プレイヤーの描画
    gameState.player.render(renderer);
    
    // ダイアログの描画
    this.dialogManager.render(renderer);
  }
  
  handleInput(input: UserInput, gameState: GameState): void {
    // ダイアログ表示中は入力をダイアログに転送
    if (this.dialogManager.isActive()) {
      this.dialogManager.handleInput(input);
      return;
    }
    
    // プレイヤーの移動
    if (input.type === 'move') {
      const newPosition = gameState.player.getPosition().add(input.direction);
      
      // 移動可能かチェック
      if (this.map.isWalkable(newPosition)) {
        gameState.player.setPosition(newPosition);
      }
    }
    
    // アクション実行
    if (input.type === 'action') {
      const interactiveEntity = this.findInteractiveEntityNearPlayer(gameState.player);
      if (interactiveEntity) {
        interactiveEntity.interact(gameState, this.dialogManager);
      }
    }
  }
  
  private loadEntities(gameState: GameState): void {
    // マップデータからNPCやアイテムを読み込む
  }
  
  private detectCollisions(gameState: GameState): void {
    // 衝突判定
  }
  
  private findInteractiveEntityNearPlayer(player: Player): InteractiveEntity | null {
    // プレイヤーの周辺でインタラクション可能なエンティティを探す
    return null;
  }
}
```

### 3. エンティティシステム

```typescript
// src/core/game-engine/entity.ts
export interface Entity {
  getPosition(): Vector2;
  update(deltaTime: number, gameState: GameState): void;
  render(renderer: Renderer): void;
}

export interface InteractiveEntity extends Entity {
  interact(gameState: GameState, dialogManager: DialogManager): void;
}

// NPC実装例
export class NPC implements InteractiveEntity {
  private position: Vector2;
  private sprite: Sprite;
  private dialog: Dialog[];
  private state: NPCState;
  
  constructor(config: NPCConfig) {
    this.position = config.position;
    this.sprite = config.sprite;
    this.dialog = config.dialog;
    this.state = config.initialState || 'idle';
  }
  
  getPosition(): Vector2 {
    return this.position;
  }
  
  update(deltaTime: number, gameState: GameState): void {
    // AI行動やアニメーション更新
  }
  
  render(renderer: Renderer): void {
    // スプライトの描画
    renderer.drawSprite(this.sprite, this.position);
  }
  
  interact(gameState: GameState, dialogManager: DialogManager): void {
    // ダイアログの表示
    dialogManager.showDialog(this.dialog, () => {
      // ダイアログ終了後のコールバック
      this.onDialogEnd(gameState);
    });
  }
  
  private onDialogEnd(gameState: GameState): void {
    // ダイアログ終了時の処理
    // クエスト更新や状態変化など
  }
}
```

### 4. ダイアログシステム

```typescript
// src/core/game-engine/dialog.ts
export interface Dialog {
  text: string;
  speaker?: string;
  choices?: DialogChoice[];
  next?: string | null;
}

export interface DialogChoice {
  text: string;
  next: string;
  condition?: (gameState: GameState) => boolean;
  onSelect?: (gameState: GameState) => void;
}

export class DialogManager {
  private currentDialog: Dialog | null;
  private dialogQueue: Dialog[];
  private choices: DialogChoice[];
  private selectedChoice: number;
  private onDialogEnd: (() => void) | null;
  
  constructor() {
    this.currentDialog = null;
    this.dialogQueue = [];
    this.choices = [];
    this.selectedChoice = 0;
    this.onDialogEnd = null;
  }
  
  isActive(): boolean {
    return this.currentDialog !== null || this.dialogQueue.length > 0;
  }
  
  showDialog(dialogs: Dialog[], onEnd?: () => void): void {
    this.dialogQueue = [...dialogs];
    this.onDialogEnd = onEnd || null;
    this.nextDialog();
  }
  
  update(deltaTime: number): void {
    // アニメーションや自動進行など
  }
  
  render(renderer: Renderer): void {
    if (!this.currentDialog) return;
    
    // ダイアログボックスの描画
    renderer.drawDialogBox();
    
    // 話者名の描画
    if (this.currentDialog.speaker) {
      renderer.drawSpeakerName(this.currentDialog.speaker);
    }
    
    // テキストの描画
    renderer.drawText(this.currentDialog.text);
    
    // 選択肢の描画
    if (this.choices.length > 0) {
      this.choices.forEach((choice, index) => {
        renderer.drawChoice(choice.text, index === this.selectedChoice);
      });
    }
  }
  
  handleInput(input: UserInput): void {
    // 選択肢がある場合
    if (this.choices.length > 0) {
      if (input.type === 'up') {
        this.selectedChoice = Math.max(0, this.selectedChoice - 1);
      } else if (input.type === 'down') {
        this.selectedChoice = Math.min(this.choices.length - 1, this.selectedChoice + 1);
      } else if (input.type === 'action') {
        const choice = this.choices[this.selectedChoice];
        if (choice.onSelect) {
          choice.onSelect(this.gameState);
        }
        this.goToDialog(choice.next);
      }
      return;
    }
    
    // 選択肢がない場合は進行
    if (input.type === 'action') {
      this.nextDialog();
    }
  }
  
  private nextDialog(): void {
    if (this.dialogQueue.length > 0) {
      this.currentDialog = this.dialogQueue.shift()!;
      this.choices = this.currentDialog.choices || [];
      this.selectedChoice = 0;
    } else {
      this.currentDialog = null;
      this.choices = [];
      if (this.onDialogEnd) {
        this.onDialogEnd();
        this.onDialogEnd = null;
      }
    }
  }
  
  private goToDialog(id: string): void {
    // 特定IDのダイアログに移動
    // 実際の実装ではダイアログツリーからの検索などが必要
  }
}
```

### 5. ゲーム状態管理

```typescript
// src/core/game-engine/game-state.ts
export class GameState {
  player: Player;
  inventory: Inventory;
  quests: QuestManager;
  variables: Map<string, any>;
  
  constructor() {
    this.player = new Player();
    this.inventory = new Inventory();
    this.quests = new QuestManager();
    this.variables = new Map();
  }
  
  // 変数の設定/取得
  setVariable(key: string, value: any): void {
    this.variables.set(key, value);
  }
  
  getVariable(key: string, defaultValue: any = null): any {
    return this.variables.has(key) ? this.variables.get(key) : defaultValue;
  }
  
  // ゲーム状態の保存/読み込み
  save(): GameSaveData {
    return {
      player: this.player.serialize(),
      inventory: this.inventory.serialize(),
      quests: this.quests.serialize(),
      variables: Object.fromEntries(this.variables)
    };
  }
  
  load(saveData: GameSaveData): void {
    this.player.deserialize(saveData.player);
    this.inventory.deserialize(saveData.inventory);
    this.quests.deserialize(saveData.quests);
    this.variables = new Map(Object.entries(saveData.variables));
  }
}
```

## 拡張機能

### 1. クエストシステム

```typescript
// src/core/game-engine/quest.ts
export interface QuestStage {
  id: string;
  description: string;
  objectives: QuestObjective[];
  reward?: QuestReward;
  nextStage?: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'talk' | 'collect' | 'visit' | 'custom';
  target: any;
  count: number;
  current: number;
  isCompleted: boolean;
}

export class QuestManager {
  private quests: Map<string, Quest>;
  private activeQuests: Set<string>;
  private completedQuests: Set<string>;
  
  constructor() {
    this.quests = new Map();
    this.activeQuests = new Set();
    this.completedQuests = new Set();
  }
  
  // クエスト追加
  addQuest(quest: Quest): void {
    this.quests.set(quest.id, quest);
  }
  
  // クエスト開始
  startQuest(questId: string): boolean {
    if (!this.quests.has(questId) || this.activeQuests.has(questId) || this.completedQuests.has(questId)) {
      return false;
    }
    
    const quest = this.quests.get(questId)!;
    quest.start();
    this.activeQuests.add(questId);
    return true;
  }
  
  // クエスト進行更新
  updateObjective(questId: string, objectiveId: string, progress: number): void {
    if (!this.activeQuests.has(questId)) {
      return;
    }
    
    const quest = this.quests.get(questId)!;
    quest.updateObjective(objectiveId, progress);
    
    if (quest.isCurrentStageCompleted()) {
      quest.advanceStage();
      
      if (quest.isCompleted()) {
        this.activeQuests.delete(questId);
        this.completedQuests.add(questId);
      }
    }
  }
  
  // アクティブなクエスト取得
  getActiveQuests(): Quest[] {
    return Array.from(this.activeQuests).map(id => this.quests.get(id)!);
  }
}

export class Quest {
  id: string;
  title: string;
  description: string;
  stages: QuestStage[];
  currentStageIndex: number;
  
  constructor(config: QuestConfig) {
    this.id = config.id;
    this.title = config.title;
    this.description = config.description;
    this.stages = config.stages;
    this.currentStageIndex = -1;
  }
  
  start(): void {
    this.currentStageIndex = 0;
  }
  
  isCompleted(): boolean {
    return this.currentStageIndex >= this.stages.length;
  }
  
  getCurrentStage(): QuestStage | null {
    if (this.currentStageIndex < 0 || this.currentStageIndex >= this.stages.length) {
      return null;
    }
    return this.stages[this.currentStageIndex];
  }
  
  isCurrentStageCompleted(): boolean {
    const stage = this.getCurrentStage();
    if (!stage) return false;
    
    return stage.objectives.every(obj => obj.isCompleted);
  }
  
  updateObjective(objectiveId: string, progress: number): void {
    const stage = this.getCurrentStage();
    if (!stage) return;
    
    const objective = stage.objectives.find(obj => obj.id === objectiveId);
    if (!objective) return;
    
    objective.current += progress;
    if (objective.current >= objective.count) {
      objective.current = objective.count;
      objective.isCompleted = true;
    }
  }
  
  advanceStage(): void {
    const currentStage = this.getCurrentStage();
    if (!currentStage) return;
    
    if (currentStage.nextStage) {
      // 特定のステージにジャンプ
      const nextStageIndex = this.stages.findIndex(s => s.id === currentStage.nextStage);
      if (nextStageIndex !== -1) {
        this.currentStageIndex = nextStageIndex;
        return;
      }
    }
    
    // 次のステージへ
    this.currentStageIndex++;
  }
}
```

### 2. インベントリシステム

```typescript
// src/core/game-engine/inventory.ts
export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'consumable' | 'key' | 'equipment';
  stackable: boolean;
  maxStack: number;
  use?: (gameState: GameState) => void;
}

export class Inventory {
  private items: Map<string, InventorySlot>;
  private capacity: number;
  
  constructor(capacity = 20) {
    this.items = new Map();
    this.capacity = capacity;
  }
  
  getItems(): InventorySlot[] {
    return Array.from(this.items.values());
  }
  
  hasItem(itemId: string): boolean {
    return this.items.has(itemId);
  }
  
  getItemCount(itemId: string): number {
    if (!this.items.has(itemId)) {
      return 0;
    }
    return this.items.get(itemId)!.count;
  }
  
  addItem(item: Item, count = 1): boolean {
    if (this.items.size >= this.capacity && !this.items.has(item.id)) {
      return false; // 容量不足
    }
    
    if (this.items.has(item.id)) {
      const slot = this.items.get(item.id)!;
      
      if (item.stackable && slot.count < item.maxStack) {
        slot.count = Math.min(slot.count + count, item.maxStack);
        return true;
      } else if (!item.stackable) {
        return false; // スタックできないアイテムは追加できない
      }
    } else {
      // 新しいアイテムを追加
      this.items.set(item.id, {
        item,
        count: Math.min(count, item.stackable ? item.maxStack : 1)
      });
      return true;
    }
    
    return false;
  }
  
  removeItem(itemId: string, count = 1): boolean {
    if (!this.items.has(itemId)) {
      return false;
    }
    
    const slot = this.items.get(itemId)!;
    if (slot.count <= count) {
      this.items.delete(itemId);
    } else {
      slot.count -= count;
    }
    
    return true;
  }
  
  useItem(itemId: string, gameState: GameState): boolean {
    if (!this.items.has(itemId)) {
      return false;
    }
    
    const slot = this.items.get(itemId)!;
    if (slot.item.use) {
      slot.item.use(gameState);
      this.removeItem(itemId, 1);
      return true;
    }
    
    return false;
  }
}

interface InventorySlot {
  item: Item;
  count: number;
}
```

### 3. セーブ/ロードシステム

```typescript
// src/core/game-engine/save-system.ts
export class SaveSystem {
  private storageKey: string;
  
  constructor(gameId: string) {
    this.storageKey = `game_save_${gameId}`;
  }
  
  saveGame(gameState: GameState, slotId: string): boolean {
    try {
      const saveData = gameState.save();
      const allSaves = this.getAllSaves();
      
      allSaves[slotId] = {
        timestamp: Date.now(),
        data: saveData
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(allSaves));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }
  
  loadGame(gameState: GameState, slotId: string): boolean {
    try {
      const allSaves = this.getAllSaves();
      if (!allSaves[slotId]) {
        return false;
      }
      
      gameState.load(allSaves[slotId].data);
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }
  
  getAllSaves(): Record<string, SaveSlot> {
    const savesJson = localStorage.getItem(this.storageKey);
    if (!savesJson) {
      return {};
    }
    
    try {
      return JSON.parse(savesJson);
    } catch {
      return {};
    }
  }
  
  deleteSave(slotId: string): boolean {
    try {
      const allSaves = this.getAllSaves();
      if (!allSaves[slotId]) {
        return false;
      }
      
      delete allSaves[slotId];
      localStorage.setItem(this.storageKey, JSON.stringify(allSaves));
      return true;
    } catch {
      return false;
    }
  }
}

interface SaveSlot {
  timestamp: number;
  data: GameSaveData;
}
```

## ゲーム実装ステップ

1. **基本エンジン実装**:
   - キャンバスレンダリングシステム
   - 入力処理システム
   - シーン管理
   - エンティティシステム

2. **コアゲームプレイ**:
   - マップの実装
   - キャラクター移動
   - カメラシステム
   - 衝突判定

3. **ストーリーコンテンツ**:
   - ダイアログシステム
   - NPCインタラクション
   - イベント管理

4. **拡張システム**:
   - インベントリ
   - クエスト管理
   - セーブ/ロード

5. **コンテンツ制作**:
   - マップデザイン
   - ダイアログ執筆
   - クエスト設計

6. **ユーザーインターフェース**:
   - ゲームメニュー
   - ヘルプ画面
   - 設定オプション

## 参考アーキテクチャ

本ゲームエンジンは以下のゲームの要素を組み合わせた設計を参考にしています：

1. **アンダーテイル** - 簡易な戦闘システムと選択肢重視のストーリー展開
2. **ロボトミーコーポレーション** - キャラクターとの対話とリソース管理
3. **魔女の家** - 謎解きとストーリーテリング
4. **To the Moon** - 感動的なストーリーラインとシンプルな操作性

## 今後の展望

1. **マルチエンディングシステム** - プレイヤーの選択がストーリーに影響するシステム
2. **ミニゲーム統合** - ストーリー内に小規模なゲーム要素を組み込む
3. **モジュール式コンテンツ** - ユーザー作成コンテンツを追加できるシステム
4. **モバイル対応** - タッチ操作の最適化

## 技術的制約と解決策

1. **パフォーマンス最適化**
   - 可視範囲外のエンティティは更新を一時停止
   - スプライトアトラスによるバッチ描画

2. **ブラウザ制約**
   - レンダリングはCanvasAPIに依存
   - セーブデータはlocalStorageとIndexedDBに分散

3. **拡張性**
   - プラグインシステムの導入
   - Jsonによるデータ駆動型設計