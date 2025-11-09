# 📚 완전한 문서 시스템 가이드

**프로젝트**: ${PROJECT_NAME}
**최종 업데이트**: 2024-10-19
**버전**: 2.0

## 🎯 개요

이것은 클라이언트, 디자이너, 제품 관리자, 개발자, QA 및 운영팀 간의 지속적인 협업을 위해 설계된 포괄적이고 워크플로우 중심의 문서 시스템입니다.

> **참고**: 이 문서는 요약 버전입니다. 전체 내용은 [README.kr.md](./README.kr.md)를 참조하세요.

## 📂 10개 카테고리 문서 구조

### 01. 요구사항 - 무엇을 만들 것인가
**소유자**: 제품 관리자, 클라이언트
**업데이트 빈도**: 요구사항 변경 시

**주요 문서**:
- `01-project-overview.md` - 상위 수준 프로젝트 비전
- `02-functional-requirements.md` - 기능 요구사항
- `03-non-functional-requirements.md` - 성능, 보안, 확장성
- `04-business-requirements.md` - 비즈니스 목표 및 KPI
- `05-constraints.md` - 제한사항 및 제약조건

**템플릿**:
- `requirement-template.md` - 표준 요구사항 형식
- `feature-request-template.md` - 새 기능 요청
- `change-request-template.md` - 요구사항 변경

### 02. 디자인 - 어떻게 보일 것인가
**소유자**: 디자인팀
**업데이트 빈도**: 디자인 반복 중

**구조**:
```
02-design/
├── 01-design-system/          # 디자인 원칙, 토큰, 가이드라인
├── 02-ui-components/          # 재사용 가능한 컴포넌트 라이브러리
├── 03-mockups/                # 화면 및 프로토타입
├── 04-specifications/         # 상세 디자인 명세
└── assets/                    # 이미지, 아이콘, 폰트
```

### 03. 기획 - 어떻게 만들 것인가
**소유자**: 제품 관리자, 테크리드
**업데이트 빈도**: 주간/스프린트 기준

**구조**:
```
03-planning/
├── 01-roadmap.md              # 제품 타임라인
├── 02-features/               # 기능 명세
├── 03-user-stories/           # 사용자 중심 요구사항
├── 04-sprints/                # 스프린트 계획
└── 05-backlog/                # 우선순위화된 백로그
```

### 04. 아키텍처 - 기술적 기반
**소유자**: 테크리드, 시니어 개발자
**업데이트 빈도**: 아키텍처 변경 시

**구조**:
```
04-architecture/
├── 01-system-architecture.md  # 시스템 디자인 개요
├── 02-database-schema.md      # 데이터 모델
├── 03-technology-stack.md     # 기술 결정
├── 04-security-architecture.md # 보안 디자인
├── diagrams/                  # 아키텍처 다이어그램
└── decisions/                 # ADR (아키텍처 결정 기록)
```

### 05. API - 서비스 간 계약
**소유자**: 백엔드 개발자
**업데이트 빈도**: 모든 API 변경 시

**구조**:
```
05-api/
├── graphql/                   # GraphQL 스키마 및 쿼리
├── rest/                      # REST 엔드포인트
├── auth/                      # 인증/인가
└── examples/                  # 요청/응답 예제
```

### 06. 개발 - 구현 가이드
**소유자**: 개발팀
**업데이트 빈도**: 지속적

**구조**:
```
06-development/
├── 01-getting-started.md      # 개발 환경 설정
├── 02-coding-standards.md     # 코드 규칙
├── 03-development-workflow.md # 일일 워크플로우
├── 04-best-practices/         # 배운 교훈
├── 05-implementation-notes/   # 기술 노트
└── 06-code-review/            # 검토 가이드라인
```

### 07. 테스팅 - 품질 보증
**소유자**: QA팀, 개발자
**업데이트 빈도**: 기능/스프린트마다

**구조**:
```
07-testing/
├── 01-testing-strategy.md     # 전체 QA 접근 방식
├── 02-test-cases/             # 수동 테스트 시나리오
├── 03-automated-tests/        # 테스트 자동화
├── 04-performance/            # 부하 및 성능 테스트
└── 05-security/               # 보안 테스팅
```

### 08. 배포 - 라이브로 가기
**소유자**: DevOps, 테크리드
**업데이트 빈도**: 배포 프로세스 변경 시

**구조**:
```
08-deployment/
├── 01-deployment-guide.md     # 배포 방법
├── 02-infrastructure.md       # 서버 설정
├── 03-cicd/                   # 파이프라인 설정
├── 04-changelog.md            # 릴리스 노트
└── 05-environments/           # 환경별 설정
```

### 09. 운영 - 프로덕션에서 실행
**소유자**: DevOps, 운영팀
**업데이트 빈도**: 지속적

**구조**:
```
09-operations/
├── 01-incidents/              # 인시던트 보고서
├── 02-monitoring.md           # 모니터링 설정
├── 03-runbooks/               # 운영 절차
└── 04-backups/                # 백업/복구 절차
```

### 10. 협업 - 팀 커뮤니케이션
**소유자**: 모든 팀원
**업데이트 빈도**: 지속적

**구조**:
```
10-collaboration/
├── 01-communication/          # 커뮤니케이션 채널
├── 02-design-handoff.md       # 디자인 → 개발 프로세스
├── 03-change-requests/        # 변경 요청 프로세스
├── 04-status-reports/         # 진행 상황 업데이트
├── 05-bug-reports/            # 버그 추적
├── 06-meeting-notes/          # 회의 문서화
├── 07-onboarding/             # 신규 멤버 온보딩
├── 08-decisions/              # 의사결정 로그
└── 09-faqs.md                 # 자주 묻는 질문
```

## 🔄 워크플로우 통합

### 1. 요구사항 → 디자인
```
클라이언트 요청 → PM 문서화 → 디자인 검토 → 디자인 생성
```

**업데이트되는 문서**:
- `01-requirements/` (요구사항 명세)
- `02-design/03-mockups/` (디자인 파일)

**주요 프로세스**: [디자인 핸드오프](./10-collaboration/02-design-handoff.kr.md)

### 2. 디자인 → 개발
```
디자인 완료 → 디자인 핸드오프 → 개발 → 디자인 검토
```

**업데이트되는 문서**:
- `02-design/04-specifications/` (디자인 명세)
- `06-development/05-implementation-notes/` (개발 노트)
- `05-api/` (API 문서)

### 3. 개발 → 테스팅
```
개발 완료 → QA 검토 → 버그 리포트 → 수정 → 재테스트
```

**업데이트되는 문서**:
- `07-testing/02-test-cases/` (테스트 시나리오)
- `10-collaboration/05-bug-reports/` (버그)

### 4. 테스팅 → 배포
```
QA 승인 → 스테이징 배포 → 검증 → 프로덕션 배포
```

**업데이트되는 문서**:
- `08-deployment/04-changelog.md` (릴리스 노트)
- `09-operations/02-monitoring.md` (모니터링)

## 🤝 팀 커뮤니케이션 모범 사례

자세한 팀 커뮤니케이션 가이드라인은 [README.kr.md](./README.kr.md#-팀-협업-모범-사례)를 참조하세요.

## 📝 필수 템플릿

| 템플릿 | 위치 | 사용 시점 |
|----------|----------|-------------|
| 요구사항 | `01-requirements/templates/requirement-template.kr.md` | 새 요구사항 |
| 사용자 스토리 | `03-planning/03-user-stories/user-story-template.md` | 새 기능 |
| 디자인 명세 | `02-design/04-specifications/design-spec-template.md` | 디자인 핸드오프 |
| API 문서 | `05-api/api-doc-template.md` | 새 API 엔드포인트 |
| 테스트 케이스 | `07-testing/02-test-cases/test-case-template.md` | 새 테스트 시나리오 |
| 버그 리포트 | `10-collaboration/05-bug-reports/bug-report-template.md` | 버그 발견 시 |
| 회의록 | `10-collaboration/06-meeting-notes/meeting-notes-template.md` | 회의 후 |
| 변경 요청 | `10-collaboration/03-change-requests/change-request-template.md` | 범위 변경 |

## 🎓 추천 도구

### 커뮤니케이션
- **Slack/Microsoft Teams**: 실시간 채팅
- **Zoom/Google Meet**: 화상 통화
- **Loom**: 비동기 비디오 업데이트

### 프로젝트 관리
- **Jira**: 엔터프라이즈팀
- **Linear**: 현대적인 애자일팀
- **Notion**: 유연한 워크스페이스
- **Asana**: 간단한 프로젝트 추적

### 디자인
- **Figma**: 주 디자인 도구 (협업)
- **Adobe XD**: 대안 디자인 도구
- **Zeplin/Avocode**: 디자인 핸드오프
- **InVision**: 프로토타이핑

### 개발
- **GitHub/GitLab**: 코드 저장소
- **VS Code**: 코드 에디터
- **Storybook**: 컴포넌트 개발
- **Postman**: API 테스팅

## 🚀 시작하기

### 신규 팀원용

**1주차: 오리엔테이션**
1. [프로젝트 개요](./01-requirements/01-project-overview.md) 읽기
2. [로드맵](./03-planning/01-roadmap.md) 검토
3. [아키텍처](./04-architecture/01-system-architecture.md) 이해
4. [개발 환경](./06-development/01-getting-started.kr.md) 설정

**2주차: 역할별**
- **개발자**: 코딩 표준 읽기, 최근 PR 검토
- **디자이너**: 디자인 시스템, UI 컴포넌트 검토
- **QA**: 테스팅 전략, 테스트 케이스 연구
- **PM**: 백로그, 사용자 스토리 검토

**3주차: 기여**
1. 백로그에서 첫 작업 선택
2. 관련 워크플로우 따르기
3. 배운 내용 문서화
4. 코드/디자인 검토 받기

## 📅 유지보수 일정

### 일일
- 코드 변경과 함께 API 문서 업데이트
- 의사결정 로그 기록
- 구현 노트 업데이트

### 주간
- 문서 PR 검토 및 병합
- 스프린트 문서 업데이트
- 깨진 링크 확인

### 월간
- 문서 메트릭 검토
- 오래된 문서 아카이빙
- 외부 링크 업데이트

### 분기
- 포괄적인 문서 감사
- 아키텍처 다이어그램 업데이트
- 프로세스 검토 및 개선

## 🔗 관련 문서

- **[README.kr.md](./README.kr.md)** - 메인 문서 허브
- **[QUICK-START.kr.md](./QUICK-START.kr.md)** - 빠른 시작 가이드
- **[KOREAN-TRANSLATION-STATUS.md](./KOREAN-TRANSLATION-STATUS.md)** - 한글 번역 상태

## 🆘 지원

### 문서 질문
- **채널**: `#documentation`
- **소유자**: ${GITHUB_USER}
- **응답 시간**: 24시간 이내

### 프로세스 개선
- **제출**: 문서 개선 이슈
- **논의**: 팀 회고에서
- **구현**: 문서 PR을 통해

---

**이것은 살아있는 문서입니다. 풀 리퀘스트를 통해 개선사항을 기여하세요.**

**최종 업데이트**: 2024-10-19
**버전**: 2.0
**다음 검토**: 2025-01-19

> 📌 **참고**: 이 문서는 요약 버전입니다. 
> 전체 영어 버전은 `DOCUMENTATION-GUIDE.md`를 참조하세요.
> 더 자세한 한글 내용은 `README.kr.md`를 참조하세요.
