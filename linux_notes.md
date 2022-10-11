# Install Post Setup Config

## Drive info
   * /dev/sda1/ -> /boot/efi
   * /dev/sda2/ -> os root

## GRUB/Kernel Options
   * kernel options, quiet apparmor=1 security=apparmor resume=UUID=edfc802e-6e25-479d-b45d-c02ccacfcb3f udev.log_priority=3 loglevel=3 rd.udev.log-priority=3  mitigations=off
   * /etc/default change grub defaults, file=grub
   * /etc/grub.d change 10_linux, remove execute bit 30_uefi_firmware, 60_memtest86+
   * grub theme /boot/grub/themes/, edit grub.cfg for new drives uuid, insert theme

## FSTAB
   * fstab /etc/fstab
   * mount drives permanent

## Modprobe drivers
   * /etc/modprobe.d/
   * blacklist // disable drivers
   * audio //disable audio power management // pop sounds
   * sensors-detect // hw monitor sensors

## Environment Settings in /etc/environment and .bashrc
   * export KWIN_TRIPLE_BUFFER=1
   * export QT_LOGGING_RULES=*.debug=false;qt.*.debug=false;qt5.debug=false;*.warning=false;*.critical=false
   * export QML_IMPORT_PATH=/usr/lib/x86_64-linux-gnu/qt5/qml
   * export XDG_CURRENT_DESKTOP="KDE"
   * export WINEDEBUG="-all"
   * export GTK_USE_PORTAL="1" // gtk apps use kde file browser
   * /home/matt/.local/bin/    // setup for user scripts

## X.org settings
   * /etc/X11/xorg.conf.d/10-monitor.conf // setup dual monitors
   * /etc/X11/xorg.conf.d/99-intel-gpu.conf // setup intel video acceleration

## Systemd
   * CPUPower settings, change in /etc/default/cpupower, copy cpupower.service to /etc/systemd/system
     * linux-tools
     * systemctl start, enable cpupower.service
   * FSTRIM  /lib/systemd/system
    * Now, I am going to apply "i" attribute which makes the file immutable. It means - you can't delete, modify the file, even if you're the file owner    and the root user.
      * sudo chattr +i fstrim.timer // prevent from being over written during updates
     * change from weekly to monthly
     * systemctl enable fstrim
   * weather scripts, stock scripts, backup scripts,cleaner scripts
   * Pacman kernel hook, apply grub settings after Kernel updates
      * copy kernel.hook to /etc/pacman.d/hooks/

## Network
   * change dns, 9.9.9.11, 9.9.9.9, 8.8.8.8
   * /etc/hosts, /etc/host.allow

## Firewall
   * copy iptales*.rules /etc/iptables
   * iptables.rules
   * ip6tables.rules
   * systemctl start,enable  iptables.service
   * systemctl start,enable  ip6tables.service

## Apps
   * SDDM - setup theme /usr/share/sddm/themes
     * /etc/sddm.conf.d/hidpi.conf  // enable hidpi for sddm
     * /etc/pam.d/sddm // edit for sddm login
   * Firefox,Chrome - ad block, privacy blocker
     * about:config, enable video playback
   * Install Minidlna, music network server configure /etc/minidlna.conf
     * systemctl enable minidlna.service
   * Kvantum install setup themes
   * Mame arcade roms, setup mame.ini
   * Handbrake Video Converter
   * MakeMKV convert Blu-Ray Discs
   * Spotify - ad-block version, arch-aur
   * Wine windows emulator
    * create .wine link to wine folder on /Data/.wine
   * Cuttlefish icon browser
   * Custom apps within applications folders, GMail, arcade game, shortcuts
   * Bleachbit -system cache/temp file cleaner, custom cleaners ML
   * ClamAV, chrootkit, rkhunter -- setup scripts to auto scan  -systemd
   * xournal++
   * hun-spell Spell check dict

## Themes
   * Within Themes folder / icons, Copy icons/Papirus*/ to usr/share/icons/Papirus*/ for global exposure sddm
   * Themes - DigiTech3 to /home/matt/.local/share/plasma/look-and-feel/
   * Widgets to folder /home/matt/.local/share/plasma/plasmoids/
   * Mouse cursors /usr/share/icons/default/index.theme
      * change Inherits=Breeze_Snow
      * prevents cursor from changing colors, black/white

## System Settings
   * Change Compositor to OpenGL 3.1
   * Desktop Session change start with empty session
   * Fonts copy fonts.conf /efc/fonts/fonts.conf
      * run fc-cache -f -v
   * Power Management
     * Energy Saving,  Change Monitor shutoff/sleep settings
   * Mouse  - Change Pointer Speed
   * Keyboard - Numlock on Bootup
   * Global Shortcuts - System Settings
     * Meta-S - System settings
     * Meta-R - Restart Plasma
     * Meta K - Kate
     * Meta D - Minimize All
