import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapSection.css';
import './PremiumMinimalMap.css';
import { MapPin, Calendar, Users, Mountain, Waves, TreePalm, Sparkles, Trees, ChevronLeft, ChevronRight } from 'lucide-react';
import MapImage from '../assets/map.png';
import MapTitleImage from '../assets/maptitle.png';

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
  readonly link?: string;
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
  readonly link?: string;
}

interface MapSectionProps {
  readonly className?: string;
}


const FESTIVALS: ReadonlyArray<Festival> = [
  {
    month: '4월',
    name: '해미벚꽃축제',
    description: '해미천을 따라 흐드러진 벚꽃과 다리가 어우러진 풍경으로 오작교를 떠올리게 하는 낭만을 자아냅니다.',
    details: [
      { icon: Calendar, text: '매년 4월경' },
      { icon: MapPin, text: '서산시 해미면 해미천 일원' },
      { icon: Users, text: '찾아가는 거리음악회, 농특산물 판매, 야간공연 등' }
    ],
    location: { x: '65%', y: '55%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6086'
  },
  {
    month: '5월',
    name: '류방택별축제',
    description: '천문과학을 주제로 한 별빛 축제로 별자리 관측과 천문 체험이 가능합니다.',
    details: [
      { icon: Calendar, text: '매년 5월경' },
      { icon: MapPin, text: '서산 류방택천문기상과학관' },
      { icon: Sparkles, text: '별자리 관측, 천문 체험, 과학 프로그램' }
    ],
    location: { x: '50%', y: '45%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6093'
  },
  {
    month: '6월',
    name: '서산해미읍성축제',
    description: '조선시대 군사 요충지였던 해미읍성에서 펼쳐지는 역사문화축제로, 전통 무예 시연과 다양한 체험 프로그램이 진행됩니다.',
    details: [
      { icon: Calendar, text: '매년 6월경' },
      { icon: MapPin, text: '서산시 해미읍성 일원' },
      { icon: Users, text: '전통 무예 시연, 역사 체험, 먹거리 장터' }
    ],
    location: { x: '63%', y: '70%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6105'
  },
  {
    month: '7월',
    name: '지곡왕산포서산갯마을축제',
    description: '서산의 갯마을 문화와 해산물을 즐길 수 있는 여름 축제입니다.',
    details: [
      { icon: Calendar, text: '매년 7월경' },
      { icon: MapPin, text: '서산시 지곡면 왕산포' },
      { icon: Waves, text: '갯마을 체험, 해산물 시식, 어촌 문화' }
    ],
    location: { x: '45%', y: '36%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6089'
  },
  {
    month: '7월',
    name: '팔봉산감자축제',
    description: '팔봉산 자락에서 재배한 햇감자를 주제로 한 농촌 축제입니다.',
    details: [
      { icon: Calendar, text: '매년 7월경' },
      { icon: MapPin, text: '서산시 팔봉면' },
      { icon: Mountain, text: '감자 수확 체험, 농산물 판매, 시골 장터' }
    ],
    location: { x: '32%', y: '48%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6096'
  },
  {
    month: '8월',
    name: '서산6쪽마늘축제',
    description: '전국 최고의 품질을 자랑하는 서산 6쪽마늘을 주제로 한 축제입니다.',
    details: [
      { icon: Calendar, text: '매년 8월경' },
      { icon: MapPin, text: '서산시 해미면' },
      { icon: Users, text: '마늘 요리 시식, 농산물 판매, 문화공연' }
    ],
    location: { x: '63%', y: '72%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6099'
  },
  {
    month: '9월',
    name: '삼길포우럭축제',
    description: '서산의 대표 수산물인 우럭을 주제로 한 미식 축제입니다.',
    details: [
      { icon: Calendar, text: '매년 9월경' },
      { icon: MapPin, text: '서산시 대산읍 삼길포' },
      { icon: Waves, text: '우럭 요리 시식, 낚시 체험, 수산물 판매' }
    ],
    location: { x: '42%', y: '16%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6102'
  },
  {
    month: '10월',
    name: '어리굴젓축제',
    description: '서산의 특산물 어리굴젓과 새우젓을 만나는 전통 발효 음식 축제입니다.',
    details: [
      { icon: Calendar, text: '매년 10월경' },
      { icon: MapPin, text: '서산시 부석면' },
      { icon: Users, text: '젓갈 시식, 전통 음식 체험, 특산물 판매' }
    ],
    location: { x: '35%', y: '80%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6141'
  },
  {
    month: '10월',
    name: '서산국화축제',
    description: '가을의 정취를 만끽할 수 있는 서산국화축제는 다양한 국화 전시와 함께 문화공연이 펼쳐집니다.',
    details: [
      { icon: Calendar, text: '매년 10월경' },
      { icon: MapPin, text: '서산시 음암면 탑곡리' },
      { icon: Sparkles, text: '국화 전시, 문화공연, 체험 프로그램' }
    ],
    location: { x: '60%', y: '50%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6138'
  },
  {
    month: '11월',
    name: '서산뻘낙지먹물축제',
    description: '서산 갯벌의 명물 뻘낙지를 주제로 한 이색 먹거리 축제입니다.',
    details: [
      { icon: Calendar, text: '매년 11월경' },
      { icon: MapPin, text: '서산시 부석면' },
      { icon: Waves, text: '뻘낙지 시식, 갯벌 체험, 먹물 요리' }
    ],
    location: { x: '35%', y: '80%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6144'
  }
] as const;

const EXPERIENCES: ReadonlyArray<Experience> = [
  {
    icon: Mountain,
    title: '서산 경주김씨 고택',
    description: '전통 한옥의 아름다움을 간직한 고택 체험',
    location: '해미면',
    position: { x: '63%', y: '72%' },
    link: 'https://blog.naver.com/gyeam'
  },
  {
    icon: Mountain,
    title: '서산 유기방가옥',
    description: '조선시대 전통 가옥 체험',
    location: '운산면',
    position: { x: '68%', y: '58%' },
    link: 'http://xn--o39am5bv7vomeopa05vdxb.gajagaja.co.kr/'
  },
  {
    icon: Waves,
    title: '중리어촌체험마을',
    description: '어촌 생활과 해양 생태 체험',
    location: '지곡면',
    position: { x: '45%', y: '36%' },
    link: 'http://중리어촌체험마을.kr'
  },
  {
    icon: Waves,
    title: '웅도어촌체험휴양마을',
    description: '서해 어촌의 일상을 체험하는 휴양마을',
    location: '대산읍',
    position: { x: '42%', y: '16%' },
    link: 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=6189&bbsNo=1744&nttNo=243759'
  },
  {
    icon: Trees,
    title: '방길동마을',
    description: '농촌 체험과 전통 문화가 살아있는 마을',
    location: '성연면',
    position: { x: '48%', y: '47%' },
    link: 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=970&bbsNo=475&nttNo=129332'
  },
  {
    icon: Sparkles,
    title: '별마을',
    description: '별빛 가득한 천문 관측 체험마을',
    location: '인지면',
    position: { x: '42%', y: '66%' },
    link: 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=970&bbsNo=475&nttNo=129333'
  },
  {
    icon: Mountain,
    title: '한다리전통체험마을',
    description: '전통 문화와 농촌 체험이 어우러진 마을',
    location: '고북면',
    position: { x: '55%', y: '86%' },
    link: 'https://handari.weebly.com/'
  },
  {
    icon: Trees,
    title: '초록꿈틀마을',
    description: '친환경 농업과 자연 생태 체험',
    location: '팔봉면',
    position: { x: '32%', y: '48%' },
    link: 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=970&bbsNo=475&nttNo=242553'
  },
  {
    icon: TreePalm,
    title: '난사랑방',
    description: '난초 재배와 원예 체험',
    location: '음암면',
    position: { x: '60%', y: '50%' },
    link: 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=969&bbsNo=476&nttNo=110638'
  },
  {
    icon: Trees,
    title: '과학딸기농장',
    description: '첨단 농법으로 재배하는 딸기 체험',
    location: '성연면',
    position: { x: '50%', y: '45%' },
    link: 'http://www.winesb.co.kr'
  },
  {
    icon: Trees,
    title: '꼼방울',
    description: '전통 발효 식품 만들기 체험',
    location: '부석면',
    position: { x: '35%', y: '80%' },
    link: 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=969&bbsNo=476&nttNo=191278'
  },
  {
    icon: Trees,
    title: '나눔농장',
    description: '유기농 채소 수확 체험',
    location: '동문동',
    position: { x: '49%', y: '52%' },
    link: 'https://www.seosan.go.kr/tour/selectBbsNttView.do?key=969&bbsNo=476&nttNo=191280'
  },
  {
    icon: Trees,
    title: '나무테크 나무야',
    description: '목공예와 나무 공방 체험',
    location: '수석동',
    position: { x: '52%', y: '58%' },
    link: 'https://blog.naver.com/leejeel'
  },
  {
    icon: Mountain,
    title: '부석사 템플스테이',
    description: '천년고찰에서의 사찰 문화 체험',
    location: '부석면',
    position: { x: '33%', y: '78%' },
    link: 'https://www.seosan.go.kr/tour/contents.do?key=6148'
  },
  {
    icon: Mountain,
    title: '서광사 템플스테이',
    description: '명상과 참선으로 마음의 평화를 찾는 시간',
    location: '석남동',
    position: { x: '48%', y: '66%' },
    link: 'http://www.seogwangsa.or.kr/'
  },
  {
    icon: Mountain,
    title: '용현리 마애여래삼존상',
    description: '백제의 미소를 간직한 국보 제84호',
    location: '용현리',
    position: { x: '35%', y: '65%' }
  },
  {
    icon: Waves,
    title: '가로림만 갯벌 체험',
    description: '서해안 최대의 내만 갯벌 생태 체험',
    location: '가로림만',
    position: { x: '25%', y: '35%' }
  },
  {
    icon: TreePalm,
    title: '팜카밀레 허브농원',
    description: '200여 종의 허브와 함께하는 힐링',
    location: '팔봉면',
    position: { x: '75%', y: '70%' }
  }
] as const;

const REGIONS: ReadonlyArray<Region> = [
  // 북부 지역
  { id: 'daesan', name: '대산읍', description: '석유화학단지', position: { x: '42%', y: '16%' } },
  { id: 'jigok', name: '지곡면', description: '농촌체험마을', position: { x: '45%', y: '36%' } },
  
  // 서부 지역
  { id: 'palbong', name: '팔봉면', description: '팔봉산 관광지', position: { x: '32%', y: '48%' } },
  
  // 중앙 지역
  { id: 'seongyeon', name: '성연면', description: '전통시장', position: { x: '48%', y: '47%' } },
  { id: 'buchun', name: '부춘동', description: '행정중심', position: { x: '42%', y: '52%' } },  // 위로 이동 후 왼쪽
  { id: 'dongmun1', name: '동문1동', description: '구도심', position: { x: '49%', y: '52%' } }, // 위로 이동 후 왼쪽
  { id: 'dongmun2', name: '동문2동', description: '상업지구', position: { x: '44%', y: '57%' } }, // 위로 이동 후 살짝 왼쪽
  { id: 'suseok', name: '수석동', description: '주거지역', position: { x: '52%', y: '58%' } },   // 위로
  { id: 'seoknam', name: '석남동', description: '신도시', position: { x: '48%', y: '66%' } },
  
  // 동부 지역
  { id: 'eumam', name: '음암면', description: '온천관광', position: { x: '60%', y: '50%' } },
  { id: 'unsan', name: '운산면', description: '역사문화', position: { x: '68%', y: '58%' } },  // 원래 위치로 복원
  
  // 남부 지역
  { id: 'inji', name: '인지면', description: '자연생태', position: { x: '42%', y: '66%' } },
  { id: 'buseok', name: '부석면', description: '사찰문화', position: { x: '35%', y: '80%' } },
  { id: 'gobuk', name: '고북면', description: '농업지대', position: { x: '55%', y: '86%' } },
  { id: 'haemi', name: '해미면', description: '해미읍성', position: { x: '63%', y: '72%' } }
] as const;

const MapSection: React.FC<MapSectionProps> = memo(({ className }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'festival' | 'experience'>('festival');
  const [currentFestivalIndex, setCurrentFestivalIndex] = useState(0);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);
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

  // Memoized computations
  const currentFestival = useMemo(() => FESTIVALS[currentFestivalIndex], [currentFestivalIndex]);
  
  // Optimized callbacks with advanced UX patterns
  const handleTabChange = useCallback((tab: 'festival' | 'experience') => {
    if (tab !== activeTab) {
      // Clear any hover states when switching tabs for clean transition
      setHoveredMarkerId(null);
      setFocusedMarkerId(null);
      
      // Add micro-delay for smooth visual transition
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
    // Add smooth transition effect
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
    // Add smooth transition effect
    const currentMarker = document.querySelector('.final-marker.active');
    if (currentMarker) {
      currentMarker.classList.add('transitioning-out');
      setTimeout(() => {
        currentMarker?.classList.remove('transitioning-out');
      }, 200);
    }
    
    setCurrentFestivalIndex((prev: number) => (prev + 1) % FESTIVALS.length);
  }, []);

  const handlePrevExperience = useCallback(() => {
    setCurrentExperienceIndex((prev: number) => {
      if (prev > 0) {
        return prev - 4; // 4개씩 이동
      }
      // 마지막 페이지로 이동
      const totalPages = Math.ceil(EXPERIENCES.length / 4);
      return (totalPages - 1) * 4;
    });
  }, []);

  const handleNextExperience = useCallback(() => {
    setCurrentExperienceIndex((prev: number) => {
      const nextIndex = prev + 4; // 4개씩 이동
      if (nextIndex >= EXPERIENCES.length) {
        return 0; // 처음으로 돌아가기
      }
      return nextIndex;
    });
  }, []);

  const handleFestivalDotClick = useCallback((index: number) => {
    if (index !== currentFestivalIndex) {
      setCurrentFestivalIndex(index);
    }
  }, [currentFestivalIndex]);

  const handleMapLoad = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setLoadingState('loaded');
    setIsMapLoaded(true);
    setRetryCount(0);
  }, []);

  const handleMapError = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    if (retryCount < 3) {
      console.warn(`Map image failed to load, retrying... (${retryCount + 1}/3)`);
      setRetryCount(prev => prev + 1);
      setLoadingState('loading');
      
      // Retry after a delay
      setTimeout(() => {
        const img = document.querySelector('.map-image-final') as HTMLImageElement;
        if (img) {
          img.src = img.src + '?retry=' + (retryCount + 1);
        }
      }, 1000 * (retryCount + 1));
    } else {
      console.error('Map image failed to load after 3 retries');
      setLoadingState('error');
      setIsMapLoaded(true); // Still show interface
    }
  }, [retryCount]);

  const handleRetryLoad = useCallback(() => {
    setLoadingState('loading');
    setRetryCount(0);
    const img = document.querySelector('.map-image-final') as HTMLImageElement;
    if (img) {
      img.src = img.src.split('?')[0] + '?retry=' + Date.now();
    }
  }, []);

  // Marker interaction handlers
  const handleMarkerMouseEnter = useCallback((markerId: string) => {
    setHoveredMarkerId(markerId);
  }, []);

  const handleMarkerMouseLeave = useCallback(() => {
    setHoveredMarkerId(null);
  }, []);

  const handleMarkerFocus = useCallback((markerId: string) => {
    setFocusedMarkerId(markerId);
  }, []);

  const handleMarkerBlur = useCallback(() => {
    setFocusedMarkerId(null);
  }, []);

  // 지역 클릭 핸들러
  const handleRegionClick = useCallback((regionId: string, regionName: string) => {
    if (isMobile) {
      // 모바일에서는 첫 탭에서 정보 표시, 두 번째 탭에서 이동
      if (selectedRegion === regionId) {
        navigate(`/explore?region=${encodeURIComponent(regionName)}`, {
          state: { scrollToTop: true }
        });
      } else {
        setSelectedRegion(regionId);
      }
    } else {
      // 데스크톱에서는 바로 이동
      navigate(`/explore?region=${encodeURIComponent(regionName)}`, {
        state: { scrollToTop: true }
      });
    }
  }, [navigate, isMobile, selectedRegion]);

  // 지역 호버 핸들러
  const handleRegionMouseEnter = useCallback((regionId: string) => {
    setHoveredRegion(regionId);
  }, []);

  const handleRegionMouseLeave = useCallback(() => {
    setHoveredRegion(null);
  }, []);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-slide with proper cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'festival') {
        setCurrentFestivalIndex((prev: number) => (prev + 1) % FESTIVALS.length);
      } else if (activeTab === 'experience') {
        setCurrentExperienceIndex((prev: number) => {
          const nextIndex = prev + 4;
          return nextIndex >= EXPERIENCES.length ? 0 : nextIndex;
        });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Optimized parallax effect with debouncing
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
            const intensity = (index % 3 + 1) * 1.5; // Reduced intensity for smoother movement
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
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mapContainer) {
        mapContainer.removeEventListener('mousemove', handleMouseMove);
        mapContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // State persistence
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
        if (typeof parsedState.currentExperienceIndex === 'number' && 
            parsedState.currentExperienceIndex >= 0 && 
            parsedState.currentExperienceIndex < EXPERIENCES.length) {
          setCurrentExperienceIndex(parsedState.currentExperienceIndex);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved map state:', error);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    if (isInitialized) {
      try {
        const stateToSave = {
          activeTab,
          currentFestivalIndex,
          currentExperienceIndex,
          timestamp: Date.now()
        };
        localStorage.setItem('seosan-map-state', JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Failed to save map state:', error);
      }
    }
  }, [activeTab, currentFestivalIndex, currentExperienceIndex, isInitialized]);

  // Advanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events when section is visible
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (activeTab === 'festival') {
            handlePrevFestival();
          } else if (activeTab === 'experience') {
            handlePrevExperience();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (activeTab === 'festival') {
            handleNextFestival();
          } else if (activeTab === 'experience') {
            handleNextExperience();
          }
          break;
        case 'Tab':
          if (e.shiftKey) {
            handleTabChange('festival');
          } else {
            handleTabChange('experience');
          }
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
  }, [isVisible, activeTab, handlePrevFestival, handleNextFestival, handlePrevExperience, handleNextExperience, handleTabChange, handleFestivalDotClick]);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 외부 클릭시 선택 해제
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.region-marker') && selectedRegion) {
        setSelectedRegion(null);
      }
    };

    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, selectedRegion]);

  // Component initialization with advanced loading
  useEffect(() => {
    setLoadingState('loading');
    
    // Set a timeout for loading state
    loadingTimeoutRef.current = setTimeout(() => {
      setLoadingState('error');
      console.warn('Map loading timeout');
    }, 10000); // 10 second timeout
    
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []); // Remove loadingState dependency to avoid infinite loop

  // Performance monitoring and memory management
  useEffect(() => {
    let startTime = performance.now();
    
    const measurePerformance = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) { // Log if render takes more than 100ms
        console.warn(`MapSection render took ${renderTime.toFixed(2)}ms`);
      }
    };

    // Measure performance after initial render
    const measureTimer = setTimeout(measurePerformance, 0);
    
    return () => {
      clearTimeout(measureTimer);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Cleanup any remaining event listeners or intervals
      setHoveredMarkerId(null);
      setFocusedMarkerId(null);
    };
  }, []);

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
                  <div className="festival-badge-container">
                    <span className="festival-title-badge">
                      {currentFestival.month} {currentFestival.name}
                    </span>
                  </div>
                  
                  <p className="festival-description-final">
                    {currentFestival.description}
                  </p>
                  
                  <div className="festival-details-final">
                    {currentFestival.details.map((detail, index) => {
                      return (
                        <div key={index} className="detail-row-final">
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

                  {/* Link Button */}
                  {currentFestival.link && (
                    <div className="festival-link-container">
                      <a 
                        href={currentFestival.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="festival-detail-link"
                      >
                        자세히 보기
                        <span className="link-arrow">→</span>
                      </a>
                    </div>
                  )}

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
                  
                  <div className="experience-cards-final">
                    {EXPERIENCES.slice(currentExperienceIndex, currentExperienceIndex + 4).map((exp, index) => {
                      const Icon = exp.icon;
                      return (
                        <div 
                          key={`exp-card-${currentExperienceIndex + index}`} 
                          className="exp-card-final"
                          style={{ cursor: exp.link ? 'pointer' : 'default' }}
                          onClick={() => {
                            if (exp.link) {
                              window.open(exp.link, '_blank');
                            }
                          }}
                        >
                          <div className="exp-icon-final">
                            <Icon size={24} aria-hidden="true" />
                          </div>
                          <div className="exp-content-final">
                            <h3>{exp.title}</h3>
                            <p>{exp.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span className="exp-location-tag">{exp.location}</span>
                              {exp.link && (
                                <span style={{ 
                                  fontSize: '12px', 
                                  color: '#26d0ce',
                                  fontWeight: '600'
                                }}>
                                  클릭 →
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation for Experience */}
                  <div className="festival-nav-final" style={{ marginTop: '20px' }}>
                    <div className="nav-controls">
                      <button className="nav-arrow prev" onClick={handlePrevExperience} aria-label="이전 체험 보기">
                        <ChevronLeft size={20} />
                      </button>
                      <div className="nav-counter">
                        <span className="current">{Math.floor(currentExperienceIndex / 4) + 1}</span>
                        <span className="divider">/</span>
                        <span className="total">{Math.ceil(EXPERIENCES.length / 4)}</span>
                      </div>
                      <button className="nav-arrow next" onClick={handleNextExperience} aria-label="다음 체험 보기">
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
                  src={MapImage} 
                  alt="서산시 전체 지도. 축제 및 체험 장소가 표시되어 있습니다" 
                  className={`map-image-final ${isMapLoaded ? 'loaded' : 'loading'}`}
                  onLoad={handleMapLoad}
                  onError={handleMapError}
                />
                
                {/* Map Highlight Overlay - 제거됨 */}
                
                
                {/* Map Decorations - 제거됨 */}
                
                {/* Festival Markers */}
                {activeTab === 'festival' && FESTIVALS.map((festival, index) => {
                  const markerId = `festival-${index}`;
                  const isActive = index === currentFestivalIndex;
                  const isHovered = hoveredMarkerId === markerId;
                  const isFocused = focusedMarkerId === markerId;
                  const shouldShowLabel = isActive || isHovered || isFocused;
                  
                  return (
                    <button 
                      key={markerId}
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
                      <div className="info-card">
                        <h3 className="region-title">{region.name}</h3>
                      </div>
                    </button>
                  );
                })}
                
                {/* Experience Markers - 제거됨 */}
              </div>
            </div>
          </div>

          {/* Right Area - Title and Character */}
          <div className="right-area">
            <div className="final-header">
              <img 
                src={MapTitleImage} 
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