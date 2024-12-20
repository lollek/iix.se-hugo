#! /usr/bin/env bash

case "$1" in
"" | "list")
    ag --nobreak --nonumbers --nogroup --nofilename -G 'content/posts/.*\.md' -o '(?<=categories: ).*' | sort | uniq -c | sort -nr
    ;;
*)
    ag --files-with-matches -G 'content/posts/.*\.md' "categories: \"$1\""
    ;;
esac
