import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapSection.css';
import './PremiumMinimalMap.css';
import { MapPin, Calendar, Users, Mountain, Waves, Sparkles, Trees, ChevronLeft, ChevronRight, Tent, Landmark, Link as LinkIcon } from 'lucide-react';

interface Festival {
  readonly month: string;
  readonly name: string;
  readonly description: string;
  readonly details: ReadonlyArray<{
    readonly icon: React.ElementType;
    readonly text: string;
  }>;
  readonly location: {
    readonly x: string;
    readonly y: string;
  };
}

interface Region {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly position: {
    readonly x: string;
    readonly y: string;
  };
  readonly labelPosition?: {
    readonly x: string;
    readonly y: string;
  };
}

interface Experience {
  readonly icon: React.ElementType;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly position: {
    readonly x: string;
    readonly y: string;
  };
}

interface MapSectionProps {
  readonly className?: string;
}

/* =========================
   🔗 공식 링크 매핑 (제목 → URL)
   빈 문자열("")이면 아이콘/링크가 표시되지 않습니다.
   ========================= */
const OFFICIAL_LINKS: Record<string, string> = {
  // ✅ 체험
  '서산 경주김씨 고택': 'https://blog.naver.com/gyeam',
  '서산 유기방가옥': 'http://xn--o39am5bv7vomeopa05vdxb.gajagaja.co.kr/',
  '중리어촌체험마을': 'http://중리어촌체험마을.kr',
  '웅도어촌체험휴양마을': 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=6189&bbsNo=1744&nttNo=243759&searchCtgry=&searchCnd=all&searchKrwd=&pageIndex=1&integrDeptCode=',
  '방길동마을': 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=970&bbsNo=475&nttNo=129332&searchCtgry=&searchCnd=all&searchKrwd=&pageIndex=1&integrDeptCode=',
  '별마을': 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=970&bbsNo=475&nttNo=129333&searchCtgry=&searchCnd=all&searchKrwd=&pageIndex=1&integrDeptCode=',
  '한다리전통체험마을': 'https://handari.weebly.com/',
  '초록꿈틀마을': 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=970&bbsNo=475&nttNo=242553&searchCtgry=&searchCnd=all&searchKrwd=&pageIndex=1&integrDeptCode=',
  '난사랑방': 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=969&bbsNo=476&nttNo=110638&searchCtgry=&searchCnd=all&searchKrwd=&pageIndex=2&integrDeptCode=',
  '과학딸기농장': 'http://www.winesb.co.kr',
  '꼼방울': 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=969&bbsNo=476&nttNo=191278&searchCtgry=&searchCnd=all&searchKrwd=&pageIndex=2&integrDeptCode=',
  '나눔농장': 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=969&bbsNo=476&nttNo=191280&searchCtgry=&searchCnd=all&searchKrwd=&pageIndex=2&integrDeptCode=',
  '나무테크 나무야': 'https://blog.naver.com/leejeel',
  '부석사 템플스테이': 'https://www.seosan.go.kr/tour/contents.do?key=6148',
  '서광사 템플스테이': 'http://www.seogwangsa.or.kr/',
  // 축제 
  '해미 벚꽃 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6086',
  '류방택별 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6093',
  '서산 해미읍성축제': 'https://www.seosan.go.kr/tour/contents.do?key=6105',
  '지곡 왕산포 서산갯마을 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6089',
  '팔봉산 감자 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6096',
  '서산 6쪽마늘 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6099',
  '삼길포 우럭 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6102',
  '어리굴젓 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6141',
  '서산 국화 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6138',
  '서산 뻘낙지먹물 축제': 'https://www.seosan.go.kr/tour/contents.do?key=6144'
};

const getOfficialLink = (name: string) => OFFICIAL_LINKS[name] || '';

/* 카드/마커용 링크 버튼 */
const ExternalLinkBtn: React.FC<{ href: string; label: string; size?: number }> = ({ href, label, size = 18 }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 9999,
        background: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
        transition: 'transform .15s ease, box-shadow .15s ease'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px) scale(1.03)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 18px rgba(0,0,0,.16)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = '';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(0,0,0,.12)';
      }}
    >
      <LinkIcon size={size} />
    </a>
  );
};

const FESTIVALS: ReadonlyArray<Festival> = [
  {
    month: '4월',
    name: '해미 벚꽃 축제',
    description: '해미천을 따라 흐드러진 벚꽃과 다리가 어우러진 풍경으로 오작교를 떠올리게 하는 낭만을 자아냅니다.',
    details: [
      { icon: Calendar, text: '매년 4월경' },
      { icon: MapPin, text: '서산시 해미면 해미천 일원' },
      { icon: Users, text: '찾아가는 거리음악회, 농특산물 판매, 야간공연 등' }
    ],
    location: { x: '65%', y: '55%' }
  },
  {
    month: '5월',
    name: '류방택별 축제',
    description: '해미천을 따라 흐드러진 벚꽃과 다리가 어우러진 풍경으로 오작교를 떠올리게 하는 낭만을 자아냅니다.',
    details: [
      { icon: Calendar, text: '매년 5월경' },
      { icon: MapPin, text: '서산류방택천문기삭과학관 일원' },
      { icon: Users, text: '고유제(영정각 내), 창작 공연, 음악회, 에어로켓 발사, OX 퀴즈, 천문우주과학충남학생 실기대회, 만들기 체험 등' }
    ],
    location: { x: '65%', y: '55%' }
  },
  {
    month: '6월',
    name: '서산 해미읍성 축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '매년 6월경' },
      { icon: MapPin, text: '서산시 해미읍성 일원' },
      { icon: Users, text: '전통 무예 시연, 역사 체험, 먹거리 장터' }
    ],
    location: { x: '63%', y: '70%' }
  },
  {
    month: '6월',
    name: '지곡 왕산포 서산갯마을 축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '매년 6월경' },
      { icon: MapPin, text: '서산시 지곡면 왕산포구 일원' },
      { icon: Users, text: '맨손 물고기 잡기, 수산물 할인행사, 노래자랑 등' }
    ],
    location: { x: '63%', y: '70%' }
  },
  {
    month: '6월',
    name: '팔봉산 감자 축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '매년 6월경' },
      { icon: MapPin, text: '팔봉산 어울림마당(양길리 827일원)' },
      { icon: Users, text: '팔봉산 감자요리, 가마솥 찐감자 시식, 감자캐기 체험, 농산물 상설판매장, 농산특산물 즉석경매, 감자 이색 게임, 팔봉산 감자골 노래자랑' }
    ],
    location: { x: '63%', y: '70%' }
  },
  {
    month: '6월',
    name: '서산 6쪽마늘 축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '6/27~6/29' },
      { icon: MapPin, text: '서산시 해미면 남문2로 143 해미읍성 일원' },
      { icon: Users, text: '서산 6쪽마늘 및 농산특산물 판매, 무대 상설공연, 체험, 먹거리등' }
    ],
    location: { x: '63%', y: '70%' }
  },
  {
    month: '8월',
    name: '삼길포 우럭 축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '8/23~8/24' },
      { icon: MapPin, text: '서산시 대산읍 화곡리 삼길포항 일원' },
      { icon: Users, text: '공연행사, 체험 행사(독살체험, 맨손 붕장어 잡기 등), 참여행사(대산읍민가요제), 연계 행사(어린이 체험 등)' }
    ],
    location: { x: '63%', y: '70%' }
  },
  {
    month: '10월',
    name: '어리굴젓 축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '매년 10월경' },
      { icon: MapPin, text: '서산시 부석면 간월도항 일원' },
      { icon: Users, text: '갯벌 체험, 맨손 물고기 잡기, 등' }
    ],
    location: { x: '63%', y: '70%' }
  },
  {
    month: '11월',
    name: '서산 국화 축제',
    description: '가을의 정취를 만끽할 수 있는 서산국화축제는 다양한 국화 전시와 함께 문화공연이 펼쳐집니다.',
    details: [
      { icon: Calendar, text: '매년 11월경' },
      { icon: MapPin, text: '한농원 일원(서산시 고북면)' },
      { icon: Sparkles, text: '국화 전시, 문화공연, 체험 프로그램' }
    ],
    location: { x: '45%', y: '40%' }
  },
  {
    month: '11월',
    name: '서산 뻘낙지먹물 축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '매년 11월경' },
      { icon: MapPin, text: '서산시 지곡면 총리포구 일원' },
      { icon: Users, text: '맨손 물고기 잡기, 수산물 할인행사, 낙지음식 시식 등' }
    ],
    location: { x: '63%', y: '70%' }
  }
] as const;

const EXPERIENCES: ReadonlyArray<Experience> = [
  {
    icon: Landmark,
    title: '서산 경주김씨 고택',
    description: '조선 한옥의 멋과 생활사를 느낄 수 있는 전통 고택 탐방지',
    location: '서산시 음암면 유계리 465번지',
    position: { x: '35%', y: '65%' }
  },
  {
    icon: Landmark,
    title: '서산 유기방가옥',
    description: '기와지붕과 대청마루가 살아있는 고즈넉한 전통가옥 체험',
    location: '서산시 운산면 이문안길 72-10',
    position: { x: '25%', y: '35%' }
  },
  {
    icon: Waves,
    title: '중리어촌체험마을',
    description: '서해 갯벌에서 조개캐기·맨손 물고기잡기 등 바다 놀이를 즐기는 가족형 어촌 체험 마을',
    location: '충청남도 서산시 지곡면 어름들2길 66',
    position: { x: '75%', y: '70%' }
  },
  {
    icon: Waves,
    title: '웅도어촌체험휴양마을',
    description: '밀물·썰물로 드러나는 갯벌에서 조개캐기·맨손 물고기잡기 등 서해 바다 생태를 온몸으로 즐기는 가족 체험 마을',
    location: '충청남도 서산시 대산읍 웅도1길 28',
    position: { x: '75%', y: '70%' }
  },
  {
    icon: Tent,
    title: '방길동마을',
    description: '마을 해설과 자연·농사 체험으로 로컬 일상을 만나는 곳',
    location: '팔봉면 팔봉산로 122',
    position: { x: '75%', y: '70%' }
  },
  {
    icon: Tent,
    title: '별마을',
    description: '빛 공해 적은 하늘 아래 별 관측과 야간 체험이 매력적인 마을',
    location: '해미면 오학별마을길 30-2',
    position: { x: '75%', y: '70%' }
  },
  {
    icon: Tent,
    title: '한다리전통체험마을',
    description: '다도·전통놀이·한지공예 등 옛 생활문화를 손끝으로 배우는 공간',
    location: '서산시 음암면 한다리길 34',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Tent,
    title: '초록꿈틀마을',
    description: '친환경 텃밭·곤충 생태 등 자연과 가까워지는 체험 마을',
    location: '충남 서산시 음암면 두치로 371',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Tent,
    title: '난사랑방',
    description: '난(蘭) 전시·분갈이·관리 노하우를 나누는 교류의 사랑방',
    location: '충남 서산시 인지면 화수리',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Tent,
    title: '과학딸기농장',
    description: '스마트팜 견학과 딸기 수확 체험을 함께 즐기는 농장',
    location: '충남 서산시 인지면 화수리',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Tent,
    title: '꼼방울',
    description: '로컬 재료로 만드는 수제 디저트·공방형 클래스가 있는 공간',
    location: '충남 서산시 인지면 산저 1길 132',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Tent,
    title: '나눔농장',
    description: '함께 가꾸고 수확을 나누는 도시농부 봉사·체험 농장',
    location: '충남 서산시 인지면 차리구억말길62-6',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Tent,
    title: '나무테크 나무야',
    description: '목공·우드버닝 원데이 클래스로 나만의 우드 굿즈를 만드는 곳',
    location: '서산시 성연면 가재미길 37-6',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Landmark,
    title: '부석사 템플스테이',
    description: '산사에서 명상·예불·발우공양으로 마음을 쉬게 하는 체험',
    location: '충청남도 서산시 부석면 부석사길 243',
    position: { x: '70%', y: '70%' }
  },
  {
    icon: Landmark,
    title: '서광사 템플스테이',
    description: '고요한 도량에서 수행 프로그램으로 일상의 쉼표를 찍는 시간',
    location: '충청남도 서산시 부춘산1로 44',
    position: { x: '70%', y: '70%' }
  }
] as const;

const REGIONS: ReadonlyArray<Region> = [
  { id: 'daesan', name: '대산읍', description: '석유화학단지', position: { x: '42%', y: '16%' } },
  { id: 'jigok', name: '지곡면', description: '농촌체험마을', position: { x: '45%', y: '36%' } },
  { id: 'palbong', name: '팔봉면', description: '팔봉산 관광지', position: { x: '32%', y: '48%' } },
  { id: 'seongyeon', name: '성연면', description: '전통시장', position: { x: '48%', y: '47%' } },
  { id: 'buchun', name: '부춘동', description: '행정중심', position: { x: '42%', y: '52%' } },
  { id: 'dongmun1', name: '동문1동', description: '구도심', position: { x: '49%', y: '52%' } },
  { id: 'dongmun2', name: '동문2동', description: '상업지구', position: { x: '44%', y: '57%' } },
  { id: 'suseok', name: '수석동', description: '주거지역', position: { x: '52%', y: '58%' } },
  { id: 'seoknam', name: '석남동', description: '신도시', position: { x: '48%', y: '66%' } },
  { id: 'eumam', name: '음암면', description: '온천관광', position: { x: '60%', y: '50%' } },
  { id: 'unsan', name: '운산면', description: '역사문화', position: { x: '68%', y: '58%' } },
  { id: 'inji', name: '인지면', description: '자연생태', position: { x: '42%', y: '66%' } },
  { id: 'buseok', name: '부석면', description: '사찰문화', position: { x: '35%', y: '80%' } },
  { id: 'gobuk', name: '고북면', description: '농업지대', position: { x: '55%', y: '86%' } },
  { id: 'haemi', name: '해미면', description: '해미읍성', position: { x: '63%', y: '72%' } }
] as const;

const MapSection: React.FC<MapSectionProps> = memo(({ className }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'festival' | 'experience'>('festival');
  const [currentFestivalIndex, setCurrentFestivalIndex] = useState(0);

  // ⭐ 체험 페이징 상태 (3개씩)
  const EXP_PAGE_SIZE = 3;
  const [currentExpPage, setCurrentExpPage] = useState(0);
  const totalExpPages = Math.ceil(EXPERIENCES.length / EXP_PAGE_SIZE);

  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [focusedMarkerId, setFocusedMarkerId] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 현재 축제 / 현재 체험 페이지 아이템
  const currentFestival = useMemo(() => FESTIVALS[currentFestivalIndex], [currentFestivalIndex]);

  const pagedExperiences = useMemo(() => {
    const start = currentExpPage * EXP_PAGE_SIZE;
    return EXPERIENCES.slice(start, start + EXP_PAGE_SIZE);
  }, [currentExpPage]);

  // 핸들러들
  const handleTabChange = useCallback((tab: 'festival' | 'experience') => {
    if (tab !== activeTab) {
      setHoveredMarkerId(null);
      setFocusedMarkerId(null);
      const tabElement = document.querySelector(`.final-tab[aria-pressed="false"]`);
      if (tabElement) {
        tabElement.classList.add('switching');
        setTimeout(() => {
          tabElement.classList.remove('switching');
        }, 300);
      }
      setActiveTab(tab);
    }
  }, [activeTab]);

  const handlePrevFestival = useCallback(() => {
    const currentMarker = document.querySelector('.final-marker.active');
    if (currentMarker) {
      currentMarker.classList.add('transitioning-out');
      setTimeout(() => {
        currentMarker?.classList.remove('transitioning-out');
      }, 200);
    }
    setCurrentFestivalIndex((prev: number) => prev > 0 ? prev - 1 : FESTIVALS.length - 1);
  }, []);

  const handleNextFestival = useCallback(() => {
    const currentMarker = document.querySelector('.final-marker.active');
    if (currentMarker) {
      currentMarker.classList.add('transitioning-out');
      setTimeout(() => {
        currentMarker?.classList.remove('transitioning-out');
      }, 200);
    }
    setCurrentFestivalIndex((prev: number) => (prev + 1) % FESTIVALS.length);
  }, []);

  const handleFestivalDotClick = useCallback((index: number) => {
    if (index !== currentFestivalIndex) setCurrentFestivalIndex(index);
  }, [currentFestivalIndex]);

  // 체험 페이징 네비게이션
  const handlePrevExpPage = useCallback(() => {
    setHoveredMarkerId(null);
    setFocusedMarkerId(null);
    setCurrentExpPage((prev) => (prev - 1 + totalExpPages) % totalExpPages);
  }, [totalExpPages]);

  const handleNextExpPage = useCallback(() => {
    setHoveredMarkerId(null);
    setFocusedMarkerId(null);
    setCurrentExpPage((prev) => (prev + 1) % totalExpPages);
  }, [totalExpPages]);

  const handleMapLoad = useCallback(() => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    setLoadingState('loaded');
    setIsMapLoaded(true);
    setRetryCount(0);
  }, []);

  const handleMapError = useCallback(() => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    if (retryCount < 3) {
      console.warn(`Map image failed to load, retrying... (${retryCount + 1}/3)`);
      setRetryCount(prev => prev + 1);
      setLoadingState('loading');
      setTimeout(() => {
        const img = document.querySelector('.map-image-final') as HTMLImageElement;
        if (img) img.src = img.src + '?retry=' + (retryCount + 1);
      }, 1000 * (retryCount + 1));
    } else {
      console.error('Map image failed to load after 3 retries');
      setLoadingState('error');
      setIsMapLoaded(true);
    }
  }, [retryCount]);

  const handleRetryLoad = useCallback(() => {
    setLoadingState('loading');
    setRetryCount(0);
    const img = document.querySelector('.map-image-final') as HTMLImageElement;
    if (img) img.src = img.src.split('?')[0] + '?retry=' + Date.now();
  }, []);

  const handleMarkerMouseEnter = useCallback((markerId: string) => setHoveredMarkerId(markerId), []);
  const handleMarkerMouseLeave = useCallback(() => setHoveredMarkerId(null), []);
  const handleMarkerFocus = useCallback((markerId: string) => setFocusedMarkerId(markerId), []);
  const handleMarkerBlur = useCallback(() => setFocusedMarkerId(null), []);

  const handleRegionClick = useCallback((regionId: string, regionName: string) => {
    if (isMobile) {
      if (selectedRegion === regionId) {
        navigate(`/explore?region=${encodeURIComponent(regionName)}`, { state: { scrollToTop: true } });
      } else {
        setSelectedRegion(regionId);
      }
    } else {
      navigate(`/explore?region=${encodeURIComponent(regionName)}`, { state: { scrollToTop: true } });
    }
  }, [navigate, isMobile, selectedRegion]);

  const handleRegionMouseEnter = useCallback((regionId: string) => setHoveredRegion(regionId), []);
  const handleRegionMouseLeave = useCallback(() => setHoveredRegion(null), []);

  // 인터섹션 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 축제 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFestivalIndex((prev: number) => (prev + 1) % FESTIVALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 패럴랙스
  useEffect(() => {
    let animationFrameId: number;
    let isProcessing = false;

    const handleMouseMove = (e: Event) => {
      if (isProcessing) return;
      const mouseEvent = e as MouseEvent;
      const mapContainer = document.querySelector('.final-map-container');
      if (!mapContainer) return;

      isProcessing = true;
      animationFrameId = requestAnimationFrame(() => {
        try {
          const rect = mapContainer.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (mouseEvent.clientX - centerX) / rect.width;
          const deltaY = (mouseEvent.clientY - centerY) / rect.height;
          const parallaxElements = mapContainer.querySelectorAll('.final-marker, .final-exp-marker, .tree-icon, .mountain-icon');
          parallaxElements.forEach((element, index) => {
            const intensity = (index % 3 + 1) * 1.5;
            const translateX = deltaX * intensity;
            const translateY = deltaY * intensity;
            const htmlElement = element as HTMLElement;
            const currentTransform = htmlElement.style.transform.replace(/translate\([^)]*\)/g, '');
            htmlElement.style.transform = `${currentTransform} translate(${translateX}px, ${translateY}px)`;
          });
        } catch (error) {
          console.warn('Parallax effect error:', error);
        } finally {
          isProcessing = false;
        }
      });
    };

    const handleMouseLeave = () => {
      const mapContainer = document.querySelector('.final-map-container');
      if (!mapContainer) return;
      const parallaxElements = mapContainer.querySelectorAll('.final-marker, .final-exp-marker, .tree-icon, .mountain-icon');
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.transform = htmlElement.style.transform.replace(/translate\([^)]*\)/g, '');
      });
    };

    const mapContainer = document.querySelector('.final-map-container');
    if (mapContainer) {
      mapContainer.addEventListener('mousemove', handleMouseMove, { passive: true });
      mapContainer.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (mapContainer) {
        mapContainer.removeEventListener('mousemove', handleMouseMove);
        mapContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // 상태 복원
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('seosan-map-state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.activeTab && ['festival', 'experience'].includes(parsedState.activeTab)) {
          setActiveTab(parsedState.activeTab);
        }
        if (typeof parsedState.currentFestivalIndex === 'number' &&
            parsedState.currentFestivalIndex >= 0 &&
            parsedState.currentFestivalIndex < FESTIVALS.length) {
          setCurrentFestivalIndex(parsedState.currentFestivalIndex);
        }
        // ⭐ 체험 페이지 복원
        if (typeof parsedState.currentExpPage === 'number' &&
            parsedState.currentExpPage >= 0 &&
            parsedState.currentExpPage < Math.ceil(EXPERIENCES.length / EXP_PAGE_SIZE)) {
          setCurrentExpPage(parsedState.currentExpPage);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved map state:', error);
    }
  }, []);

  // 상태 저장
  useEffect(() => {
    if (isInitialized) {
      try {
        const stateToSave = {
          activeTab,
          currentFestivalIndex,
          currentExpPage, // ⭐ 체험 페이지 저장
          timestamp: Date.now()
        };
        localStorage.setItem('seosan-map-state', JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Failed to save map state:', error);
      }
    }
  }, [activeTab, currentFestivalIndex, currentExpPage, isInitialized]);

  // 키보드 네비
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      switch (e.key) {
        case 'ArrowLeft':
          if (activeTab === 'festival') {
            e.preventDefault();
            handlePrevFestival();
          } else if (activeTab === 'experience') {
            e.preventDefault();
            handlePrevExpPage(); // ⭐ 체험 좌측 이동
          }
          break;
        case 'ArrowRight':
          if (activeTab === 'festival') {
            e.preventDefault();
            handleNextFestival();
          } else if (activeTab === 'experience') {
            e.preventDefault();
            handleNextExpPage(); // ⭐ 체험 우측 이동
          }
          break;
        case 'Tab':
          if (e.shiftKey) handleTabChange('festival');
          else handleTabChange('experience');
          break;
        case '1':
        case '2':
        case '3':
          if (activeTab === 'festival') {
            const index = parseInt(e.key) - 1;
            if (index >= 0 && index < FESTIVALS.length) {
              e.preventDefault();
              handleFestivalDotClick(index);
            }
          }
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, activeTab, handlePrevFestival, handleNextFestival, handleTabChange, handleFestivalDotClick, handlePrevExpPage, handleNextExpPage]);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 외부 클릭시 선택 해제
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.region-marker') && selectedRegion) setSelectedRegion(null);
    };
    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, selectedRegion]);

  // 초기화
  useEffect(() => {
    setLoadingState('loading');
    loadingTimeoutRef.current = setTimeout(() => {
      setLoadingState('error');
      console.warn('Map loading timeout');
    }, 10000);
    const initTimer = setTimeout(() => setIsInitialized(true), 100);
    return () => {
      clearTimeout(initTimer);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  // 성능 모니터링
  useEffect(() => {
    let startTime = performance.now();
    const measurePerformance = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      if (renderTime > 100) console.warn(`MapSection render took ${renderTime.toFixed(2)}ms`);
    };
    const measureTimer = setTimeout(measurePerformance, 0);
    return () => {
      clearTimeout(measureTimer);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      setHoveredMarkerId(null);
      setFocusedMarkerId(null);
    };
  }, []);

  // 🔗 축제 링크 도우미
  const festLink = getOfficialLink(currentFestival.name);
  const festOpen = () => { if (festLink) window.open(festLink, '_blank', 'noopener'); };
  const festKeyOpen: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!festLink) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); festOpen(); }
  };

  return (
    <section className={`map-section-final ${isVisible ? 'visible' : ''}`} ref={sectionRef} aria-label="서산 축제 및 체험 지도">
      {/* Wave Background */}
      <div className="final-background">
        <div className="wave-background" />
        <div className="wave-layer-1" />
        <div className="wave-layer-2" />
      </div>

      {/* Main Container */}
      <div className="final-container">
        {/* Tab Navigation - Top Left */}
        <div className="final-tabs">
          <button
            className={`final-tab ${activeTab === 'festival' ? 'active' : ''}`}
            onClick={() => handleTabChange('festival')}
            aria-pressed={activeTab === 'festival'}
            aria-label="서산 축제 탭"
          >
            <span className="tab-label">서산 축제</span>
          </button>
          <button
            className={`final-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => handleTabChange('experience')}
            aria-pressed={activeTab === 'experience'}
            aria-label="서산 체험 탭"
          >
            <span className="tab-label">서산 체험</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="final-content">
          {/* Left Info Panel */}
          <div className="left-panel">
            <div className="final-info-panel">
              {activeTab === 'festival' && (
                <div className="festival-panel-content">
                  {/* Festival Image (클릭/엔터로 새 탭) */}
                  <div
                    className="festival-image-container"
                    onClick={festOpen}
                    onKeyDown={festKeyOpen}
                    role={festLink ? 'link' : undefined}
                    tabIndex={festLink ? 0 : -1}
                    aria-label={festLink ? `${currentFestival.name} 공식 사이트로 이동` : undefined}
                    title={festLink ? `${currentFestival.name} 공식 사이트` : undefined}
                    style={festLink ? { cursor: 'pointer' } : undefined}
                  >
                    <img src="/images/벚꽃.png" alt="해미벚꽃축제 풍경" className="festival-main-image" />
                  </div>

                  {/* 제목 배지 + 링크 아이콘 오른쪽 */}
                  <div className="festival-badge-container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="festival-title-badge">{currentFestival.month} {currentFestival.name}</span>
                    <div style={{ marginLeft: 'auto' }}>
                      <ExternalLinkBtn href={festLink} label={`${currentFestival.name} 공식 사이트`} />
                    </div>
                  </div>

                  <p className="festival-description-final">
                    {currentFestival.description}
                  </p>

                  <div className="festival-details-final">
                    {currentFestival.details.map((detail, index) => {
                      const IconComponent = detail.icon;
                      return (
                        <div key={index} className="detail-row-final">
                          <div className="detail-icon-container">
                            <IconComponent className="detail-icon-final" size={20} />
                          </div>
                          <div className="detail-content-final">
                            <span className="detail-label-final">
                              {index === 0 ? '개최일' : index === 1 ? '장소' : '주요'}
                            </span>
                            <span className="detail-value-final">{detail.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="festival-nav-final">
                    <div className="nav-controls">
                      <button className="nav-arrow prev" onClick={handlePrevFestival} aria-label="이전 축제 보기">
                        <ChevronLeft size={20} />
                      </button>
                      <div className="nav-counter">
                        <span className="current">{currentFestivalIndex + 1}</span>
                        <span className="divider">/</span>
                        <span className="total">{FESTIVALS.length}</span>
                      </div>
                      <button className="nav-arrow next" onClick={handleNextFestival} aria-label="다음 축제 보기">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Floating Petals */}
                  <div className="panel-petals">
                    <div className="floating-petal" style={{ top: '0', left: '0' }} />
                    <div className="floating-petal" style={{ top: '20px', right: '10px', animationDelay: '2s' }} />
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="experience-panel-content">
                  <h2 className="experience-title-final">
                    자연과 함께하는
                    <span className="title-highlight"> 특별한 여행</span>
                  </h2>

                  {/* ⭐ 체험 카드: 3개 페이징 (카드/제목/아이콘 모두 링크) */}
                  <div className="experience-cards-final">
                    {pagedExperiences.map((exp, index) => {
                      const Icon = exp.icon;
                      const link = getOfficialLink(exp.title); // 🔗 공식 링크

                      const openLink = () => { if (link) window.open(link, '_blank', 'noopener'); };
                      const onKeyOpen: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
                        if (!link) return;
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLink(); }
                      };

                      return (
                        <div
                          key={`exp-card-${currentExpPage}-${index}`}
                          className="exp-card-final"
                          style={link ? { cursor: 'pointer' } : undefined}
                          onClick={openLink}
                          onKeyDown={onKeyOpen}
                          role={link ? 'link' : undefined}
                          tabIndex={link ? 0 : -1}
                          aria-label={link ? `${exp.title} 공식 사이트로 이동` : undefined}
                        >
                          <div className="exp-icon-final">
                            <Icon size={24} aria-hidden="true" />
                          </div>

                          <div className="exp-content-final">
                            <div className="exp-card-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {link ? (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: 'inherit', textDecoration: 'none' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <h3 style={{ margin: 0 }}>{exp.title}</h3>
                                </a>
                              ) : (
                                <h3 style={{ margin: 0 }}>{exp.title}</h3>
                              )}

                              <div style={{ marginLeft: 'auto' }} onClick={(e) => e.stopPropagation()}>
                                <ExternalLinkBtn href={link} label={`${exp.title} 공식 사이트`} />
                              </div>
                            </div>

                            <p>{exp.description}</p>
                            <span className="exp-location-tag">{exp.location}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ⭐ 체험 네비게이션: 축제와 동일한 UI 재사용 */}
                  <div className="festival-nav-final">
                    <div className="nav-controls">
                      <button className="nav-arrow prev" onClick={handlePrevExpPage} aria-label="이전 체험 페이지">
                        <ChevronLeft size={20} />
                      </button>
                      <div className="nav-counter">
                        <span className="current">{currentExpPage + 1}</span>
                        <span className="divider">/</span>
                        <span className="total">{totalExpPages}</span>
                      </div>
                      <button className="nav-arrow next" onClick={handleNextExpPage} aria-label="다음 체험 페이지">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Map */}
          <div className="center-map">
            <div className="final-map-container">
              <div className="map-frame">
                {loadingState === 'loading' && (
                  <div className="map-loading-overlay">
                    <div className="loading-spinner">
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                    </div>
                    <p className="loading-text">
                      {retryCount > 0 ? `재시도 중... (${retryCount}/3)` : '지도를 불러오는 중...'}
                    </p>
                  </div>
                )}

                {loadingState === 'error' && (
                  <div className="map-error-overlay">
                    <div className="error-icon">⚠️</div>
                    <p className="error-text">지도를 불러올 수 없습니다</p>
                    <button
                      className="retry-button"
                      onClick={handleRetryLoad}
                      aria-label="지도 다시 불러오기"
                    >
                      다시 시도
                    </button>
                  </div>
                )}
                <img
                  src="/images/지도.png"
                  alt="서산시 전체 지도. 축제 및 체험 장소가 표시되어 있습니다"
                  className={`map-image-final ${isMapLoaded ? 'loaded' : 'loading'}`}
                  onLoad={handleMapLoad}
                  onError={handleMapError}
                />

                {/* Map Highlight Overlay */}
                <div className="map-highlight-overlay">
                  {activeTab === 'festival' && FESTIVALS.map((festival, index) => (
                    <div
                      key={`highlight-${index}`}
                      className={`region-highlight ${index === currentFestivalIndex ? 'active' : ''}`}
                      style={{
                        left: festival.location.x,
                        top: festival.location.y,
                        width: '120px',
                        height: '120px'
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Map Decorations */}
                <div className="map-tree-icons">
                  <Trees className="tree-icon" style={{ top: '20%', left: '30%' }} />
                  <Mountain className="mountain-icon" style={{ top: '15%', right: '25%' }} />
                  <Trees className="tree-icon" style={{ bottom: '30%', left: '15%' }} />
                  <Mountain className="mountain-icon" style={{ bottom: '40%', right: '35%' }} />
                  <Trees className="tree-icon" style={{ top: '60%', right: '20%' }} />
                </div>

                {/* Festival Markers + 링크 아이콘(옆) */}
                {activeTab === 'festival' && FESTIVALS.map((festival, index) => {
                  const markerId = `festival-${index}`;
                  const isActive = index === currentFestivalIndex;
                  const isHovered = hoveredMarkerId === markerId;
                  const isFocused = focusedMarkerId === markerId;
                  const shouldShowLabel = isActive || isHovered || isFocused;
                  const link = getOfficialLink(festival.name);
                  const showLink = !!link && shouldShowLabel;

                  return (
                    <React.Fragment key={markerId}>
                      <button
                        className={`final-marker ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''} ${isFocused ? 'focused' : ''}`}
                        style={{
                          left: festival.location.x,
                          top: festival.location.y,
                          zIndex: isActive ? 100 : (isHovered || isFocused) ? 50 : 10
                        }}
                        onClick={() => handleFestivalDotClick(index)}
                        onMouseEnter={() => handleMarkerMouseEnter(markerId)}
                        onMouseLeave={handleMarkerMouseLeave}
                        onFocus={() => handleMarkerFocus(markerId)}
                        onBlur={handleMarkerBlur}
                        aria-label={`${festival.name} (${festival.month}) 마커`}
                        aria-pressed={isActive}
                      >
                        <div className="marker-pin">
                          <div className="pin-head" />
                          <div className="pin-center" />
                        </div>
                        <div className={`marker-label-final ${shouldShowLabel ? 'visible' : 'hidden'}`}>
                          <div className="festival-name">{festival.name}</div>
                          <div className="festival-month">{festival.month}</div>
                        </div>
                      </button>

                      {showLink && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${festival.name} 공식 사이트`}
                          title={`${festival.name} 공식 사이트`}
                          style={{
                            position: 'absolute',
                            left: festival.location.x,
                            top: festival.location.y,
                            transform: 'translate(26px, 0)',
                            display: 'inline-flex',
                            width: 22,
                            height: 22,
                            borderRadius: 9999,
                            background: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,.18)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: isActive ? 110 : 60
                          }}
                        >
                          <LinkIcon size={16} />
                        </a>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Region Clickable Areas */}
                {REGIONS.map((region, index) => {
                  const isHovered = hoveredRegion === region.id;
                  const isSelected = selectedRegion === region.id;
                  const isActive = isMobile && isSelected;

                  return (
                    <button
                      key={region.id}
                      className={`region-marker ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''} ${isActive ? 'mobile-active' : ''}`}
                      style={{
                        left: region.position.x,
                        top: region.position.y,
                        '--index': index
                      } as React.CSSProperties}
                      onClick={() => handleRegionClick(region.id, region.name)}
                      onMouseEnter={() => handleRegionMouseEnter(region.id)}
                      onMouseLeave={handleRegionMouseLeave}
                      aria-label={`${region.name} 지역`}
                      aria-pressed={isSelected}
                    >
                      <span className="dot-indicator" />
                      <span className="ripple" />
                      <div className="info-card">
                        <h3 className="region-title">{region.name}</h3>
                      </div>
                    </button>
                  );
                })}

                {/* ⭐ Experience Markers: 현재 페이지 3개만 + 링크 아이콘 옆으로 */}
                {activeTab === 'experience' && pagedExperiences.map((exp, index) => {
                  const Icon = exp.icon;
                  const globalIndex = currentExpPage * EXP_PAGE_SIZE + index;
                  const markerId = `experience-${globalIndex}`;
                  const isHovered = hoveredMarkerId === markerId;
                  const isFocused = focusedMarkerId === markerId;
                  const shouldShowLabel = isHovered || isFocused;
                  const link = getOfficialLink(exp.title);

                  return (
                    <React.Fragment key={markerId}>
                      <button
                        className={`final-exp-marker ${isHovered ? 'hovered' : ''} ${isFocused ? 'focused' : ''}`}
                        style={{
                          left: exp.position.x,
                          top: exp.position.y,
                          zIndex: (isHovered || isFocused) ? 30 : 15
                        }}
                        onMouseEnter={() => handleMarkerMouseEnter(markerId)}
                        onMouseLeave={handleMarkerMouseLeave}
                        onFocus={() => handleMarkerFocus(markerId)}
                        onBlur={handleMarkerBlur}
                        aria-label={`${exp.title} - ${exp.location}`}
                      >
                        <div className="exp-marker-icon">
                          <Icon size={16} aria-hidden="true" />
                        </div>
                        <span className={`exp-marker-name ${shouldShowLabel ? 'visible' : 'hidden'}`}>
                          {exp.location}
                        </span>
                      </button>

                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${exp.title} 공식 사이트`}
                          title={`${exp.title} 공식 사이트`}
                          style={{
                            position: 'absolute',
                            left: exp.position.x,
                            top: exp.position.y,
                            transform: 'translate(26px, 0px)',
                            display: shouldShowLabel ? 'inline-flex' : 'none',
                            width: 22,
                            height: 22,
                            borderRadius: 9999,
                            background: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,.18)',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <LinkIcon size={16} />
                        </a>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Area - Title and Character */}
          <div className="right-area">
            <div className="final-header">
              <img
                src="/images/Group 341.png"
                alt="마을 구석구석, 서산 정복하기! 타이틀"
                className="final-title-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

MapSection.displayName = 'MapSection';

// Error Boundary Component
class MapSectionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MapSection Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="map-section-error" role="alert" aria-live="polite">
          <div className="error-container">
            <h2>지도를 불러오는 중 오류가 발생했습니다</h2>
            <p>페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
            <button
              onClick={() => window.location.reload()}
              className="error-reload-btn"
            >
              새로고침
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

// Wrapped component with error boundary
const MapSectionWithErrorBoundary: React.FC<MapSectionProps> = (props) => (
  <MapSectionErrorBoundary>
    <MapSection {...props} />
  </MapSectionErrorBoundary>
);

export default MapSectionWithErrorBoundary;
