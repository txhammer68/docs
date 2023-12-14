## Debain 12 Plasma 5 LTS Setup
* Install with minimal iso do not install any DE bare minimal setup
* Do not set root password, this will allow user as sudo
* Pre Install Setup

### Create partitions for each drive before the install process

* EFI partition for UEFI Boot drive 512MB type fat32 /dev/sda1
* Root system partition remaining space type ext4 /dev/sda2
* Home partition/drive space ssd /dev/sdb1
* Swap space partiton 16GB type swap /dev/sdb2
* Data drive 4TB hdd ext4 /dev/sdc1

### Install as usual after creating partitions. Reboot.

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
sudo tune2fs -O fast_commit /dev/sdb1
```
Verify
```
sudo tune2fs -l /dev/sda2 | grep features
```
### Update apt sources.list
```
  sudo nano /etc/apt/sources.list
  deb http://deb.debian.org/debian bookworm main non-free-firmware contrib non-free
  deb http://deb.debian.org/debian bookworm-updates main non-free-firmware contrib non-free
  deb http://security.debian.org/debian-security/ bookworm-security main non-free-firmware contrib non-free
  deb http://deb.debian.org/debian bookworm-backports main non-free-firmware contrib non-free
sudo apt update && upgrade
sudo reboot
```

### Reboot

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

## Install DE and apps
* change /etc/apt/sources.list
* apt update
* sudo apt install kde-plasma-desktop
* after boot to desktop
* edit the /etc/network/interfaces file as administrator: sudo nano /etc/network/interfaces remove any networks interfaces , interferes with network manager
* Reboot
* install some useful apps
```
apt install
ark kde-spectacle libreoffice libreoffice-kde5 okular okular-extra-backends python3-pyside2-qtgui python3-pyqt5.qtquick inkscape gimp kcalc kcolorchooser,muon,linux-cpupower minidlna xournalpp plasma-sdk qmlscene qml bleachbit handbrake handbrake-cli mpv mpv-mpris qt5-style-kvantum mame
```

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
