import homeProtectorImage from '../assets/title-images/home-protector.png';
import rookieAdventurerImage from '../assets/title-images/rookie-adventurer.png';
import passionateAdventurerImage from '../assets/title-images/passionate-adventurer.png';
import veteranAdventurerImage from '../assets/title-images/veteran-adventurer.jpg';
import hobbyMasterImage from '../assets/title-images/hobby-master.png';

const titleImageMap = {
  '홈프로텍터': homeProtectorImage,
  '초보 모험가': rookieAdventurerImage,
  '열정 모험가': passionateAdventurerImage,
  '고인물 모험가': veteranAdventurerImage,
  '취미 마스터': hobbyMasterImage
};

export function getTitleImage(title) {
  return titleImageMap[title] || homeProtectorImage;
}
