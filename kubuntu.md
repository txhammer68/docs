### [Customizing KDE Plasma Desktop](index.md)<br>

### Optimizing Kubuntu 22.04 LTS desktop

Some useful links for optimizing system performance<br>
[Arch](https://wiki.archlinux.org/title/improving_performance)<br>
[KDE](https://wiki.archlinux.org/title/KDE)<br>
[Ubuntu](https://github.com/themagicalmammal/howtodebuntu#5-optimize-boot-time--ram-usage)<br>
[Ubuntu Desktop optimization](https://www.orangesputnik.eu/ubuntu-desktop-optimization/)<br>

My Setup  - Intel Haswell CPU OC'd to 4Ghz, Intel GPU, 16GB RAM, 2 SSD's - 120GB, 4TB HDD, 10Mbs Internet

<picture>
  <img alt="system" src="system.png" width="60%">
</picture> <br>

### Pre Install Setup

Create [partitions](https://wiki.archlinux.org/title/partitioning) for each drive before the install process
* EFI partition for UEFI Boot drive 512MB type fat32 /dev/sda1
* Root system partition remaining space type ext4 /dev/sda2
* Swap space partiton 16GB type swap /dev/sdb1
* Home partition/drive remaining space ssd /dev/sdb2
* Data drive 4TB hdd ext4 /dev/sdc1

Install as usual after creating partitions.
Reboot.
### fstab
The [fstab](https://wiki.archlinux.org/title/fstab) file configures the mounted drives/partitions
Obtain UUID for each drive/partiton on system.<br>
```
lsblk -f
```
##### /etc/fstab <br>
``` 
Root   UUID="" /               ext4    auto,noatime,errors=remount-ro 0  1
home   UUID="" /home           ext4    auto,noatime,nouser            0  1
Data   UUID="" /home/Data      ext4    auto,noatime,nouser            0  1
SWAP   UUID="" swap            swap    sw                             0  0
tmpfs          /tmp            tmpfs   auto,noatime,mode=1777         0  0
```
### EXT4 options<br>
Enable fast_commit journal option speed up FS writes <br>
```
sudo tune2fs -O fast_commit /dev/sda2
sudo tune2fs -O fast_commit /dev/sdc2
```
Verify
```
sudo tune2fs -l /dev/sda2 | grep features
```
### Grub options<br>
/etc/default/grub<br>
```
mitigations=off loglevel=3
```

### Modprobe<br>
/etc/modprobe.d<br>
Audio /etc/modprobe.d/audio.conf
```
options snd_hda_intel power_save=0 power_save_controller=N
```
GPU /etc/modprobe.d/intel.conf
```
options i915 modeset=1  mitigations=off fastboot=1 enable_fbc=1
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
### [Optimize network MTU](https://appuals.com/how-to-optimize-ubuntu-internet-speed-with-mtu-settings/)<br> 
The ping command will let you know if the packet was sent as more than one fragment with multiple header data attached.<br>
```
ping -s 1472 -c1 espn.com
```
Retest changing packet size until 0% packet loss<br>
### Systemd-Resolve provides DNSSEC and DNS caching
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

### Install Firefox PPA
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
### Firefox
##### Extensions
[Youtube enhancer extension](https://addons.mozilla.org/en-US/firefox/addon/enhancer-for-youtube/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)<br>
[Origin Ad-Blocker](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)<br>
[Cookies](https://addons.mozilla.org/en-US/firefox/addon/i-dont-care-about-cookies/)<br>
[Duck-Duck Go](https://addons.mozilla.org/en-US/firefox/addon/duckduckgo-for-firefox/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)<br>
[FetchV:Videos](https://addons.mozilla.org/en-US/firefox/addon/videos-hls-m3u8-mp4-downloader/)<br>
##### [Firefox smooth scroll](https://github.com/AveYo/fox/blob/main/Natural%20Smooth%20Scrolling%20for%20user.js)<br>
##### Performance - about:config <br>
[Arch Firefox](https://wiki.archlinux.org/title/Firefox/Tweaks)<br>
[Github](https://gist.github.com/RubenKelevra/fd66c2f856d703260ecdf0379c4f59db)<br>
```
gfx.webrender.enabled=true
gfx.webrender.force-disabled=false
gfx.webrender.all=true
dom.ipc.processCount=10
layers.mlgpu.enabled=true
layers.mlgpu.sanity-test-failed=false
layers.gpu-process.enabled=true
media.gpu-process-decoder=true
media.ffmpeg.vaapi.enabled=true
media.ffmpeg.dmabuf-textures.enabled=true
dom.webgpu.enabled=true
browser.cache.disk.enable=false
browser.cache.memory.enable=true
browser.cache.memory.capacity=-1 //auto
media.memory_cache_max_size=65536
media.webrtc.hw.h264.enabled
media.navigator.mediadatadecoder_h264_enabled
media.gmp.decoder.h264=true
media.navigator.video.preferred_codec=126
media.navigator.video.max_fs= 2560
media.navigator.video.h264.level=22
media.navigator.video.h264.max_br=700
media.navigator.video.h264.max_mbps=6000
media.ffmpeg.low-latency.enabled=true
```

### Spotify Client
```
sudo apt install software-properties-common apt-transport-https wget ca-certificates gnupg2
wget https://download.spotify.com/debian/pubkey_5E3C45D7B312C643.gpg
cat pubkey_5E3C45D7B312C643.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/spotify.gpg >/dev/null
echo "deb http://repository.spotify.com stable non-free" | sudo tee /etc/apt/sources.list.d/spotify.list
sudo apt update
sudo apt install spotify-client
```

### [systemd-boot](https://blobfolio.com/2018/replace-grub2-with-systemd-boot-on-ubuntu-18-04/), replace grub, speeds up boot time.<br>
systemd-boot loader -  grub replacement
### [post-kernel-script](https://gist.github.com/txhammer68/84650da9037e9d4ca94613f266eab2c1)
Custom scipt to update systemd-boot config files after kernel updates<br>
Install systemd-boot loader
```
sudo bootctl install --path=/boot/efi
```
Root flags are same as grub options in /etc/default/grub <br>
```
ROOTFLAGS="quiet apparmor=1 security=apparmor loglevel=3  mitigations=off udev.log_priority=3 resume=UUID=123"
ROOTFLAGS1="quiet apparmor=1 security=apparmor loglevel=3  mitigations=off udev.log_priority=3 resume=UUID=123 3"
```
After install and setup of systemd-boot run <br>
```
sudo update-initramfs -u
```
This wil update systemd-boot config files.<br>
Reboot.<br>
### [xanmod kernel](https://xanmod.org/)<br>
