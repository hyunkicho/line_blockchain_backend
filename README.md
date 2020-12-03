# line_blockchain_backend

# 현재 진행상황

1. API 설계서 작성- 라인 블록체인 부분
라인 블록체인 API를 사용할 부분만 우선적으로 API설계서로 작성해 두었습니다.
총 3부분으로 나뉘어져 있으며, 현재 이중 현재 실제로 구현된 부분은
NFT - 보증서 관리 부분입니다.

2.  API 호출 부분 구현 완료
노드와 express를 이용하여 구현 완료
프론트엔드와의 호출을 통해서 테스트 완료
사인이 필요한 GET 요청과, 조회를 하는 POST 요청 중 주요 기능에 해당하는 부분 테스트 후 정리


# 예선 통과 후 To-Do 리스트

1. DB설계 및 DB관련 API 작성 및 구현

2. API가 열리면 비트맥스API를 이용하여 비트맥스 지갑 및 라인 로그인과 연동하여 구현할 예정입니다.

3. 모듈 정리 후 프라이빗 키 및 사인 부분 따로 관리, api 라우팅 세분화

4. 모니터링을 위한 데이터 저장 및 스마트컨트렉트를 활용한 staking 시스템 구현

# 설계서 URL
    https://docs.google.com/spreadsheets/d/1gZQ8NdswHYf3cWBMqwAMYagO9olyHR1vuNqTdw5kI9s/edit?usp=sharing

# 프론트 엔드 깃허브 주소
    https://github.com/hyunkicho/line_blockchain_front
