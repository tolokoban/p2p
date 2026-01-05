# Signaling server

To establish the peer-to-peer connection, WebRTC needs a _signaling server_.

Here is a PHP version of such a server. In development, you can use it in a Docker container.
The address will be <http://localhost:55555/signal.php>.

To start the dev signaling server, just type:

```sh
npm start
```

When using a PHP server, do not forget to use this configuration in your `php.ini`:

```sh
session.use_only_cookies = 0
```

It's best to have your `signal.php` file on it's own server, alone.
This way, you don't compromise the security of other applications.
