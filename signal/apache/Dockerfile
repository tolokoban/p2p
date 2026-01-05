FROM php:8.1-apache

COPY ./conf/apache2 /etc/

RUN apt-get update -y && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libzip-dev \
    zip \
    zlib1g-dev \
    libpng-dev \
    libjpeg-dev \
    zlib1g-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install -j$(nproc) \
    opcache \
    pdo_mysql \
    gd \
    zip

COPY ../www/conf/php.ini /usr/local/etc/php/conf.d/app.ini
