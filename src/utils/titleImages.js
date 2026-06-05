import homeProtectorImage from '../assets/title-images/home-protector.png';
import rookieAdventurerImage from '../assets/title-images/rookie-adventurer.png';
import passionateAdventurerImage from '../assets/title-images/passionate-adventurer.png';
import veteranAdventurerImage from '../assets/title-images/veteran-adventurer.jpg';
import hobbyMasterImage from '../assets/title-images/hobby-master.png';

const titleImageMap = {
  '홈프로텍터': homeProtectorImage,
  '초보 모험가': rookieAdventurerImage,
  '열정 모험가': passionateAdventurerImage,
  '취향 지도 제작자': veteranAdventurerImage,
  '라이프 모험가': hobbyMasterImage,
  '시작 전 모험가': homeProtectorImage,
  '첫걸음 모험가': rookieAdventurerImage,
  '가능성 수집가': passionateAdventurerImage
};

export function getTitleImage(title) {
  return titleImageMap[title] || homeProtectorImage;
}
