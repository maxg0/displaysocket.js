#!/usr/bin/env bash

# copied directly from:
# http://www.gilluminate.com/2014/06/10/livereload-ssl-https-grunt-watch/
#
# TODO automatically fill in some good default values
# (when running this script it will prompt for values)
#
# used to create certs that are used by grunt to serve https pages so that we
# can get automatic access to the webcam (http needs to ask permission on every
# page reload)
FILENAME="ds"
openssl genrsa -out $FILENAME.key 1024
openssl req -new -key $FILENAME.key -out $FILENAME.csr
openssl x509 -req -in $FILENAME.csr -signkey $FILENAME.key -out $FILENAME.crt

