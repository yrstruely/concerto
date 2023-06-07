#!/bin/bash
 
# Code to build and push docker image to ECR repository
 
IMAGE_NAME="${bamboo_imageName}"                                     # Match to the name of ECR repository
IMAGE_BUILD="${bamboo_planRepository_revision}"                         
ECR_URL="994338886544.dkr.ecr.ap-southeast-2.amazonaws.com"
GIT_EMAIL="${bamboo_BITBUCKET_EMAIL}"
GIT_USER="${bamboo_BITBUCKET_USERNAME}"
echo about to get docker image

# Explicitly pull the image down before building
docker pull "${ECR_URL}/${bamboo_baseImage}:latest"

docker build -t "${IMAGE_NAME}" \
	--build-arg GIT_USER="${GIT_USER}" \
	--build-arg GIT_EMAIL="${GIT_EMAIL}" \
	.

if [ $? -eq 0 ]
then
  	docker tag "${IMAGE_NAME}:latest" \
	                       "${ECR_URL}/${IMAGE_NAME}:latest"
	docker tag "${IMAGE_NAME}:latest" \
	           "${ECR_URL}/${IMAGE_NAME}:${IMAGE_BUILD}"
	docker push "${ECR_URL}/${IMAGE_NAME}:latest"
	docker push "${ECR_URL}/${IMAGE_NAME}:${IMAGE_BUILD}"

	mkdir -p artifacts
	echo "${IMAGE_BUILD}" > artifacts/image_tag.txt
  	exit 0
else
  	echo "There was a problem building the image" >&2
  	exit 1
fi
# NB: Add imageName and baseImage  as the build variables for the plan
