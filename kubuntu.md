### Optimizing Kubuntu 24.04 LTS

Some useful links for optimizing system performance<br>
[Arch](https://wiki.archlinux.org/title/improving_performance)<br>
[KDE](https://wiki.archlinux.org/title/KDE)<br>
[Ubuntu](https://github.com/themagicalmammal/howtodebuntu#5-optimize-boot-time--ram-usage)<br>
[Ubuntu Desktop optimization](https://www.orangesputnik.eu/ubuntu-desktop-optimization/)<br>

#### My Setup  - Dell Optiplex 7050 Intel Core 5-Skylake CPU OC'd to 3.8Ghz, Intel GPU, 16GB RAM, 500GB NVME-SSD, 4TB HDD, 10Mib Internet

#### Some settings are specific for my system setup, use at own risk!

<picture>
  <img alt="system" src="images/system.png" width="80%">
</picture> <br>

### Pre Install Setup

Create [partitions](https://wiki.archlinux.org/title/partitioning) for each drive before the install process
* EFI partition for UEFI Boot drive 650MB type fat32 /dev/nvme0n1p1
* Root system partition remaining space type ext4 /dev/nvme0n1p2
* Swap space file 16GB
* Data drive 4TB hdd ext4 /dev/sdc1

Install as usual after creating partitions. <br>
Reboot <br>

Before making changes to your system run this, then again when finished <br>
Check system log for errors or issues <br>
``` free -m ``` <br>
``` sudo hdparm -t --direct /dev/nvme0n1p2 ``` <br>
``` systemd-analyze critical-chain ``` <br>
``` systemd-analyze --user blame ``` <br>

### fstab
The [fstab](https://wiki.archlinux.org/title/fstab) file configures the mounted drives/partitions
Obtain UUID for each drive/partiton on system.<br>
```
lsblk -f
```
##### /etc/fstab <br>
``` 
Root   UUID="" /               ext4    defaults,noatime,auto_da_alloc,inode_readahead_blks=64,errors=remount-ro 0  1
Data   UUID="" /home/Data      ext4    defaults,noatime,errors=remount-ro            0  2
```
### EXT4 options<br>
Enable fast_commit journal option speed up FS writes <br>
```
sudo tune2fs -O fast_commit /dev/nvme0n1p2
sudo tune2fs -O fast_commit /dev/sdc1
```
Verify
```
sudo tune2fs -l /dev/nvme0n1p2 | grep features
```
#### Set Disk Label
``` sudo e2label /dev/nvme0n1p2 "SYSTEM" ``` <br>

### Grub options<br>
/etc/default/grub<br>
```
mitigations=off loglevel=3
```

### CPUFreqUtils Change CPU Governor and Frequencies
/etc/init.d/cpufrequtils
```
ENABLE="true"
GOVERNOR="performance"
MAX_SPEED="3800"
MIN_SPEED="1600"
```

### Modprobe<br>
/etc/modprobe.d<br>
Audio /etc/modprobe.d/audio.conf
```
options snd_hda_intel power_save=0 power_save_controller=N
```
GPU /etc/modprobe.d/intel.conf
```
options i915 modeset=1 mitigations=off enable_fbc=0 enable_psr=0 enable_guc=-1
```
### Disable evbug logging
modprobe blacklist <br>
```
/etc/modprobe.d/blacklist.conf
blacklist evbug
```
After creating these files run <br>
```
sudo update-initramfs -u
```
This wil update boot image to include the changes.<br>
Reboot.<br>

### Disable some uneeded system services<br>
Disable ModemManager If you do not have a mobile broadband interface.
```
sudo systemctl disable ModemManager.service
sudo systemctl mask ModemManager.service
```
fwupd is a daemon allowing you to update some devices' firmware, including UEFI for several machines. <br>
Remove fwupd from boot
```
sudo systemctl disable fwupd.service
sudo systemctl mask fwupd.service
```
GPU-Manager is software that creates a xorg.conf for you. So running this in every boot is just overkill. You only need to run this if you change your GPU.
```
sudo systemctl disable gpu-manager.service
sudo systemctl mask gpu-manager.service
```
Apt-daily-upgrade solves long boot up time with apt-daily-upgrade.
```
sudo systemctl disable apt-daily.service
sudo systemctl disable apt-daily.timer
sudo systemctl mask apt-daily.timer
sudo systemctl disable apt-daily-upgrade.timer
sudo systemctl disable apt-daily-upgrade.service
sudo systemctl mask apt-daily-upgrade.service
```
<br>Logical Volume Manager (LVM) is a device mapper framework that provides logical volume management.<br>
Disable LVM
```
sudo systemctl disable lvm2-monitor.service
sudo systemctl mask lvm2-monitor.service
````
<br>Disable Wait for Network online service, slows down boot
```
sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl mask NetworkManager-wait-online.service
```

### journald logging
Change log retention and logging settings, check logs first for errors <br>
/etc/systemd/journald.conf<br>
```
MaxRetentionSec=3month
MaxFileSec=1month
MaxLevelStore=err
MaxLevelSyslog=err
MaxLevelKMsg=err
MaxLevelConsole=err
MaxLevelWall=emerg
```

### Set fsck check interval
50 boot-ups or 1 month, change devices for your system <br>
```
sudo tune2fs -c 50 -i 1m /dev/nvme0n1p2
sudo tune2fs -c 50 -i 1m /dev/sdb1
```

### [To automatically switch audio device to newly connected devices, create this file:](https://wiki.archlinux.org/title/PipeWire#Troubleshooting)
Used for HTPC connected to HDTV, when switching monitor outputs
```
/etc/pipewire/pipewire-pulse.conf.d/switch-on-connect.conf (or ~/.config/pipewire/pipewire-pulse.conf.d/switch-on-connect.conf)
```
override for pipewire-pulse.conf file
```
pulse.cmd = [
    { cmd = "load-module" args = "module-always-sink" flags = [ ] }
    { cmd = "load-module" args = "module-switch-on-connect" }
]
```
### [Better Pulse Audio Settings](https://medium.com/@gamunu/enable-high-quality-audio-on-linux-6f16f3fe7e1f)
/etc/pulse/daemon.conf
```
default-sample-format = float32le
default-sample-rate = 48000
alternate-sample-rate = 44100
default-sample-channels = 2
default-channel-map = front-left,front-right
default-fragments = 2
default-fragment-size-msec = 125
resample-method = soxr-vhq
avoid-resampling = yes
high-priority = yes
nice-level = -11
realtime-scheduling = yes
realtime-priority = 9
rlimit-rtprio = 9
daemonize = no
```
### Networking
#### systemd-resolved
systemd-resolved provides a system-level DNS cache that can substantially improve performance for applications that do not cache their own DNS results.  DNS queries and responses have traditionally been unencrypted, but more and more resolvers now support DNS over an encrypted TLS connection (DNS over TLS.) TLS can help ensure that no parties between the DNS server and the resolver can see or modify the DNS responses.

[CTRL Blog](https://www.ctrl.blog/entry/systemd-resolved.html)<br>
[Linux Insider](https://www.linuxinsider.com/story/be-it-resolved-systemd-shall-serve-dns-177275.html)<br>
[Blog](https://www.adityathebe.com/systemd-resolved-dns-over-tls/)<br>
Check Status
```
resolvectl status
```
Edit /etc/systemd/resolved.conf <br>
Add, change DNS to your preferred DNS server <br>
```
DNS=1.1.1.1
DNSSEC=yes
DNSOverTLS=yes
```
Change Network Manager <br>
/etc/NetworkManager/NetworkManager.conf<br>
```
[main]
dns=systemd-resolved
```

if working just restart after changes to resolved.conf file<br>
```
systemctl restart systemd-resolved.service
systemctl restart NetworkManager.service
```
if not running then<br>
```
systemctl enable systemd-resolved.service
systemctl start systemd-resolved.service
```
Verify Status<br>
```
resolvectl status
```
Some useful sites to verify internet security connection <br>
[Test your connection](https://internet.nl/)<br>
[IP Leak Test](https://ipleak.net/)<br>
[Cloudfare Test](https://1.1.1.1/help/)<br>

### NFS Shares
[NFS](https://www.linuxbabe.com/ubuntu/nfs-share)<br>
[NFS shares on Ubuntu](https://www.nodinrogers.com/post/2021-10-10-nfs-shares-on-ubuntu/)<br>
```
 sudo apt install nfs-kernel-server
```
Create /etc/exports
```
/home/data/Movies/    192.168.1.0/24(ro,sync,no_subtree_check,no_root_squash,all_squash)
```
```
sudo exportfs -ra
sudo systemctl restart nfs-server
```
mount share
```
sudo mount -t nfs -o resvport,ro 192.168.1.101:/home/data/Movies/ /home/matt/Temp/
sudo showmount -e
```
For iOS NFS path
``` 192.168.1.101:/home/data/Movies/ ```

### [Optimize network MTU](https://appuals.com/how-to-optimize-ubuntu-internet-speed-with-mtu-settings/)<br> 
The ping command will let you know if the packet was sent as more than one fragment with multiple header data attached.<br>
```
ping -s 1472 -c1 espn.com
```
Retest changing packet size until 0% packet loss<br>

### Sysctl Settings
[Arch](https://wiki.archlinux.org/title/Sysctl#Improving_performance) <br>
[Github](https://gist.github.com/JoeyBurzynski/a4359dd19b211e5c37b6fcd2eff67286) <br>
[Ubuntu](https://www.howtouseubuntu.com/cloud/understanding-etc-sysctl-conf-file-in-linux/) <br>
[sysAdmin](https://lonesysadmin.net/2013/12/22/better-linux-disk-caching-performance-vm-dirty_ratio/) <br>

Some useful sysctl settings place in /etc/sysctl.conf
```
kernel.sysrq=0
fs.file-max = 209708
net.ipv4.tcp_fastopen=3
net.core.default_qdisc=cake
net.ipv4.tcp_congestion_control=bbr
net.ipv4.tcp_window_scaling = 1
vm.swappiness = 1
vm.dirty_ratio = 30
vm.dirty_background_ratio = 5
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.ip_forward = 0
net.ipv4.route.flush = 1
net.ipv6.route.flush = 1
```

### [Remove snapd](https://haydenjames.io/remove-snap-ubuntu-22-04-lts/)<br>
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

cat <<EOF | sudo tee /etc/apt/preferences.d/nosnap.pref
# This file forbids snapd from ever being installed by APT.

Package: snapd
Pin: release a=*
Pin-Priority: -10
EOF
```
### KDE Plasma Fixes
X11 setup for dual monitors <br>
Run xrandr to get inuput id's <br>
Create /etc/X11/xorg.conf.d/10-monitor.conf <br>
```
  Section "Monitor"
    Identifier  "HDMI-3"
    Option      "Primary" "true"
    Option      "Enable"   "true"
    Option      "PreferredMode" "1920x1080x60.0"
    Option      "Broadcast RGB" "Full"
EndSection
Section "Monitor"
    Identifier  "HDMI-1"
    Option      "RightOf" "HDMI-3"
    Option      "Primary" "false"
    Option      "Disable"  "true"
    Option      "Enable"   "false"
    Option      "PreferredMode" "1920x1080x60.0"
    Option      "Broadcast RGB" "Full"
EndSection
```
This will allow SDDM to show login prompt focused on primary screen. <br>
After creating this file run <br>
```
sudo update-initramfs -u
```

WSL messes up Qt.openUrlExternally() <br>
```sudo mv /usr/share/applications/wslview.desktop /usr/share/applications/wslview.desktop.disabled```
MSFT is starting to mess with my linux desktop :( <br>
Disable Qt Logging, add to /etc/environment or .bashrc <br>
```
QT_LOGGING_RULES="*.debug=false;qt*.debug=false;qt5.debug=false;*.warning=false;*.critical=false;qt.qpa.xcb.xcberror.warning=false;qt.qpa.xcb.xcberror.error=false;qt.qpa.xcb.warning=false;qt.qpa.xcb.error=false;qt.qpa.xcb=false"
```
Allow xmlrequest for loading json files <br>
Add to /etc/environment or .bashrc <br>
``` QML_XHR_ALLOW_FILE_READ="1" ``` <br>
``` kdebugdialog5   - kde debugging settings```<br>
Remove extra fonts, check Noto Sans/Serif extra language fonts, unnecessary for most cases <br>
Run this after, clean font cache <br>
``` fc-cache -f -v ``` <br>

### Install Firefox PPA
[FireFox](https://support.mozilla.org/en-US/kb/install-firefox-linux)<br>
#### Firefox Extensions
* [Youtube enhancer extension](https://addons.mozilla.org/en-US/firefox/addon/enhancer-for-youtube/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)<br>
* [Origin Ad-Blocker](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)<br>
* [Cookies](https://addons.mozilla.org/en-US/firefox/addon/i-dont-care-about-cookies/)<br>
* [Duck-Duck Go](https://addons.mozilla.org/en-US/firefox/addon/duckduckgo-for-firefox/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)<br>
* [HLS D-L](https://addons.mozilla.org/en-US/firefox/addon/hls-downloader/) <br>
#### Firefox Config options
* [Firefox smooth scroll](https://github.com/AveYo/fox/blob/main/Natural%20Smooth%20Scrolling%20for%20user.js)<br>
* [Arch Firefox](https://wiki.archlinux.org/title/Firefox/Tweaks)<br>
* [Github](https://gist.github.com/RubenKelevra/fd66c2f856d703260ecdf0379c4f59db)<br>
* [FastFox](https://gist.github.com/RubenKelevra/fd66c2f856d703260ecdf0379c4f59db) <br>
* [BetterFox](https://github.com/yokoffing/Betterfox) <br>

### systemd-boot
* Replace grub, speeds up boot time.<br>
* [systemd-boot loader -  grub replacement](https://wiki.archlinux.org/title/systemd-boot) <br>
* [systemd-boot](https://blobfolio.com/2018/replace-grub2-with-systemd-boot-on-ubuntu-18-04/) <br>
* Custom scipt to update systemd-boot config files after kernel updates <br>
* [post-kernel-script](https://gist.github.com/txhammer68/84650da9037e9d4ca94613f266eab2c1) <br>
* [different script using kernel cmdline options](https://gist.github.com/gdamjan/ccdcda2c91119406a0f8d22f8b8f2c4a) <br>
#### Install systemd-boot loader <br>
```
sudo apt install systemd-boot
sudo bootctl install --path=/boot/efi
```
Root flags are same as grub options in /etc/default/grub <br>
```
ROOTFLAGS="root=UUID=efc95b50-5747-*** ro quiet nowatchdog preempt=voluntary threadirqs loglevel=3 mitigations=off resume=UUID=123"
ROOTFLAGS1="root=UUID=efc95b50-5747-*** ro quiet mitigations=off resume=UUID=123 3"
```
After install and setup of systemd-boot run <br>
```
sudo update-initramfs -u
```
Verify <br>
``` sudo bootctl ``` <br>
Reboot <br>
System should now be running at optimal performance and security

[Some usefull tips i have collected over the years](https://gist.github.com/txhammer68/487164d7e59df958bf41a12178dacd12)<br>

### [xanmod kernel](https://xanmod.org/)<br>

### [Customizing KDE Plasma Desktop](index.md)<br>
