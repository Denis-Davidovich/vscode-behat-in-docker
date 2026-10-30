NODE ?= node
NPM ?= npm
CODE ?= code
VERSION := $(shell $(NODE) -p "require('./package.json').version")
# Build identity: 12 символов SHA, незакоммиченные правки дают суффикс -dirty
BUILD := $(shell git describe --always --abbrev=12 --dirty --exclude='*')
VSIX := vscode-behat-in-docker-localized-$(VERSION)+$(BUILD).vsix

.PHONY: help check test package install

help:
	@echo 'make check    Compile and lint'
	@echo 'make test     Run the extension tests in a VS Code test host'
	@echo 'make package  Build the VSIX as $(VERSION)+<git sha>'
	@echo 'make install  Build the VSIX and install it into VS Code'

node_modules: package-lock.json
	$(NPM) ci
	@touch node_modules

check: node_modules
	$(NPM) run compile
	$(NPM) run lint

test: node_modules
	$(NPM) test

package: check
	npx --yes @vscode/vsce package $(VERSION)+$(BUILD) --no-update-package-json --out $(VSIX)

install: package
	"$(CODE)" --install-extension $(VSIX) --force
