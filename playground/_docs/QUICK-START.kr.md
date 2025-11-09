# 🚀 문서 시스템 빠른 시작

15분 안에 프로젝트 문서를 시작하고 실행하세요.

## ⚡ 빠른 설정

### 1단계: 디렉토리 구조 생성 (2분)

```bash
cd /path/to/your/project/_docs
./setup-documentation.sh
```

다음을 생성합니다:
- 10개의 메인 카테고리 폴더 (01-requirements부터 10-collaboration까지)
- 40개 이상의 하위 디렉토리
- Git에 구조를 보존하기 위한 .gitkeep 파일

### 2단계: 메인 README 커스터마이징 (5분)

`README.md` 편집:
```markdown
# 플레이스홀더 교체
${PROJECT_NAME} → 귀하의 프로젝트 이름
${PLATFORM_NAME} → 귀하의 플랫폼 이름
${GITHUB_USER} → 귀하의 사용자명
[Name] → 팀원 이름들
```

### 3단계: 첫 문서 작성 (8분)

#### 3a. 프로젝트 개요 (3분)
`01-requirements/01-project-overview.md` 생성:
```markdown
# 프로젝트 개요

## 무엇을 만드는가
[간단한 설명]

## 왜 만드는가
[해결하려는 문제]

## 누구를 위한 것인가
[대상 사용자]

## 성공 기준
- 지표 1
- 지표 2
```

#### 3b. 초기 로드맵 (3분)
`03-planning/01-roadmap.md` 생성:
```markdown
# 제품 로드맵

## 2024년 4분기
- [ ] 1단계: [이름]
- [ ] 2단계: [이름]

## 2025년 1분기
- [ ] 3단계: [이름]
```

#### 3c. 아키텍처 개요 (2분)
`04-architecture/01-system-architecture.md` 생성:
```markdown
# 시스템 아키텍처

## 기술 스택
- 프론트엔드: Next.js / SvelteKit
- 백엔드: Node.js + GraphQL
- 데이터베이스: PostgreSQL / MySQL
- 인프라: Docker
```

### 4단계: 팀 협업 설정 (선택사항 - 5분)

#### 커뮤니케이션 채널 생성
- Slack/Teams: `#documentation` 채널 생성
- `README.md` 링크 고정
- 채널 주제 설정: "프로젝트 문서 허브"

#### 정기 검토 일정
- 주간: 스프린트 문서 업데이트
- 월간: 로드맵 검토
- 분기: 전체 문서 감사

## 📋 역할별: 먼저 해야 할 일

### 👔 제품 관리자로서

**우선순위 1: 요구사항** (30분)
1. `01-requirements/01-project-overview.md` 작성
2. `01-requirements/02-functional-requirements.md`에 기능 나열
3. `03-planning/01-roadmap.md`에 초기 로드맵 작성

**우선순위 2: 기획** (1시간)
1. `03-planning/04-sprints/`에서 스프린트 정의
2. `03-planning/03-user-stories/`에 사용자 스토리 작성
3. `03-planning/05-backlog/`에 백로그 설정

**템플릿 사용**:
- `01-requirements/templates/requirement-template.md`
- `03-planning/03-user-stories/user-story-template.md`

### 🎨 디자이너로서

**우선순위 1: 디자인 시스템** (1시간)
1. `02-design/01-design-system/`에 색상, 타이포그래피 문서화
2. `02-design/02-ui-components/`에 컴포넌트 라이브러리 생성
3. 접근성 가이드라인 설정

**우선순위 2: 디자인 에셋** (30분)
1. `02-design/03-mockups/`에 목업 정리
2. `02-design/assets/`에 에셋 내보내기
3. Figma 파일 링크

**프로세스 사용**:
- `10-collaboration/02-design-handoff.md` 디자이너→개발자 핸드오프용

### 💻 개발자로서

**우선순위 1: 설정** (30분)
1. `06-development/01-getting-started.md`에 시작 가이드 작성
2. `06-development/02-coding-standards.md`에 코딩 표준 문서화
3. `06-development/03-development-workflow.md`에 개발 워크플로우 정의

**우선순위 2: 기술 문서** (1시간)
1. `05-api/`에 API 문서 생성
2. `04-architecture/`에 아키텍처 문서화
3. `06-development/06-code-review/`에 코드 리뷰 프로세스 설정

**일일 실천**:
- 코드 변경과 함께 API 문서 업데이트
- `10-collaboration/08-decisions/`에 의사결정 문서화
- `06-development/05-implementation-notes/`에 구현 세부사항 기록

### 🧪 QA 엔지니어로서

**우선순위 1: 테스팅 전략** (45분)
1. `07-testing/01-testing-strategy.md`에 접근 방식 정의
2. `07-testing/02-test-cases/template.md`에 테스트 케이스 템플릿 생성
3. 버그 리포트 프로세스 설정

**우선순위 2: 테스트 문서화** (1시간)
1. `07-testing/02-test-cases/`에 테스트 케이스 작성
2. `07-testing/03-automated-tests/`에 자동화 테스트 문서화
3. `07-testing/04-performance/`에 성능 벤치마크 정의

**템플릿 사용**:
- `07-testing/02-test-cases/test-case-template.md`
- `10-collaboration/05-bug-reports/bug-report-template.md`

### 🚀 DevOps로서

**우선순위 1: 배포** (1시간)
1. `08-deployment/01-deployment-guide.md`에 배포 가이드 작성
2. `08-deployment/02-infrastructure.md`에 인프라 문서화
3. `08-deployment/03-cicd/`에 CI/CD 문서 설정

**우선순위 2: 운영** (1시간)
1. `09-operations/03-runbooks/`에 런북 생성
2. `09-operations/02-monitoring.md`에 모니터링 문서화
3. `09-operations/04-backups/`에 백업 절차 정의

**지속적**:
- 각 릴리스와 함께 체인지로그 업데이트
- `09-operations/01-incidents/`에 인시던트 문서화
- 런북 유지

## 🔄 일일 문서화 워크플로우

### 모두를 위한

**아침** (5분)
- 어제의 문서 업데이트 검토
- 입력이 필요한 문서 확인

**업무 중** (지속적)
- 의사결정을 내릴 때 문서화
- 코드/디자인이 변경될 때 관련 문서 업데이트
- `#documentation` 채널에서 질문

**하루 마무리** (5분)
- 코드와 함께 문서 변경 커밋
- 프로젝트 관리 도구에서 상태 업데이트
- 내일 업데이트가 필요한 문서 기록

### 코드 변경용

```bash
# 표준 워크플로우
1. 코드 작성
2. API 문서 업데이트 (API가 변경된 경우)
3. 구현 노트 업데이트
4. PR 생성 (문서 변경 포함)
5. 검토 받기 (코드 및 문서 모두 검토)
6. 병합
```

### 디자인 변경용

```bash
# 표준 워크플로우
1. Figma에서 디자인 업데이트
2. 디자인 명세 업데이트
3. 새 에셋 내보내기
4. #design-dev에서 개발자에게 알림
5. 디자인 리뷰 일정 잡기
```

### 요구사항 변경용

```bash
# 변경 요청 워크플로우
1. 변경 요청 템플릿 작성
2. 영향도 평가 (PM + 테크리드)
3. 이해관계자 승인 받기
4. 요구사항 문서 업데이트
5. 사용자 스토리 및 로드맵 업데이트
6. 팀에 알림
```

## 📝 한눈에 보는 필수 템플릿

| 템플릿 | 위치 | 사용 시점 |
|----------|----------|-------------|
| 요구사항 | `01-requirements/templates/requirement-template.md` | 새 요구사항 |
| 사용자 스토리 | `03-planning/03-user-stories/user-story-template.md` | 새 기능 |
| 디자인 명세 | `02-design/04-specifications/design-spec-template.md` | 디자인 핸드오프 |
| API 문서 | `05-api/api-doc-template.md` | 새 API 엔드포인트 |
| 테스트 케이스 | `07-testing/02-test-cases/test-case-template.md` | 새 테스트 시나리오 |
| 버그 리포트 | `10-collaboration/05-bug-reports/bug-report-template.md` | 버그 발견 시 |
| 회의록 | `10-collaboration/06-meeting-notes/meeting-notes-template.md` | 회의 후 |
| 변경 요청 | `10-collaboration/03-change-requests/change-request-template.md` | 범위 변경 |

## 🤝 팀 커뮤니케이션 설정

### Slack/Teams 채널

다음 채널들을 생성하세요:
```
#documentation       - 일반 문서 질문
#design-dev         - 디자이너 ↔ 개발자 커뮤니케이션
#dev-qa             - 개발자 ↔ QA 커뮤니케이션
#deployments        - 배포 알림
#incidents          - 프로덕션 인시던트
```

### 회의 주기

**일일** (15분)
- 스탠드업: 완료된 것, 다음 작업, 차단 요소
- 회의록에 의사결정 문서화

**주간** (다양함)
- 디자인 리뷰 (1시간)
- 스프린트 계획 (2시간)
- 백로그 리파인먼트 (1시간)

**격주** (2시간)
- 스프린트 리뷰 & 회고
- 스프린트 문서 업데이트

**월간** (1시간)
- 로드맵 검토
- 문서 감사

### 알림 규칙

**즉시** (Slack/Teams)
- 프로덕션 인시던트
- 차단 이슈
- 긴급 명확화

**당일** (Slack/Teams)
- 버그 리포트
- 디자인 질문
- 코드 리뷰 요청

**다음 날** (이메일/비동기)
- 요구사항 변경
- 문서 업데이트
- 상태 보고서

## 📊 성공 지표

문서 성공을 측정하기 위해 추적:

**1주차**
- [ ] 디렉토리 구조 생성됨
- [ ] 메인 README 커스터마이징됨
- [ ] 5개 이상의 핵심 문서 생성됨
- [ ] 팀에 시스템 소개됨

**1개월**
- [ ] 모든 주요 섹션에 최소 1개의 문서 있음
- [ ] 팀이 템플릿 사용 중
- [ ] 문서가 워크플로우의 일부임
- [ ] 10개 이상의 문서 생성됨

**3개월**
- [ ] 90% 이상의 기능이 문서화됨
- [ ] 팀이 자립적임
- [ ] 코드 변경과 함께 문서 업데이트됨
- [ ] 긍정적인 팀 피드백

## ⚠️ 피해야 할 일반적인 함정

### ❌ 하지 말아야 할 것
- 문서를 만들고 절대 업데이트하지 않기
- 검토하지 않고 문서 작성
- 하나의 거대한 파일에 모든 것 문서화
- 일관성 없는 형식 사용
- 템플릿 건너뛰기
- 관련 문서 링크 잊기

### ✅ 대신 해야 할 것
- 모든 코드/디자인 변경과 함께 문서 업데이트
- PR에서 문서 검토
- 집중된 단일 목적 문서로 분할
- 템플릿 및 표준 따르기
- 템플릿 일관되게 사용
- 관련 콘텐츠 상호 참조

## 🆘 도움 받기

### 무언가를 찾을 수 없나요?
1. IDE에서 검색 (Cmd/Ctrl+Shift+F)
2. `README.md` 탐색 확인
3. `#documentation` 채널에서 질문
4. `DOCUMENTATION-GUIDE.md` 확인

### 무엇을 문서화해야 할지 모르겠나요?
1. 역할에 대한 `DOCUMENTATION-GUIDE.md` 확인
2. 해당 문서 유형의 템플릿 보기
3. 팀에 무엇이 필요한지 물어보기
4. 시작할 때 있었으면 좋았을 것 문서화

### 문서가 지저분해지고 있나요?
1. `README.md`의 폴더 구조 검토
2. 잘못 배치된 문서 이동
3. 링크 업데이트
4. 오래된 콘텐츠 아카이빙
5. 문서 정리 날짜 예약

## 🎓 더 알아보기

**핵심 문서**:
- [README.md](./README.md) - 전체 탐색
- [DOCUMENTATION-GUIDE.md](./DOCUMENTATION-GUIDE.md) - 포괄적인 가이드
- [10-collaboration/](./10-collaboration/) - 모든 협업 프로세스

**주제별**:
- 요구사항 → [01-requirements/README.md](./01-requirements/README.md)
- 디자인 → [02-design/](./02-design/)
- 개발 → [06-development/](./06-development/)
- 테스팅 → [07-testing/](./07-testing/)

**프로세스**:
- [디자인 핸드오프](./10-collaboration/02-design-handoff.md)
- [변경 요청](./10-collaboration/03-change-requests/)
- [버그 리포트](./10-collaboration/05-bug-reports/)

## ✅ 빠른 체크리스트

### 초기 설정
- [ ] `setup-documentation.sh` 실행
- [ ] README.md 커스터마이징
- [ ] 프로젝트 개요 생성
- [ ] 팀 채널 설정
- [ ] 팀에 문서 시스템 소개

### 첫 주
- [ ] 5개의 핵심 문서 생성
- [ ] 템플릿 커스터마이징
- [ ] 현재 스프린트 문서화
- [ ] 회의록 프로세스 설정

### 지속적
- [ ] 코드 변경과 함께 문서 업데이트
- [ ] PR에서 문서 검토
- [ ] 주간 문서 검토
- [ ] 월간 문서 감사

---

**시작할 준비가 되셨나요? 지금 `./setup-documentation.sh`를 실행하세요!**

**질문이 있나요?** [DOCUMENTATION-GUIDE.md](./DOCUMENTATION-GUIDE.md) 확인하거나 `#documentation`에서 질문하세요

**최종 업데이트**: 2024-10-19
