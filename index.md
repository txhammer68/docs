## [Custom Lockscreen for KDE plasma](https://github.com/txhammer68/Lockscreen)

### Changes made
* Clock remove am/pm
* Added calendar event to Clock
* Added current temperature
* Modified UI to hide status bar/show user login when KB/mouse movement detected
* Mail and messages are static for now, need work on using O-auth to get gmail inbox count

NOTES:
using systemd to update calendar events and temperature, as kscrenlocker does not allow internet access for security.
  maybe someone with better qml skills could show me a better way in pure qml...
  still a WIP, use at ur own risk!
  
![Image of Lockscreen](https://txhammer68.github.io/docs/images/screenlocker.gif)

## [Plasma Look And Feel Explorer](https://userbase.kde.org/Plasma/Create_a_Look_and_Feel_Package)
  Plasma Look And Feel Explorer is a KDE application that allows you to create your own desktop theme.
  The 'Plasma Look and Feel Explorer' is part of the 'plasma-sdk', install it from your distro repo.
  the advatage of creating your own LnF theme is that you can change things like the lockscreen,logout, 
  and other compenents that are part of the default Breeze LnF theme...Most Lnf themes rely on the Breeze Lnf compenents 
  for their theme. Creating your own theme will allow you to custimize every compenent of the Plasma desktop to your liking.
  Once you create your own theme copy the folders from /usr/share/plasma/look-and-feel/org.kde.breeze.desktop/contents/ 
  to your theme in /home/.local/share/plasma/look-and-feel/"your theme name"/
 
  ![Image of Plasma Look And Feel Explorer](https://i.imgur.com/yPkUl3M.png)


## [Kvantum](https://github.com/tsujan/Kvantum/tree/master/Kvantum) is widget customizer for KDE, widgets are the controls and drop down menus within Plasma

![Image of kvantum](https://github.com/tsujan/Kvantum/raw/master/Kvantum/screenshots/Default.png?raw=true)

