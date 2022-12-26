## Optimizing kubuntu desktop

Some useful links for optimizing system performance<br>
[Arch](https://wiki.archlinux.org/title/improving_performance)<br>
[KDE](https://wiki.archlinux.org/title/KDE)<br>
[Ubuntu](https://github.com/themagicalmammal/howtodebuntu#5-optimize-boot-time--ram-usage)<br>
[Ubuntu Desktop optimization](https://www.orangesputnik.eu/ubuntu-desktop-optimization/)<br>

My Setup  - Intel Haswell CPU OC'd to 4Ghz, Intel GPU, 16GB RAM, 2 SSD's - 120GB, 4TB HDD, 10Mbs Internet

Create [partitions](https://wiki.archlinux.org/title/partitioning) for each part of the install process
* EFI partition for UEFI Boot drive 512MB type fat32 /dev/sda1
* Root system partition remaining space type ext4 /dev/sda2
* Swap space partiton 16GB type swap /dev/sdb1
* Home partition/drive remaining space ssd /dev/sdb2
* Data drive 4TB hdd ext4 /dev/sdc1

Install as usual after creating partitions.

The [fstab](https://wiki.archlinux.org/title/fstab) file configures the mounted drives/partitions
Obtain UUID for each drive/partiton on system.
`lsblk -f`<br>
##### /etc/fstab 
``` 
Root / `UUID="" /              ext4    auto,noatime,errors=remount-ro 0  1
home   UUID="" /home           ext4    auto,noatime,nouser            0  1
Data   UUID="" /home/Data      ext4    auto,noatime,nouser            0  1
SWAP   UUID="" swap            swap    sw                             0  0
tmpfs          /tmp            tmpfs   auto,noatime,mode=1777         0  0
```
<br>
##### EXT4 options
* Enable fast_commit journal option speed up FS writes
`sudo tune2fs -O fast_commit /dev/sda2`
`sudo tune2fs -O fast_commit /dev/sdc2`

##### Grub options<br>
/etc/default/grub
`mitigations=off loglevel=3`

##### Modprobe<br>
/etc/modprobe.d<br>
Audio `/etc/modprobe.d/audio.conf`<br>
`options snd_hda_intel power_save=0 power_save_controller=N`<br>

GPU `/etc/modprobe.d/intel.conf`<br>
`options i915 modeset=1  mitigations=off fastboot=1 enable_fbc=1`<br>
 
After creating these files run `sudo update-initramfs -u`<br>
This wil update boot image to include the changes.<br>

### Disable some uneeded system services<br>
Disable ModemManager If you do not have a mobile broadband interface, you do not need this.<br>
```
sudo systemctl disable ModemManager.service
sudo systemctl mask ModemManager.service
```
<br>fwupd is a daemon allowing you to update some devices' firmware, including UEFI for several machines. <br>
Remove fwupd from boot<br>
```
sudo systemctl disable fwupd.service
sudo systemctl mask fwupd.service
```
<br>GPU-Manager is software that creates a xorg.conf for you. So running this in every boot is just overkill. You only need to run this if you change your GPU.<br>
```
sudo systemctl disable gpu-manager.service
sudo systemctl mask gpu-manager.service
```
<br>Apt-daily-upgrade solves long boot up time with apt-daily-upgrade.
```
sudo systemctl disable apt-daily.service
sudo systemctl disable apt-daily.timer
sudo systemctl mask apt-daily.timer
sudo systemctl disable apt-daily-upgrade.timer
sudo systemctl disable apt-daily-upgrade.service
sudo systemctl mask apt-daily-upgrade.service
```
<br>Logical Volume Manager (LVM) is a device mapper framework that provides logical volume management.<br>
Disable LVM<br>
```
sudo systemctl disable lvm2-monitor.service
sudo systemctl mask lvm2-monitor.service
````
#### [Optimize network MTU](https://appuals.com/how-to-optimize-ubuntu-internet-speed-with-mtu-settings/)<br> 
The ping command will let you know if the packet was sent as more than one fragment with multiple header data attached.<br>
`ping -s 1472 -c1 espn.com`
<br>Retest changing packet size until 0% packet loss<br>
#### Systemd-Resolve DNS security and caching, provides DNSSEC and DNS caching
```
/etc/systemd/resolved.conf
DNS=1.1.1.2
FallbackDNS=1.1.1.1
DNSOverTLS=opportunistic
DNSSEC=true
```
Tell Network Manager to use systemd-resolved
```
/etc/NetworkManager/conf.d/dns.conf
dns=systemd-resolved
```
Enable and start systemd-resolved<br>
Restart network to apply settings
```
systemctl start systemd-resolved
systemctl enable systemd-resolved
sudo systemctl restart NetworkManager.service
nmcli networking off
nmcli networking on
resolvectl
systemctl status systemd-resolved
```
#### [Remove snapd](https://haydenjames.io/remove-snap-ubuntu-22-04-lts/)<br>
```
snap list
sudo systemctl disable snapd.service
sudo systemctl disable snapd.socket
sudo systemctl disable snapd.seeded.service
sudo snap remove firefox
sudo snap remove snap-store
sudo snap remove gtk-common-themes
sudo snap remove gnome-3-38-2004
sudo snap remove core18
sudo snap remove snapd-desktop-integration
sudo rm -rf /var/cache/snapd/
sudo apt autoremove --purge snapd
rm -rf ~/snap
```
#### Install Firefox PPA
```
nano /etc/apt/preferences.d/firefox-no-snap
Package: firefox*
Pin: release o=Ubuntu*
Pin-Priority: -1
```
`sudo add-apt-repository ppa:mozillateam/ppa`
```
sudo apt update
sudo apt install firefox
```
### [systemd-boot](https://blobfolio.com/2018/replace-grub2-with-systemd-boot-on-ubuntu-18-04/), replace grub, speeds up boot time.<br>
#### [post=kernel-script](https://gist.github.com/txhammer68/84650da9037e9d4ca94613f266eab2c1)
`sudo bootctl install --path=/boot/efi`<br>
```
ROOTFLAGS="quiet apparmor=1 security=apparmor loglevel=3  mitigations=off udev.log_priority=3 resume=UUID=123"
ROOTFLAGS1="quiet apparmor=1 security=apparmor loglevel=3  mitigations=off udev.log_priority=3 resume=UUID=123 3"
```
#### [Firefox smooth scroll](https://github.com/AveYo/fox/blob/main/Natural%20Smooth%20Scrolling%20for%20user.js)<br>
#### [xanmod kernel](https://xanmod.org/)<br>
