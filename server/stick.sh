#!/bin/bash

MOUNT_PATH="/var/www/html/images"
JSON_PATH="/var/www/html/bilder.json"
LOG_PATH="/home/jfw/stick.log"

if [ "$1" == "remove" ]; then
    echo "triggered USB remove, wait 5 seconds." >> $LOG_PATH
    sleep 5
    echo "... now try to unmont the stick." >> $LOG_PATH
    # Leeren der JSON-Datei, wenn der Stick entfernt wird
    echo "{\"bilder\": []}" > $JSON_PATH
    # Entfernen des Mount-Points
    umount $MOUNT_PATH
else
    sleep 5
    DEVICE=$(lsblk -rpo "name,type" | awk '$2=="part" {print $1}' | head -1)
    mkdir -p $MOUNT_PATH
    # mount for user www-data -> uid=33,gid=33
    mount $DEVICE $MOUNT_PATH -o uid=33,gid=33
    cd $MOUNT_PATH || exit
    echo "{\"bilder\": [" > $JSON_PATH
    
    find . -type f -iregex '\./[^.].*\.\(jpg\|jpeg\|mov\|mp4\)' | while read -r file; do
        echo "\"images/$file\"," >> $JSON_PATH
    done

    sed '$ s/,$/]}/' -i $JSON_PATH

    chown -R www-data:www-data $MOUNT_PATH/../
    cd ~ || exit
fi
