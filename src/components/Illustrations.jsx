import sproutAdventurerMaleImage from '../assets/sub-character-images/sprout-adventurer-male.png';
import sproutAdventurerFemaleImage from '../assets/sub-character-images/sprout-adventurer-female.png';

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
      <div className="compass-ring">
        <div className="needle" />
        <span>N</span>
      </div>
      <div className="spark spark-1">✦</div>
      <div className="spark spark-2">✧</div>
    </div>
  );
}

export function TreasureChestIllustration() {
  return (
    <div className="treasure" aria-hidden="true">
      <div className="treasure-lid" />
      <div className="treasure-body">✦</div>
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
      <div className="route-dot start">🏠</div>
      <div className="route-line" />
      <div className="route-dot middle">🧭</div>
      <div className="route-line second" />
      <div className="route-dot end">🏆</div>
    </div>
  );
}
