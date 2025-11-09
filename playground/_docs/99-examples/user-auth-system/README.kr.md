# 사용자 인증 & 권한 관리 시스템 - 완전한 워크플로우 예제

모든 단계에서 **Claude Code** 지원에 최적화된 문서화 워크플로우를 따라 사용자 인증 & 권한 관리 시스템을 구축하는 완전하고 실제적인 예제입니다.

## 🎯 프로젝트 개요

**프로젝트 이름**: 사용자 인증 & 권한 관리 시스템
**기술 스택**:
- **데이터베이스**: PostgreSQL
- **백엔드**: TypeScript + GraphQL (Apollo Server)
- **프론트엔드**: Next.js 15 + shadcn/ui + Tailwind CSS
- **인증**: JWT + Refresh Tokens
- **권한 관리**: 역할 기반 접근 제어 (RBAC)

## 📋 이 예제가 보여주는 것

이 예제는 다음을 보여줍니다:
1. **요구사항부터 운영까지** 완전한 문서화 워크플로우
2. 프로젝트가 진행되면서 **문서가 어떻게 진화**하는지
3. 각 워크플로우 단계에서의 **Claude Code 통합**
4. Claude와 작업하기 위한 **실용적인 프롬프트**
5. TypeScript, GraphQL, Next.js를 위한 **실제 코드 예제**

## 🔄 워크플로우 단계

### 1단계: 요구사항 분석 (1주차)
**생성된 문서**:
- `01-requirements/01-project-overview.md`
- `01-requirements/02-functional-requirements.md`
- `01-requirements/03-non-functional-requirements.md`

**Claude Code 활용**: 요구사항 수집, 사용자 스토리 생성, 인수 기준 정의

### 2단계: 디자인 (1-2주차)
**생성된 문서**:
- `02-design/01-design-system/colors-typography.md`
- `02-design/02-ui-components/component-library.md`
- `02-design/03-wireframes/auth-flows.md`

**Claude Code 활용**: 디자인 시스템 설정, 컴포넌트 구조 계획, 접근성 가이드라인

### 3단계: 계획 (2주차)
**생성된 문서**:
- `03-planning/01-roadmap.md`
- `03-planning/02-features/data-models.md`
- `03-planning/03-user-stories/auth-user-stories.md`

**Claude Code 활용**: 스프린트 계획, 데이터 모델링, 사용자 스토리 분해

### 4단계: 아키텍처 (2-3주차)
**생성된 문서**:
- `04-architecture/01-system-architecture.md`
- `04-architecture/02-database-schema.md`
- `04-architecture/03-security-architecture.md`

**Claude Code 활용**: 아키텍처 설계, 데이터베이스 스키마 생성, 보안 모범 사례

### 5단계: API 디자인 (3주차)
**생성된 문서**:
- `05-api/01-graphql-schema.md`
- `05-api/typedefs/user-types.graphql`
- `05-api/resolvers/auth-resolvers-spec.md`

**Claude Code 활용**: GraphQL 스키마 설계, 타입 정의, resolver 명세

### 6단계: 개발 (3-6주차)
**생성된 문서**:
- `06-development/backend/01-setup.md`
- `06-development/backend/02-implementation.md`
- `06-development/frontend/01-setup.md`
- `06-development/frontend/02-component-structure.md`
- `06-development/frontend/03-implementation.md`

**Claude Code 활용**: 코드 생성, 구현, 리팩토링, 디버깅

### 7단계: 테스트 (6-7주차)
**생성된 문서**:
- `07-testing/01-test-strategy.md`
- `07-testing/test-cases/auth-test-cases.md`
- `07-testing/test-code/unit-tests.md`

**Claude Code 활용**: 테스트 케이스 생성, 테스트 코드 작성, 커버리지 분석

### 8단계: 배포 (7-8주차)
**생성된 문서**:
- `08-deployment/01-deployment-guide.md`
- `08-deployment/02-environment-setup.md`

**Claude Code 활용**: 배포 스크립트, 환경 구성, CI/CD 설정

### 9단계: 운영 (지속적)
**생성된 문서**:
- `09-operations/01-monitoring.md`
- `09-operations/02-incident-response.md`

**Claude Code 활용**: 모니터링 설정, 로그 분석, 문제 해결

## 🤖 Claude Code 통합 전략

### 핵심 원칙: "문서 우선 개발"

Claude Code는 완전한 컨텍스트가 있을 때 최고의 성능을 발휘합니다. 이 예제는 다음을 보여줍니다:

1. **Claude에게 코딩을 요청하기 전**: 먼저 디자인 문서 생성
2. **Claude에게 컨텍스트 제공**: 기존 문서 참조
3. **Claude와 함께 반복**: 코드가 발전하면서 문서 업데이트
4. **일관성을 위해 Claude 사용**: 컨벤션과 일치하는 코드 생성

### 권장 Claude Code 워크플로우

```
📝 문서 작성/업데이트
    ↓
🤖 Claude에게 문서 검토 요청
    ↓
💡 Claude의 제안/개선사항 받기
    ↓
📝 문서 최종화
    ↓
🤖 Claude에게 문서로부터 코드 생성 요청
    ↓
💻 생성된 코드 검토
    ↓
📝 문서 업데이트 (구현 노트)
    ↓
🔄 반복
```

## 📂 디렉토리 구조

```
99-examples/user-auth-system/
├── README.md (이 파일)
├── WORKFLOW-TIMELINE.md (상세 타임라인)
├── CLAUDE-BEST-PRACTICES.md (Claude Code 팁)
│
├── 00-project-setup/
│   ├── tech-stack-decisions.md
│   └── claude-setup-prompts.md
│
├── 01-requirements/
│   ├── 01-project-overview.md
│   ├── 02-functional-requirements.md
│   ├── 03-non-functional-requirements.md
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
├── 02-design/
│   ├── 01-design-system/
│   │   ├── colors-typography.md
│   │   └── component-tokens.md
│   ├── 02-ui-components/
│   │   ├── component-library.md
│   │   └── element-component-structure.md
│   ├── 03-wireframes/
│   │   └── auth-flows.md
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
├── 03-planning/
│   ├── 01-roadmap.md
│   ├── 02-features/
│   │   └── data-models.md
│   ├── 03-user-stories/
│   │   └── auth-user-stories.md
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
├── 04-architecture/
│   ├── 01-system-architecture.md
│   ├── 02-database-schema.md
│   ├── 03-security-architecture.md
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
├── 05-api/
│   ├── 01-graphql-schema.md
│   ├── typedefs/
│   │   ├── user-types.graphql
│   │   └── auth-types.graphql
│   ├── resolvers/
│   │   └── auth-resolvers-spec.md
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
├── 06-development/
│   ├── 00-coding-conventions.md
│   ├── backend/
│   │   ├── 01-setup.md
│   │   ├── 02-implementation.md
│   │   └── code-examples/
│   ├── frontend/
│   │   ├── 01-setup.md
│   │   ├── 02-component-structure.md
│   │   ├── 03-implementation.md
│   │   └── code-examples/
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
├── 07-testing/
│   ├── 01-test-strategy.md
│   ├── test-cases/
│   │   └── auth-test-cases.md
│   ├── test-code/
│   │   ├── backend-tests.md
│   │   └── frontend-tests.md
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
├── 08-deployment/
│   ├── 01-deployment-guide.md
│   ├── 02-environment-setup.md
│   ├── workflow-guide.md
│   └── claude-prompts.md
│
└── 09-operations/
    ├── 01-monitoring.md
    ├── 02-incident-response.md
    ├── workflow-guide.md
    └── claude-prompts.md
```

## 🎓 이 예제 사용 방법

### 학습용
1. `WORKFLOW-TIMELINE.md`를 읽고 진행 과정 이해
2. 각 단계를 순서대로 따라가기
3. 문서들이 서로 어떻게 참조하는지 확인
4. 초기 결정이 이후 단계에 어떻게 영향을 미치는지 주목

### 자신의 프로젝트용
1. 관련 섹션 복사
2. 구조를 필요에 맞게 조정
3. Claude 프롬프트를 템플릿으로 사용
4. 동일한 워크플로우 따르기

### Claude Code와 함께
1. Claude에게 도움을 요청할 때 이 예제 참조
2. 이렇게 말하기: "99-examples/user-auth-system의 패턴을 따라줘"
3. 제공된 프롬프트를 시작점으로 사용
4. Claude가 문서와 일치하는 코드를 생성하도록 하기

## 📊 주요 지표

이 예제 프로젝트는 다음을 보여줍니다:
- **전체 문서**: 약 50개 파일
- **개발 시간**: 8주 (개발자 1명)
- **Claude Code 지원**: 코드의 약 80%가 Claude에 의해 생성/검토됨
- **문서 유지보수**: 주당 약 2시간
- **코드 품질**: 일관된 패턴, 잘 문서화됨

## 🔗 빠른 네비게이션

- [프로젝트 설정](./00-project-setup/tech-stack-decisions.md)
- [요구사항](./01-requirements/01-project-overview.md)
- [디자인 시스템](./02-design/01-design-system/colors-typography.md)
- [데이터 모델](./03-planning/02-features/data-models.md)
- [데이터베이스 스키마](./04-architecture/02-database-schema.md)
- [GraphQL API](./05-api/01-graphql-schema.md)
- [백엔드 코드](./06-development/backend/01-setup.md)
- [프론트엔드 코드](./06-development/frontend/01-setup.md)
- [테스트](./07-testing/01-test-strategy.md)

## 💡 핵심 교훈

1. **문서가 개발을 주도** - Claude는 좋은 문서로부터 더 나은 코드를 생성
2. **일관성이 중요** - 패턴을 따르면 Claude가 더 효과적
3. **함께 반복** - Claude가 더 나은 접근법을 발견하도록 도우면서 문서 업데이트
4. **컨텍스트가 핵심** - 더 많은 컨텍스트 = 더 나은 Claude 응답
5. **템플릿이 작업을 가속화** - 기능 전반에 걸쳐 패턴 재사용

---

**다음 단계**: [WORKFLOW-TIMELINE.md](./WORKFLOW-TIMELINE.kr.md)를 읽고 이 프로젝트의 일별 진행 과정을 확인하세요.
