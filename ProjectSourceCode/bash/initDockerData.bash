#!/bin/bash

curl -v -X POST -H "Content-Type: multipart/form-data" -F "file=@../src/test_data/BerkeleyPDCalls.csv" http://localhost:5001/upload

