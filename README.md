# YGGTorrent searcher

YGGTorrent is a client / server application to allow the user to search for torrents through a simple interface and download `.torrent` files.

It is particularly useful if you have a _seedbox_ watching for new file in a given folder

### Getting started

Configure the `config.js` file and edit your `username` and `password` without changing the download location (see below)

> Please note that if you don't want to expose your password, it's still a JS file so you can provide it through the environment and access it through `process.env.YOUR_VARIABLE`

> You can choose to run the searcher either in Docker or natively
> Native will offer more possibilities when choosing the destination path of the .torrent files

#### Docker

##### Configuration

To choose your download location you need to edit the `docker-compose` file.
Edit the left hand part of the line below `volumes` and provide a _valid_ path

You can edit the CORS _ONLY_ by editing the docker-compose file under the environment path
You can specify `all` if you don't want to bother with CORS

Docker will launch two containers containing the client and the server

#### Native

##### Configuration

To choose your download location you need to edit the `config.js` file.
Edit the `downloadLocation` variable. You can of course provide an environment variable.

The `downloadLocation` variable can either be a string or a function.
 - A String will save all the files at the given path
 - A function will take three arguments: `category`, `subcategory` and `fullpath` so you can logically store your .torrent files depending on their category

You can edit the CORS either by providing them in the environment under the form of `CORS_WHITELIST=http://localhost:5000,http://localhost:3000` _or_ by editing the `config.js` file.
You can specify `all` if you don't want to bother with CORS

#### Responsibility

I am not responsible for any pursuit regarding illegal torrents download