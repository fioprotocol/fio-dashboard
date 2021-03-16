#!/bin/bash
set -e

# colors for output
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
echo -e "${YELLOW}\n***********************************************************************${NC}"
echo -e "${YELLOW}\n**************************Prepare vars*********************************${NC}"
[ -z "${NODE_ENV}" ] && export NODE_ENV="production"

[ -z "${WORK_DIR}" ]    && echo "***[ERROR]*** WORK_DIR is undefined" && export DEP_ERROR=1
[ -z "${SERVERS_IP}" ]  && export SERVERS_IP=${SERVER_IP};
[ -z "${SERVERS_IP}" ]  && echo "***[ERROR]*** SERVERS_IP or SERVER_IP is undefined" && export DEP_ERROR=1
[ -z "${SERVER_USER}" ] && echo "***[ERROR]*** SERVER_USER is undefined" && export DEP_ERROR=1
[ -z "${SERVER_PORT}" ] && echo "***[ERROR]*** SERVER_PORT is undefined" && export DEP_ERROR=1
[ -z "${RUN_USER}" ]    && echo "***[ERROR]*** RUN_USER is undefined" && export DEP_ERROR=1

[ "${DEP_ERROR}" = "1" ] && exit 1
for SERVER in ${SERVERS_IP}; do
	echo -e "${YELLOW}\n******************* Processing server ${SERVER} ********************${NC}"
	echo -e "${YELLOW}\n**************************Prepare configs******************************${NC}"
	rm -f ./pm2.json
	envsubst '${WORK_DIR} ${NODE_ENV}' < ./bin/pm2.json.template > ./pm2.json
	echo -e "${YELLOW}\n***********************************************************************${NC}"
	echo -e "${YELLOW}\n**************************Make directory*******************************${NC}"
	ssh ${SERVER_USER}@${SERVER} -o StrictHostKeyChecking=no -p ${SERVER_PORT} "sudo mkdir -p ${WORK_DIR} && sudo mkdir -p ${WORK_DIR}/logs && sudo mkdir -p ${WORK_DIR}/client && sudo chown -R ${RUN_USER}:${RUN_USER} ${WORK_DIR}"
	echo -e "${YELLOW}\n**************************Copy files to destination********************${NC}"
	rsync -e "ssh -o StrictHostKeyChecking=no -p ${SERVER_PORT}" --rsync-path="sudo rsync" -vcrlpogz --super --delete --chown="${RUN_USER}:${RUN_USER}" --exclude-from="./bin/.rsyncingnore-client" ./client/build/ ${SERVER_USER}@${SERVER}:${WORK_DIR}/client
	rsync -e "ssh -o StrictHostKeyChecking=no -p ${SERVER_PORT}" --rsync-path="sudo rsync" -vcrlpogz --super --delete --chown="${RUN_USER}:${RUN_USER}" --exclude-from="./bin/.rsyncingnore-server" ./ ${SERVER_USER}@${SERVER}:${WORK_DIR}
	echo -e "${YELLOW}\n**************************Post copy processing*************************${NC}"
	ssh ${SERVER_USER}@${SERVER} -o StrictHostKeyChecking=no -p ${SERVER_PORT} "sudo su - ${RUN_USER} -c \"cd ${WORK_DIR} && npm install --production && pm2 startOrRestart ./pm2.json && pm2 save\""
	echo -e "${YELLOW}\n**************************Finish***************************************${NC}"
	echo -e "${YELLOW}\n***********************************************************************${NC}"
done
