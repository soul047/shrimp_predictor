# 새우 색 도감 + 돌연변이 예측기 v1.1

민후 전용 경량 웹앱. 단일 `index.html` 파일만으로 동작합니다 (이미지 없음).

## 로컬 실행
파일을 더블클릭하여 브라우저에서 열면 됩니다.

## Netlify 배포 (권장)
1) https://app.netlify.com → **New site from Git** 또는 **Deploy manually**
- 깃 저장소로 배포: 이 폴더를 저장소로 올린 뒤 연결
- 수동 배포: Netlify 대시보드에서 **Deploy site** → `index.html` 포함 폴더를 끌어다 놓기
2) `netlify.toml`은 별도 빌드 없이 정적 배포를 지정합니다.
3) 배포 후 생성된 URL로 접속

## GitHub Pages 배포
1) GitHub에 새 저장소 생성 (예: `shrimp-predictor`)
2) 이 폴더의 모든 파일을 업로드 (`index.html`이 루트에 있어야 함)
3) 저장소 **Settings → Pages**에서 **Deploy from a branch** 선택
   - Branch: `main`
   - Folder: `/ (root)`
4) 저장 후 제공된 URL로 접속

## 파일 목록
- `index.html` : 앱 본체 (단일 파일 실행)
- `netlify.toml` : Netlify 설정 (정적 사이트)
- `404.html` : 간단한 404 페이지
