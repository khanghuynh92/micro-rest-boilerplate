Micro & REST API Boilerplate
==================================

This is a straightforward boilerplate for building REST APIs with Micro and Mongoose.

- Micro support via [micro](https://github.com/zyedidia/micro)
- Router via [micro-router](https://github.com/pedronauck/micro-router)


Getting Started
---------------

```sh
# clone it
git clone git@github.com:khanghuynh92/micro-rest-boilerplate.git
cd micro-rest-boilerplate

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
yarn

# Start development live-reload server
yarn dev

# Start production server:
yarn serve
```
Docker Support
------
```sh
cd micro-rest-boilerplate

# Build your docker
docker build -t micro/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 80:80 micro/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

License
-------

MIT
