import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  finalPhase?: boolean;
}

// Shinryu Normal
const triggerSet: TriggerSet<Data> = {
  id: 'TheRoyalMenagerie',
  zoneId: ZoneId.TheRoyalMenagerie,
  timelineFile: 'shinryu.txt',
  triggers: [
    {
      id: 'Shinryu Normal Akh Morn',
      type: 'StartsUsing',
      netRegex: { id: '1FA4', source: 'Shinryu' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.akhMornOnYou!();
        else if (data.role === 'tank')
          return output.akhMornOn!({ player: data.party.member(matches.target) });
      },
      infoText: (data, matches, output) => {
        // Nobody with Akh Morn is a direct target for Akh Rai,
        // and tanks should never be targeted for it.
        // Additionally, Akh Rai happens only after the intermission.
        if (matches.target === data.me || data.role === 'tank' || !data.finalPhase)
          return;
        return output.akhRhaiSpreadAndMove!();
      },
      outputStrings: {
        akhRhaiSpreadAndMove: {
          en: 'Akh Rhai: spread and move',
          de: 'Akh Rhai: Verteilen und bewegen',
          fr: 'Akh Rhai : Dispersion et bougez',
          ja: 'アク・ラーイ: 散開 動け',
          cn: '天光轮回：散开保持移动',
          ko: '아크 라이: 산개, 이동',
        },
        akhMornOnYou: {
          en: 'Akh Morn on YOU',
          de: 'Akh Morn auf DIR',
          fr: 'Akh Morn sur VOUS',
          ja: '自分にアク・モーン',
          cn: '死亡轮回点名',
          ko: '아크몬 대상자',
        },
        akhMornOn: {
          en: 'Akh Morn on ${player}',
          de: 'Akh Morn auf ${player}',
          fr: 'Akh Morn sur ${player}',
          ja: '${player}にアク・モーン',
          cn: '死亡轮回点${player}',
          ko: '"${player}" 아크몬',
        },
      },
    },
    {
      id: 'Shinryu Normal Diamond Dust',
      type: 'StartsUsing',
      netRegex: { id: '1FAD', source: 'Shinryu' },
      // Here and elsewhere, timings aren't always completely usable. Instead we give the user
      // a quasi-standard amount of time when notifying.
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      response: Responses.stopMoving(),
    },
    {
      id: 'Shinryu Normal Dragonfist',
      type: 'StartsUsing',
      netRegex: { id: '24EF', source: 'Shinryu', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out of middle',
          de: 'Raus aus der Mitte',
          fr: 'Sortez du milieu',
          ja: '中央から離れる',
          cn: '离开中间',
          ko: '중앙 피하기',
        },
      },
    },
    {
      id: 'Shinryu Normal Hellfire',
      type: 'StartsUsing',
      netRegex: { id: '1FAB', source: 'Shinryu', capture: false },
      durationSeconds: 7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get in water',
          de: 'In\'s Wasser',
          fr: 'Allez dans l\'eau',
          ja: '水に入る',
          cn: '进水圈',
          ko: '물 장판에 들어가기',
        },
      },
    },
    {
      id: 'Shinryu Normal Hypernova',
      type: 'StartsUsing',
      netRegex: { id: ['1F99', '1F9A'], source: 'Right Wing', capture: false },
      durationSeconds: 7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack in water',
          de: 'In Wasser stacken',
          fr: 'Packez-vous dans l\'eau',
          ja: '水に集合',
          cn: '水圈内分摊',
          ko: '물 장판에 모이기',
        },
      },
    },
    {
      id: 'Shinryu Normal Judgement Bolt',
      type: 'StartsUsing',
      netRegex: { id: '1FAC', source: 'Shinryu', capture: false },
      durationSeconds: 7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'out of water',
          de: 'Raus aus dem Wasser',
          fr: 'Sortez de l\'eau',
          ja: '水から離れる',
          cn: '离开水圈',
          ko: '물 장판 밖으로',
        },
      },
    },
    {
      id: 'Shinryu Normal Levinbolt',
      type: 'StartsUsing',
      netRegex: { id: '1F9B', source: 'Right Wing', capture: false },
      durationSeconds: 7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread out, no water',
          de: 'Verteilen und nicht in\'s Wasser',
          fr: 'Dispersez-vous en dehors de l\'eau',
          ja: '散開、水に入らない',
          cn: '散开，离开水圈',
          ko: '산개, 물장판 X',
        },
      },
    },
    {
      id: 'Shinryu Normal Tidal Wave',
      type: 'StartsUsing',
      netRegex: { id: '1FAA', source: 'Shinryu' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      durationSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback, look for water',
          de: 'Rückstoß, nach Wasser schauen',
          fr: 'Poussée, cherchez l\'eau',
          ja: 'ノックバック、水を探せ',
          cn: '击退，确认水圈位置',
          ko: '넉백, 물기둥 확인',
        },
      },
    },
    {
      id: 'Shinryu Normal Ice Storm',
      type: 'StartsUsing',
      netRegex: { id: '1FA2', source: 'Left Wing' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      response: Responses.aoe(),
    },
    {
      id: 'Shinryu Normal Tail Slap',
      type: 'StartsUsing',
      netRegex: { id: '1F93', source: 'Tail', capture: false },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tail: Switch targets',
          de: 'Schweif: Zielwechsel',
          fr: 'Queue : Changez de cible',
          ja: '尾: タゲチェンジ',
          cn: '打尾巴',
          ko: '꼬리 공격',
        },
      },
    },
    {
      // Re-using the Gyre Charge triggers since they're convenient and already translated.
      id: 'Shinryu Normal Akh Rai Activation',
      type: 'StartsUsing',
      netRegex: { id: '1FF4', source: 'Shinryu', capture: false },
      condition: (data) => !data.finalPhase,
      run: (data) => data.finalPhase = true,
    },
    {
      id: 'Shinryu Normal Divebomb',
      type: 'StartsUsing',
      netRegex: { id: '1FF4', source: 'Shinryu', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'avoid divebomb',
          de: 'Divebomb ausweichen',
          fr: 'Évitez la bombe plongeante',
          ja: 'ダイブボムを避ける',
          cn: '躲避俯冲',
          ko: '회전 돌진 피하기',
        },
      },
    },
    {
      id: 'Shinryu Normal Tethers',
      type: 'HeadMarker',
      netRegex: { id: '0061' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 3.8,
      response: Responses.breakChains(),
    },
    {
      // There doesn't really seem to be any verified information about this marker.
      // It usually appears around Burning Chains, but it's wildly inconsistent.
      // However, it *seems* that the tail attacks from the side the target is on.
      id: 'Shinryu Normal Slap Marker',
      type: 'HeadMarker',
      netRegex: { id: '0062' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait onto unbroken squares',
          de: 'Auf nicht kaputter Fläche ködern',
          fr: 'Attirez sur les carrés non brisés',
          ja: '壊れなかった床に誘導',
          cn: '在未损坏方格上诱导',
          ko: '꼬리 내리치기 유도',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Cocoon': 'Lichtsphäre',
        'Left Wing': 'link(?:e|er|es|en) Schwinge',
        'Right Wing': 'recht(?:e|er|es|en) Schwinge',
        'Shinryu': 'Shinryu',
        'Tail': 'Schwanz',
        'Icicle': 'Eiszapfen',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Elemental Attack': 'Elemental Attack',
        'Dark Matter': 'Dunkelmaterie',
        'Dragonfist': 'Drachenfaust',
        'Earth Breath': 'Erdatem',
        'Gyre Charge': 'Wirbel-Aufladung',
        'Hellfire': 'Höllenfeuer',
        'Hypernova': 'Supernova',
        'Ice Storm': 'Eissturm',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Judgment Bolt': 'Ionenschlag',
        'Levinbolt': 'Keraunisches Feld',
        'Meteor Impact': 'Meteoreinschlag',
        'Protostar': 'Protostern',
        'Spikesicle': 'Eislanze',
        'Summon Icicle': 'Flugeis',
        'TAP BUTTON OR ELSE': 'DRÜCKE TASTEN ETC',
        'Tail Slap': 'Schweifklapser',
        'Tidal Wave': 'Flutwelle',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Cocoon': 'cocon de lumière',
        'Icicle': 'stalactite',
        'Left Wing': 'aile gauche',
        'Right Wing': 'aile droite',
        'Shinryu': 'Shinryu',
        'Tail': 'queue',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Elemental Attack': 'Attaque élémentaire',
        'Dark Matter': 'Matière sombre',
        'Dragonfist': 'Poing dragon',
        'Earth Breath': 'Souffle de terre',
        'Gyre Charge': 'Gyrocharge',
        'Hellfire': 'Flammes de l\'enfer',
        'Hypernova': 'Hypernova',
        'Ice Storm': 'Tempête de glace',
        'Icicle Impact': 'Impact de stalactite',
        'Judgment Bolt': 'Éclair du jugement',
        'Levinbolt': 'Fulguration',
        'Meteor Impact': 'Impact de météore',
        'Protostar': 'Proto-étoile',
        'Spikesicle': 'Stalactopointe',
        'Summon Icicle': 'Appel de stalactite',
        'Tail Slap': 'Gifle caudale',
        'TAP BUTTON OR ELSE': 'CLIQUEZ SUR LE BOUTON OU AUTRE',
        'Tidal Wave': 'Raz-de-marée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Cocoon': '光の繭',
        'Left Wing': 'レフトウィング',
        'Right Wing': 'ライトウィング',
        'Shinryu': '神龍',
        'Tail': '神龍の尾',
        'Icicle': 'アイシクル',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Elemental Attack': 'エレメンタル攻撃',
        'Dark Matter': 'ダークマター',
        'Dragonfist': '龍掌',
        'Earth Breath': 'アースブレス',
        'Gyre Charge': 'ジャイヤチャージ',
        'Hellfire': '地獄の火炎',
        'Hypernova': 'スーパーノヴァ',
        'Ice Storm': '吹雪',
        'Icicle Impact': 'アイシクルインパクト',
        'Judgment Bolt': '裁きの雷',
        'Levinbolt': '稲妻',
        'Meteor Impact': 'メテオインパクト',
        'Protostar': 'プロトスター',
        'Spikesicle': 'アイシクルスパイク',
        'Summon Icicle': 'サモン・アイシクル',
        'TAP BUTTON OR ELSE': 'ボタンを押せ！',
        'Tail Slap': 'テールスラップ',
        'Tidal Wave': 'タイダルウェイブ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Cocoon': '光茧',
        'Left Wing': '左翼',
        'Right Wing': '右翼',
        'Shinryu': '神龙',
        'Tail': '龙尾',
        'Icicle': '冰柱',
      },
      'replaceText': {
        'Akh Morn': '死亡轮回',
        'Elemental Attack': '元素攻击',
        'Dark Matter': '暗物质',
        'Dragonfist': '龙掌',
        'Earth Breath': '大地吐息',
        'Gyre Charge': '螺旋冲锋',
        'Hellfire': '地狱之火炎',
        'Hypernova': '超新星',
        'Ice Storm': '吹雪',
        'Icicle Impact': '冰柱冲击',
        'Judgment Bolt': '制裁之雷',
        'Levinbolt': '闪电',
        'Meteor Impact': '陨石冲击',
        'Protostar': '原恒星',
        'Spikesicle': '冰柱突刺',
        'Summon Icicle': '召唤冰柱',
        'TAP BUTTON OR ELSE': 'XJB按',
        'Tail Slap': '尾部猛击',
        'Tidal Wave': '巨浪',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Cocoon': '빛의 고치',
        'Left Wing': '왼쪽 날개',
        'Right Wing': '오른쪽 날개',
        'Shinryu': '신룡',
        'Tail(?! )': '신룡의 꼬리',
      },
      'replaceText': {
        'Akh Morn': '아크 몬',
        'Dark Matter': '암흑물질',
        'Dragonfist': '용의 손바닥',
        'Elemental Attack': '원소 공격',
        'Earth Breath': '대지의 숨결',
        'Gyre Charge': '회전 돌진',
        'Hellfire': '지옥의 화염',
        'Hypernova': '초신성',
        'Ice Storm': '눈보라',
        'Icicle Impact': '고드름 낙하',
        'Judgment Bolt': '심판의 벼락',
        'Levinbolt': '우레',
        'Meteor Impact': '운석 낙하',
        'Protostar': '원시별',
        'Spikesicle': '고드름 돌진',
        'Summon Icicle': '고드름 소환',
        'TAP BUTTON OR ELSE': '긴 급 조 작',
        'Tail Slap': '꼬리치기',
        'Tidal Wave': '해일',
      },
    },
  ],
};

export default triggerSet;
