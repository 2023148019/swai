import TitleProgressCard from './TitleProgressCard.jsx';
import TraitSummary from './TraitSummary.jsx';
import { getSubCharacter } from '../utils/character.js';

export default function UserProfileCard({ profile, stats, userTraits, onAchievements }) {
  const subCharacter = getSubCharacter(userTraits);
  const hint = profile?.currentDescription;

  return (
    <aside className="dashboard-sidebar">
      <section className="card profile-side-card">
        <span className="eyebrow">모험가 프로필</span>
        <h2>{profile?.name || '모험가'}님</h2>
        <div className="sub-character-badge">
          <span>{subCharacter.emoji}</span>
          {subCharacter.name}
        </div>
        <p className="profile-label">대표 성향</p>
        <TraitSummary traits={profile?.topTraits || []} />
      </section>
      <TitleProgressCard profile={profile} stats={stats} hint={hint} onAchievements={onAchievements} />
    </aside>
  );
}
