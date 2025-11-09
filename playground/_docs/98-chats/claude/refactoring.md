
/var/services/homes/jungsam/dev/dockers/platforms/_backups/ubuntu-ilmac/projects/ilmac-bid-web 에서 구현중인 project의 코드들을 /var/services/homes/jungsam/dev/dockers/platforms/ubuntu-ilmac/projects/ilmac-bid-web 에 적용시켜주세요.
코드들은 재활용하되, 환경변수(mysql 접속 정보, port 정보)들은 /var/services/homes/jungsam/dev/dockers/platforms/ubuntu-ilmac/projects/ilmac-bid-web 의 것들을 사용해주세요.

---

sudo 암호는 Answjdtka1! 

---

> root@4cad5ae2fede:/exposed/projects/ilmac-bid-web# ./start_servers.sh
  Starting servers...
  Starting GraphQL server...
  GraphQL server started (PID: 2058)
  Starting Next.js frontend...
  Next.js frontend started (PID: 2102)

  ========================================
  Servers started successfully!
  GraphQL PID: 2058
  Next.js PID: 2102
  ========================================

  To view logs:
    GraphQL: tail -f /exposed/projects/ilmac-bid-web/logs/nohup_graphql.out
    Next.js: tail -f /exposed/projects/ilmac-bid-web/logs/nohup_nextjs.out

  To stop servers:
    kill $(cat /exposed/projects/ilmac-bid-web/logs/graphql.pid)
    kill $(cat /exposed/projects/ilmac-bid-web/logs/nextjs.pid)


  그런데, nextjs: http://1.231.118.217:21025, graphql: http://1.231.118.217:21022 에 접속하면

  페이지가 작동하지 않습니다.
  1.231.118.217에서 전송한 데이터가 없습니다.
  ERR_EMPTY_RESPONSE 

---

cd /exposed/projects/ilmac-bid-web/backend/nodejs && npm run build

cd /exposed/projects/ilmac-bid-web/frontend/nextjs && npm run build

---

아래와 같이 create-project.sh 를 실행시켰을 때, 
- sed: -e expression #1, char 38: unknown option to `s' 로그가 반복적으로 나타납니다.
- 아래의 파일들에서 {{PROJECT_DESCRIPTION}} 내용이 치환되지 않았네요.  {{PROJECT_DESCRIPTION}} 값은 -d "일맥 업무/프로젝트 관리 웹앱" 에서 -d 옵션값("일맥 업무/프로젝트 관리 웹앱")를 사용하면 됩니다.
- /var/services/homes/jungsam/dev/dockers/_templates/docker/docker-ubuntu/projects/create-project.sh , /var/services/homes/jungsam/dev/dockers/platforms/ubuntu-ilmac/projects/create-project.sh 를 모두 수정해주세요.

---

> frontend/nextjs/package.json 

```
  "description": "{{PROJECT_DESCRIPTION}} nextjs server",
```

> `backend/nodejs/package.json`

```
  "description": "{{PROJECT_DESCRIPTION}} backend service",
```


---

cd /var/services/homes/jungsam/dev/dockers/platforms/ubuntu-ilmac/projects && ./create-project.sh -p ubuntu-ilmac -n ilmac-work-web -u ilinkrun -d "일맥 업무/프로젝트 관리 웹앱"

[INFO]   Configuring environment files...
[INFO]   Processing .env...
[SUCCESS]   ✓ .env configured

[INFO]   Updating project metadata...
sed: -e expression #1, char 38: unknown option to `s'
...
sed: -e expression #1, char 38: unknown option to `s'
[SUCCESS]   ✓ Metadata updated

[INFO]   Substituting template placeholders...
sed: -e expression #1, char 41: unknown option to `s'
...
sed: -e expression #1, char 41: unknown option to `s'
[SUCCESS]   ✓ Template placeholders substituted

---

create-project.sh 를 실행시켰을 때, 

