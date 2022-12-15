## Optimizing kubuntu desktop


Some useful links for optimizing system performance<br>
[Arch](https://wiki.archlinux.org/title/improving_performance)<br>
[KDE](https://wiki.archlinux.org/title/KDE)<br>
[Ubuntu](https://github.com/themagicalmammal/howtodebuntu#5-optimize-boot-time--ram-usage)<br>

Create [partitions](https://wiki.archlinux.org/title/partitioning) for each part of the install process
* EFI partition for UEFI Boot drive 512MB type fat32 /dev/sda1
* Root system partition remaining space type ext4 /dev/sda2
* Swap space partiton 16GB type swap /dev/sdb1
* Home partition/drive remaining space ssd /dev/sdb2
* Data drive 4TB hdd ext4 /dev/sdc1

Install as usual after creating partitions.

Edit the file in /etc/fstab<br>
The [fstab](https://wiki.archlinux.org/title/fstab) file configures the mounted drives/partitions
You will need the UUID for each drive/partiton on your system, as you will be mounting with custom parameters.
Launch konsole and run lsblk -f  to get the UUID of your drives, and replace the ones here with yours.<br>
Root / `UUID="" /               ext4    auto,noatime,errors=remount-ro 0       1`<br>
home   `UUID="" /home           ext4    auto,noatime,nouser       0       1`<br>
Data   `UUID="" /home/Data      ext4    auto,noatime,nouser       0       1`<br>
`tmpfs                                     /tmp           tmpfs   auto,noatime,mode=1777 0 0`<br>

Grub options<br>
/etc/default/grub
`mitigations=off loglevel=3`

Modprobe<br>
/etc/modprobe.d<br>
Audio `/etc/modprobe.d/audio.conf`<br>
`options snd_hda_intel power_save=0 power_save_controller=N`<br>

GPU `/etc/modprobe.d/intel.conf`<br>
`options i915 modeset=1  mitigations=off fastboot=1 enable_fbc=1`<br>
 
After creating these files run `sudo update-initramfs -u`<br>
This wil update boot image to include the changes.<br>
Disable ModemManager If you do not have a mobile broadband interface, you do not need this.<r>
`
sudo systemctl disable ModemManager.service
sudo systemctl mask ModemManager.service
`
 
Disable some uneeded system services<br>
fwupd is a simple daemon allowing you to update some devices' firmware, including UEFI for several machines. <br>
Remove fwupd from boot<br>
`
sudo systemctl disable fwupd.service
sudo systemctl mask fwupd.service
`
<br>GPU-Manager is software that creates a xorg.conf for you. So running this in every boot is just overkill. You only need to run this if you change your GPU.<br>
`
sudo systemctl disable gpu-manager.service
sudo systemctl mask gpu-manager.service
`
<br>Apt-daily-upgrade solves long boot up time with apt-daily-upgrade.
`
sudo systemctl disable apt-daily.service
sudo systemctl disable apt-daily.timer
sudo systemctl mask apt-daily.timer
sudo systemctl disable apt-daily-upgrade.timer
sudo systemctl disable apt-daily-upgrade.service
sudo systemctl mask apt-daily-upgrade.service
`
<br>
Logical Volume Manager (LVM) is a device mapper framework that provides logical volume management.<br>
Disable LVM<br>
`
sudo systemctl disable lvm2-monitor.service
sudo systemctl mask lvm2-monitor.service
`
<br>[Optimize network MTU](https://appuals.com/how-to-optimize-ubuntu-internet-speed-with-mtu-settings/)<br> 
Remove snapd, ubuntu wants us to use snap, i do not care for it, [here are the steps](https://haydenjames.io/remove-snap-ubuntu-22-04-lts/)
to remove snapd and install firefox as a ppa.<br>
[Firefox smooth scroll](https://github.com/AveYo/fox/blob/main/Natural%20Smooth%20Scrolling%20for%20user.js)<br>
Install [xanmod kernel](https://xanmod.org/)<br>
Install [systemd-boot](https://blobfolio.com/2018/replace-grub2-with-systemd-boot-on-ubuntu-18-04/), replace grub, speeds up boot time by 5 secs.<br>
