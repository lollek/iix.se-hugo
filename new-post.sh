#! /usr/bin/env bash

script_dir="$(cd "$(dirname "$0")" && pwd)"
posts_dir="${script_dir}/content/posts"

post_filename_to_post_number() {
    local post_filename="$1"
    post_filename="${post_filename%.md}"
    post_filename="${post_filename##*/}"
    echo "${post_filename%%-*}"
}

title="${1:?Usage: $0 \"Post title\"}"
title_slug="$(ruby -e 'puts ARGV.fetch(0).unicode_normalize(:nfkc).downcase.gsub(/[^\p{L}\p{N}]+/, "-").sub(/\A-/, "").sub(/-\z/, "")' "$title")"
escaped_title="${title//\\/\\\\}"
escaped_title="${escaped_title//\"/\\\"}"

highest_post_number=0
for post_filename in "${posts_dir}"/*; do
    post_number="$(post_filename_to_post_number "$post_filename")"
    if (( post_number > highest_post_number )); then
        highest_post_number="$post_number"
    fi
done

new_post_number="$(( highest_post_number + 1))"
new_post_filename="${posts_dir}/${new_post_number}-${title_slug}.md"
echo "$new_post_filename"
echo "---
title: \"${escaped_title}\"
slug: \"${new_post_number}\"
date: \"$(date -I)\"
categories: \"category\"
tags:
- tag
summary: A short summary
---
"> "$new_post_filename"

exec "${EDITOR:-vim}" "$new_post_filename"
