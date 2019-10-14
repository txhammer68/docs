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
  
![Image of Lockscreen](https://txhammer68.github.io/docs/images/lockscreen.png)
