let isGameOver = false;
let playerSkillUsed = false;
let isEnemyStunned = false;
let isPlayerStunned = false;

//画面定義
const titleScreen = document.getElementById("title-screen");
const startButton = document.getElementById("start-button");
const battleScreen = document.getElementById("battle-screen");
const detailScreen = document.getElementById("detail-screen");
const victoryScreen = document.getElementById("victory-screen");
const defeatedScreen = document.getElementById("defeated-screen");

//プレイヤーの定義
const playerStatus = document.getElementById("player-status")
const playerMessage = document.getElementById("player-message");
const playerHp = document.getElementById("player-hp");
const playerMaxHp = document.getElementById("player-max-hp");
const playerHpBar = document.getElementById("player-hp-bar");

//敵の定義
const enemyStatus = document.getElementById("enemy-status");
const enemyMessage = document.getElementById("enemy-message");
const messageEnemyName = document.getElementById("message-enemy-name");
const enemyName = document.getElementById("enemy-name");
const enemyHp = document.getElementById("enemy-hp");
const enemyMaxHp = document.getElementById("enemy-max-hp");
const enemyImage = document.getElementById("enemy-image");
const enemyHpBar = document.getElementById("enemy-hp-bar");

//ポーションの定義
const potionCountDisplay = document.getElementById("potion-count");

//プレイヤー詳細の定義
const detailPlayerHp = document.getElementById("detail-player-hp");
const detailPlayerMaxHp = document.getElementById("detail-player-max-hp");
const detailPlayerAttack = document.getElementById("detail-player-attack");

//敵詳細の定義
const detailEnemyName = document.getElementById("detail-enemy-name");
const detailEnemyHp = document.getElementById("detail-enemy-hp");
const detailEnemyMaxHp = document.getElementById("detail-enemy-max-hp");
const detailEnemyAttack = document.getElementById("detail-enemy-attack");
const detailEnemySkill = document.getElementById("detail-enemy-skill");

//ボタンの定義
const attackButton = document.getElementById("attack-button");
const skillButton = document.getElementById("skill-button");
const potionButton = document.getElementById("potion-button");
const detailButton = document.getElementById("detail-button");
const closeButton = document.getElementById("close-button");
const victoryRestartButton = document.getElementById("victory-restart-screen");
const defeatedRestartButton = document.getElementById("defeated-restart-screen");

//プレイヤーの詳細
const player = {
    name: "冒険者",
    maxHp: 170,
    currentHp: 170,
    attack: 20,
    skill: "強撃（1.5倍の攻撃、敵を一ターンひるませる。1ステージに1回使用可能）"
}
playerMaxHp.textContent = player.maxHp;

//ポーションの処理
const potionHealAmount = 40;
let potionCount = 4;
function usePotion(){
    if(isGameOver || potionCount <= 0){
        return;
    }
   potionCount--;
    const beforeHp = player.currentHp;
    player.currentHp = Math.min(
        player.maxHp,
        player.currentHp + potionHealAmount
    );
    const actualHealAmount = player.currentHp - beforeHp;
    playerHp.textContent = player.currentHp;
    playerMessage.textContent = "ポーションを使用した！" + actualHealAmount + "回復！";
    updateHpBar();
    potionCountDisplay.textContent = potionCount;
    updatePotionButton();
}

potionButton.addEventListener("click", usePotion);

//ポーションボタンの状態を更新する関数
function updatePotionButton(){
    potionButton.disabled =
    isGameOver ||
    potionCount <= 0;
}

//敵の詳細
const enemies = [
    { name: "スライム",
        maxHp: 60,
        currentHp: 50,
        attack: 15,
        skill: "ダメージ軽減(３０％の確率で受けるダメージを半減する）",
        skillEffect: function(){
            if(Math.random() < 0.3){
                return true;
            }
            return false;
        },
        image: "images/slime.png"
    },
    { name: "ゴブリン",
        maxHp: 100,
        currentHp: 80,
        attack: 20,
        skill: "混沌の一撃（２０％の確率で相手をひるませる）",
        skillEffect: function(){
            if(Math.random() < 0.2){
                return true;
            }
            return false;
        },
        image: "images/goblin.png"
    },
    { name: "デーモン",
        maxHp: 200,
        currentHp: 120,
        attack: 30,
        turnCount: 0,
        skill: "闇の力（３ターン後から、攻撃力が２倍）",
        image: "images/demon.png"
    }
]

//現在のステージ
let currentStage = 0;

//現在の敵の情報
let currentEnemy = enemies[currentStage];
enemyName.textContent = currentEnemy.name;

// 詳細画面の情報を更新
function updateDetail(){

    // プレイヤー情報
    detailPlayerHp.textContent = player.currentHp;
    detailPlayerMaxHp.textContent = player.maxHp;
    detailPlayerAttack.textContent = player.attack;

    // 敵情報
    detailEnemyName.textContent = currentEnemy.name;
    detailEnemyHp.textContent = currentEnemy.currentHp;
    detailEnemyMaxHp.textContent = currentEnemy.maxHp;
    detailEnemyAttack.textContent = currentEnemy.attack;
    detailEnemySkill.textContent = currentEnemy.skill;
}

//HPバーの更新
function updateHpBar(){
    const playerHpPercent = player.currentHp / player.maxHp * 100;
    const enemyHpPercent = currentEnemy.currentHp / currentEnemy.maxHp *100;
    playerHpBar.style.width = (playerHpPercent + "%");
    enemyHpBar.style.width = (enemyHpPercent + "%");
    if(playerHpPercent <= 20){
        playerHpBar.style.backgroundColor = "red";
    } else if(playerHpPercent <= 50){
        playerHpBar.style.backgroundColor = "orange";
    } else {
        playerHpBar.style.backgroundColor = "#4caf50";
    }
    if (enemyHpPercent <= 20) {
        enemyHpBar.style.backgroundColor = "red";
    } else if (enemyHpPercent <= 50) {
        enemyHpBar.style.backgroundColor = "orange";
    } else {
        enemyHpBar.style.backgroundColor = "#4caf50";
    }
}

//敵の情報を更新する処理
function setEnemy(){
    currentEnemy = enemies[currentStage];
    currentEnemy.currentHp = currentEnemy.maxHp;
    if(currentEnemy.name === "デーモン"){
        currentEnemy.turnCount = 0;
    }
    enemyName.textContent = currentEnemy.name;
    messageEnemyName.textContent = currentEnemy.name;
    enemyHp.textContent = currentEnemy.currentHp;
    enemyMaxHp.textContent = currentEnemy.maxHp;
    enemyImage.src = currentEnemy.image;
    playerSkillUsed = false;
    isEnemyStunned = false;
    updateSkillButton();
    updateHpBar();
}

//敵に攻撃する処理
function attackEnemy(){
    let playerAttack = player.attack;
    if(Math.random() < 0.2){
        playerAttack = player.attack * 2;
        playerMessage.textContent = "会心の一撃！" + playerAttack + "ダメージ！";
    } else {
        playerMessage.textContent = "攻撃した！" + playerAttack + "ダメージ！";
    }
    if(currentEnemy.name === "スライム"){
        const result = currentEnemy.skillEffect();
        if(result){
            playerAttack = playerAttack / 2;
            playerMessage.textContent = (result ? "ダメージ軽減された！" : "") + playerAttack + "ダメージ！";
        }
    }
    currentEnemy.currentHp = Math.max(0, currentEnemy.currentHp - playerAttack);
    enemyHp.textContent = currentEnemy.currentHp;
    updateHpBar();
}

//プレイヤースキルの処理
skillButton.addEventListener("click", function(){
    if(isGameOver || playerSkillUsed)return;
    if(isPlayerStunned){
        isPlayerStunned = false;
        playerMessage = "ひるんで動けない";
        return;
    }
    playerSkillUsed = true;
    updateSkillButton();
    isEnemyStunned = true;
    let playerSkillAttack = player.attack * 1.5;
    playerMessage.textContent = "強撃！！" + playerSkillAttack + "ダメージ！相手をひるませた！";
    currentEnemy.currentHp = Math.max(0, currentEnemy.currentHp - playerSkillAttack);
    enemyHp.textContent = currentEnemy.currentHp;
    updateHpBar();
    if(currentEnemy.currentHp <= 0){
        handleEnemyDefeated();
        return;
    }
});

//スキルボタンの更新
function updateSkillButton(){
    skillButton.disabled = isGameOver || playerSkillUsed;
}

//プレイヤーに攻撃する処理
function attackPlayer(){
    let enemyAttackDamage = currentEnemy.attack;
    let result = false;
    if(currentEnemy.name === "デーモン"){
        currentEnemy.turnCount++;
        if(currentEnemy.turnCount > 3){
            enemyAttackDamage *= 2;
            enemyMessage.textContent ="デーモンの闇の力！攻撃力が上がった！";
        }
    }
    if(currentEnemy.name === "ゴブリン"){
        result = currentEnemy.skillEffect();
    }
    if(Math.random() < 0.2){
        enemyAttackDamage *= 2;
        enemyMessage.textContent = "会心の一撃、" + enemyAttackDamage + "ダメージ！";
    } else{
        enemyMessage.textContent = "敵の攻撃、" + enemyAttackDamage + "ダメージ！";
    }
    player.currentHp = Math.max(0, player.currentHp - enemyAttackDamage);
    playerHp.textContent = player.currentHp;
    if(result){
        isPlayerStunned = true;
        enemyMessage.textContent += "ゴブリンの混沌の一撃！冒険者はひるんだ！";
    }
    if(currentEnemy.name === "デーモン" && currentEnemy.turnCount === 4){
        enemyMessage.textContent = "デーモンは闇の力に目覚めた!攻撃力が2倍になった!" + enemyMessage.textContent;
    }
    updateHpBar();
    updatePotionButton();
}

//敵のターンの処理
function enemyTurn(){
    if(isEnemyStunned){
        isEnemyStunned = false;
        enemyMessage.textContent = currentEnemy.name + "はひるんで動けない";
        return;
    }
    attackPlayer();
    if(player.currentHp <= 0){
        handlePlayerDefeated();
    }
}

//敵を倒した時の処理
function handleEnemyDefeated(){
    if(currentStage < enemies.length - 1){
        alert(currentEnemy.name + "を倒した！次のステージへ！");
        nextStage();
        return;
    } else {
        isGameOver = true;
        alert("敵を倒した！全ステージクリア！！");
        battleScreen.hidden = true;
        victoryScreen.hidden = false;
    }
    updatePotionButton();
}

//プレイヤーが倒された時の処理
function handlePlayerDefeated(){
    isGameOver = true;
    alert("ゲームオーバー");
    battleScreen.hidden = true;
    defeatedScreen.hidden = false;
    updatePotionButton();
}

//次のステージに進む
function nextStage(){
    currentStage++;
    setEnemy();
}

//ゲームの開始
function startGame(){
    isGameOver = false;
    currentStage = 0;
    player.currentHp = player.maxHp;
    playerHp.textContent = player.currentHp;
    setEnemy();
    playerMessage.textContent = "";
    enemyMessage.textContent = "";
    titleScreen.hidden = true;
    battleScreen.hidden = false;
    potionCount = 4;
    potionCountDisplay.textContent = potionCount;
    updatePotionButton();
}

//ゲームの再スタート
function restartGame(){
    startGame();
    victoryScreen.hidden = true;
    defeatedScreen.hidden = true;
}
victoryRestartButton.addEventListener("click", restartGame);
defeatedRestartButton.addEventListener("click", restartGame);

//スタートの処理
startButton.addEventListener("click", function(){
    startGame();
});

//攻撃の処理
attackButton.addEventListener("click", function(){
    if(isGameOver){
        return;
    }
    if(isPlayerStunned){
        isPlayerStunned = false;
        playerMessage.textContent = "ひるんで動けない！";
        enemyTurn();
        return;
    }
    attackEnemy();
    if(currentEnemy.currentHp <= 0){
        enemyHp.textContent = currentEnemy.currentHp;
        handleEnemyDefeated();
        return;
    }
    enemyTurn();   
    }
);

//詳細ボタン
detailButton.addEventListener("click", function(){
    updateDetail();
    detailButton.hidden = true;
    detailScreen.hidden = false;
});

//閉じるボタン
closeButton.addEventListener("click", function(){
    detailButton.hidden = false;
    detailScreen.hidden = true;
});