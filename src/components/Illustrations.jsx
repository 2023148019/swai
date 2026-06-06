import sproutAdventurerMaleImage from '../assets/sub-character-images/sprout-adventurer-male.png';
import sproutAdventurerFemaleImage from '../assets/sub-character-images/sprout-adventurer-female.png';
import compassImage from '../../나침반.png';
import hobbyMapImage from '../../지도.png';
import treasureChestImage from '../../보물상자.png';

export function AdventurerIllustration() {
  return (
    <div className="illustration adventurer" aria-hidden="true">
      <div className="sun" />
      <div className="map-card mini-map">✦</div>
      <div className="character">
        <div className="hat" />
        <div className="face">•ᴗ•</div>
        <div className="body" />
      </div>
      <div className="ground" />
    </div>
  );
}

export function SproutAdventurerSelection({ gender }) {
  return (
    <div className="illustration sprout-adventurer-selection" aria-hidden="true">
      <div className={`sprout-adventurer-frame${gender === '남성' ? ' selected' : ''}`}>
        <img className="sprout-adventurer-option" src={sproutAdventurerMaleImage} alt="" />
      </div>
      <div className={`sprout-adventurer-frame${gender === '여성' ? ' selected' : ''}`}>
        <img className="sprout-adventurer-option" src={sproutAdventurerFemaleImage} alt="" />
      </div>
    </div>
  );
}

export function CompassIllustration() {
  return (
    <div className="illustration compass" aria-hidden="true">
      <img className="compass-image" src={compassImage} alt="" />
    </div>
  );
}

export function TreasureChestIllustration() {
  return (
    <div className="treasure" aria-hidden="true">
      <img className="treasure-image" src={treasureChestImage} alt="" />
    </div>
  );
}

export function AchievementBadgeIllustration() {
  return <div className="badge-illustration" aria-hidden="true">🏅</div>;
}

export function QuestCompleteIllustration() {
  return (
    <div className="illustration complete" aria-hidden="true">
      <TreasureChestIllustration />
      <div className="complete-spark one">✦</div>
      <div className="complete-spark two">✧</div>
      <div className="complete-spark three">✹</div>
    </div>
  );
}

export function LockedAchievementIllustration() {
  return <div className="badge-illustration locked-icon" aria-hidden="true">🔒</div>;
}

export function HobbyMapIllustration() {
  return (
    <div className="hobby-map" aria-hidden="true">
      <img className="hobby-map-image" src={hobbyMapImage} alt="" />
    </div>
  );
}
