#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://create_user:9PFNYq6rQT5vJnix1LcNgpe2m6qzKAK4@dpg-csvpjd1opnds738607b0-a.oregon-postgres.render.com/create"

# Execute each .sql file in the directory
for file in  ./src/init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done
