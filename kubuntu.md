### Optimizing Kubuntu 24.04 LTS

Some useful links for optimizing system performance<br>
[Arch](https://wiki.archlinux.org/title/improving_performance)<br>
[KDE](https://wiki.archlinux.org/title/KDE)<br>
[Ubuntu](https://github.com/themagicalmammal/howtodebuntu#5-optimize-boot-time--ram-usage)<br>
[Ubuntu Desktop optimization](https://www.orangesputnik.eu/ubuntu-desktop-optimization/)<br>
[Ubuntu system hardening guide for desktops and servers](https://linux-audit.com/system-hardening/guides/ubuntu/)

#### My Setup
* Dell Optiplex 7050 Intel Core 5-Skylake CPU OC'd to 3.6Ghz 16GiB RAM, 500GiB NVME-SSD, 4TiB HDD
* Intel GPU 1920x1080 ,100Mib Internet

#### Caution, some settings are specific for my system setup, trying to get every performance gain i can on this older PC. 
#### **** USE At OWN RISK! ****

<picture>
  <img alt="system" src="images/system.png" width="80%">
</picture> <br>

### Pre Install Setup

Create [partitions](https://wiki.archlinux.org/title/partitioning) for each drive before the install process
* EFI partition for UEFI Boot drive 512MiB type fat32 /dev/nvme0n1p1
  * More space for custom kernel testing
* Root system partition remaining space type ext4 /dev/nvme0n1p2
* Swap space file 4GiB
* Data drive 4TiB hdd ext4 /dev/sdc1

Install as usual after creating partitions. <br>
Reboot <br>

### System Tuning
Before making changes to your system run these commands and take note of the info, then compare when finished <br>
Check system log for errors or issues, try to resolve those first before proceeding <br>
``` free -m ``` <br>
``` sudo hdparm -t --direct /dev/nvme0n1p2 ``` <br>
``` systemd-analyze critical-chain ``` <br>
``` systemd-analyze --user blame ``` <br>

#### fstab
The [fstab](https://wiki.archlinux.org/title/fstab) file configures the mounted drives/partitions
Obtain UUID for each drive/partiton on system.  [ext4](https://man7.org/linux/man-pages/man5/ext4.5.html) <br>
```
lsblk -f
```
edit /etc/fstab <br>
``` 
Root   UUID="" /               ext4    defaults,noatime,auto_da_alloc,inode_readahead_blks=64,errors=remount-ro   0 1
Data   UUID="" /home/Data      ext4    defaults,noatime,auto_da_alloc,inode_readahead_blks=64,errors=remount-ro   0 2
tmpfs         /tmp             tmpfs   defaults,rw,nosuid,nodev,size=50%,noatime,nr_inodes=10k,mode=1777 0 0
/swapfile     swap             swap    defaults,noatime   0 0
```
* noatime - disable access time stamps
* auto_da_alloc - If auto_da_alloc is enabled, ext4 will detect the replace via-rename and replace-via-truncate patterns and orce that any delayed allocation blocks are allocated such that at the next journal commit
* inode_readahead_blks - This tuning parameter controls the maximum number of inode table blocks that ext4's inode table adahead algorithm will pre-read into the buffer cache.  The value must be a power of 2. The default value is 32 blocks
  
### EXT4 options <br>
Enable fast_commit journal option speed up FS writes <br>
```
sudo tune2fs -O fast_commit /dev/nvme0n1p2
sudo tune2fs -O fast_commit /dev/sdc1
```
Verify
```
sudo tune2fs -l /dev/nvme0n1p2 | grep features
```
### Grub options <br>
/etc/default/grub<br>
* [Turning off CPU exploit mitigations may improve performance.](https://wiki.archlinux.org/title/Improving_performance#Turn_off_CPU_exploit_mitigations) <br>
```
ro quiet mitigations=off loglevel=3
```

### CPUFreqUtils Change CPU Governor and Frequencies <br>
/etc/init.d/cpufrequtils <br>
```
ENABLE="true"
GOVERNOR="performance"
MAX_SPEED="3600000"
MIN_SPEED="2000000"
```
### Intel GPU <br>
* [Intel](https://www.intel.com/content/www/us/en/content-details/609249/enabling-the-guc-huc-firmware-for-linux-on-new-intel-gpu-platforms.html) 
* [Arch](https://wiki.archlinux.org/title/Intel_graphics)
* [GitHub](https://gist.github.com/Brainiarc7/aa43570f512906e882ad6cdd835efe57)

i915 GPU settings edit /etc/modprobe.d/i915.conf <br>
```
options i915 modeset=1 mitigations=off enable_fbc=1 enable_guc=2 enable_psr=0
```
* Override the security mitigations default for the Intel graphics driver for perfromance gains.
* Framebuffer compression (FBC) is a feature that can reduce power consumption and memory bandwidth during screen refreshes.
* GuC is designed to perform graphics workload scheduling on the various graphics parallel engines, (better.faster x264 decoding)
* Panel Self Refresh (PSR), a power saving feature used by Intel iGPUs is known to cause flickering in some instances.
* Some usefull tools for Intel GPU's <br>
 ```
sudo apt install
intel-media-va-driver *(decode)
intel-media-va-driver-non-free *(encode)
firmware-misc-nonfree
intel-gpu-tools
```
Run ```sudo update-initramfs -u```
Verify changes after reboot
``` sudo systool -m i915 -av ```

### Additonal System Tuning
#### Sysctl Settings
[Arch](https://wiki.archlinux.org/title/Sysctl#Improving_performance) <br>
[Github](https://gist.github.com/JoeyBurzynski/a4359dd19b211e5c37b6fcd2eff67286) <br>
[Ubuntu](https://www.howtouseubuntu.com/cloud/understanding-etc-sysctl-conf-file-in-linux/) <br>
[sysAdmin](https://lonesysadmin.net/2013/12/22/better-linux-disk-caching-performance-vm-dirty_ratio/) <br>

Some useful sysctl settings edit /etc/sysctl.conf <br>
```
kernel.sysrq=0
kernel.nmi_watchdog=0
fs.file-max = 209708
net.ipv4.tcp_fastopen=3
net.core.default_qdisc=cake
net.ipv4.tcp_congestion_control=bbr
net.ipv4.tcp_window_scaling = 1
vm.swappiness = 1
vm.vfs_cache_pressure=40
# vm.dirty_ratio = 30
# vm.dirty_background_ratio = 5
# speed up usb transfers, can't have both ratio or bytes, this will sync usb copy after ~ 64Mib transfers
# if possible format usb as exFAT instead of FAT32 better results/performance
vm.dirty_bytes = 134217728 # 1Gib
vm.dirty_background_bytes = 64108864 # 64Mib
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
net.ipv4.ip_forward = 0
net.ipv4.tcp_mtu_probing = 1
net.ipv4.route.flush = 1
net.ipv6.route.flush = 1
```
### Modprobe various driver settings <br>
Disable power saving for audio device, remove pop sounds <br>
Audio Device - create /etc/modprobe.d/audio.conf
```
options snd_hda_intel power_save=0 power_save_controller=N
```
GPU - create /etc/modprobe.d/i915.conf
```
options i915 modeset=1 mitigations=off enable_fbc=1 enable_psr=0 enable_guc=2
```
After creating these files run <br>
```
sudo update-initramfs -u -k all
```
This wil update boot image to include the changes.<br>
Reboot.<br>

### Disable some uneeded system services <br>

Disable ModemManager If you do not have a mobile broadband interface.
```
sudo systemctl disable ModemManager.service
sudo systemctl mask ModemManager.service
```
fwupd is a daemon allowing you to update some devices' firmware, including UEFI for several machines. <br>
Remove fwupd from boot, newer hardware may want to leave this enabled for future updates...
```
sudo systemctl disable fwupd.service
sudo systemctl mask fwupd.service
```
GPU-Manager is software that creates a xorg.conf for you. So running this in every boot is just overkill. You only need to run this if you change your GPU.
```
sudo systemctl disable gpu-manager.service
sudo systemctl mask gpu-manager.service
```  
Logical Volume Manager (LVM) is a device mapper framework that provides logical volume management.<br>
Disable LVM
```
sudo systemctl disable lvm2-monitor.service
sudo systemctl mask lvm2-monitor.service
````
Disable Wait for Network online service, slows down boot
```
sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl mask NetworkManager-wait-online.service
```

#### Minimize logging <br>
* journald logging <br>
Change log retention and logging settings, check logs first for errors <br>
/etc/systemd/journald.conf <br>
```
MaxRetentionSec=3month
MaxFileSec=1month
MaxLevelStore=err
MaxLevelSyslog=err
MaxLevelKMsg=err
MaxLevelConsole=err
MaxLevelWall=emerg
```
#### Disable evbug logging <br>
EVBUG is the driver for the Linux kernel input subsystem's event debugging. Enabling the EVBUG driver (INPUT_EVBUG) will cause all input events to be logged to the system log... So all key presses, mouse movements, etc, will end up in the kernel log. That includes all key presses, so logging your passwords and other data to the kernel log. Practically a built-in kernel key logger. 
modprobe blacklist <br>
Not sure why this enabled on kubuntu maybe they forgot to disable after testing..., safe to disable <br>
```
/etc/modprobe.d/blacklist.conf
blacklist evbug
```
After creating these files run <br>
```
sudo update-initramfs -u
```
This wil update boot image to include the changes. <br>
Reboot.<br>
#### Set fsck check interval <br>
50 boot-ups or 1 month, change devices for your system <br>
```
sudo tune2fs -c 50 -i 1m /dev/nvme0n1p2
sudo tune2fs -c 50 -i 1m /dev/sdb1
```
### MultiMedia
* Restricted Codecs
```
sudo apt install gstreamer1.0-libav gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-vaapi libk3b-extracodecs lame libavcodec-extra libavcodec-extra60 intel-media-va-driver-non-free
```
#### [To automatically switch audio device to newly connected devices, create this file:](https://wiki.archlinux.org/title/PipeWire#Troubleshooting)
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
#### [Better Pulse Audio Settings](https://medium.com/@gamunu/enable-high-quality-audio-on-linux-6f16f3fe7e1f)
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

### [Optimize network MTU](https://appuals.com/how-to-optimize-ubuntu-internet-speed-with-mtu-settings/)<br> 
The ping command will let you know if the packet was sent as more than one fragment with multiple header data attached.<br>
```
ping -s 1472 -c1 espn.com
```
Retest changing packet size until 0% packet loss<br>

### NFS Shares <br>
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
```
Create /etc/apt/preferences.d/nosnap.pref <br>
This file forbids snapd from ever being installed by APT.
```
Package: snapd
Pin: release a=*
Pin-Priority: -10
```

### Install Firefox PPA <br>
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

### KDE Plasma Fixes
[kubuntu](https://www.kubuntuforums.net/forum/currently-supported-releases/kubuntu-24-04-nitpick-noble-lts/post-installation-az/678534-essential-and-strongly-recommended-things-to-do-directly-after-a-kubuntu-24-04-lts-installation) <br>

* Reduce systemd timeouts for desktop installations, the system will not "hang" for 90 seconds and longer from time to time when logging out, rebooting or shutting down. <br>
* Edit etc/systemd/system.conf.d/99-systemtimeout.conf <br>
Change line <br>
```
[Manager]
DefaultTimeoutStopSec=15s
```
Edit /etc/systemd/user.conf.d/99-usertimeout.conf <br>
Change line <br>
```
[Manager]
DefaultTimeoutStopSec=15s
```
* Disable fast user switching <br>
* Edit /usr/share/kubuntu-default-settings/kf5-settings/kdeglobals <br>
```
[KDE Action Restrictions]
switch_user=false
start_new_session=false
```
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
* Reboot to apply changes

### systemd-boot and Unified Kernel Images
* Replace grub, speeds up boot time, this is the future of Linux startup
* A Unified Kernel Image (UKI) is a combination of a UEFI boot stub program, a Linux kernel image, an initramfs, and further resources in a single UEFI PE file (device tree, cpu µcode, splash screen, secure boot sig/key, ...). This file can either be directly invoked by the UEFI firmware or through a boot loader.
* [systemd-boot loader -  grub replacement](https://wiki.archlinux.org/title/systemd-boot)
* [UKI](https://wiki.archlinux.org/title/Unified_kernel_image)
* [different script using kernel cmdline options](https://gist.github.com/gdamjan/ccdcda2c91119406a0f8d22f8b8f2c4a)
#### Install systemd-boot loader <br>
```
sudo apt install systemd-boot systemd-ukify
sudo bootctl install --path=/boot/efi
```
Create /boot/efi/loader/loader.conf
```
timeout 0
default ubuntu*
auto-entries 1
console-mode max
editor false
```
Create /etc/kernel/install.conf <br>
```
layout=uki
uki_generator=ukify
BOOT_ROOT=/boot/efi
```
Create /etc/kernel/uki.conf <br>
```
Cmdline=@/etc/kernel/cmdline
OSRelease=@/etc/os-release
Splash=/boot/bootSplash.bmp
```
edit /etc/kernel/cmdline <br>
Check /etc/default/grub for boot options of your system, add them here to cmdline
```
root=UUID=xxxyyy ro quiet raid=noautodetect nowatchdog preempt=voluntary threadirqs mitigations=off loglevel=3 rd.udev.log-priority=3 udev.log_priority=3
```
* preempt=voluntary reduces the maximum latency of rescheduling at the price of slightly lower throughput. As a result, faster application reactions, even when under load, are perceived to run more smoothly.
* threadirqs - Improved interrupt handling, by distributing interrupts across multiple threads, the system can handle a higher volume of interrupts concurrently, potentially reducing latency and improving responsiveness.
* [nowatchdog](https://wiki.archlinux.org/title/Improving_performance#Watchdogs) <br>

After install and setup of systemd-boot run <br>
```
sudo update-initramfs -u -k all
```
Verify <br>
``` sudo bootctl ``` <br>
Reboot <br>
* Verify systemd proper operation
* Select systemd-boot menu by pressing space bar during boot up
* System should now be running at optimal performance and security
* If all seems ok proceed to remove Grub

#### Remove Grub
```
sudo apt purge --allow-remove-essential grub2-common grub-pc-bin grub-pc grub-gfxpayload-lists grub-efi-amd64-bin grub-efi-amd64-signed grub-common os-prober shim-signed 
apt-get autoremove --purge
rm -rf /boot/grub/
rm -rf /boot/efi/EFI/ubuntu
```
* Make sure GRUB is not installed back
```
sudo apt-mark hold "grub*"
```
Create /etc/apt/preferences.d/nogrub.pref <br>
This file forbids grub from ever being installed by APT.
```
Package: grub*
Pin: release a=*
Pin-Priority: -10
```

* You can also remove plymouth boot splash manager <br>
Remove plymouth boot splash screen
```
sudo apt purge plymouth && sudo apt autoremove
sudo rm -rf /usr/share/plymouth
```
Reboot to verify grub is no longer installed and systemd-boot is working

* systemd-boot bootSplash logo <br>
<picture>
  <img alt="bootSplash" src="bootSplash.png" width="60%">
</picture> <br>

#### Other Misc <br>
* [Nala is a Python-based frontend for apt package management.](https://itsfoss.com/nala/)
* [aria2 is a lightweight multi-protocol & multi-source command-line download utility.](https://aria2.github.io/)
* [Jellyfin is an open source media solution that puts you in control of your media.](https://jellyfin.org/)
* [bleachbit cleaner](https://www.bleachbit.org/)
* [clamav virus scanner](https://www.clamav.net/)

#### [Proton VPN](https://protonvpn.com/)<br>

#### [Customizing KDE Plasma Desktop](index.md)<br>

* [Some usefull tips/cmds](https://gist.github.com/txhammer68/487164d7e59df958bf41a12178dacd12)<br>
