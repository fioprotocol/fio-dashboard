#!/bin/bash

[ ! -f ./client/.env ] || export $(grep -v '^#' ./client/.env | xargs)

PATH_TO_WIDGET_BUILD=./client/build/${REACT_APP_WIDGET}
SCRIPT_FILE_NAME=${REACT_APP_WIDGET}.js
WIDGET_EXAMPLE=widget.html
WIDGET_SCRIPT_FILE_NAME=${PATH_TO_WIDGET_BUILD}/${SCRIPT_FILE_NAME}

cp ./client/generic-widget.js ${WIDGET_SCRIPT_FILE_NAME}

chmod 777 -R ${WIDGET_SCRIPT_FILE_NAME}

PATH_TO_MANIFEST_JSON=${PATH_TO_WIDGET_BUILD}/asset-manifest.json

touch ${PATH_TO_WIDGET_BUILD}/${WIDGET_EXAMPLE}

cat > ${PATH_TO_WIDGET_BUILD}/${WIDGET_EXAMPLE}<< EOF

<div id="${REACT_APP_WIDGET}"></div>
<script type="text/javascript" src="${WIDGET_PUBLIC_URL}/${REACT_APP_WIDGET}/${SCRIPT_FILE_NAME}"></script>

EOF

for x in $(cat ${PATH_TO_MANIFEST_JSON} | jq '.files[]' | grep -E 'chunk.js"|runtime-main.*.js"')
do
echo "loadJsFile($x);" | tee -a ${WIDGET_SCRIPT_FILE_NAME}
done

for y in $(cat ${PATH_TO_MANIFEST_JSON} | jq '.files[]' | grep -v 'main.*.chunk.css"' | grep -E 'chunk.css"')
do
echo "loadCssFile($y);" | tee -a ${WIDGET_SCRIPT_FILE_NAME}
done

for z in $(cat ${PATH_TO_MANIFEST_JSON} | jq '.files[]' | grep -E 'main.*.chunk.css"')
do
echo "loadCssFile($z);" | tee -a ${WIDGET_SCRIPT_FILE_NAME}
done

