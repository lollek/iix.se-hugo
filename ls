#! /usr/bin/env bash


categories() {
    case "$1" in
        "" | "list")
            ag --nobreak --nonumbers --nogroup --nofilename -G 'content/posts/.*\.md' -o '(?<=categories: ).*' | sort | uniq -c | sort -nr
            ;;
        *)
            files="$(ag --files-with-matches -G 'content/posts/.*\.md' "categories: \"$1\"")"
            ag --nonumber --noheading --nobreak -o '(?<=title: ).*' $files
            ;;
    esac
}

case "$1" in
    "")
        ag --nonumber --noheading --nobreak -G 'content/posts/.*\.md' -o '(?<=title: ).*'
        ;;
    "categories"|"cat")
        shift
        categories $@
        ;;
    "--help"|"-h")
        echo "Usage: $0 categories" >&2
        exit 1
        ;;
esac
