import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  surgeProtection?: boolean;
  steppedLeaderNext?: boolean;
  seenFirstSpear?: boolean;
  furysBoltActive?: boolean;
  seenFirstAdd?: boolean;
  furysFourteenCounter?: number;
}

const triggerSet: TriggerSet<Data> = {
  id: 'EdensVerseFulminationSavage',
  zoneId: ZoneId.EdensVerseFulminationSavage,
  timelineFile: 'e5s.txt',
  timelineTriggers: [
    {
      id: 'E5S Stepped Leader Next',
      regex: /^Stepped Leader$/,
      beforeSeconds: 15,
      run: (data) => data.steppedLeaderNext = true,
    },
  ],
  triggers: [
    {
      id: 'E5S Surge Protection Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '8B4' },
      condition: Conditions.targetIsYou(),
      run: (data) => data.surgeProtection = true,
    },
    {
      id: 'E5S Surge Protection Loss',
      type: 'LosesEffect',
      netRegex: { effectId: '8B4' },
      condition: Conditions.targetIsYou(),
      run: (data) => data.surgeProtection = false,
    },
    {
      id: 'E5S Stratospear Summons',
      type: 'Ability',
      netRegex: { id: '4BA5', source: 'Ramuh', capture: false },
      condition: (data) => !data.seenFirstSpear,
      delaySeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.seenFirstSpear = true,
      outputStrings: {
        text: {
          en: 'Look for small spear',
          de: 'Halt nach kleinem Speer ausschau',
          fr: 'Allez sur la petite lance',
          ja: '低い杖を探す',
          cn: '找短矛',
          ko: '작은 지팡이 확인',
        },
      },
    },
    {
      id: 'E5S Tribunal Summons',
      type: 'StartsUsing',
      netRegex: { id: '4BAC', source: 'Ramuh', capture: false },
      infoText: (data, _matches, output) => {
        if (data.seenFirstAdd)
          return output.lookForAdds!();

        if (data.furysBoltActive)
          return output.bigKnockback!();

        return output.shortKnockback!();
      },
      run: (data) => data.seenFirstAdd = true,
      outputStrings: {
        lookForAdds: {
          en: 'Look for adds',
          de: 'Halt nach dem Add ausschau',
          fr: 'Cherchez les adds',
          ja: '雑魚に注意',
          cn: '注意小怪冲锋',
          ko: '쫄 위치 확인',
        },
        bigKnockback: {
          en: 'Big Knockback',
          de: 'Weiter Rückstoß',
          fr: 'Forte poussée',
          ja: '遠いノックバック',
          cn: '长击退',
          ko: '긴 넉백',
        },
        shortKnockback: {
          en: 'Short Knockback',
          de: 'Kurzer Rückstoß',
          fr: 'Faible poussée',
          ja: '短いノックバック',
          cn: '短击退',
          ko: '짧은 넉백',
        },
      },
    },
    {
      id: 'E5S Fury\'s Bolt',
      type: 'StartsUsing',
      netRegex: { id: '4BAA', source: 'Ramuh', capture: false },
      alertText: (data, _matches, output) => {
        // Fury's Bolt + Stepped Leader doesn't require an orb
        if (!data.surgeProtection && !data.steppedLeaderNext)
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Grab an orb',
          de: 'Einen Orb nehmen',
          fr: 'Prenez un orbe',
          ja: '雷玉を取る',
          cn: '吃球',
          ko: '구슬 줍기',
        },
      },
    },
    {
      id: 'E5S Fury\'s Bolt Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '8B7', capture: false },
      run: (data) => data.furysBoltActive = true,
    },
    {
      id: 'E5S Fury\'s Bolt Lose',
      type: 'LosesEffect',
      netRegex: { effectId: '8B7', capture: false },
      run: (data) => data.furysBoltActive = false,
    },
    {
      id: 'E5S Fury\'s Fourteen',
      type: 'StartsUsing',
      netRegex: { id: '4BAB', source: 'Ramuh', capture: false },
      condition: (data) => !data.furysFourteenCounter || data.furysFourteenCounter < 2,
      alertText: (data, _matches, output) => {
        if (!data.surgeProtection)
          return output.text!();
      },
      run: (data) => data.furysFourteenCounter = (data.furysFourteenCounter ?? 0) + 1,
      outputStrings: {
        text: {
          en: 'Grab an orb',
          de: 'Einen Orb nehmen',
          fr: 'Prenez un orbe',
          ja: '雷玉を取る',
          cn: '吃球',
          ko: '구슬 줍기',
        },
      },
    },
    {
      id: 'E5S Judgment Volts',
      type: 'StartsUsing',
      netRegex: { id: '4BB5', source: 'Ramuh', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'E5S Stepped Leader',
      type: 'StartsUsing',
      netRegex: { id: '4BC6', source: 'Ramuh', capture: false },
      alertText: (data, _matches, output) => {
        // Fury's Bolt + Stepped Leader is a donut AoE instead
        if (!data.furysBoltActive)
          return output.readySpread!();

        return output.donutAoe!();
      },
      outputStrings: {
        readySpread: {
          en: 'Ready Spread',
          de: 'Bereitmachen zum Verteilen',
          fr: 'Dispersion bientôt',
          ja: '散開準備',
          cn: '准备分散',
          ko: '산개 준비',
        },
        donutAoe: {
          en: 'donut AoE',
          de: 'Donut AoE',
          fr: 'AoE en donut',
          ja: 'ドーナツ範囲',
          cn: '环形AOE',
          ko: '도넛 장판',
        },
      },
    },
    {
      id: 'E5S Stepped Leader Spread',
      type: 'StartsUsing',
      netRegex: { id: '4BC6', source: 'Ramuh', capture: false },
      condition: (data) => !data.furysBoltActive,
      delaySeconds: 3,
      response: Responses.moveAway('alarm'),
    },
    {
      id: 'E5S Stepped Leader Cast',
      type: 'Ability',
      netRegex: { id: '4BC6', source: 'Ramuh', capture: false },
      run: (data) => data.steppedLeaderNext = false,
    },
    {
      id: 'E5S Crippling Blow',
      type: 'StartsUsing',
      netRegex: { id: '4BCA', source: 'Ramuh' },
      response: Responses.tankBuster(),
    },
    {
      id: 'E5S Stormcloud Summons',
      type: 'StartsUsing',
      netRegex: { id: '4BB8', source: 'Ramuh', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Position for Stormcloud',
          de: 'Position für die Wolke',
          fr: 'Positions pour les nuages',
          ja: '雷雲散開',
          cn: '雷云站位',
          ko: '번개 구름 위치 잡기',
        },
      },
    },
    {
      // Hated of Levin debuff
      id: 'E5S Stormcloud Cleanse',
      type: 'HeadMarker',
      netRegex: { id: '00D2' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cleanse In Cloud',
          de: 'In der Wolke reinigen',
          fr: 'Purifiez-vous dans le nuage',
          ja: '雷雲の範囲攻撃でデバフ解除',
          cn: '雷云清Debuff',
          ko: '디버프 제거하기',
        },
      },
    },
    {
      id: 'E5S Stormcloud Drop',
      type: 'HeadMarker',
      netRegex: { id: '006E' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Cloud Away',
          de: 'Wolke drausen ablegen',
          fr: 'Déposez le nuage à l\'extérieur',
          ja: '外に雷雲を捨てる',
          cn: '远离放雷云',
          ko: '번개 구름 소환자',
        },
      },
    },
    {
      id: 'E5S Centaur\'s Charge',
      type: 'StartsUsing',
      netRegex: { id: '4BAD', source: 'Ramuh', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Be in your position',
          de: 'Befinde dich auf deiner Position!',
          fr: 'Placez-vous à votre position',
          ja: '突進、自分の位置へ',
          cn: '冲锋站位',
          ko: '자기 위치에 있기',
        },
      },
    },
    {
      id: 'E5S Chain Lightning',
      type: 'StartsUsing',
      netRegex: { id: '4BC4', source: 'Ramuh', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ready for Chain',
          de: 'Bereit für Kettenblitz',
          fr: 'Préparez-vous pour la chaine',
          ja: 'チェインライトニング準備',
          cn: '雷光链',
          ko: '체인 라이트닝 준비',
        },
      },
    },
    {
      id: 'E5S Levinforce',
      type: 'StartsUsing',
      netRegex: { id: '4BCC', source: 'Ramuh', capture: false },
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Stormcloud': 'Cumulonimbus-Wolke',
        'Ramuh': 'Ramuh',
        'Raiden': 'Raiden',
        'Will Of Ixion': 'Ixion-Spiegelung',
      },
      'replaceText': {
        'Volt Strike': 'Voltschlag',
        'Tribunal Summons': 'Gedankenentstehung',
        'Thunderstorm': 'Gewitter',
        'Stratospear Summons': 'Stromgenerierung',
        'Stormcloud Summons': 'Elektrizitätsgenerierung',
        'Stepped Leader': 'Leuchtspur',
        'Shock Blast': 'Schockstoß',
        'Lightning Bolt': 'Blitzschlag',
        'Levinforce': 'Blitzkraft',
        'Judgment Volts': 'Gewitter des Urteils',
        'Judgment Jolt': 'Blitz des Urteils',
        'Impact': 'Impakt',
        'Gallop': 'Galopp',
        'Fury\'s Fourteen': 'Wütende Vierzehn',
        'Fury\'s Bolt': 'Wütender Blitz',
        'Executor Summons': 'Wächtergenerierung',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Chaos Strike': 'Chaosschlag',
        'Chain Lightning': 'Kettenblitz',
        'Centaur\'s Charge': 'Zentaurenansturm',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'stormcloud': 'Cumulonimbus',
        'Ramuh': 'Ramuh',
        'Raiden': 'Raiden',
        'Will Of Ixion': 'Réplique d\'Ixion',
      },
      'replaceText': {
        '\\?': ' ?',
        'Volt Strike': 'Frappe d\'éclair',
        'Tribunal Summons': 'Manifestations de l\'esprit',
        'Thunderstorm': 'Tempête de foudre',
        'Stratospear Summons': 'Conjuration de dards',
        'Stormcloud Summons': 'Nuage d\'orage',
        'Stepped Leader': 'Traceur',
        'Shock Blast': 'Impact foudroyant',
        'Lightning Bolt': 'Éclair de foudre',
        'Levinforce': 'Déflagration fulgurante',
        'Judgment Volts': 'Éclair de chaleur du jugement',
        'Judgment Jolt': 'Front orageux du jugement',
        'Impact': 'Impact',
        'Gallop': 'Galop',
        'Fury\'s Fourteen': 'Boules de foudre - Quattordecim',
        'Fury\'s Bolt': 'Boules de foudre',
        'Executor Summons': 'Disjonction corporelle',
        'Crippling Blow': 'Coup handicapant',
        'Chaos Strike': 'Frappe chaotique',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Centaur\'s Charge': 'Charge centaure',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'stormcloud': '積乱雲',
        'Ramuh': 'ラムウ',
        'Raiden': 'ライディーン',
        'Will Of Ixion': 'イクシオン・ミラージュ',
      },
      'replaceText': {
        'Volt Strike': 'ボルトストライク',
        'Tribunal Summons': '思念体生成',
        'Thunderstorm': 'サンダーストーム',
        'Stratospear Summons': '武具生成',
        'Stormcloud Summons': '雷雲生成',
        'Stepped Leader': 'ステップトリーダー',
        'Shock Blast': 'ショックブラスト',
        'Lightning Bolt': '落雷',
        'Levinforce': 'ライトニングフォース',
        'Judgment Volts': '裁きの熱雷',
        'Judgment Jolt': '裁きの界雷',
        'Impact': '衝撃',
        'Gallop': 'ギャロップ',
        'Fury\'s Fourteen': 'フォーティーン・チャージボルト',
        'Fury\'s Bolt': 'チャージボルト',
        'Executor Summons': '分離体生成',
        'Crippling Blow': '痛打',
        'Chaos Strike': 'カオスストライク',
        'Chain Lightning': 'チェインライトニング',
        'Centaur\'s Charge': 'セントールチャージ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'stormcloud': '雷暴云',
        '(?<! )Ramuh': '拉姆',
        'Will Of Ramuh': '拉姆幻影',
        'Raiden': '雷电',
        'Will Of Ixion': '伊克西翁幻影',
      },
      'replaceText': {
        'Volt Strike': '雷电强袭',
        'Tribunal Summons': '生成幻影',
        'Thunderstorm': '雷暴',
        'Stratospear Summons': '生成武具',
        'Stormcloud Summons': '生成雷暴云',
        'Stepped Leader': '梯级先导',
        'Shock Strike': '轰雷',
        'Shock Blast': '震荡爆雷',
        'Shock(?! )': '放电',
        'Lightning Bolt': '落雷',
        'Levinforce': '雷霆之力',
        'Judgment Volts': '制裁之热雷',
        'Judgment Jolt': '制裁之界雷',
        'Impact': '冲击',
        'Gallop': '飞驰',
        'Fury\'s Fourteen': '十四重蓄雷',
        'Fury\'s Bolt': '蓄雷',
        'Executor Summons': '生成仆从',
        'Deadly Discharge': '死亡冲锋',
        'Crippling Blow': '痛击',
        'Chaos Strike': '混乱冲击',
        'Chain Lightning': '雷光链',
        'Centaur\'s Charge': '人马冲锋',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'stormcloud': '적란운',
        '(?<! )Ramuh': '라무',
        'Will Of Ramuh': '라무의 환영',
        'Raiden': '뇌전',
        'Will Of Ixion': '익시온의 환영',
      },
      'replaceText': {
        'Volt Strike': '전기 충격',
        'Tribunal Summons': '사념체 생성',
        'Thunderstorm': '번개 폭풍',
        'Stratospear Summons': '무기 생성',
        'Stormcloud Summons': '번개구름 생성',
        'Stepped Leader': '계단형 선도',
        'Shock Strike': '번개 충격',
        'Shock Blast': '번개 충격파',
        'Shock(?! )': '방전',
        'Lightning Bolt': '낙뢰',
        'Levinforce': '천둥의 기세',
        'Judgment Volts': '심판의 열뢰',
        'Judgment Jolt': '심판의 계뢰',
        'Impact': '충격',
        'Gallop': '습보',
        'Fury\'s Fourteen': '14연속 번개 충전',
        'Fury\'s Bolt': '번개 충전',
        'Executor Summons': '분리체 생성',
        'Deadly Discharge': '죽음의 방전',
        'Crippling Blow': '통타',
        'Chaos Strike': '혼돈의 일격',
        'Chain Lightning': '번개 사슬',
        'Centaur\'s Charge': '켄타우로스 돌진',
      },
    },
  ],
};

export default triggerSet;
