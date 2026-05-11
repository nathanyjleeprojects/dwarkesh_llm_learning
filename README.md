# Dwarkesh × Reiner Pope: LLM 추론의 경제학

**목적**: Dwarkesh Patel x Reiner Pope 인터뷰(`xmkSf5IS-zw`) "How GPT, Claude, and Gemini are actually trained and served" 의 모든 기술적 내용을 비전문가도 따라갈 수 있게 풀어낸 self-hosted 학습 페이지.

이 영상은 LLM의 학습/서빙을 *물리법칙과 경제학*의 관점에서 다룹니다. 트랜스포머가 어떻게 작동하는지(예: attention 메커니즘의 디테일)가 아니라, **트랜스포머가 작동한다고 할 때 왜 회사들이 지금 같은 결정(batch size, MoE, pipeline 구조, 컨텍스트 길이, 가격)을 내리는가**가 주제입니다.

## 사용 방법

`index.html`을 브라우저에서 열기. 다른 의존성 없음 (`file://`로도 동작).

## 커리큘럼 설계

영상은 7개 챕터(약 2시간)지만, 비전문가가 따라가려면 추가 scaffolding이 필요합니다. 따라서 13개 모듈로 재구성:

| # | 모듈 | 영상 어느 부분과 매핑 |
|---|------|---------------------|
| 0 | Prologue: 이 영상이 진짜 다루는 것 | 전체 |
| 1 | LLM 추론의 기본 풍경 | 사전지식 (영상 외) |
| 2 | 두 개의 시계: Compute vs Memory | Ch.1 도입 |
| 3 | Batch 의 마법 | Ch.1 핵심 |
| 4 | 마법의 숫자 300 | Ch.1 후반 |
| 5 | Mixture of Experts | Ch.2 도입 |
| 6 | GPU 랙과 두 종류의 네트워크 | Ch.2 |
| 7 | Pipeline Parallelism | Ch.3 |
| 8 | KV Cache: 모델의 단기 기억 | 횡단 개념 |
| 9 | "Pipelining is not wise" 의 의미 | Ch.4 |
| 10 | Chinchilla 와 100배 오버트레이닝 | Ch.5 |
| 11 | Long Context 의 경제학 | Ch.6 |
| 12 | 종합 | 전체 |

## 난이도 조절 전략

1. **인라인 본문**: 누구나 읽을 수 있는 평이한 한국어 + 비유.
2. **Hover 툴팁**: 영어 기술 용어/표현에 점선 밑줄. 마우스 올리면 1-2문장 정의.
3. **"더 자세히" 접기**: 수식의 derivation, 세부 숫자, 부연.
4. **SVG 도식**: 공간/구조 개념은 그림이 더 빠름 (랙 배치, MoE 흐름, 비용 곡선).
5. **모듈 끝 퀴즈**: 2-3문항. 헷갈리기 쉬운 곳을 짚음.
6. **사이드바 글로서리**: 어디서든 클릭으로 정의 호출.

## 파일

- `index.html`: 페이지 구조 + 콘텐츠 (한국어 본문)
- `styles.css`: 시각 디자인
- `app.js`: 툴팁/퀴즈/진행률/네비게이션 인터랙션
- `data.js`: 글로서리 사전, 퀴즈 데이터

## 빌드/실행

빌드 단계 없음. 정적 파일. 그냥 `index.html` 더블클릭.
