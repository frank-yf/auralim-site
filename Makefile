.DEFAULT_GOAL := help
.PHONY: help dev check test build preview release-sync
help:
	@printf '%s\n' 'make dev           本机预览 http://127.0.0.1:4321' 'make check         Astro / TypeScript 检查' 'make test          网站交互逻辑和双语内容检查' 'make build         生成静态文件 dist/（不部署）' 'make preview       预览 dist/' 'make release-sync  从 GitHub 最新公开 Release 更新下载信息'
dev:
	npm run dev -- --port 4321
check:
	npm run check
test:
	npm test
build:
	npm run build
preview:
	npm run preview
release-sync:
	npm run release:sync
