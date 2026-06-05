import TitleProgressCard from './TitleProgressCard.jsx';
import TraitSummary from './TraitSummary.jsx';
import { getSubCharacter } from '../utils/character.js';
import { getSubCharacterImage } from '../utils/subCharacterImages.js';

export default function UserProfileCard({ profile, stats, userTraits, onAchievements }) {
  const subCharacter = getSubCharacter(userTraits);
  const subCharacterImage = getSubCharacterImage(subCharacter.name, profile?.gender);
  const hint = profile?.currentDescription;

  return (
    <aside className="dashboard-sidebar">
      <section className="card profile-side-card">
        <div className="profile-character-frame">
          <img className="sub-character-image" src={subCharacterImage} alt={`${subCharacter.name} 이미지`} />
        </div>
        <div className="profile-content">
          <span className="eyebrow">모험가 프로필</span>
          <h2>{profile?.name || '모험가'}님</h2>
          <div className="sub-character-badge">
            <span>{subCharacter.emoji}</span>
            {subCharacter.name}
          </div>
          <p className="profile-label">대표 성향</p>
          <TraitSummary traits={profile?.topTraits || []} />
        </div>
      </section>
      <TitleProgressCard profile={profile} stats={stats} hint={hint} onAchievements={onAchievements} />
    </aside>
  );
}
