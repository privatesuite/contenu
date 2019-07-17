![Contenu](https://cdn.discordapp.com/attachments/574628569288933398/600994361223806979/unknown.png)

Private Suite's official CMS.

## Backstory

*Contenu* was created out of necessity. We used to use [WordPress](https://wordpress.com) - the popular CMS that almost half of the internet uses - until one day, the `About` page disappeared from `wp-json` and we realized that WordPress was inflexible and too unstable for our developer-oriented needs.

In `aurame`'s words: "It's not WordPress' fault for not working, it's our fault for choosing a CMS made for non-PWA oriented blogs."

*Contenu* is still a *little* unstable as it was made in only one month, so if you spot any creepy crawlers, leave us a line in the form of an `Issue` or a Discord message.

## Setting Up

Setting up Contenu is simple! You'll need a recent version of `nodejs`, `git`, and 5 minutes!

1. Clone this repository
2. Run `npm install`
3. Create a `prod.conf` configuration file
4. Place that file in the `config` folder
5. Run `node src/index.js prod`
6. Store the password logged in the first run somewhere safe

**Note** `dev.conf` is meant for developers, please don't use it in production.

## Configuration Files

Configuration files are written in the `ini` format.

**Note** The following code is part of `dev.conf`, please change the `secret`, `secure`, `keyPath`, and `certPath` in order to fit your needs.

```ini

[server]
port = 80 # The port the HTTP server will listen on
secure = true # True if you want an HTTPS server as well

# v Only applies when secure = true v
securePort = 443 # The port the HTTPS server will listen on
keyPath = config/server.key # The HTTPS key's path
certPath = config/server.cert # The HTTPS certificate's path

[admin]
enabled = true # True if you want the admin panel to be enabled
secret = myJsonWebTokenPassword # The JWT key, change this to a secure password

```

## The Admin Panel

The admin panel can be found at `/admin` on any *Contenu* instance. To log in for the first time, go to the `/admin` login page and enter the following credentials:

* **Username** admin
* **Password** *Password logged on first run*

Deleting the `admin` account is not possible as it will automatically be recreated by the CMS - if non-existent - every time the program starts. I recommend opening the `Data` tab and changing the admin password to something more memorable or creating a new user altogether.

### Templates and Elements

*Contenu*'s two most important components are **Templates** and **Elements**. Templates are molds that define child elements' fields. Elements are database entries that contain fields.

Templates can be found in the `Data` tab while elements can be found in the `Elements` tab.

### Users

**Users** are elements with non-customizable fields. Users can be added, deleted, and modified in the `Data` tab.

#### Permissions

Users have different available permission levels. The following table describes each permission level and the access that they grant to a user.

Permission | What it can do
---------- | --------------
Admin | Can do anything in the admin panel
Author | Currently has the same permissions as an admin
Viewer | Cannot access the admin panel

### Source Control

The `Source Control` tab will allow you to clone from a Git repository. Just type in the `URL` of the repository and the `branch` or `tag` that you want to clone from. Then, press the `Clone` button. The repository will be cloned into the `www` folder, from which HTML is served.

## License

MIT
