#!/bin/bash

FILES=(getBalances.json validators.json eventsStats.json alerts.json)

check_files_exist() {
  rc=0
  for f in "${FILES[@]}"; do
    command="test -f responses/bridge/$f"
    (docker-compose -f ../e2e-commons/docker-compose.yml exec -T monitor /bin/bash -c "$command") || rc=1
    (docker-compose -f ../e2e-commons/docker-compose.yml exec -T monitor-erc20 /bin/bash -c "$command") || rc=1
    (docker-compose -f ../e2e-commons/docker-compose.yml exec -T monitor-erc20-native /bin/bash -c "$command") || rc=1
    (docker-compose -f ../e2e-commons/docker-compose.yml exec -T monitor-amb /bin/bash -c "$command") || rc=1
  done
  return $rc
}

i=0
until check_files_exist
do
  ((i++))
  if [ "$i" -gt 30 ]
  then
    exit -1
  fi

  echo "Waiting for monitor to start..."
  sleep 3
done

echo "Monitor started"
