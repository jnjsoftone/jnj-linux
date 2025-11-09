  Claude Code 데이터 저장 위치

  주요 디렉토리

  1. ~/.claude/ - 설정, 세션, 로그인 정보 (가장 중요)
    - .credentials.json - 로그인 인증 정보
    - projects/ - 프로젝트별 세션 기록
    - shell-snapshots/ - 셸 스냅샷
    - todos/ - 작업 목록
    - statsig/ - 사용 통계
    - debug/ - 디버그 로그
  2. ~/.cache/claude-cli-nodejs/ - 캐시 및 MCP 로그

  Docker Volume 설정 방법

  1. docker-compose.yml 설정

  version: '3.8'

  services:
    your-service:
      image: your-image
      volumes:
        # Claude Code 설정 및 세션 (필수)
        - claude_data:/root/.claude

        # Claude Code 캐시 (선택사항, 성능 향상)
        - claude_cache:/root/.cache/claude-cli-nodejs

        # 프로젝트 디렉토리
        - ./your-project:/exposed/projects/your-project

  volumes:
    claude_data:
      driver: local
    claude_cache:
      driver: local

  2. 호스트 경로로 직접 마운트 (권장)

  version: '3.8'

  services:
    your-service:
      image: your-image
      volumes:
        # 호스트 경로에 직접 마운트
        - /host/path/to/claude-data:/root/.claude
        - /host/path/to/claude-cache:/root/.cache/claude-cli-nodejs

        # 프로젝트 디렉토리
        - ./your-project:/exposed/projects/your-project

  3. docker run 명령어

  docker run -it \
    -v claude_data:/root/.claude \
    -v claude_cache:/root/.cache/claude-cli-nodejs \
    -v $(pwd):/exposed/projects/your-project \
    your-image