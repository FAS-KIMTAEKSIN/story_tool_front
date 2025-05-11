# 📚 Story Tool Frontend

**고전 스토리 생성 툴**은 사용자의 입력을 바탕으로 고전 문학 스타일의 이야기를 생성하고,  
유사한 고전 문단을 검색 및 분석해주는 **AI 기반 웹 애플리케이션**입니다.  
이 프로젝트의 프론트엔드는 **React로 구현**되었으며, 사용자 친화적인 인터페이스와 상태 관리를 중심으로 설계되었습니다.

> 🟢 **배포 주소**: [스토리생성툴로 이동하기](http://202.86.11.19:8012/)

---

## 🧾 프로젝트 개요

- **AI 기반 고전 스타일 이야기 생성**
- **유사 고전 문단 추천 및 분석 기능**
- **React + Zustand 기반 상태관리 및 API 연동**
- **실시간 스트리밍 응답 처리**
- **다크/라이트 테마 시스템 내장**

---

## 🏗️ 시스템 아키텍처

![System Architecture](https://github.com/user-attachments/assets/81e1ab36-6577-4b4b-9098-90a2e37ab80a)

- **Presentation Layer**: UI 컴포넌트, 테마 시스템
- **Application Layer**: API Client Layer, Zustand 상태 관리
- **Infrastructure Layer**: Backend API, Browser LocalStorage

---

## 🔄 분석 흐름 (Sequence Diagram)

![Sequence Diagram](https://github.com/user-attachments/assets/f847cc28-1be1-44bf-bbcb-017727707e69)

- 사용자가 유사 스토리를 클릭하면:
  1. 선택된 스토리와 함께 API 요청 (`POST /api/analyze`)
  2. 분석 결과 수신
  3. 분석 데이터를 상태에 저장 및 모달로 표시

---

## 🚀 콘텐츠 스트리밍 및 처리 흐름

![Streaming Flow](https://github.com/user-attachments/assets/be500257-ed98-4b03-b33a-95c18f751102)

- API 응답을 스트리밍 방식으로 수신
- 각 청크를 분석하여:
  - 콘텐츠 여부 확인 → Zustand Store에 추가
  - 메타데이터 처리 → ID 매핑
- 스트리밍 완료 시, 유사 문단 및 추천 콘텐츠 요청 후 UI 업데이트 완료

---

## 🔧 기술 스택 및 주요 구성

| 기술/도구 | 설명 |
|-----------|------|
| React | 프론트엔드 프레임워크 |
| Zustand | 전역 상태 관리 라이브러리 |
| Fetch API (Streaming) | AI 응답 실시간 처리 |
| AbortController | 생성 중단 처리 |
| LocalStorage | 히스토리 및 세션 정보 저장 |
| OpenAI GPT | 스토리 생성 및 문단 분석 |

---

## 🔑 주요 기능 요약

- **스토리 생성**: 사용자 프롬프트 기반 생성
- **추천 기능**: 유사한 고전 문장 자동 추천
- **분석 기능**: 고전 문장의 구조적 요소 분석
- **중단 기능**: 생성 중 실시간 취소
- **다크/라이트 테마 전환**
- **대화 히스토리 저장 및 불러오기**

---

## 📁 주요 소스 경로

| 파일 | 역할 |
|------|------|
| `src/pages/main/MobileMain.jsx` | 주요 인터랙션 로직 |
| `src/api/retrieveClassicalLiterature.js` | 스토리 생성/분석 API 함수 |
| `components/main/TagFilters.jsx` | 태그 필터 UI |
| `store/useRetrieveClassicLiteratureStore.js` | 상태 저장 및 조작 |

---

## 🏛️ 개발 목적

> 본 프로젝트는 고전 문학을 현대적인 인터페이스를 통해 체험하고  
> 창작 및 교육용으로 활용할 수 있도록 설계되었습니다.

---

