#!/bin/sh

./sports -redis=172.24.222.42:6379 -mongo=172.24.222.42:27017 -weed=172.24.222.42:9334 -cs=172.24.222.42:8087 -btcrpc=172.24.222.42:8110 > log.txt
