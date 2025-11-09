현재 claude code에서  문서들을 생성할 때, 영문 버전을 디폴트로 하여 [filename].md 를 생성하고, 한글 버전은 [filename].kr.md 로 만들어야 하는데, 이 원칙이 잘 지켜지지 않아요. 이러한 원칙을 언급이 없더라도 지키도록 하려면 어디에 이런 지침을 설정해야 하나요?

===

/var/services/homes/jungsam/dev/dockers/_templates/docker/ubuntu-project/_docs 폴더에 있는 md 파일들에 대해 영문 버전을 [filename].md, 한글 버전은 [filename].kr.md 로 생성하는 원칙에 위배되는 파일들을 교정해주세요. [filename].md 이면서 한글 버전인 경우 [filename].kr.md로 수정하고, 영문버전을 [filename].md로 새로 만들어주세요. 