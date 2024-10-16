# jfw - slideshow

## Install Steps

### install nginx
   ```bash
   sudo apt autoremove apache2
   sudo apt install nginx
   ```

### add udev rules to react to usb add/remove

   Aktuelle udevd verbieten vile Befehle wie zum Beispiel "mount". Dehalb hier der Umweg über systemd
   ```bash
   # /etc/udev/rules.d/100-usb-autoscript.rules
    ACTION=="add", KERNEL=="sd?[1-9]", SUBSYSTEM=="block", TAG+="systemd", ENV{SYSTEMD_WANTS}+="usb-mount.service"
    ACTION=="remove", KERNEL=="sd?[1-9]", SUBSYSTEM=="block", TAG+="systemd", ENV{SYSTEMD_WANTS}+="usb-unmount.service"
   ```

   /etc/systemd/system/usb-mount.service
   ```bash
   [Unit]
   Description=Mount USB device

   [Service]
   Type=oneshot
   ExecStart=/pfad/zu/ihrem/script.sh

   [Install]
   WantedBy=multi-user.target
   ```

   /etc/systemd/system/usb-umount.service
   ```bash
   [Unit]
   Description=Unmount USB device

   [Service]
   Type=oneshot
   ExecStart=/pfad/zu/ihrem/script.sh remove

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   sudo udevadm control --reload-rules && sudo udevadm trigger
   ```

### Add script 
   ```bash stick.sh
    #!/bin/bash

    MOUNT_PATH="/var/www/html/images"
    JSON_PATH="/var/www/html/bilder.json"

    if [ "$1" == "remove" ]; then
        # Leeren der JSON-Datei, wenn der Stick entfernt wird
        echo "{\"bilder\": [\"bild_1.jpg\"]}" > $JSON_PATH
        # Entfernen des Mount-Points
        umount $MOUNT_PATH
    else
        sleep 5
        DEVICE=$(lsblk -rpo "name,type" | awk '$2=="part" {print $1}' | head -1)
        mkdir -p $MOUNT_PATH
        # mount for user www-data -> uid=33,gid=33
        mount $DEVICE $MOUNT_PATH -o uid=33,gid=33,ro
        cd $MOUNT_PATH

        echo "{\"bilder\": [" > $JSON_PATH
        find . -type f -iregex '.*\.\(jpg\|jpeg\|mov\|mp4\)' | while read -r file; do
            echo "\"images/$FILE\"," >> $JSON_PATH
        done
        sed '$ s/,$/]}/' -i $JSON_PATH

        chown -R www-data:www-data $MOUNT_PATH/../
        cd ~
    fi
   ```
   ```bash
   sudo chmod +x /path/to/script.sh
   ```
### add dist data to /var/www/html AND fix permissions to www-data
   ```bash
   sudo chown -R www-data:www-data /var/www/html/
   ```
### Remove mouse pointer
   ```bash
   sudo mv /usr/share/icons/PiXflat/cursors/left_ptr /usr/share/icons/PiXflat/cursors/left_ptr.bak
   ```

### Add kiosk browser to autostart and disable mouse pointer (Raspberry 5)
    ```bash
    vim ~/.config/wayfire.ini`
    ```
    
   ```bash
   [autostart]
   chromium = chromium-browser http://localhost --kiosk --noerrdialogs --disable-infobars --no-first-run --ozone-platform=wayland --enable-features=OverlayScrollbar --start-maximized --incognito
   ```



## TODO

- [] wechsel zwischen lokal und USB Stick optimieren
