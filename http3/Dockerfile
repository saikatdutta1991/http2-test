# Use a base image with necessary build tools
FROM debian:bullseye

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    autoconf \
    automake \
    libtool \
    pkg-config \
    libssl-dev \
    libnghttp2-dev \
    curl \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install APR and APR-Util
RUN wget https://downloads.apache.org/apr/apr-1.7.4.tar.gz && \
    tar xzf apr-1.7.4.tar.gz && \
    cd apr-1.7.4 && \
    ./configure && \
    make && \
    make install && \
    cd .. && \
    rm -rf apr-1.7.4 apr-1.7.4.tar.gz

RUN wget https://downloads.apache.org/apr/apr-util-1.6.3.tar.gz && \
    tar xzf apr-util-1.6.3.tar.gz && \
    cd apr-util-1.6.3 && \
    ./configure --with-apr=/usr/local/apr && \
    make && \
    make install && \
    cd .. && \
    rm -rf apr-util-1.6.3 apr-util-1.6.3.tar.gz

# Build and install nghttp3
RUN curl -LO https://github.com/ngtcp2/nghttp3/releases/download/v0.2.0/nghttp3-0.2.0.tar.gz && \
    tar xzf nghttp3-0.2.0.tar.gz && \
    cd nghttp3-0.2.0 && \
    ./configure && \
    make && \
    make install && \
    cd .. && \
    rm -rf nghttp3-0.2.0 nghttp3-0.2.0.tar.gz

# Install Apache with HTTP/3 support
RUN curl -O https://downloads.apache.org/httpd/httpd-2.4.62.tar.gz && \
    tar xzf httpd-2.4.62.tar.gz && \
    cd httpd-2.4.62 && \
    ./configure --enable-ssl --enable-so --with-nghttp2 --with-nghttp3 && \
    make && \
    make install

# Create directories for logs and configuration
RUN mkdir -p /usr/local/apache2/conf /usr/local/apache2/logs /usr/local/apache2/htdocs

# Copy custom Apache configuration
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf

# Expose HTTP/3 port (443 for HTTPS with QUIC)
EXPOSE 80 443/udp 443/tcp

# Start Apache
CMD ["/usr/local/apache2/bin/httpd", "-D", "FOREGROUND"]