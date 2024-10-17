ARG DEBIAN_FRONTEND=noninteractive

FROM httpd:2.4.54-alpine AS base-image

FROM  node:16.19.1-bullseye AS compile-image

RUN mkdir -p app

WORKDIR /home/app

COPY . .


RUN npm install

RUN ls -la

RUN npm run build

# RUN ls -la dist/desk-of-sales-frontend/

RUN touch e-procurement.tar.gz
RUN tar --exclude=om.tar.gz -zcvf om.tar.gz dist/

# RUN cd dist/desk-of-sales-frontend/ &&  tar -czf htdocs.tar.gz dist/

FROM base-image
COPY . /usr/local/apache2/htdocs
COPY --from=compile-image /home/app/om.tar.gz  /usr/local/apache2/htdocs/om.tar.gz

RUN cd /usr/local/apache2/htdocs && tar -xvzf /usr/local/apache2/htdocs/om.tar.gz

RUN apk add rsync

WORKDIR /usr/local/apache2/htdocs

RUN rsync -a dist/vend-auth/ /usr/local/apache2/htdocs
RUN  rm /usr/local/apache2/htdocs/om.tar.gz
RUN  rm -rf /usr/local/apache2/htdocs/dist

RUN ls -la /usr/local/apache2/htdocs

# RUN a2enmod ssl

COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY .htaccess /usr/local/apache2/htdocs
