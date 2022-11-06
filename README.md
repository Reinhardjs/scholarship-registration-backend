# shoolarship-registration-backend

```
git clone [repository-url]
```

add .env
```
APP_NAME=scholarship-registration-mext

DB_USERNAME=lotusbcm_root
DB_PASSWORD=scholarship12345
DB_HOSTNAME=localhost
DB_NAME=lotusbcm_scholarship
DB_DIALECT=mysql
```

add .htaccess
```
Options +FollowSymLinks -Indexes
IndexIgnore *
DirectoryIndex
<IfModule mod_rewrite.c>
RewriteEngine on
# Simple URL redirect:
RewriteRule ^(.*)$ http://127.0.0.1:1234/$1 [P]
</IfModule>
```

dont forget too add this line at the bottom of app.js file
```
app.listen('1234')
```

In ssh, run these commands :
```
git pull
```

```
forever stop app.js
forever start app.js
```

or (if you already run forever start ...) you can simply run this command :
```
forever restart app.js
```
