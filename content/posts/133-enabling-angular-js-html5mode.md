---
title: Enabling angular-js html5mode
slug: "133"
date: 2016-06-14T12:00:00Z
categories: "Linux Administration"
tags:
- html5mode
- angular
---
    location ~ ^/(data|html|css|js)/ {
        try_files $uri $uri/ =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

