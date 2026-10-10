# Git Guide

정적 HTML/CSS/JS로 구성된 Git 가이드 문서입니다.

## GitHub Pages 배포

이 저장소에는 GitHub Pages 배포용 workflow가 포함되어 있습니다.

파일:
- `.github/workflows/deploy-pages.yml`

배포 절차:
1. 이 폴더를 GitHub 저장소에 업로드합니다.
2. 기본 브랜치를 `main` 또는 `master`로 둡니다.
3. GitHub 저장소의 `Settings > Pages`에서 소스를 `GitHub Actions`로 사용합니다.
4. `main` 또는 `master`에 push 하면 Pages가 자동 배포됩니다.

배포 산출물에는 아래 경로만 포함됩니다.
- `index.html`
- `guide/`
- `scripts/`
- `styles/`

아래 항목은 저장소와 배포 대상에서 제외됩니다.
- `examples/`
- 임시 스크린샷 파일(`tmp-*.png`)

## 로컬 미리보기 및 검증

Node.js 24 LTS(24.15 이상)과 Python 3이 필요합니다. 브라우저에 전달되는 파일에는 npm 의존성이 없습니다.

```sh
npm ci
npm run check
npm run preview
```

미리보기 주소: <http://localhost:8000>

한국어·일본어 가이드: <https://kibalab.github.io/git_guide/>

그래프 정의는 `guide/scripts/graphs/`에서 두 언어가 공유합니다. 각 파일의 `translations`에는 일본어 표시 문구만 두고, 그래프 구조는 한 번만 정의합니다. 전략 탭의 공통 동작은 `guide/scripts/graph-page.js`에서 관리합니다.

PR에서는 정적 참조와 그래프·접근성 회귀 검증만 실행합니다. `main` 또는 `master`에서는 검증에 성공한 경우에만 배포합니다.

## 명령어 설명 표시

가이드 상단의 `명령어 설명 표시` 버튼은 기본적으로 꺼져 있습니다. 켜면 각 기능·그림에 대응하는 Git 명령어와 설명이 본문에 나타납니다. 한국어·일본어 페이지에서 같은 설정을 공유하고, 페이지 이동·새로고침 후에도 유지합니다. 브라우저 저장소를 사용할 수 없어도 현재 페이지에서는 토글할 수 있습니다.

명령어와 번역은 `guide/scripts/command-data.js`, 표시 동작은 `guide/scripts/command-guide.js`에서 관리합니다. HTML의 `data-command-guide` 위치에 해당 설명이 들어갑니다. 브랜치 전략 탭은 현재 선택한 전략의 예시만 보여줍니다. PR 관련 `gh` 예시는 별도 GitHub CLI가 필요하며, 명령어는 자동 실행되지 않습니다.
