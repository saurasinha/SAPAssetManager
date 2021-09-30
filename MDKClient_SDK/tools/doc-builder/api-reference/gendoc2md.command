#!/bin/bash
update_md () {
  for filename in "$1"/*; do
    if [ -d "$filename" ]; then
      # walk thru subdirectories recursively
      update_md "$filename"
    elif [ ${filename: -3} == ".md" ]; then
      echo "$filename"
      basename=$(basename $filename)
      # Remove the file name and line number for the function, such as "Defined in app/context/ClientAPI.ts:98"
      sed -i "" -e 's/Defined in mdk-core.*//' "$filename"  
      # Remove the first a few lines until first #
      sed -i "" '/#/, $!d' "$filename" 
      # replace the ## Index with ## Summary
      sed -i "" -e 's/## Index/## Summary/' "$filename" 
    else 
      printf '.'
    fi
  done
}

update_readme () {
  filename=$1"/README.md"
  echo "Updating README.md ..." 
  # add a H1 Overview section and description at the top
  sed -i "" -e 's/## Summary/# Overview \
  This document provides information of the client APIs available to the developers. ## Summary/' "$filename" 
  sed -i "" -e 's/## Summary/\
## Summary/' "$filename"
  # remove content after "### Type aliases" (workaround solution)
  sed -i "" '/### Type aliases/, $d' "$filename" 
  #rename README.md to index.md
  filename_new=$1"/index.md"
  mv -f "$filename" "$filename_new"
}

update_dataquerybuilder () {
  folder="$1"
  filename=$1"/classes/dataquerybuilder.md"
  echo "Updating DataQueryBuilder.md ..." 
  # remove unneccessory char
  sed -i "" -e 's/▪//g' "$filename"
}

# Command for generating API reference document in MD format.
cd "$( dirname "${BASH_SOURCE[0]}" )"
./node_modules/.bin/typedoc --options ./typedocconfig_md.ts >/dev/null 2>&1
echo "Removing the file name and line number for the function definition"
update_md ../../../tmpapidocs/apidoc
update_readme ../../../tmpapidocs/apidoc
update_dataquerybuilder ../../../tmpapidocs/apidoc

cp -r ../../../tmpapidocs/apidoc  ../../../api-reference-docs/docs-en/docs/reference
rm -fR ../../../tmpapidocs/
