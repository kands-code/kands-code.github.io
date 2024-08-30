#!/usr/bin/env bash
echo "clean old"
rm -r blogs/*
mdbook clean
echo "build new"
mdbook build
cp -r book/* blogs/
