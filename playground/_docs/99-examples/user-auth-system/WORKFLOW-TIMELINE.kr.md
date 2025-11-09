# 프로젝트 워크플로우 타임라인 - 사용자 인증 시스템

이 문서는 프로젝트 생명주기 전반에 걸친 **완전한 문서 생성 및 업데이트 타임라인**을 보여줍니다.

## 📅 타임라인 개요

```
1주차: 요구사항 & 디자인
2주차: 계획 & 아키텍처
3주차: API 디자인 & 백엔드 설정
4-5주차: 백엔드 개발
6주차: 프론트엔드 개발
7주차: 테스트
8주차: 배포 & 런칭
```

---

## 1주차: 요구사항 & 디자인

### 1일차 (월요일) - 프로젝트 킥오프

**오전: 초기 요구사항**
- 📝 **생성**: `01-requirements/01-project-overview.md`
- 🤖 **Claude 프롬프트**: "사용자 인증 시스템을 구축합니다. 목표, 범위, 성공 기준을 포괄하는 종합적인 프로젝트 개요를 만들어주세요."

**오후: 기능 요구사항**
- 📝 **생성**: `01-requirements/02-functional-requirements.md`
- 🤖 **Claude 프롬프트**: "이 프로젝트 개요를 바탕으로 사용자 등록, 로그인, 비밀번호 재설정, 역할 관리에 대한 상세한 기능 요구사항을 정의해주세요."

### 2일차 (화요일) - 디자인 시스템 계획

**오전: 디자인 시스템 기반**
- 📝 **생성**: `02-design/01-design-system/colors-typography.md`
- 🤖 **Claude 프롬프트**: "인증 UI를 위한 디자인 시스템을 만들어주세요. 색상 팔레트(다크 모드 포함), 타이포그래피 스케일, 간격 시스템이 필요하며 Tailwind 컨벤션을 따라주세요."

**오후: 컴포넌트 구조**
- 📝 **생성**: `02-design/02-ui-components/element-component-structure.md`
- 🤖 **Claude 프롬프트**: "인증 UI를 위한 컴포넌트 계층 구조를 정의해주세요: atoms (버튼, 입력), molecules (폼 필드), organisms (로그인 폼), templates, pages. shadcn/ui 컨벤션을 사용하세요."

### 3일차 (수요일) - UI 컴포넌트 라이브러리

**오전: 컴포넌트 명세**
- 📝 **생성**: `02-design/02-ui-components/component-library.md`
- 🤖 **Claude 프롬프트**: "인증 UI 컴포넌트에 대한 상세 명세를 만들어주세요: LoginForm, SignupForm, PasswordResetForm, RoleSelector. props, 상태, variants, 접근성 요구사항을 포함해주세요."

**오후: 와이어프레임**
- 📝 **생성**: `02-design/03-wireframes/auth-flows.md`
- 🤖 **Claude 프롬프트**: "인증 사용자 플로우를 디자인해주세요: 등록 → 이메일 인증 → 로그인 → 2FA → 대시보드. 에러 상태와 엣지 케이스를 포함해주세요."

### 4일차 (목요일) - 비기능 요구사항

**종일: 기술 요구사항**
- 📝 **생성**: `01-requirements/03-non-functional-requirements.md`
- 🤖 **Claude 프롬프트**: "프로덕션 인증 시스템을 위한 비기능 요구사항을 정의해주세요: 성능(응답 시간), 보안(OWASP 준수), 확장성(동시 사용자), 가용성(가동 시간)."

### 5일차 (금요일) - 계획 & 데이터 모델링

**오전: 로드맵**
- 📝 **생성**: `03-planning/01-roadmap.md`
- 🤖 **Claude 프롬프트**: "이 인증 시스템 구현을 위한 3개 스프린트 로드맵을 만들어주세요. 스프린트 1: 기본 인증, 스프린트 2: RBAC, 스프린트 3: 고급 기능(2FA, OAuth)."

**오후: 데이터 모델**
- 📝 **생성**: `03-planning/02-features/data-models.md`
- 🤖 **Claude 프롬프트**: "PostgreSQL용 데이터 모델을 디자인해주세요: User, Role, Permission, Session, RefreshToken. 관계, 제약조건, 인덱스를 포함해주세요."

---

## 2주차: 아키텍처 & 계획

### 6일차 (월요일) - 시스템 아키텍처

**오전: 아키텍처 디자인**
- 📝 **생성**: `04-architecture/01-system-architecture.md`
- 🤖 **Claude 프롬프트**: "Next.js + GraphQL 인증 시스템을 위한 시스템 아키텍처를 설계해주세요. 클라이언트, API 게이트웨이, GraphQL 서버, 데이터베이스, 캐싱 레이어를 포함해주세요."

**오후: 데이터베이스 스키마**
- 📝 **생성**: `04-architecture/02-database-schema.md`
- 🤖 **Claude 프롬프트**: "정의한 데이터 모델에 대한 PostgreSQL 스키마를 생성해주세요. 적절한 타입, 제약조건, 외래 키, 인덱스가 있는 CREATE TABLE 문을 포함해주세요. 마이그레이션 전략을 추가해주세요."

### 7일차 (화요일) - 보안 아키텍처

**종일: 보안 디자인**
- 📝 **생성**: `04-architecture/03-security-architecture.md`
- 🤖 **Claude 프롬프트**: "포괄적인 보안 아키텍처를 설계해주세요: JWT 구현, refresh token rotation, 비밀번호 해싱(bcrypt), 속도 제한, CSRF 보호, XSS 방지, 보안 헤더."

### 8일차 (수요일) - 사용자 스토리

**종일: 사용자 스토리 생성**
- 📝 **생성**: `03-planning/03-user-stories/auth-user-stories.md`
- 🤖 **Claude 프롬프트**: "인수 기준이 있는 상세한 사용자 스토리를 만들어주세요: 사용자 등록, 이메일 인증, JWT를 사용한 로그인, 비밀번호 재설정, 역할 할당, 권한 확인."

### 9일차 (목요일) - API 디자인

**오전: GraphQL 스키마 디자인**
- 📝 **생성**: `05-api/01-graphql-schema.md`
- 🤖 **Claude 프롬프트**: "인증 API를 위한 GraphQL 스키마를 설계해주세요. User, Role, Permission 타입과 register, login, logout, refreshToken, resetPassword에 대한 mutation을 포함해주세요."

**오후: 타입 정의**
- 📝 **생성**: `05-api/typedefs/user-types.graphql`
- 📝 **생성**: `05-api/typedefs/auth-types.graphql`
- 🤖 **Claude 프롬프트**: "사용자 관리와 인증 작업을 위한 GraphQL 타입 정의를 생성해주세요. 도메인 중심 네이밍을 따라주세요: authUserRegister, authUserLogin 등."

### 10일차 (금요일) - Resolver 명세

**종일: API 명세**
- 📝 **생성**: `05-api/resolvers/auth-resolvers-spec.md`
- 🤖 **Claude 프롬프트**: "각 GraphQL mutation과 query에 대한 상세한 resolver 명세를 만들어주세요. 입력 검증, 비즈니스 로직 플로우, 데이터베이스 작업, 에러 처리를 포함해주세요."

---

## 3주차: 백엔드 개발 설정

### 11일차 (월요일) - 코딩 컨벤션

**오전: 표준 문서화**
- 📝 **생성**: `06-development/00-coding-conventions.md`
- 🤖 **Claude 프롬프트**: "이 프로젝트를 위한 TypeScript 코딩 컨벤션을 만들어주세요: 파일 구조, 네이밍 패턴, 에러 처리, 로깅, 주석, GraphQL resolver 패턴."

**오후: 백엔드 설정**
- 📝 **생성**: `06-development/backend/01-setup.md`
- 🤖 **Claude 프롬프트**: "단계별 백엔드 설정 가이드를 만들어주세요: Node.js/TypeScript 프로젝트 초기화, Apollo Server 설정, Prisma를 사용한 PostgreSQL 연결, JWT 미들웨어, 환경 구성."

### 12일차 (화요일) - 데이터베이스 구현

**종일: 데이터베이스 설정**
- 📝 **생성**: `06-development/backend/code-examples/prisma-schema.md`
- 🤖 **Claude 프롬프트**: "데이터베이스 디자인과 일치하는 Prisma 스키마 파일을 생성해주세요. 적절한 관계와 인덱스가 있는 모든 모델을 포함해주세요: User, Role, Permission, Session, RefreshToken."

### 13일차 (수요일) - 인증 구현

**종일: 인증 코드**
- 📝 **생성**: `06-development/backend/02-implementation.md`
- 🤖 **Claude 프롬프트**: "명세를 바탕으로 인증 resolver를 구현해주세요. 이메일 검증이 있는 사용자 등록, JWT 생성이 있는 로그인, refresh token rotation, 비밀번호 재설정 플로우에 대한 코드를 생성해주세요. TypeScript 모범 사례를 사용하세요."

**업데이트**:
- 📝 **업데이트**: `05-api/resolvers/auth-resolvers-spec.md` (구현 노트 추가)

---

## 4-5주차: 백엔드 개발 & 테스트

### 16-18일차 (월-수) - 백엔드 기능

**지속적 개발**
- 📝 **업데이트**: `06-development/backend/02-implementation.md` (진행 중)
- 🤖 **Claude 프롬프트**:
  - "토큰 생성이 있는 이메일 인증 추가"
  - "안전한 토큰이 있는 비밀번호 재설정 구현"
  - "무차별 대입 공격 방지를 위한 속도 제한 추가"

### 19-20일차 (목-금) - 백엔드 테스트

**테스트 구현**
- 📝 **생성**: `07-testing/test-cases/auth-test-cases.md`
- 📝 **생성**: `07-testing/test-code/backend-tests.md`
- 🤖 **Claude 프롬프트**: "모든 인증 mutation과 query에 대한 포괄적인 테스트 케이스와 Jest 테스트 코드를 생성해주세요. 정상 경로, 에러 케이스, 엣지 케이스를 포함해주세요."

---

## 6주차: 프론트엔드 개발

### 21일차 (월요일) - 프론트엔드 설정

**종일: Next.js 설정**
- 📝 **생성**: `06-development/frontend/01-setup.md`
- 🤖 **Claude 프롬프트**: "Next.js 15 프로젝트 설정 가이드를 만들어주세요: App Router 구조, TypeScript 구성, Tailwind CSS 설정, shadcn/ui 설치, GraphQL 클라이언트(Apollo Client) 설정."

### 22일차 (화요일) - 컴포넌트 구조

**종일: 프론트엔드 아키텍처**
- 📝 **생성**: `06-development/frontend/02-component-structure.md`
- 🤖 **Claude 프롬프트**: "atomic design을 따르는 프론트엔드 컴포넌트 구조를 설계해주세요: atoms (button, input, label), molecules (form-field, password-input), organisms (login-form, signup-form), templates (auth-layout), pages (login, signup)."

### 23일차 (수요일) - 디자인 시스템 구현

**종일: 컴포넌트 라이브러리**
- 📝 **생성**: `06-development/frontend/code-examples/design-system-components.md`
- 🤖 **Claude 프롬프트**: "인증을 위한 shadcn/ui 커스터마이즈 컴포넌트를 생성해주세요: Button, Input, Label, Card, Alert. 디자인 시스템 토큰(색상, 간격, 타이포그래피)을 적용해주세요."

### 24일차 (목요일) - 인증 UI 구현

**종일: UI 개발**
- 📝 **생성**: `06-development/frontend/03-implementation.md`
- 🤖 **Claude 프롬프트**: "Next.js 15 App Router와 컴포넌트 라이브러리를 사용하여 인증 페이지를 구현해주세요: /login, /signup, /reset-password, /verify-email. react-hook-form과 Zod를 사용한 클라이언트 측 검증을 포함해주세요."

### 25일차 (금요일) - 상태 관리

**종일: 인증 상태**
- 📝 **업데이트**: `06-development/frontend/03-implementation.md` (인증 컨텍스트 섹션)
- 🤖 **Claude 프롬프트**: "인증 상태 관리를 구현해주세요: React Context API를 사용한 AuthContext, 토큰 저장(httpOnly cookies), 자동 토큰 갱신, protected route 컴포넌트, 역할 기반 UI 렌더링."

---

## 7주차: 테스트 & 배포 준비

### 31-32일차 (월-화) - 통합 테스트

**종단 간 테스트**
- 📝 **업데이트**: `07-testing/01-test-strategy.md` (통합 테스트 섹션)
- 🤖 **Claude 프롬프트**: "완전한 인증 플로우를 포괄하는 통합 테스트 시나리오를 만들어주세요: 새 사용자 가입 → 이메일 인증 → 로그인 → 보호된 리소스 접근 → 로그아웃."

### 33일차 (수요일) - 배포 계획

**배포 전략**
- 📝 **생성**: `08-deployment/01-deployment-guide.md`
- 🤖 **Claude 프롬프트**: "Next.js + GraphQL 인증 시스템을 위한 배포 가이드를 만들어주세요: Docker 컨테이너화, PostgreSQL 설정, 환경 변수, SSL/TLS 구성, 프로덕션 서버로의 배포."

### 34일차 (목요일) - 환경 구성

**환경 설정**
- 📝 **생성**: `08-deployment/02-environment-setup.md`
- 🤖 **Claude 프롬프트**: "dev, staging, production을 위한 환경 구성을 문서화해주세요: 필수 환경 변수, 데이터베이스 연결 문자열, JWT 비밀키, 이메일 서비스 구성, CORS 설정."

---

## 8주차: 배포 & 런칭

### 36일차 (월요일) - 스테이징 배포

**스테이징 환경**
- 🚀 **작업**: 스테이징에 배포
- 📝 **업데이트**: `08-deployment/01-deployment-guide.md` (배포 로그)

### 37일차 (화요일) - 보안 감사

**보안 검토**
- 📝 **생성**: `09-operations/03-security-audit.md`
- 🤖 **Claude 프롬프트**: "OWASP Top 10에 대해 구현을 검토하고 인증 시스템을 위한 보안 감사 체크리스트를 만들어주세요."

### 39일차 (목요일) - 프로덕션 배포

**런칭**
- 🚀 **작업**: 프로덕션에 배포
- 📝 **생성**: `09-operations/04-launch-checklist.md`

---

## 📊 문서 통계

### 단계별 생성된 문서

| 단계 | 생성된 문서 | 업데이트된 문서 | 합계 |
|------|----------|--------------|------|
| 요구사항 | 3 | 0 | 3 |
| 디자인 | 5 | 1 | 6 |
| 계획 | 3 | 0 | 3 |
| 아키텍처 | 3 | 0 | 3 |
| API 디자인 | 5 | 2 | 7 |
| 개발 | 8 | 5 | 13 |
| 테스트 | 6 | 2 | 8 |
| 배포 | 2 | 1 | 3 |
| 운영 | 5 | 0 | 5 |
| **합계** | **40** | **11** | **51** |

### Claude Code 사용 패턴

**가장 효과적인 Claude 프롬프트**:
1. **아키텍처 디자인** - Claude는 시스템 설계와 모범 사례에서 탁월함
2. **코드 생성** - 보일러플레이트와 표준 패턴에 매우 효과적
3. **테스트 케이스 생성** - 엣지 케이스 식별에 탁월함
4. **문서 검토** - 불일치 발견에 뛰어남

**Claude가 가이드가 필요했던 경우**:
1. **비즈니스 로직** - 명확한 비즈니스 규칙 문서 필요
2. **UI/UX 결정** - 먼저 디자인 시스템 문서 필요
3. **보안 선택** - 사전에 보안 요구사항 필요

---

## 🔄 문서 진화 패턴

### 패턴 1: 명세 → 구현 → 업데이트

예제: `05-api/resolvers/auth-resolvers-spec.md`
1. **10일차**: 이론적 resolver 명세로 생성
2. **13일차**: 실제 구현 노트로 업데이트
3. **19일차**: 테스트 중 발견된 엣지 케이스로 업데이트

### 패턴 2: 상위 레벨 → 상세

예제: `04-architecture/02-database-schema.md`
1. **6일차**: 엔티티 관계로 생성
2. **12일차**: Prisma 스키마로 상세화
3. **18일차**: 쿼리 기반 인덱스로 최적화

---

## 💡 주요 교훈

### 문서화 모범 사례

1. **Why로 시작**: 어떻게보다 먼저 요구사항 문서화
2. **진행하면서 업데이트**: 끝까지 기다리지 말 것
3. **모든 것을 링크**: 관련 문서 상호 참조
4. **실제로 유지**: 이론이 아닌 실제 예제 사용

### Claude Code 모범 사례

1. **컨텍스트 우선**: 코드를 요청하기 전에 Claude에게 전체 그림 제공
2. **반복**: 명세로 시작, 코드 생성, 개선
3. **구체적으로**: 정확한 문서와 섹션 참조
4. **검증**: 요구사항에 대해 Claude의 결과물 항상 검토

---

## 📚 다음 단계

런칭 후, 문서는 계속됩니다:

**9주차+: 유지보수 단계**
- 실제 지표로 `09-operations/01-monitoring.md` 업데이트
- 지원 티켓을 기반으로 `09-operations/06-common-issues.md` 생성
- 회귀 테스트 케이스로 `07-testing/test-cases/` 확장
- 기능 요청으로 `03-planning/01-roadmap.md` 업데이트

**지속적 개선**
- 월간 문서 감사
- 분기별 아키텍처 검토
- 지속적인 사용자 스토리 추가
- 정기적인 보안 업데이트

---

**관련 문서**:
- [메인 README](./README.kr.md)
- [Claude Best Practices](./CLAUDE-BEST-PRACTICES.kr.md)
- [요구사항 단계 가이드](./01-requirements/workflow-guide.md)
