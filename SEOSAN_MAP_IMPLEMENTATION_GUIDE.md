# 서산시 지도 구현 가이드

## 현재 구현 개선 방안

### 즉시 적용 가능한 개선사항

1. **히트 영역 확대**
```tsx
// 클릭 영역을 시각적 영역보다 크게 설정
.region-overlay {
  /* 실제 크기보다 20% 더 큰 클릭 영역 */
  padding: 10px;
  margin: -10px;
}
```

2. **데이터 구조 개선**
```tsx
// GeoJSON 형식으로 전환
const REGION_DATA = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "대산읍" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[126.35, 36.9], ...]]
      }
    }
  ]
};
```

3. **성능 최적화**
```tsx
// 이미지 최적화
const preloadImages = () => {
  const img = new Image();
  img.src = '/path/to/map.webp'; // WebP 형식 사용
};

// 디바운스 적용
const debouncedHover = debounce(handleRegionHover, 50);
```

## SVG 기반 구현 (권장)

### 장점
- 해상도 독립적
- 정확한 경계선
- CSS 애니메이션 지원
- 접근성 우수

### 구현 단계
1. 서산시 행정구역 SVG 데이터 확보
2. SVG 최적화 (SVGO 사용)
3. React 컴포넌트로 변환
4. 인터랙션 추가

### 예제 코드
```tsx
// 서산시 실제 좌표 기반 SVG
<svg viewBox="126.2 36.7 0.5 0.4">
  <path 
    d="M 126.35 36.9 L 126.45 36.9 L 126.45 36.95 L 126.35 36.95 Z"
    onClick={() => handleClick('대산읍')}
  />
</svg>
```

## 지도 라이브러리 선택 가이드

### Mapbox GL JS (추천)
```bash
npm install mapbox-gl @types/mapbox-gl
```

**장점:**
- WebGL 기반 고성능
- 3D 건물, 지형 표현
- 스타일 커스터마이징
- 모바일 최적화

**구현:**
```tsx
map.addSource('seosan-boundaries', {
  type: 'geojson',
  data: '/data/seosan.geojson'
});

map.addLayer({
  id: 'seosan-fill',
  type: 'fill',
  source: 'seosan-boundaries',
  paint: {
    'fill-color': ['case',
      ['boolean', ['feature-state', 'hover'], false],
      '#00D4B5',
      '#E5E7EB'
    ]
  }
});
```

### Leaflet (무료 대안)
```bash
npm install leaflet react-leaflet
```

**장점:**
- 완전 무료
- 가벼움 (39KB gzipped)
- 플러그인 생태계

### 한국 지도 서비스
- **네이버 지도**: 한국 POI 데이터 풍부
- **카카오맵**: 모바일 최적화, 길찾기 API

## 데이터 관리 베스트 프랙티스

### 1. 외부 데이터 파일 분리
```tsx
// data/seosan-regions.json
export const SEOSAN_REGIONS = {
  "regions": [...],
  "metadata": {
    "lastUpdated": "2024-01-01",
    "source": "서산시청"
  }
};
```

### 2. 타입 안전성
```tsx
interface SeosanRegion {
  id: string;
  name: string;
  hanjaName?: string;
  area: number; // km²
  population: number;
  coordinates: GeoJSON.Polygon;
}
```

### 3. 상태 관리
```tsx
// Zustand 또는 Redux Toolkit 사용
const useMapStore = create((set) => ({
  selectedRegion: null,
  hoveredRegion: null,
  mapType: 'svg',
  setSelectedRegion: (region) => set({ selectedRegion: region })
}));
```

## 애니메이션 & 트랜지션

### CSS 기반 (성능 우수)
```css
.region-path {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.region-path:hover {
  transform: scale(1.05);
  filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}
```

### JavaScript 애니메이션 (복잡한 효과)
```tsx
import { animated, useSpring } from 'react-spring';

const animatedProps = useSpring({
  scale: isHovered ? 1.05 : 1,
  opacity: isSelected ? 0.9 : 0.6
});
```

## 성능 체크리스트

- [ ] 이미지 최적화 (WebP, 적절한 해상도)
- [ ] 레이지 로딩 구현
- [ ] GPU 가속 활용 (`will-change`, `transform`)
- [ ] 디바운스/쓰로틀 적용
- [ ] 메모이제이션 (`useMemo`, `React.memo`)
- [ ] 번들 크기 최적화

## 접근성 체크리스트

- [ ] 키보드 내비게이션
- [ ] 스크린 리더 지원
- [ ] 충분한 색상 대비
- [ ] 포커스 표시
- [ ] ARIA 레이블

## 추천 구현 순서

1. **Phase 1**: 현재 구조 개선 (1-2일)
   - 데이터 구조 정리
   - 성능 최적화
   - 애니메이션 개선

2. **Phase 2**: SVG 전환 (3-5일)
   - SVG 데이터 준비
   - 컴포넌트 재구현
   - 테스트

3. **Phase 3**: 지도 라이브러리 (1-2주)
   - 라이브러리 선정
   - POC 구현
   - 완전 전환

## 참고 자료

- [D3.js 한국 지도](https://github.com/southkorea/southkorea-maps)
- [Mapbox 스타일 가이드](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
- [서산시 공공데이터](https://www.data.go.kr/)