## Optimizing kubuntu desktop
## Based on Kubuntu 22.04.1
## My system specs, desktop tower PC, circa 2012
* Intel Haswell 3.4Ghz
* 16GB RAM
* /dev/sda 120GB SSD - Root partition
* /dev/sdb 120GB SSD - Home partition
* /dev/sdc 4TB HDD   - Data Drive, music,movies,pics
* GPU Intel built-in
* Intel Audio
* 1gb Intel Ethernet

I started using Linux about 5 years ago, coming from Windows it was quite a learning curve, but Linux as come a long ways,
and is now a viable alternative to Windows.
This is a collection of info i have learned over the years of running Linux on my home PC.
References to Arch wiki are useful, even though we are running Ubuntu based distro, many of the principles apply to kubuntu setup.

Some useful links for optimizing system performance<br>
[Arch](https://wiki.archlinux.org/title/improving_performance)<br>
[Ubuntu](https://github.com/themagicalmammal/howtodebuntu#5-optimize-boot-time--ram-usage)<br>

When installing kubuntu its best to partition drives manually to put /home on a separate drive/partition.
This is usefull to isolate desktop user settings from system drive, also when reinstalling, to retain user settings on next install, 
and performance advantages for reading config settings, as they are all stored in the user's home directory.

Create [partitions](https://wiki.archlinux.org/title/partitioning) for each part of the install process
* EFI partition for UEFI Boot drive 512MB type fat32 /dev/sda1
* Root system partition remaining space type ext4 /dev/sda2
* Swap space partiton 16GB type swap /dev/sdb1
* Home partition/drive remaining space ssd /dev/sdb2
* Data drive 4TB hdd ext4 dev/sdc1
Install as usual after creating partitions.

Once you reboot after install, edit the file in /etc/fstab

The [fstab](https://wiki.archlinux.org/title/fstab) file configures the mounted drives/partitions
You will need the UUID for each drive/partiton on your system, as you will be mounting with custom parameters.
Launch konsole and run lsblk -f  to get the UUID of your drives, and replace the ones here with yours.<br>
`UUID= /               ext4    auto,noatime,errors=remount-ro 0       1`<br>
UUID is the id of the disk                mount point     file system type   options
The options are the custom parts we want, the noatime omits the system from marking every file we access, 
speeds up reads/writes and helps preserve SSD lifespan.
 
 If you have enough RAM > 8GB, then use tmpfs, this will buffer system files in RAM to help speed up system.
 Here is the entry for tmpfs in fstab, be default it will use 50% of your available RAM.<br>
 `tmpfs                                     /tmp           tmpfs   auto,noatime,mode=1777 0 0`<br>
 
 Next the Home partition, again noatime, and no user. no user prohibits user from unmounting drive w/o root access.<br>
 `UUID= /home           ext4    auto,noatime,nouser       0       2`<br>
 
 Grub options
 Within the file /etc/default/grub, find the line
 `GRUB_CMDLINE_LINUX_DEFAULT=`
 We are going to add the option mitigations=off, this will disable the spectre vulnerability protection, which slows down the cpu.
 As I am not running a web server, not too worried about this.
 
 Next options for the audio and video driver, my sound pops everytime a notification sound or music starts playing.
 I discovered this is due to linux power management features of the audio driver.
 This can be resolved by creating a config file within `/etc/modprobe.d/audio.conf`<br>
 `options snd_hda_intel power_save=0 power_save_controller=N`<br>
 
 Next is the Intel GPU, again create a file in<br>
 `/etc/modprobe.d/intel.conf`<br>
 `options i915 modeset=1  mitigations=off fastboot=1 enable_fbc=1`<br>
 modeset tells the system to load the cpu driver at bootup
 
 After creating these files run `sudo update-initramfs -c -k $(uname -r)`<br>
 This wil update boot process to include the changes.
 
 [Optimize network MTU](https://appuals.com/how-to-optimize-ubuntu-internet-speed-with-mtu-settings/)<br> 
 Remove snapd, ubuntu wants us to use snap, i do not care for it, [here are the steps](https://haydenjames.io/remove-snap-ubuntu-22-04-lts/)
 to remove snapd and install firefox as a ppa.<br>
 [Firefox smooth scroll](https://github.com/AveYo/fox/blob/main/Natural%20Smooth%20Scrolling%20for%20user.js)<br>
 Install [xanmod kernel](https://xanmod.org/)<br>
 Install [systemd-boot](https://blobfolio.com/2018/replace-grub2-with-systemd-boot-on-ubuntu-18-04/), replace grub, speeds up boot time by 5 secs.<br>
