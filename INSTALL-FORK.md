# Установка Behat in Docker (Localized)

Fork [`Michael-vb/vscode-behat-in-docker`](https://github.com/Michael-vb/vscode-behat-in-docker)
(расширение `xMIkeXeeioi.vscode-behat-in-docker`). Что он добавляет:

- обнаружение сценариев с русскими ключевыми словами Gherkin;
- исключение вложенных worktree и зависимостей из обнаружения;
- `behatDocker.projectPath` для проекта, вложенного в папку workspace.

Исходное расширение нельзя оставлять активным вместе с fork: у них общие
настройки `behatDocker.*` и один идентификатор Test Controller.

## Сборка и установка

```bash
cd /Volumes/Data/work/dev.lab/platform/vscode-ext/vscode-behat-in-docker
make install
```

Команда сама установит зависимости, скомпилирует и проверит код, соберёт VSIX
и установит его. Затем выполните в VS Code команду `Developer: Reload Window`.
`Developer: Restart Extension Host` здесь не подходит: хост стартует с прежним
списком расширений, и окно продолжает работать на старой версии.

Версия сборки — это версия из `package.json` и SHA коммита в SemVer build
metadata, например `0.3.0+b0b4e619f00b`. Суффикс `-dirty` означает сборку с
незакоммиченными правками.

Проверка установленной версии:

```bash
code --list-extensions --show-versions \
  | rg '^denis-davidovich\.vscode-behat-in-docker-localized@'
```

Эта команда показывает версию на диске, а не запущенную в окне. Запущенную
показывает `Developer: Show Running Extensions`.

## Настройка проекта

Расширение выполняет `docker exec`, поэтому контейнер должен быть запущен.
Если в контейнер смонтирована не вся папка workspace, а вложенный проект,
укажите его в `projectPath`. Пример для `reseller-server`, где workspace — это
`online-sim`, а в `/var/www` смонтирован `reseller-server/www`:

```json
{
  "behatDocker.containerName": "php",
  "behatDocker.projectPath": "reseller-server/www"
}
```

## Обновление локальной сборки

```bash
cd /Volumes/Data/work/dev.lab/platform/vscode-ext/vscode-behat-in-docker
git pull --ff-only
make install
```

Затем выполните `Developer: Reload Window`.

## Выпуск версии

1. Изменение идёт обычным путём платформы: worktree → ветка → PR → CI →
   merge commit (`platform/docs/git-merge-policy.md`).
2. Версию в `package.json` и `CHANGELOG.md` поднимает сам PR: `feat:` — minor,
   `fix:` — patch.
3. После merge выполните `make install` из чистого `main` и запустите сценарий
   из Test Explorer.
4. Только после этого создайте тег `vX.Y.Z` и GitHub Release: тег до проверки
   запрещён (`platform/docs/tagged-release-guide.md`).

## Настройка клона и GitHub-репозитория

В клоне два remote, поэтому `gh` может выбрать upstream и отправить PR в чужой
репозиторий. Один раз на клон закрепите fork:

```bash
gh repo set-default Denis-Davidovich/vscode-behat-in-docker
```

База из `platform/docs/git-merge-policy.md` применена 2026-10-30 через GitHub
API: merge commits включены, squash и rebase выключены, head-ветки удаляются
автоматически.

## Возврат к исходному расширению

```bash
code --uninstall-extension denis-davidovich.vscode-behat-in-docker-localized
code --install-extension xMIkeXeeioi.vscode-behat-in-docker
```

`behatDocker.projectPath` в исходном расширении не работает: проект должен быть
корнем workspace.
