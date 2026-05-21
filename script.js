/* =============================================================
   Coloracle 〜ココロ・パレット〜
   script.js
   - 9色のタイル → 3グループ（A/B/C）に分類
   - switch 文で1次分岐、Math.random で2次分岐
   - DOM操作で背景動画切替＋色フィルター付与＋カード色＋ラッキーアイテム
   ============================================================= */

const colorData = {
  // ===== Group A : 休息・充電 =====
  lavender: {
    group: 'A',
    tint:    '#9b89c9',
    cardBg:  '#d8cef0',
    messages: [
      'がんばり屋のセンサー、今夜はOFFで',
      '深呼吸ひとつ。世界はあなたの味方だよ',
      '頭の中のひとり反省会、強制終了です',
    ],
    luckyItems: ['ハーブティー', 'ラベンダーキャンドル', '紫の入浴剤'],
  },
  navy: {
    group: 'A',
    tint:    '#3d4f7a',
    cardBg:  '#bccae4',
    messages: [
      '静かな夜　誰の目も気にせず、殻にこもろう',
      '今夜はスマホより、自分の声をのぞいてみよう',
      '一人時間は、自分のための最高の時間',
    ],
    luckyItems: ['お気に入りの本', '月のチャーム', '紺色のブランケット'],
  },
  gray: {
    group: 'A',
    tint:    '#7a7e8c',
    cardBg:  '#d2d3dc',
    messages: [
      '今日は何もしないのが大正解',
      '感情スイッチ　一回オフにしてゴロゴロしよう',
      '白黒つけない日。グレーのままで、おやすみ',
    ],
    luckyItems: ['グレーのパーカー', 'モノクロ写真', 'ホットチョコレート'],
  },

  // ===== Group B : 自愛・境界線 =====
  pink: {
    group: 'B',
    tint:    '#e8a0aa',
    cardBg:  '#fad4d9',
    messages: [
      'まずは自分が、自分を世界一お姫様扱い',
      'ワガママなあなたも　愛おしくて満点',
      '誰かの期待に応えなくていい。自分ファースト',
    ],
    luckyItems: ['ローズ色のリップ', 'ハート型クッキー', '桜の香りのコスメ'],
  },
  mint: {
    group: 'B',
    tint:    '#9ec9a3',
    cardBg:  '#cfecd1',
    messages: [
      '嫌な空気はシャットアウト　深呼吸しよう',
      '他人の機嫌はスルー　心の風通しを良く',
      '境界線は　あなたを守る優しいお守り',
    ],
    luckyItems: ['ミントの観葉植物', 'グリーンスムージー', 'メントールキャンディ'],
  },
  turquoise: {
    group: 'B',
    tint:    '#7ab8b8',
    cardBg:  '#c2e3e3',
    messages: [
      '空気を読むの、今日はお休み。本音でいこう',
      '枠からはみ出すくらいが、あなたらしくて素敵。',
      '心のままに、自由な風に乗って進んで',
    ],
    luckyItems: ['ターコイズの石', '旅行ガイドブック', '海の写真'],
  },

  // ===== Group C : 前進・リセット =====
  yellow: {
    group: 'C',
    tint:    '#e5c868',
    cardBg:  '#f6e5a8',
    messages: [
      '直感を信じて！面白いことが始まる予感',
      'あなたのワクワクが、未来の扉をパッと開く',
      '難しく考えず、楽しそうな方を選んじゃおう',
    ],
    luckyItems: ['ひまわり', 'レモンウォーター', '黄色いお花'],
  },
  white: {
    group: 'C',
    tint:    '#dcd6c8',
    cardBg:  '#faf5e8',
    messages: [
      '今日からシーズン2。真っ白なページをめくろう',
      '過去の失敗はリセット！真っ白な一歩を踏み出そう',
      '何色にでもなれる。キャンバスは、今真っ白',
    ],
    luckyItems: ['白いマグカップ', '真っ白なノート', 'シルバーリング'],
  },
  orange: {
    group: 'C',
    tint:    '#e89b6a',
    cardBg:  '#f7cca7',
    messages: [
      '準備はバッチリ。自信を持って飛び出そう！',
      '失敗なんて怖くない。あなたの情熱が一番強い',
      '追い風が吹いてるよ。あとは一歩踏み出すだけ',
    ],
    luckyItems: ['オレンジジュース', '夕焼けの写真', 'シナモンロール'],
  },
};

const groupLabels = {
  A: 'Rest & Recharge',
  B: 'Self-love & Boundaries',
  C: 'Move Forward',
};

function formatMessage(text) {
  return text
    .replace(/([、。！？])(?!$)/g, '$1<br>') 
    .replace(/　/g, '<br>'); 
}

// --- DOM 参照 ---
const $opening    = document.getElementById('opening');
const $palette    = document.getElementById('palette');
const $result     = document.getElementById('result');
const $startBtn   = document.getElementById('start-btn');
const $retryBtn   = document.getElementById('retry-btn');
const $oracleTxt  = document.getElementById('oracle-text');
const $groupTag   = document.getElementById('group-tag');
const $luckyTxt   = document.getElementById('lucky-text');
const $oracleCard = document.querySelector('.oracle-card');
const $chihuahua  = document.getElementById('chihuahua-mini');
const $cards      = document.querySelectorAll('.color-card');
const $vidOpening = document.getElementById('video-opening');
const $vidClean   = document.getElementById('video-clean');
const $tint       = document.getElementById('color-tint');
const $bgm        = document.getElementById('card-bgm');

function activateVideo(target) {
  [$vidOpening, $vidClean].forEach(v => {
    if (v === target) {
      v.classList.add('is-active');
      v.play().catch(() => { /* autoplay制限時は無視 */ });
    } else {
      v.classList.remove('is-active');
      v.pause();
    }
  });
}

function showScreen(target) {
  [$opening, $palette, $result].forEach(s => s.classList.add('hidden'));
  target.classList.remove('hidden');
  target.style.animation = 'none';
  target.offsetHeight;
  target.style.animation = '';
}

$startBtn.addEventListener('click', () => {
  activateVideo($vidClean); 
  $tint.classList.remove('is-active');
  showScreen($palette);
});

$cards.forEach(card => {
  card.addEventListener('click', () => {
    const colorKey = card.dataset.color;
    const info = colorData[colorKey];
    if (!info) return;

    // 1次分岐: switch でグループ判定（結果カードのラベル決定）
    let groupLabel;
    switch (info.group) {
      case 'A': groupLabel = groupLabels.A; break;
      case 'B': groupLabel = groupLabels.B; break;
      case 'C': groupLabel = groupLabels.C; break;
      default:  groupLabel = "Today's Oracle";
    }

    // 2次分岐: Math.random でメッセージとラッキーアイテムをそれぞれ抽出
    const msgIndex   = Math.floor(Math.random() * info.messages.length);
    const luckyIndex = Math.floor(Math.random() * info.luckyItems.length);
    const chosenMessage = info.messages[msgIndex];
    const chosenLucky   = info.luckyItems[luckyIndex];

    try {
      $bgm.currentTime = 0;
      $bgm.volume = 0.6;
      $bgm.play().catch(() => { /* autoplay制限時は無音で続行 */ });
    } catch (e) { /* ignore */ }

    $tint.style.backgroundColor = info.tint;
    $tint.classList.add('is-active');

    $oracleCard.style.backgroundColor = info.cardBg;
    $chihuahua.style.backgroundColor = info.tint;

    $oracleTxt.innerHTML = formatMessage(chosenMessage);
    $luckyTxt.innerText  = chosenLucky;
    $groupTag.innerText  = groupLabel;

    showScreen($result);
  });
});

$retryBtn.addEventListener('click', () => {
  try { $bgm.pause(); $bgm.currentTime = 0; } catch (e) {}
  $tint.classList.remove('is-active');
  activateVideo($vidOpening);
  showScreen($opening);
});

// --- 初期化：オープニング動画を再生 ---
$vidOpening.play().catch(() => {});