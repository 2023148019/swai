import sproutAdventurerMaleImage from '../assets/sub-character-images/sprout-adventurer-male.png';
import sproutAdventurerFemaleImage from '../assets/sub-character-images/sprout-adventurer-female.png';
import flameRunnerMaleImage from '../assets/sub-character-images/flame-runner-male.png';
import flameRunnerFemaleImage from '../assets/sub-character-images/flame-runner-female.png';
import quietCreatorMaleImage from '../assets/sub-character-images/quiet-creator-male.png';
import quietCreatorFemaleImage from '../assets/sub-character-images/quiet-creator-female.png';
import partyMakerMaleImage from '../assets/sub-character-images/party-maker-male.png';
import partyMakerFemaleImage from '../assets/sub-character-images/party-maker-female.png';
import homeStrategistMaleImage from '../assets/sub-character-images/home-strategist-male.png';
import homeStrategistFemaleImage from '../assets/sub-character-images/home-strategist-female.png';
import valueGrowerMaleImage from '../assets/sub-character-images/value-grower-male.png';
import valueGrowerFemaleImage from '../assets/sub-character-images/value-grower-female.png';
import moodCollectorMaleImage from '../assets/sub-character-images/mood-collector-male.png';
import moodCollectorFemaleImage from '../assets/sub-character-images/mood-collector-female.png';
import routineBuilderMaleImage from '../assets/sub-character-images/routine-builder-male.png';
import routineBuilderFemaleImage from '../assets/sub-character-images/routine-builder-female.png';
import outdoorAdventurerMaleImage from '../assets/sub-character-images/outdoor-adventurer-male.png';
import outdoorAdventurerFemaleImage from '../assets/sub-character-images/outdoor-adventurer-female.png';
import stageExpressorMaleImage from '../assets/sub-character-images/stage-expressor-male.png';
import stageExpressorFemaleImage from '../assets/sub-character-images/stage-expressor-female.png';
import calmResearcherMaleImage from '../assets/sub-character-images/calm-researcher-male.png';
import calmResearcherFemaleImage from '../assets/sub-character-images/calm-researcher-female.png';

const subCharacterImageMap = {
  '새싹 모험가': { male: sproutAdventurerMaleImage, female: sproutAdventurerFemaleImage },
  '불꽃 러너': { male: flameRunnerMaleImage, female: flameRunnerFemaleImage },
  '조용한 창작자': { male: quietCreatorMaleImage, female: quietCreatorFemaleImage },
  '파티 메이커': { male: partyMakerMaleImage, female: partyMakerFemaleImage },
  '방구석 전략가': { male: homeStrategistMaleImage, female: homeStrategistFemaleImage },
  '실속 성장러': { male: valueGrowerMaleImage, female: valueGrowerFemaleImage },
  '감성 수집가': { male: moodCollectorMaleImage, female: moodCollectorFemaleImage },
  '루틴 빌더': { male: routineBuilderMaleImage, female: routineBuilderFemaleImage },
  '야외 모험가': { male: outdoorAdventurerMaleImage, female: outdoorAdventurerFemaleImage },
  '무대 위 표현가': { male: stageExpressorMaleImage, female: stageExpressorFemaleImage },
  '차분한 탐구자': { male: calmResearcherMaleImage, female: calmResearcherFemaleImage }
};

export function getSubCharacterImage(name, gender) {
  const imageSet = subCharacterImageMap[name] || subCharacterImageMap['새싹 모험가'];
  return gender === '여성' ? imageSet.female : imageSet.male;
}
