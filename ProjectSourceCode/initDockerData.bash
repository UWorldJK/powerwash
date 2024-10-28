#!/bin/bash

curl -v -X POST -H "Content-Type: multipart/form-data" -F "file=@BerkeleyPDCalls.csv" http://localhost:5001/upload

