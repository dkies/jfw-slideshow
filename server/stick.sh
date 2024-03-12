#!/bin/bash

MOUNT_PATH="/var/www/html/images"
JSON_PATH="/var/www/html/bilder.json"

if [ "$1" == "remove" ]; then
    # Leeren der JSON-Datei, wenn der Stick entfernt wird
    echo "{\"bilder\": []}" > $JSON_PATH
    # Entfernen des Mount-Points
    umount $MOUNT_PATH
else
    sleep 5
    DEVICE=$(lsblk -rpo "name,type" | awk '$2=="part" {print $1}' | head -1)
    mkdir -p $MOUNT_PATH
    # mount for user www-data -> uid=33,gid=33
    mount $DEVICE $MOUNT_PATH -o uid=33,gid=33,ro
    cd $MOUNT_PATH
    FILES=(*.jpg)
    echo "{\"bilder\": [" > $JSON_PATH
    for FILE in "${FILES[@]}"; do
        echo "\"images/$FILE\"," >> $JSON_PATH
    done
    sed '$ s/,$/]}/' -i $JSON_PATH

    chown -R www-data:www-data $MOUNT_PATH/../
    cd ~
fi
