.DEFAULT_GOAL := help # when you run make, it defaults to printing available commands

LOCAL_IMAGE_NAME  = ms-conference-bff
LOCAL_APP_FOLDER  = /application

ifeq ($(OS),Windows_NT)
	DIR := $(shell powershell "(New-Object -ComObject Scripting.FileSystemObject).GetFolder('.').ShortPath")
else
	DIR := "$$(pwd)"
endif

.PHONY: docker-clean
docker-clean: ## stop+kill all running containers. prune stopped containers. remove all untagged images
ifeq ($(OS),Windows_NT)
	powershell "docker ps -qa | foreach-object {docker kill $$_}; docker container prune --force; docker system prune --force;"
else
	docker ps -qa | xargs docker kill; docker container prune --force; docker system prune --force;
endif

.PHONY: build
build: ## build docker image
	docker build -t $(LOCAL_IMAGE_NAME) .

.PHONY: interactive
interactive: ## get a bash shell in the container
	docker run -it --workdir="$(LOCAL_APP_FOLDER)" \
		$(LOCAL_IMAGE_NAME):latest ls -al

.PHONY: launch
launch: docker-clean ## launch the multi-container on local machine
	docker-compose -f docker-compose.yml up

.PHONY: help
help:  ## show all make commands
ifeq ($(OS),Windows_NT)
	powershell "((type Makefile) -match '##') -notmatch 'grep'"
else
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
endif
