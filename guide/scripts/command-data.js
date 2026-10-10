window.GitGuideCommandData = {
  "intro": {
    "title": {
      "ko": "명령어 예시 읽는 법",
      "ja": "コマンド例の読み方"
    },
    "note": {
      "ko": "Git 2.28 이상을 설치한 뒤 프로젝트 폴더에서 터미널을 엽니다. URL, 파일 경로, 브랜치 이름, 커밋 ID는 실제 값으로 바꿉니다. 아래 명령어는 표시만 하며 자동 실행하지 않습니다.",
      "ja": "Git 2.28 以降をインストールし、プロジェクトフォルダーでターミナルを開きます。URL、ファイルパス、ブランチ名、コミット ID は実際の値に置き換えます。表示されるコマンドは自動実行されません。"
    },
    "steps": [
      {
        "command": "git --version",
        "description": {
          "ko": "설치된 Git 버전을 확인합니다.",
          "ja": "インストールされた Git のバージョンを確認します。"
        }
      },
      {
        "command": "git help commit",
        "description": {
          "ko": "커밋 명령어의 공식 도움말을 엽니다.",
          "ja": "コミットコマンドの公式ヘルプを開きます。"
        }
      }
    ]
  },
  "repository": {
    "title": {
      "ko": "로컬 저장소와 origin 확인",
      "ja": "ローカルリポジトリと origin の確認"
    },
    "note": {
      "ko": "새 저장소 만들기와 기존 저장소 복제는 서로 다른 시작 방법입니다. 둘 중 상황에 맞는 방법을 선택합니다.",
      "ja": "新規リポジトリの作成と既存リポジトリの複製は別の始め方です。状況に合う方を選びます。"
    },
    "steps": [
      {
        "command": "git init -b main",
        "description": {
          "ko": "새 프로젝트 폴더에서 .git을 만들고 main을 최초 브랜치 이름으로 정합니다.",
          "ja": "新しいプロジェクトフォルダーに .git を作り、最初のブランチ名を main にします。"
        }
      },
      {
        "command": "git clone https://github.com/OWNER/REPOSITORY.git",
        "description": {
          "ko": "기존 리모트 저장소를 새 폴더로 복제합니다. origin도 자동으로 등록됩니다.",
          "ja": "既存のリモートを新しいフォルダーに複製します。origin も自動登録されます。"
        }
      },
      {
        "command": "git remote add origin https://github.com/OWNER/REPOSITORY.git",
        "description": {
          "ko": "init으로 시작했고 origin이 아직 없을 때 리모트 주소를 등록합니다. 리모트 저장소는 서비스에서 먼저 만듭니다.",
          "ja": "init で始めて origin が未登録の場合にリモート URL を登録します。リモート自体はサービス側で先に作成します。"
        }
      },
      {
        "command": "git remote -v",
        "description": {
          "ko": "등록된 리모트 이름과 가져오기·보내기 주소를 확인합니다.",
          "ja": "登録されたリモート名と取得・送信先 URL を確認します。"
        }
      }
    ]
  },
  "sharing": {
    "title": {
      "ko": "기록을 저장하고 공유하기",
      "ja": "記録の保存と共有"
    },
    "note": {
      "ko": "각 명령어는 서로 다른 동작입니다. 커밋은 내 로컬에서, Push는 보내는 사람의 로컬에서, Fetch는 받는 사람의 로컬에서 실행합니다.",
      "ja": "それぞれ別の操作です。Commit は自分のローカル、Push は送信者のローカル、Fetch は受信者のローカルで実行します。"
    },
    "steps": [
      {
        "command": "git add -- README.md",
        "description": {
          "ko": "선택한 파일의 현재 변경을 다음 커밋에 포함하도록 준비합니다.",
          "ja": "選んだファイルの現在の変更を次のコミットに含める準備をします。"
        }
      },
      {
        "command": "git commit -m \"Update project notes\"",
        "description": {
          "ko": "준비한 변경을 로컬 기록에 커밋합니다. 파일 저장이나 리모트 업로드와는 별도입니다.",
          "ja": "準備した変更をローカルにコミットします。ファイル保存やリモートへの送信とは別です。"
        }
      },
      {
        "command": "git push -u origin main",
        "description": {
          "ko": "로컬 main의 커밋을 origin으로 보내고 추적 대상을 설정합니다.",
          "ja": "ローカル main のコミットを origin に送り、追跡先を設定します。"
        }
      },
      {
        "command": "git fetch origin",
        "description": {
          "ko": "받는 사람은 리모트 기록을 가져옵니다. 현재 브랜치와 작업 파일은 바로 합쳐지지 않습니다.",
          "ja": "受信者はリモートの記録を取得します。現在のブランチや作業ファイルにはまだ統合されません。"
        }
      }
    ]
  },
  "history": {
    "title": {
      "ko": "히스토리와 커밋의 변경 확인",
      "ja": "履歴とコミットの変更確認"
    },
    "note": {
      "ko": "COMMIT_ID에는 실제 커밋 해시를 넣습니다. 그림의 m0 같은 ID는 설명용이므로 그대로 사용할 수 없습니다.",
      "ja": "COMMIT_ID には実際のコミットハッシュを入れます。図の m0 などは説明用 ID なのでそのまま使えません。"
    },
    "steps": [
      {
        "command": "git log --oneline --graph --all --decorate",
        "description": {
          "ko": "브랜치와 커밋의 연결 관계를 짧은 로그로 확인합니다.",
          "ja": "ブランチとコミットのつながりを短いログで確認します。"
        }
      },
      {
        "command": "git show COMMIT_ID -- Assets/Prefabs/UI/LoginButton.prefab",
        "description": {
          "ko": "해당 커밋에서 이 파일이 어떻게 바뀌었는지 확인합니다.",
          "ja": "指定コミットでこのファイルがどう変わったか確認します。"
        }
      }
    ]
  },
  "diff": {
    "title": {
      "ko": "파일·줄 단위 비교",
      "ja": "ファイル・行単位の比較"
    },
    "note": {
      "ko": "작업 파일 비교와 커밋끼리의 비교를 구분합니다. 새로 생겨 아직 추적되지 않는 파일은 git diff에 표시되지 않습니다.",
      "ja": "作業ファイルの比較とコミット間の比較を区別します。新規の未追跡ファイルは git diff に表示されません。"
    },
    "steps": [
      {
        "command": "git status --short",
        "description": {
          "ko": "수정·추가·삭제된 파일과 스테이징 여부를 확인합니다.",
          "ja": "変更・追加・削除されたファイルとステージ状態を確認します。"
        }
      },
      {
        "command": "git diff -- Assets/Prefabs/UI/LoginButton.prefab",
        "description": {
          "ko": "아직 스테이징하지 않은 변경을 줄 단위로 확인합니다.",
          "ja": "まだステージしていない変更を行単位で確認します。"
        }
      },
      {
        "command": "git diff --staged -- Assets/Prefabs/UI/LoginButton.prefab",
        "description": {
          "ko": "다음 커밋에 넣도록 준비한 변경을 확인합니다.",
          "ja": "次のコミットに含めるため準備した変更を確認します。"
        }
      },
      {
        "command": "git blame -- Assets/Prefabs/UI/LoginButton.prefab",
        "description": {
          "ko": "현재 파일의 각 줄을 마지막으로 바꾼 커밋과 작성자를 확인합니다.",
          "ja": "現在のファイルの各行を最後に変更したコミットと作者を確認します。"
        }
      }
    ]
  },
  "head": {
    "title": {
      "ko": "현재 작업 위치 확인",
      "ja": "現在の作業位置の確認"
    },
    "note": {
      "ko": "",
      "ja": ""
    },
    "steps": [
      {
        "command": "git branch --show-current",
        "description": {
          "ko": "현재 체크아웃한 브랜치 이름을 봅니다. 브랜치에서 떨어진 HEAD 상태이면 비어 있습니다.",
          "ja": "現在のブランチ名を確認します。detached HEAD 状態では空になります。"
        }
      },
      {
        "command": "git rev-parse HEAD",
        "description": {
          "ko": "HEAD가 가리키는 실제 커밋 해시를 확인합니다.",
          "ja": "HEAD が指す実際のコミットハッシュを確認します。"
        }
      }
    ]
  },
  "branch-create": {
    "title": {
      "ko": "작업 브랜치 만들기",
      "ja": "作業ブランチの作成"
    },
    "note": {
      "ko": "main에 있는 상태에서 새 작업을 시작하는 예시입니다. 변경 파일은 먼저 커밋하거나 정리해 둡니다.",
      "ja": "main から新しい作業を始める例です。変更ファイルは先にコミットするなどして整理します。"
    },
    "steps": [
      {
        "command": "git switch -c feature/login-bg",
        "description": {
          "ko": "현재 커밋에서 새 브랜치를 만들고 그 브랜치로 이동합니다.",
          "ja": "現在のコミットから新しいブランチを作り、そこへ移動します。"
        }
      }
    ]
  },
  "branch-return": {
    "title": {
      "ko": "작업을 합치고 main으로 돌아오기",
      "ja": "作業を統合して main に戻る"
    },
    "note": {
      "ko": "feature/login-bg의 작업을 이미 커밋한 상태입니다. 팀이 PR을 사용하는 경우 실제 통합은 PR 절차를 따릅니다.",
      "ja": "feature/login-bg の作業をコミット済みの例です。PR を使うチームでは実際の統合は PR の手順に従います。"
    },
    "steps": [
      {
        "command": "git switch main",
        "description": {
          "ko": "main을 현재 작업 브랜치로 선택합니다. 이것만으로 feature 작업이 합쳐지지는 않습니다.",
          "ja": "作業ブランチを main に切り替えます。これだけでは feature の変更は統合されません。"
        }
      },
      {
        "command": "git merge --no-ff feature/login-bg",
        "description": {
          "ko": "feature의 커밋을 main에 통합합니다. --no-ff는 통합 커밋을 남기는 예시입니다.",
          "ja": "feature のコミットを main に統合します。--no-ff はマージコミットを残す指定です。"
        }
      }
    ]
  },
  "checkout": {
    "title": {
      "ko": "기존 브랜치로 이동하기",
      "ja": "既存ブランチへの移動"
    },
    "note": {
      "ko": "switch는 브랜치 이동 전용 명령어입니다. 같은 이동을 git checkout feature/login-bg로도 할 수 있습니다.",
      "ja": "switch はブランチ移動用コマンドです。同じ移動は git checkout feature/login-bg でもできます。"
    },
    "steps": [
      {
        "command": "git switch feature/login-bg",
        "description": {
          "ko": "이미 만들어진 feature/login-bg로 HEAD와 작업 파일을 전환합니다.",
          "ja": "既存の feature/login-bg に HEAD と作業ファイルを切り替えます。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "다시 main으로 돌아옵니다.",
          "ja": "main に戻ります。"
        }
      }
    ]
  },
  "commit": {
    "title": {
      "ko": "변경을 골라 커밋하기",
      "ja": "変更を選んでコミットする"
    },
    "note": {
      "ko": "작성자 정보가 설정되지 않았다면 먼저 git config user.name \"Your Name\"과 git config user.email \"you@example.com\"을 실제 정보로 실행합니다. 파일 경로도 실제 수정한 파일로 바꿉니다.",
      "ja": "作者情報が未設定なら git config user.name \"Your Name\" と git config user.email \"you@example.com\" を実際の情報で実行します。パスも変更したファイルに置き換えます。"
    },
    "steps": [
      {
        "command": "git status --short",
        "description": {
          "ko": "수정한 파일과 아직 추적되지 않는 파일을 확인합니다.",
          "ja": "変更したファイルと未追跡ファイルを確認します。"
        }
      },
      {
        "command": "git add -- Assets/Prefabs/UI/LoginButton.prefab",
        "description": {
          "ko": "이 파일의 현재 변경만 다음 커밋에 준비합니다. 작업이 더 바뀌면 다시 add합니다.",
          "ja": "このファイルの現在の変更を次のコミットに準備します。その後変更したら再度 add します。"
        }
      },
      {
        "command": "git diff --staged",
        "description": {
          "ko": "커밋에 들어갈 변경 묶음을 확인합니다.",
          "ja": "コミットに含まれる変更を確認します。"
        }
      },
      {
        "command": "git commit -m \"Align login button\"",
        "description": {
          "ko": "스테이징한 변경을 설명 메시지와 함께 로컬에 기록합니다.",
          "ja": "ステージした変更をメッセージとともにローカルに記録します。"
        }
      }
    ]
  },
  "push": {
    "title": {
      "ko": "로컬 커밋을 Push하기",
      "ja": "ローカルコミットを Push する"
    },
    "note": {
      "ko": "리모트에 보내기 전에 로컬에서 커밋을 완료합니다. main에 직접 Push할 수 없는 팀에서는 작업 브랜치를 사용합니다.",
      "ja": "送信前にローカルでコミットを完了します。main への直接 Push を許可しないチームでは作業ブランチを使います。"
    },
    "steps": [
      {
        "command": "git push -u origin main",
        "description": {
          "ko": "로컬 main을 origin/main으로 보내고 이후 사용할 추적 대상을 설정합니다.",
          "ja": "ローカル main を origin/main に送り、以後使う追跡先を設定します。"
        }
      }
    ]
  },
  "fetch": {
    "title": {
      "ko": "리모트 기록을 Fetch하기",
      "ja": "リモート記録の Fetch"
    },
    "note": {
      "ko": "",
      "ja": ""
    },
    "steps": [
      {
        "command": "git fetch origin",
        "description": {
          "ko": "origin의 커밋과 리모트 추적 브랜치를 갱신합니다. 현재 main과 작업 파일은 통합하지 않습니다.",
          "ja": "origin のコミットとリモート追跡ブランチを更新します。現在の main と作業ファイルには統合しません。"
        }
      },
      {
        "command": "git log --oneline main..origin/main",
        "description": {
          "ko": "origin/main에 있고 로컬 main에는 아직 없는 커밋을 확인합니다.",
          "ja": "origin/main にあってローカル main にまだないコミットを確認します。"
        }
      }
    ]
  },
  "fetch-merge": {
    "title": {
      "ko": "Fetch 다음에 Merge하기",
      "ja": "Fetch の後に Merge する"
    },
    "note": {
      "ko": "main에서 origin/main을 통합하는 예시입니다. 통합 중 충돌이 나면 아래 해결 절차를 따릅니다.",
      "ja": "main に origin/main を統合する例です。衝突したら下の解決手順に従います。"
    },
    "steps": [
      {
        "command": "git switch main",
        "description": {
          "ko": "통합을 받을 로컬 main으로 이동합니다.",
          "ja": "統合先のローカル main に移動します。"
        }
      },
      {
        "command": "git fetch origin",
        "description": {
          "ko": "origin/main을 최신 상태로 가져옵니다.",
          "ja": "origin/main を最新にします。"
        }
      },
      {
        "command": "git merge origin/main",
        "description": {
          "ko": "가져온 커밋을 main에 합칩니다. 가능한 경우 fast-forward하고, 이력이 갈라졌으면 Merge합니다.",
          "ja": "取得したコミットを main に統合します。可能なら fast-forward、分岐していれば Merge します。"
        }
      }
    ]
  },
  "merge": {
    "title": {
      "ko": "feature를 main에 Merge하기",
      "ja": "feature を main に Merge する"
    },
    "note": {
      "ko": "feature/ui의 작업을 커밋한 뒤 main에서 실행합니다. --no-ff를 사용해 그림처럼 머지 커밋을 남깁니다.",
      "ja": "feature/ui の作業をコミットした後、main で実行します。--no-ff で図のようにマージコミットを残します。"
    },
    "steps": [
      {
        "command": "git switch main",
        "description": {
          "ko": "통합 대상인 main을 선택합니다.",
          "ja": "統合先の main を選びます。"
        }
      },
      {
        "command": "git merge --no-ff feature/ui",
        "description": {
          "ko": "feature/ui를 main에 합칩니다. 같은 부분이 다르면 충돌 해결 후 커밋합니다.",
          "ja": "feature/ui を main に統合します。同じ箇所が異なれば衝突を解決してコミットします。"
        }
      }
    ]
  },
  "pull-ff": {
    "title": {
      "ko": "Pull A: fast-forward 갱신",
      "ja": "Pull A: fast-forward 更新"
    },
    "note": {
      "ko": "main에서 실행합니다. --ff-only는 로컬·리모트 이력이 갈라졌을 때 자동 머지하지 않고 중단합니다.",
      "ja": "main で実行します。--ff-only はローカルとリモートの履歴が分岐していたら自動マージせず停止します。"
    },
    "steps": [
      {
        "command": "git pull --ff-only origin main",
        "description": {
          "ko": "Fetch 후 main을 origin/main과 같은 커밋으로 이동합니다. 별도 머지 커밋은 만들지 않습니다.",
          "ja": "Fetch 後に main を origin/main と同じコミットへ移動します。マージコミットは作りません。"
        }
      }
    ]
  },
  "pull-merge": {
    "title": {
      "ko": "Pull B: 갈라진 이력을 Merge",
      "ja": "Pull B: 分岐した履歴を Merge"
    },
    "note": {
      "ko": "main에서 실행하며, 이 문서의 Fetch + Merge 동작을 옵션으로 지정합니다. Pull은 설정과 옵션에 따라 Rebase 등 다른 통합 방식도 사용할 수 있습니다.",
      "ja": "main で実行し、この文書の Fetch + Merge をオプションで指定します。Pull は設定やオプションによって Rebase など別の統合方法も使えます。"
    },
    "steps": [
      {
        "command": "git pull --no-rebase --ff origin main",
        "description": {
          "ko": "Fetch 후 Merge합니다. main에도 별도 커밋이 있으면 머지 커밋이 필요하며 충돌할 수 있습니다.",
          "ja": "Fetch 後に Merge します。main にも独自のコミットがあればマージコミットが必要になり、衝突する場合があります。"
        }
      }
    ]
  },
  "conflict": {
    "title": {
      "ko": "Merge 충돌을 확인하고 마무리하기",
      "ja": "Merge の衝突を確認して完了する"
    },
    "note": {
      "ko": "충돌한 파일을 편집기로 열어 최종 내용을 만들고 <<<<<<<, =======, >>>>>>> 표시를 제거한 뒤 저장합니다. 이 예시는 Merge 충돌이며 Rebase 절차와 구분합니다.",
      "ja": "衝突したファイルをエディターで開いて最終内容を作り、<<<<<<<、=======、>>>>>>> を取り除いて保存します。これは Merge の衝突で、Rebase の手順とは区別します。"
    },
    "steps": [
      {
        "command": "git status",
        "description": {
          "ko": "충돌한 파일과 현재 통합 상태를 확인합니다.",
          "ja": "衝突したファイルと現在の統合状態を確認します。"
        }
      },
      {
        "command": "git diff --name-only --diff-filter=U",
        "description": {
          "ko": "아직 해결 표시를 하지 않은 충돌 파일의 경로를 봅니다.",
          "ja": "まだ解決済みにしていない衝突ファイルのパスを確認します。"
        }
      },
      {
        "command": "git add -- ui/menu.txt",
        "description": {
          "ko": "수정해 저장한 파일을 해결된 결과로 준비합니다. 모든 충돌 파일에 반복합니다.",
          "ja": "修正・保存したファイルを解決結果としてステージします。すべての衝突ファイルで繰り返します。"
        }
      },
      {
        "command": "git commit -m \"Resolve menu text conflict\"",
        "description": {
          "ko": "모든 충돌을 해결한 뒤 통합 커밋을 남깁니다.",
          "ja": "すべての衝突を解決した後、統合コミットを作ります。"
        }
      },
      {
        "command": "git merge --abort",
        "description": {
          "ko": "해결을 계속하지 않을 때 사용하는 대안입니다. Merge를 중단하고 이전 상태 복원을 시도합니다. 커밋 후에 이어 실행하는 명령이 아닙니다.",
          "ja": "解決を続けない場合の代替操作です。Merge を中止して元の状態への復元を試みます。コミット後に続けて実行するコマンドではありません。"
        }
      }
    ]
  },
  "pr": {
    "title": {
      "ko": "PR 생성·리뷰·머지",
      "ja": "PR の作成・レビュー・マージ"
    },
    "note": {
      "ko": "PR은 Git 명령어가 아닌 GitHub 기능입니다. gh 명령어에는 GitHub CLI 설치와 gh auth login이 필요합니다. PR_NUMBER는 실제 PR 번호로 바꾸며 리뷰 승인은 작성자가 아닌 다른 리뷰어가 실행합니다.",
      "ja": "PR は Git コマンドではなく GitHub の機能です。gh には GitHub CLI のインストールと gh auth login が必要です。PR_NUMBER は実際の番号に置き換え、承認は作者ではなく別のレビュアーが実行します。"
    },
    "steps": [
      {
        "command": "git push -u origin feature/login-ui",
        "description": {
          "ko": "작성자: 커밋한 작업 브랜치를 업로드합니다.",
          "ja": "作者: コミットした作業ブランチをアップロードします。"
        }
      },
      {
        "command": "gh pr create --base main --head feature/login-ui",
        "description": {
          "ko": "작성자: 제목과 설명을 입력해 main으로 합칠 PR을 엽니다.",
          "ja": "作者: タイトルと説明を入力し、main への PR を作成します。"
        }
      },
      {
        "command": "gh pr diff PR_NUMBER",
        "description": {
          "ko": "리뷰어: PR에 포함된 변경을 확인합니다.",
          "ja": "レビュアー: PR に含まれる変更を確認します。"
        }
      },
      {
        "command": "git add -- ui/login.css",
        "description": {
          "ko": "작성자: 리뷰 반영 후 저장한 수정 파일을 커밋에 준비합니다.",
          "ja": "作者: レビュー反映後に保存した修正ファイルをステージします。"
        }
      },
      {
        "command": "git commit -m \"Improve login button contrast\"",
        "description": {
          "ko": "작성자: 리뷰 반영 변경을 추가 커밋합니다.",
          "ja": "作者: レビュー対応の変更を追加コミットします。"
        }
      },
      {
        "command": "git push origin feature/login-ui",
        "description": {
          "ko": "작성자: 같은 브랜치에 Push하면 기존 PR도 갱신됩니다.",
          "ja": "作者: 同じブランチに Push すると既存 PR も更新されます。"
        }
      },
      {
        "command": "gh pr review PR_NUMBER --approve",
        "description": {
          "ko": "다른 리뷰어: 변경 검토 후 PR을 승인합니다.",
          "ja": "別のレビュアー: 変更を確認して PR を承認します。"
        }
      },
      {
        "command": "gh pr merge PR_NUMBER --merge",
        "description": {
          "ko": "권한 있는 담당자: 승인·필수 검사를 확인하고 리모트 main에 머지합니다. 팀에서 허용한 머지 방식에 맞춥니다.",
          "ja": "権限を持つ担当者: 承認・必須チェックを確認してリモート main にマージします。チームで許可された方法に従います。"
        }
      },
      {
        "command": "git fetch origin",
        "description": {
          "ko": "작성자: 머지 후 origin/main을 가져옵니다. 현재 작업 브랜치는 그대로입니다.",
          "ja": "作者: マージ後の origin/main を取得します。作業ブランチは変わりません。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "작성자: 갱신할 로컬 main으로 이동합니다.",
          "ja": "作者: 更新するローカル main に移動します。"
        }
      },
      {
        "command": "git pull --ff-only origin main",
        "description": {
          "ko": "작성자: 리모트 main의 머지 결과를 로컬 main에 반영합니다.",
          "ja": "作者: リモート main のマージ結果をローカル main に反映します。"
        }
      }
    ]
  },
  "cleanup": {
    "title": {
      "ko": "PR 머지 후 브랜치 정리",
      "ja": "PR マージ後のブランチ整理"
    },
    "note": {
      "ko": "PR이 머지된 뒤 실행하는 순서입니다. GitHub에서 리모트 브랜치를 이미 삭제했다면 첫 명령은 생략합니다. -d가 미통합 작업을 이유로 거절하면 강제로 지우지 말고 머지 방식과 작업 포함 여부를 확인합니다.",
      "ja": "PR のマージ後に実行する順序です。GitHub でリモートブランチを削除済みなら最初は省略します。-d が未統合の作業を理由に拒否したら強制削除せず、マージ方法と作業の取り込みを確認します。"
    },
    "steps": [
      {
        "command": "git push origin --delete feature/login-ui",
        "description": {
          "ko": "리모트 작업 브랜치를 삭제합니다. 커밋 이력 자체를 지우는 명령은 아닙니다.",
          "ja": "リモートの作業ブランチを削除します。コミット履歴自体を消す操作ではありません。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "삭제할 브랜치에서 벗어나 main으로 이동합니다.",
          "ja": "削除対象のブランチから main に移動します。"
        }
      },
      {
        "command": "git pull --ff-only origin main",
        "description": {
          "ko": "main을 최신화합니다. 로컬 main이 갈라져 있으면 중단하므로 먼저 상태를 확인합니다.",
          "ja": "main を最新にします。ローカル main が分岐していれば停止するので状態を確認します。"
        }
      },
      {
        "command": "git branch -d feature/login-ui",
        "description": {
          "ko": "머지 여부를 확인하면서 로컬 작업 브랜치를 삭제합니다.",
          "ja": "マージ済みか確認しながらローカル作業ブランチを削除します。"
        }
      },
      {
        "command": "git fetch --prune origin",
        "description": {
          "ko": "삭제된 리모트 브랜치에 대응하는 origin/* 추적 표시도 정리합니다.",
          "ja": "削除されたリモートブランチに対応する origin/* の追跡表示も整理します。"
        }
      },
      {
        "command": "git switch -c feature/next-task",
        "description": {
          "ko": "최신 main에서 다음 작업 브랜치를 만듭니다.",
          "ja": "最新の main から次の作業ブランチを作ります。"
        }
      }
    ]
  },
  "message": {
    "title": {
      "ko": "제목과 이유를 커밋 메시지로 남기기",
      "ja": "タイトルと理由をコミットメッセージに残す"
    },
    "note": {
      "ko": "먼저 git add로 이 커밋에 들어갈 파일만 준비합니다. -m을 두 번 쓰면 제목과 본문을 나눌 수 있습니다.",
      "ja": "先に git add でこのコミットに含めるファイルだけ準備します。-m を 2 回使うとタイトルと本文を分けられます。"
    },
    "steps": [
      {
        "command": "git commit -m \"Reduce button shadow by 20%\" -m \"Improve label readability on dark backgrounds\"",
        "description": {
          "ko": "무엇을 바꿨는지 제목에, 왜 바꿨는지 본문에 기록합니다.",
          "ja": "何を変えたかをタイトルに、理由を本文に記録します。"
        }
      },
      {
        "command": "git log -1 --format=full",
        "description": {
          "ko": "최근 커밋의 작성자와 전체 메시지를 확인합니다.",
          "ja": "最新コミットの作者とメッセージ全体を確認します。"
        }
      }
    ]
  },
  "short-branch": {
    "title": {
      "ko": "짧은 작업 브랜치 운용",
      "ja": "短い作業ブランチの運用"
    },
    "note": {
      "ko": "작업은 feature/ui-banner에서 수정·add·commit한 뒤 합칩니다. 아래 merge는 로컬 통합 예시이며 PR이 필수인 팀에서는 PR로 대체합니다.",
      "ja": "feature/ui-banner で変更・add・commit してから統合します。下の merge はローカル統合の例で、PR 必須のチームでは PR に置き換えます。"
    },
    "steps": [
      {
        "command": "git switch -c feature/ui-banner main",
        "description": {
          "ko": "main을 기준으로 짧은 작업 브랜치를 만듭니다.",
          "ja": "main から短い作業ブランチを作ります。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "작업 커밋 후 기준 브랜치로 돌아옵니다.",
          "ja": "作業のコミット後に基準ブランチへ戻ります。"
        }
      },
      {
        "command": "git merge --no-ff feature/ui-banner",
        "description": {
          "ko": "검증한 작업을 통합합니다.",
          "ja": "確認した作業を統合します。"
        }
      },
      {
        "command": "git branch -d feature/ui-banner",
        "description": {
          "ko": "합친 작업 브랜치를 정리합니다.",
          "ja": "統合した作業ブランチを整理します。"
        }
      }
    ]
  },
  "hotfix": {
    "title": {
      "ko": "긴급 수정 브랜치 운용",
      "ja": "緊急修正ブランチの運用"
    },
    "note": {
      "ko": "수정 파일을 add·commit하고 검증한 뒤 main에 반영합니다. 다른 유지 브랜치에도 필요하면 팀 규칙에 따라 같은 수정 커밋을 반영합니다.",
      "ja": "修正を add・commit して検証した後 main に取り込みます。他の維持ブランチにも必要ならチームの規則に従って同じ修正コミットを反映します。"
    },
    "steps": [
      {
        "command": "git switch -c hotfix/ui-block main",
        "description": {
          "ko": "main에서 긴급 수정 작업을 분리합니다.",
          "ja": "main から緊急修正の作業を分けます。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "수정을 커밋한 뒤 main으로 돌아옵니다.",
          "ja": "修正をコミットした後 main に戻ります。"
        }
      },
      {
        "command": "git merge --no-ff hotfix/ui-block",
        "description": {
          "ko": "검증된 긴급 수정을 main에 합칩니다.",
          "ja": "検証済みの緊急修正を main に統合します。"
        }
      },
      {
        "command": "git cherry-pick FIX_COMMIT_ID",
        "description": {
          "ko": "대안: 다른 대상 브랜치에서 필요한 수정 커밋만 가져옵니다. 이미 포함된 수정은 반복 적용하지 않습니다.",
          "ja": "代替操作: 別の対象ブランチで必要な修正コミットだけ取り込みます。取り込み済みなら繰り返し適用しません。"
        }
      }
    ]
  },
  "gitflow": {
    "title": {
      "ko": "Git Flow의 브랜치 작업",
      "ja": "Git Flow のブランチ操作"
    },
    "note": {
      "ko": "develop이 이미 있는 저장소의 예시입니다. 기능을 커밋하고 검증한 뒤 develop으로 합칩니다. release 준비와 긴급 수정은 별도 작업이므로 이어서 모두 실행하는 스크립트가 아닙니다.",
      "ja": "develop があるリポジトリの例です。機能をコミット・検証して develop に統合します。release 準備と緊急修正は別作業で、すべて続けて実行するスクリプトではありません。"
    },
    "steps": [
      {
        "command": "git switch -c feature/login-panel develop",
        "description": {
          "ko": "기능 작업은 develop에서 시작합니다.",
          "ja": "機能作業を develop から始めます。"
        }
      },
      {
        "command": "git switch develop",
        "description": {
          "ko": "작업 커밋 후 기능을 받을 develop으로 돌아옵니다.",
          "ja": "作業のコミット後に統合先 develop へ戻ります。"
        }
      },
      {
        "command": "git merge --no-ff feature/login-panel",
        "description": {
          "ko": "완성된 기능을 develop에 모읍니다.",
          "ja": "完成した機能を develop に統合します。"
        }
      },
      {
        "command": "git switch -c release/1.2 develop",
        "description": {
          "ko": "배포 준비 시점에 develop에서 release 브랜치를 만듭니다.",
          "ja": "リリース準備の時点で develop から release ブランチを作ります。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "배포 준비를 커밋·검증한 뒤 main으로 이동합니다.",
          "ja": "リリース準備をコミット・検証した後 main に移動します。"
        }
      },
      {
        "command": "git merge --no-ff release/1.2",
        "description": {
          "ko": "검증된 release를 main에 반영합니다.",
          "ja": "確認済みの release を main に取り込みます。"
        }
      },
      {
        "command": "git switch develop",
        "description": {
          "ko": "release에서 생긴 수정도 develop에 반영할 준비를 합니다.",
          "ja": "release での修正を develop にも取り込む準備をします。"
        }
      },
      {
        "command": "git merge --no-ff release/1.2",
        "description": {
          "ko": "배포 준비 중의 수정을 develop에도 통합합니다.",
          "ja": "リリース準備中の修正を develop にも統合します。"
        }
      },
      {
        "command": "git switch -c hotfix/login-safe-area main",
        "description": {
          "ko": "별도 긴급 수정은 main을 기준으로 시작합니다. 완료 후 main과 develop 양쪽에 반영합니다.",
          "ja": "別の緊急修正を main から始めます。完了後 main と develop の両方に取り込みます。"
        }
      }
    ]
  },
  "githubflow": {
    "title": {
      "ko": "GitHub Flow의 PR 작업",
      "ja": "GitHub Flow の PR 操作"
    },
    "note": {
      "ko": "feature에서 수정·add·commit하고 검증합니다. gh는 별도 GitHub CLI이며 로그인과 리포지토리 권한이 필요합니다.",
      "ja": "feature で変更・add・commit して検証します。gh は別の GitHub CLI で、ログインとリポジトリ権限が必要です。"
    },
    "steps": [
      {
        "command": "git switch -c feature/login-panel main",
        "description": {
          "ko": "main에서 리뷰할 작업 브랜치를 만듭니다.",
          "ja": "main からレビュー対象の作業ブランチを作ります。"
        }
      },
      {
        "command": "git push -u origin feature/login-panel",
        "description": {
          "ko": "커밋한 작업 브랜치를 공유합니다.",
          "ja": "コミットした作業ブランチを共有します。"
        }
      },
      {
        "command": "gh pr create --base main --head feature/login-panel",
        "description": {
          "ko": "작업을 설명하며 PR을 엽니다.",
          "ja": "作業を説明して PR を作成します。"
        }
      },
      {
        "command": "gh pr merge PR_NUMBER --merge",
        "description": {
          "ko": "리뷰와 필수 검사가 완료된 PR을 권한 있는 담당자가 머지합니다.",
          "ja": "レビューと必須チェックが完了した PR を権限を持つ担当者がマージします。"
        }
      }
    ]
  },
  "gitlabflow": {
    "title": {
      "ko": "환경 브랜치로 결과 전달하기",
      "ja": "環境ブランチへ結果を送る"
    },
    "note": {
      "ko": "main·staging·production이 이미 있는 예시입니다. feature의 수정·커밋과 각 환경의 검증·승인을 먼저 완료합니다. 브랜치 머지만으로 빌드나 배포가 자동 실행되는 것은 아니며 별도 CI 설정이 필요합니다.",
      "ja": "main・staging・production がある例です。feature の変更・コミットと各環境の検証・承認を先に完了します。ブランチのマージだけでビルドやデプロイが自動実行されるわけではなく、別途 CI 設定が必要です。"
    },
    "steps": [
      {
        "command": "git switch -c feature/login-panel main",
        "description": {
          "ko": "main에서 기능 작업을 시작합니다.",
          "ja": "main から機能作業を始めます。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "기능 커밋 후 main으로 이동합니다.",
          "ja": "機能のコミット後 main に移動します。"
        }
      },
      {
        "command": "git merge --no-ff feature/login-panel",
        "description": {
          "ko": "검증한 기능을 main에 합칩니다.",
          "ja": "確認した機能を main に統合します。"
        }
      },
      {
        "command": "git switch staging",
        "description": {
          "ko": "검수 환경 브랜치를 선택합니다.",
          "ja": "検証環境ブランチを選びます。"
        }
      },
      {
        "command": "git merge --no-ff main",
        "description": {
          "ko": "main의 결과를 staging에 반영합니다.",
          "ja": "main の結果を staging に取り込みます。"
        }
      },
      {
        "command": "git switch production",
        "description": {
          "ko": "검수와 승인이 끝난 뒤 운영 환경 브랜치로 이동합니다.",
          "ja": "検証と承認後に本番環境ブランチへ移動します。"
        }
      },
      {
        "command": "git merge --no-ff staging",
        "description": {
          "ko": "승인된 staging의 결과를 production에 반영합니다.",
          "ja": "承認済みの staging の結果を production に取り込みます。"
        }
      }
    ]
  },
  "tbd": {
    "title": {
      "ko": "작은 작업을 main에 자주 통합하기",
      "ja": "小さな作業を main に頻繁に統合する"
    },
    "note": {
      "ko": "작은 변경을 add·commit하고 빠른 검증을 마친 뒤 합칩니다. 통합·Push·PR 방식은 팀 규칙에 따릅니다.",
      "ja": "小さな変更を add・commit して素早く検証した後に統合します。統合・Push・PR の方法はチームの規則に従います。"
    },
    "steps": [
      {
        "command": "git switch -c task/login-copy main",
        "description": {
          "ko": "짧게 유지할 작업 브랜치를 만듭니다.",
          "ja": "短期間だけ維持する作業ブランチを作ります。"
        }
      },
      {
        "command": "git switch main",
        "description": {
          "ko": "작은 작업 커밋 후 main으로 돌아옵니다.",
          "ja": "小さな作業のコミット後 main に戻ります。"
        }
      },
      {
        "command": "git merge --no-ff task/login-copy",
        "description": {
          "ko": "검증한 변경을 바로 통합합니다.",
          "ja": "確認した変更をすぐに統合します。"
        }
      },
      {
        "command": "git branch -d task/login-copy",
        "description": {
          "ko": "통합한 임시 브랜치를 정리합니다.",
          "ja": "統合した一時ブランチを整理します。"
        }
      }
    ]
  },
  "conflict-inspect": {
    "title": {
      "ko": "충돌한 파일과 양쪽 내용 확인",
      "ja": "衝突ファイルと両側の内容の確認"
    },
    "note": {
      "ko": "main에서 feature/title-copy를 Merge하다 충돌한 상태를 예로 듭니다. FILE_PATH는 git status에 나온 실제 충돌 파일 경로로 바꿉니다.",
      "ja": "main に feature/title-copy を Merge して衝突した例です。FILE_PATH は git status に表示された実際の衝突ファイルに置き換えます。"
    },
    "steps": [
      {
        "command": "git status",
        "description": {
          "ko": "어떤 파일이 충돌했는지 확인합니다.",
          "ja": "どのファイルが衝突したか確認します。"
        }
      },
      {
        "command": "git diff -- FILE_PATH",
        "description": {
          "ko": "자동 통합이 끝나지 않은 부분과 충돌 표시를 확인합니다.",
          "ja": "自動統合が完了していない箇所と衝突マーカーを確認します。"
        }
      },
      {
        "command": "git show :2:FILE_PATH",
        "description": {
          "ko": "일반 Merge에서 현재 브랜치 쪽 파일 내용을 확인합니다.",
          "ja": "通常の Merge で現在のブランチ側のファイル内容を確認します。"
        }
      },
      {
        "command": "git show :3:FILE_PATH",
        "description": {
          "ko": "일반 Merge에서 합쳐 오는 브랜치 쪽 파일 내용을 확인합니다.",
          "ja": "通常の Merge で取り込むブランチ側のファイル内容を確認します。"
        }
      }
    ]
  },
  "conflict-finish": {
    "title": {
      "ko": "선택한 최종 결과를 기록하기",
      "ja": "選んだ最終結果の記録"
    },
    "note": {
      "ko": "편집기에서 양쪽 내용을 비교해 최종본을 저장하고 충돌 표시를 제거한 다음 실행합니다. 이 예시는 Merge 충돌입니다.",
      "ja": "エディターで両側を比較し、最終内容を保存して衝突マーカーを除いた後に実行します。この例は Merge の衝突です。"
    },
    "steps": [
      {
        "command": "git add -- FILE_PATH",
        "description": {
          "ko": "해결한 파일을 최종 결과로 스테이징합니다. 모든 충돌 파일에 반복합니다.",
          "ja": "解決したファイルを最終結果としてステージします。すべての衝突ファイルで繰り返します。"
        }
      },
      {
        "command": "git diff --staged --check",
        "description": {
          "ko": "남은 충돌 표시와 공백 문제를 확인합니다. 내용의 의미까지 판단하지는 않습니다.",
          "ja": "残った衝突マーカーと空白の問題を確認します。内容の意味までは判断しません。"
        }
      },
      {
        "command": "git status",
        "description": {
          "ko": "해결되지 않은 파일이 남지 않았는지 확인합니다.",
          "ja": "未解決のファイルが残っていないか確認します。"
        }
      },
      {
        "command": "git commit -m \"Resolve title copy conflict\"",
        "description": {
          "ko": "선택 이유를 설명하는 메시지로 Merge를 마무리합니다.",
          "ja": "選んだ理由を説明するメッセージで Merge を完了します。"
        }
      }
    ]
  },
  "conflict-choose": {
    "title": {
      "ko": "파일 전체를 한쪽으로 선택하거나 중단하기",
      "ja": "ファイル全体を片側から選ぶ・中止する"
    },
    "note": {
      "ko": "아래는 서로 다른 선택지입니다. --ours와 --theirs는 파일 전체를 덮어쓰므로 두 명령을 연달아 실행하지 않습니다. 일반 Merge에서는 ours가 현재 브랜치, theirs가 합쳐 오는 브랜치입니다. Rebase에서는 의미가 달라질 수 있습니다.",
      "ja": "以下は別々の選択肢です。--ours と --theirs はファイル全体を上書きするので続けて両方実行しません。通常の Merge では ours が現在のブランチ、theirs が取り込む側です。Rebase では意味が変わる場合があります。"
    },
    "steps": [
      {
        "command": "git restore --ours -- FILE_PATH",
        "description": {
          "ko": "대안 1: 현재 브랜치의 파일 전체를 선택합니다. 이후 내용을 확인하고 add·commit합니다.",
          "ja": "選択肢 1: 現在のブランチのファイル全体を選びます。内容を確認後 add・commit します。"
        }
      },
      {
        "command": "git restore --theirs -- FILE_PATH",
        "description": {
          "ko": "대안 2: 합쳐 오는 브랜치의 파일 전체를 선택합니다. 이후 내용을 확인하고 add·commit합니다.",
          "ja": "選択肢 2: 取り込む側のファイル全体を選びます。内容を確認後 add・commit します。"
        }
      },
      {
        "command": "git merge --abort",
        "description": {
          "ko": "대안 3: 현재 Merge를 중단하고 통합 전 상태 복원을 시도합니다.",
          "ja": "選択肢 3: 現在の Merge を中止し、統合前の状態への復元を試みます。"
        }
      }
    ]
  },
  "background": {
    "title": {
      "ko": "이 페이지의 명령어 안내",
      "ja": "このページのコマンド案内"
    },
    "note": {
      "ko": "이 페이지는 Git의 탄생 배경을 설명하므로 직접 대응하는 실행 명령어가 없습니다. 저장소·커밋·브랜치·머지의 명령어는 관련 장에서 확인할 수 있습니다.",
      "ja": "このページは Git の誕生の背景を説明するため、直接対応する実行コマンドはありません。リポジトリ・コミット・ブランチ・Merge のコマンドは関連する章で確認できます。"
    },
    "steps": []
  }
};
