# Customizing KDE Plasma Desktop

## [My Plasma setup](https://txhammer68.github.io/docs/kde/slideshow.html)
![desktop](images/preview2.png)(https://github.com/txhammer68/docs/blob/master/images/preview2.png "My Plasma Desktop")

## [Custom Lockscreen for KDE plasma](https://github.com/txhammer68/Lockscreen#custom-plasma-lockscreen)

* Clock remove am/pm
* Calendar,weather,email info

[![Plasma Lockscreen](lockscreen.png)](https://gofile.io/?c=bmYlVp "Plasma Lockscreen")

## [Plasma Widgets](https://github.com/txhammer68/qml)
### System monitor dashboard
![System dashboard](images/dashboard.png)
### Web Search
![Web Search](images/search.png)
### System menu
![System Menu](images/system-menu.png)

## Web Apps
* Create web app shortcuts for your favorite web apps, spotify,gmail,google maps,etc...
* Using chrome or firefox and xprop to determine window class info
* create a desktop entry in $HOME/.local/share/applications/
* to have it use its own icon instead of the web browser icon use xprop to determine window class
* run the desktop entry created and then in in terminal run xprop and click the window title
* Notice the entry for StartupWMClass
* Paste this into the desktop entry
```
[Desktop Entry]
Comment=G-Mail Web App
Exec=/opt/google/chrome/google-chrome --disk-cache-dir=/tmp/cache --profile-directory=Default --app=https://mail.google.com/mail/u/0/#inbox
GenericName=G-Mail Web App
Icon=$HOME/Pictures/Misc/icons/email.png
MimeType=
Name=G-Mail
NoDisplay=false
StartupNotify=true
StartupWMClass=mail.google.com__mail_u_0
Terminal=false
Type=Application
Version=1.0
```
## Customize Kinfo
![System Info](images/kinfo.png)
* Create a new file kcm-about-distrorc within $HOME/.config/
```
[General]
Name=Plasma OS
LogoPath=$HOME/Pictures/Misc/icons/ai_48.png
Website=https://github.com/txhammer68
Version=5.18
Variant=kubuntu edition
```

## [Plasma Look And Feel Explorer](https://userbase.kde.org/Plasma/Create_a_Look_and_Feel_Package)
  Plasma Look And Feel Explorer is a KDE application that allows you to create your own desktop theme.
  The 'Plasma Look and Feel Explorer' is part of the 'plasma-sdk', install it from your distro repo.
  the advatage of creating your own LnF theme is that you can change things like the lockscreen,logout, 
  and other compenents that are part of the default Breeze LnF theme...Most Lnf themes rely on the Breeze Lnf compenents 
  for their theme. Creating your own theme will allow you to custimize every compenent of the Plasma desktop to your liking.
  Once you create your own theme copy the folders from /usr/share/plasma/look-and-feel/org.kde.breeze.desktop/contents/ 
  to your theme in /home/.local/share/plasma/look-and-feel/"your theme name"/
 
  ![Image of Plasma Look And Feel Explorer](https://i.imgur.com/yPkUl3M.png)


## [Kvantum](https://github.com/tsujan/Kvantum/tree/master/Kvantum) 
Kvantum is widget customizer for KDE, widgets are the controls and drop down menus within Plasma

![Image of kvantum](https://github.com/tsujan/Kvantum/raw/master/Kvantum/screenshots/Default.png?raw=true)



## Ideas for Plasma
* Incorporate Google type notifications into Plasma notifications, sports,news,stocks
  * Using Node JS to get info and notify timer events
* Wallpaper slideshow to use picture metadata exif info to show location/description of photo on wallpaper

