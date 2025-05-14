// src/pages/laboratory/GamePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { WorldNavigation } from '../../components/navigation/WorldNavigation';
import './GamePage.css';

// ゲームのキャラクターインターフェース
interface GameCharacter {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  sprite: string;
  name: string;
}

// ゲームの状態インターフェース
interface GameState {
  player: GameCharacter;
  npcs: GameCharacter[];
  currentScene: string;
  dialogues: string[];
  currentDialogue: number | null;
  gameStarted: boolean;
  inventory: string[];
}

/**
 * 2Dアドベンチャーゲームのページコンポーネント
 * 簡易的なゲームエンジンの実装例
 */
const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: 150,
      y: 150,
      direction: 'down',
      sprite: '/images/fallback.jpg', // プレイヤースプライト（後で差し替え）
      name: 'プレイヤー'
    },
    npcs: [
      {
        x: 250,
        y: 150,
        direction: 'left',
        sprite: '/images/fallback.jpg', // NPCスプライト（後で差し替え）
        name: 'ガイド'
      }
    ],
    currentScene: 'start',
    dialogues: [
      "こんにちは、Project Nifercheの実験的ゲームへようこそ！",
      "これは2Dアドベンチャーゲームのプロトタイプです。",
      "矢印キーで移動し、スペースキーで会話やアクションができます。",
      "この実験的な機能はまだ開発中です。今後のアップデートをお楽しみに！"
    ],
    currentDialogue: null,
    gameStarted: false,
    inventory: []
  });
  
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  
  // キー入力のイベントリスナーを設定
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key]: true }));
      
      // スペースキーでダイアログ/アクション
      if (e.key === ' ') {
        handleAction();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);
  
  // ゲームループ - キャラクター移動などの更新
  useEffect(() => {
    if (!gameState.gameStarted || gameState.currentDialogue !== null) return;
    
    const gameLoop = setInterval(() => {
      setGameState(prevState => {
        const newState = { ...prevState };
        const moveSpeed = 3;
        
        // プレイヤーの移動処理
        if (keysPressed.ArrowUp) {
          newState.player.y = Math.max(0, newState.player.y - moveSpeed);
          newState.player.direction = 'up';
        }
        if (keysPressed.ArrowDown) {
          newState.player.y = Math.min(300, newState.player.y + moveSpeed);
          newState.player.direction = 'down';
        }
        if (keysPressed.ArrowLeft) {
          newState.player.x = Math.max(0, newState.player.x - moveSpeed);
          newState.player.direction = 'left';
        }
        if (keysPressed.ArrowRight) {
          newState.player.x = Math.min(500, newState.player.x + moveSpeed);
          newState.player.direction = 'right';
        }
        
        // NPCとの衝突判定
        newState.npcs.forEach(npc => {
          // 簡易的な衝突距離の計算
          const distance = Math.sqrt(
            Math.pow(newState.player.x - npc.x, 2) + 
            Math.pow(newState.player.y - npc.y, 2)
          );
          
          // 近すぎる場合は少し押し戻す
          if (distance < 30) {
            const pushDistance = 2;
            switch (newState.player.direction) {
              case 'up':
                newState.player.y += pushDistance;
                break;
              case 'down':
                newState.player.y -= pushDistance;
                break;
              case 'left':
                newState.player.x += pushDistance;
                break;
              case 'right':
                newState.player.x -= pushDistance;
                break;
            }
          }
        });
        
        return newState;
      });
    }, 16); // 約60FPS
    
    return () => clearInterval(gameLoop);
  }, [keysPressed, gameState.gameStarted, gameState.currentDialogue]);
  
  // キャンバスへの描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景色を描画
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 簡易的なグリッド線を描画
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // 縦線
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // 横線
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // NPCの描画
    gameState.npcs.forEach(npc => {
      // 円形のプレースホルダー
      ctx.fillStyle = '#5D9CEC';
      ctx.beginPath();
      ctx.arc(npc.x, npc.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // NPC名を表示
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x, npc.y - 25);
    });
    
    // プレイヤーの描画
    if (gameState.gameStarted) {
      // 円形のプレースホルダー
      ctx.fillStyle = '#FC6E51';
      ctx.beginPath();
      ctx.arc(gameState.player.x, gameState.player.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // 方向を示す矢印
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      switch (gameState.player.direction) {
        case 'up':
          ctx.moveTo(gameState.player.x, gameState.player.y - 5);
          ctx.lineTo(gameState.player.x, gameState.player.y - 15);
          break;
        case 'down':
          ctx.moveTo(gameState.player.x, gameState.player.y + 5);
          ctx.lineTo(gameState.player.x, gameState.player.y + 15);
          break;
        case 'left':
          ctx.moveTo(gameState.player.x - 5, gameState.player.y);
          ctx.lineTo(gameState.player.x - 15, gameState.player.y);
          break;
        case 'right':
          ctx.moveTo(gameState.player.x + 5, gameState.player.y);
          ctx.lineTo(gameState.player.x + 15, gameState.player.y);
          break;
      }
      
      ctx.stroke();
    }
  }, [gameState]);
  
  // スペースキーでのアクション処理
  const handleAction = () => {
    setGameState(prevState => {
      // ゲームがまだ開始されていない場合は開始
      if (!prevState.gameStarted) {
        return {
          ...prevState,
          gameStarted: true,
          currentDialogue: 0 // 最初のダイアログを表示
        };
      }
      
      // ダイアログ表示中の場合
      if (prevState.currentDialogue !== null) {
        // 次のダイアログへ、もしくはダイアログ終了
        if (prevState.currentDialogue < prevState.dialogues.length - 1) {
          return {
            ...prevState,
            currentDialogue: prevState.currentDialogue + 1
          };
        } else {
          return {
            ...prevState,
            currentDialogue: null
          };
        }
      }
      
      // NPCとの対話判定
      for (const npc of prevState.npcs) {
        const distance = Math.sqrt(
          Math.pow(prevState.player.x - npc.x, 2) + 
          Math.pow(prevState.player.y - npc.y, 2)
        );
        
        // 一定の距離内にいる場合、ダイアログを表示
        if (distance < 50) {
          return {
            ...prevState,
            currentDialogue: 0
          };
        }
      }
      
      return prevState;
    });
  };
  
  // ゲーム開始ボタンのハンドラ
  const handleStartGame = () => {
    setGameState(prevState => ({
      ...prevState,
      gameStarted: true,
      currentDialogue: 0
    }));
  };
  
  return (
    <div className="game-page">
      <header className="game-page__header">
        <h1 className="game-page__title">2Dアドベンチャーゲーム</h1>
        <p className="game-page__description">
          Project Nifercheの世界を舞台とした2Dアドベンチャーゲームのプロトタイプです。
          実験的な機能のため、現在は簡易的な操作のみをサポートしています。
        </p>
      </header>

      <WorldNavigation worldType="laboratory" mode="tab" />

      <div className="game-page__container">
        <div className="game-page__canvas-wrapper">
          {!gameState.gameStarted && !gameState.currentDialogue && (
            <div className="game-page__start-screen">
              <h2>Project Niferche Adventure</h2>
              <p>矢印キーで移動、スペースキーで会話・アクション</p>
              <button 
                className="game-page__start-button"
                onClick={handleStartGame}
              >
                ゲームを始める
              </button>
            </div>
          )}
          
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={300} 
            className="game-page__canvas"
          />
          
          {gameState.currentDialogue !== null && (
            <div className="game-page__dialogue">
              <div className="game-page__dialogue-content">
                <p>{gameState.dialogues[gameState.currentDialogue]}</p>
                <div className="game-page__dialogue-indicator">▼</div>
              </div>
              <div className="game-page__dialogue-help">
                スペースキーで次へ
              </div>
            </div>
          )}
          
          <div className="game-page__controls">
            <div className="game-page__control-info">
              <h3>操作方法</h3>
              <ul>
                <li>↑↓←→ : 移動</li>
                <li>スペース : 会話・アクション</li>
              </ul>
            </div>
            <div className="game-page__touch-controls">
              <button className="game-page__touch-up" onTouchStart={() => setKeysPressed(prev => ({ ...prev, ArrowUp: true }))}>↑</button>
              <div className="game-page__touch-middle">
                <button className="game-page__touch-left" onTouchStart={() => setKeysPressed(prev => ({ ...prev, ArrowLeft: true }))}>←</button>
                <button className="game-page__touch-action" onTouchStart={handleAction}>アクション</button>
                <button className="game-page__touch-right" onTouchStart={() => setKeysPressed(prev => ({ ...prev, ArrowRight: true }))}>→</button>
              </div>
              <button className="game-page__touch-down" onTouchStart={() => setKeysPressed(prev => ({ ...prev, ArrowDown: true }))}>↓</button>
            </div>
          </div>
        </div>
        
        <div className="game-page__info">
          <div className="game-page__coming-soon">
            <h3>開発中の機能</h3>
            <ul>
              <li>完全なストーリーモード</li>
              <li>複数のマップとシーン</li>
              <li>アイテムと収集要素</li>
              <li>キャラクターカスタマイズ</li>
              <li>グラフィックの向上</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="game-page__footer">
        <p>
          このゲームは実験的な機能です。今後のアップデートでさらなる機能が追加される予定です。
          ご意見やフィードバックをお待ちしています。
        </p>
      </footer>
    </div>
  );
};

export default GamePage;