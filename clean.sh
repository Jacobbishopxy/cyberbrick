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
for serverPID in `lsof -i :2009,8000,7999 |awk '{print $2}'`
do
    if [ $serverPID != "PID" ]; then
        kill $serverPID
    fi
	# kill -9 $proclist
done