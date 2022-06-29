#!/usr/bin/env sh
 
file_name=$2
path=$1

current_time=$(date +%s)
 
new_fileName="$current_time-$file_name.ts"
echo "New Migration: " "$new_fileName"
 
touch "$path/$new_fileName"
echo "import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
" > $path/$new_fileName
echo "You should see new migration generated with timestamp on it.."