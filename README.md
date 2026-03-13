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
