#! /usr/bin/env bash

script_dir="$(dirname "$(readlink -f "$0")")"
posts_dir="${script_dir}/content/posts"

post_filename_to_post_number() {
    local post_filename="$1"
    post_filename="${post_filename%.md}"
    post_filename="${post_filename##*/}"
    echo "$post_filename"
}

highest_post_number=0
for post_filename in "${posts_dir}"/*; do
    post_number="$(post_filename_to_post_number "$post_filename")"
    if (( post_number > highest_post_number )); then
        highest_post_number="$post_number"
    fi
done

new_post_filename="${posts_dir}/$(( highest_post_number + 1)).md"
echo "$new_post_filename"
echo "---
title: \"Title\"
date: \"$(date -I)\"
categories: \"category\"
tags:
- tag
summary: A short summary
---
"> "$new_post_filename"

exec "${EDITOR:-vim}" "$new_post_filename"
