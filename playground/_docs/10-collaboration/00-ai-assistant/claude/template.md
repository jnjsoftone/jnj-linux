'사용자/인증/권한 관리 프로젝트' 를 아래의 테크스택으로 만들 경우
실제 요구사항 분석, 기획, 디자인, 개발, 테스트, 운영 등의 워크플로우에 따라 _docs 폴더에 생성되는 문서와 업데이트되는 과정을 /var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs/99-examples 에 만들어주세요. 모든 워크플로우에는 가장 효과적으로 claude code를 활용할 수 있도록 합니다. 그러므로, 각 단계별로 클로드에게 제공할 지침(PRD작성, UI/UX 가이드라인, UI 컴포넌트 구조(element, component, template, page 등), 코딩 컨벤션, ...), 프롬프트 등도 추천해주세요. 

- database: postgresql
- backend: typescript, graphql 
- frontend: nextjs(shadcn, tailwind)