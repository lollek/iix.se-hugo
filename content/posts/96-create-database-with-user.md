---
title: Create database with user
slug: "96"
date: 2017-12-18T12:00:00Z
categories: "Linux Administration"
tags:
- postgres
---
```bash
sudo -u postgres createuser USER
sudo -u postgres createdb DB
sudo -u postgres psql
```

```postgres
alter user USER with encrypted password 'PASS';
alter database DB owner to USER;
```
