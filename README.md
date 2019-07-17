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

**Note** `dev.conf` is meant for developers, please don't use it in production.

## Configuration Files

Configuration files are written in the `ini` format.

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

## License

MIT
