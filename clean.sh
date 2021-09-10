#!/usr/bin/env bash

#if file exist, kill all the PID stored inside
if [ -f "./.myAppPID" ]; then
    for serverPID in `cat ./.myAppPID`
    do
        kill -9 $serverPID
    done
    rm ./.myAppPID
fi

#unbind port 2009 from localhost
for serverPID in `lsof -i :8000,8020,8030 |awk '{print $2}'`
do
    if [ $serverPID != "PID" ]; then
        kill $serverPID
    fi
	# kill -9 $proclist
done
