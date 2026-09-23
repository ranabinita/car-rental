#!/usr/bin/env bash
set -o errexit

rm -rf dist
mkdir -p dist

cp *.html dist/
cp -r css dist/
cp -r js dist/
cp -r images dist/
cp -r components dist/